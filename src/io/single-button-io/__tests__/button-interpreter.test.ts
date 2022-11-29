import ButtonInterpreter from '../button-interpreter';
import SingleButtonRecorder from '../single-button-recorder';

describe('button-interpreter', () => {
  let interpreter: ButtonInterpreter;
  let button_recorder: SingleButtonRecorder;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    button_recorder = new SingleButtonRecorder();
    interpreter = new ButtonInterpreter();
  });
  describe('getNextCommands', () => {
    describe('a scenario where the radio has booted in a closed state and got opened', () => {
      beforeEach(() => {
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(1_000);
      });
      it('should reset and play', () => {
        expect(interpreter.parseCommand(button_recorder.getLog())).toEqual('START');
      });
    });
    describe('a scenario where the radio has booted in an open state and got closed', () => {
      beforeEach(() => {
        button_recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(1_000);
      });
      it('should pause', () => {
        expect(interpreter.parseCommand(button_recorder.getLog())).toEqual('STOP');
      });
    });
    describe('when radio is opened and got a tap', () => {
      beforeEach(() => {
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(800);
        button_recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(20);
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(1_000);
      });
      it('should toggle play', () => {
        expect(interpreter.parseCommand(button_recorder.getLog())).toEqual('TOGGLE_PAUSE');
      });
    });
    describe('with two short and one long press', function () {
      beforeEach(() => {
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(800);
        // short click
        button_recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(20);
        // short click #2
        button_recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(20);
        // long press
        button_recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(5_000);
        button_recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(5_000);
      });
      it('should pause and ignore the prior short taps', () => {
        expect(interpreter.parseCommand(button_recorder.getLog())).toEqual('START');
      });
    });
  });
});
