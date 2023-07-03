import Keyboard from '../keyboard';
import ButtonSequenceInterpreter from '../single-button-io/interpreter/button-sequence-interpreter';
import { Command } from '../../radio/command';
import SingleButtonRecorder from '../single-button-io/recorder/single-button-recorder';

const mock_std_in = require('mock-stdin').stdin();

describe('keyboard', () => {
  const test_command_listener = jest.fn((command: Command) => console.log(`command: ${JSON.stringify(command, null, 2)}`));
  let button_recorder_spy: jest.SpiedFunction<SingleButtonRecorder['logButtonInteraction']>;
  let keyboard: Keyboard;

  beforeAll(() => {
    jest.useFakeTimers();
    const interpreter = ButtonSequenceInterpreter.prototype;
    const button_recorder: SingleButtonRecorder = new SingleButtonRecorder();
    button_recorder_spy = jest.spyOn(button_recorder, 'logButtonInteraction');

    keyboard = new Keyboard(interpreter, button_recorder);
  });
  describe('without registered command-listeners', () => {
    it('should fail, but not throw', () => {
      expect(() => mock_std_in.send('1\n')).not.toThrow();
    });
  });
  describe('with command-listeners', () => {
    beforeAll(() => {
      keyboard.registerListener(test_command_listener);
    });
    const test_cases: string[][] = [
      ['1\n', 'START'],
      ['2\n', 'TOGGLE_PAUSE'],
      ['3\n', 'NEXT'],
      ['4\n', 'SKIP_15_S'],
      ['5\n', 'REWIND_15_S'],
      ['6\n', 'STOP'],
    ];
    describe('on numeric keyboard input', () => {
      test.each(test_cases)('std input %s should render in %s', (input: string, command: string) => {
        mock_std_in.send(input);
        expect(test_command_listener).toHaveBeenCalledWith(command);
      });
    });

    describe('letter input', () => {
      describe('s pressed', function () {
        it('should act as single button pressed on s', () => {
          mock_std_in.send('s\n');
          jest.advanceTimersByTime(10_000);
          expect(button_recorder_spy).toHaveBeenCalledWith('PRESSED');
        });
      });
      describe('letter input', () => {
        it('should act as single button released on w', () => {
          mock_std_in.send('w\n');
          jest.advanceTimersByTime(10_000);
          expect(button_recorder_spy).toHaveBeenCalledWith('RELEASED');
        });
      });
    });
    describe('unknown input', () => {
      it('should ignore the input', () => {
        mock_std_in.send('random-input\n');
        expect(button_recorder_spy).not.toHaveBeenCalled();
        expect(test_command_listener).not.toHaveBeenCalled();
      });
    });
  });
});
