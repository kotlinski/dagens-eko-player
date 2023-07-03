import { ValueCallback } from 'onoff';
import { Command } from '../../radio/command';
import GpioWrapper from '../gpio-wrapper';
import PiButton, { BinaryButtonValue } from '../pi-button';
import ButtonSequenceInterpreter from '../single-button-io/interpreter/button-sequence-interpreter';
import SingleButtonRecorder from '../single-button-io/recorder/single-button-recorder';

jest.mock('../gpio-wrapper');

describe('pi-button', () => {
  const test_command_listener = jest.fn((command: Command) => console.log(`command: ${JSON.stringify(command, null, 2)}`));
  let button_recorder_spy: jest.SpiedFunction<SingleButtonRecorder['logButtonInteraction']>;
  let pi_button: PiButton;
  let signal_callback: ValueCallback;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(GpioWrapper.prototype, 'watch').mockImplementation((callback: ValueCallback) => {
      signal_callback = callback;
    });

    const interpreter = ButtonSequenceInterpreter.prototype;
    const button_recorder: SingleButtonRecorder = new SingleButtonRecorder();
    button_recorder_spy = jest.spyOn(button_recorder, 'logButtonInteraction');
    jest.spyOn(interpreter, 'parseButtonSequence').mockReturnValue(undefined);

    pi_button = new PiButton(interpreter, button_recorder);
    pi_button.registerListener(test_command_listener);
  });
  afterEach(() => {
    button_recorder_spy.mockReset();
  });

  describe('button pressed', function () {
    it('should record the pressed action', async () => {
      signal_callback(undefined, BinaryButtonValue.PRESSED);
      jest.advanceTimersByTime(10_000);
      expect(button_recorder_spy).toHaveBeenCalledWith('PRESSED');
    });
  });
  describe('button released', () => {
    it('should record button released', () => {
      signal_callback(undefined, BinaryButtonValue.RELEASED);
      jest.advanceTimersByTime(10_000);
      expect(button_recorder_spy).toHaveBeenCalledWith('RELEASED');
    });
  });
  describe('on error', () => {
    it('should not crash', () => {
      signal_callback(new Error('test error'), 0);
      jest.advanceTimersByTime(10_000);
      expect(button_recorder_spy).not.toHaveBeenCalled();
    });
  });
});
