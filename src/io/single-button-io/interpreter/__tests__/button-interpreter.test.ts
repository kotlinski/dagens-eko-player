import ButtonInterpreter, { LONG_THRESHOLD } from '../button-interpreter';
import SingleButtonRecorder from '../../recorder/single-button-recorder';
import { ButtonLog, SingleButtonState } from '../../button-interfaces';

describe('button-interpreter', () => {
  let interpreter: ButtonInterpreter;
  let button_recorder: SingleButtonRecorder;
  let log: ButtonLog[];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    button_recorder = new SingleButtonRecorder();
    interpreter = new ButtonInterpreter();
  });
  describe('parseButtonLog', () => {
    describe('with an empty log', () => {
      it('should return undefined', () => {
        expect(interpreter.parseButtonLog([])).toEqual(undefined);
      });
    });
    describe('with an unknown pattern', () => {
      it('should throw', () => {
        log = [{ state: 'AN-UNKNOWN-COMMAND' as SingleButtonState, date: new Date(1) }];
        expect(() => interpreter.parseButtonLog(log)).toThrow('The impossible has happened');
      });
    });
    describe(`when it hasn't passed a "LONG_THRESHOLD" (${LONG_THRESHOLD} ms) since the last interaction`, () => {
      beforeEach(() => {
        log = [{ state: 'RELEASED', date: new Date() }];
      });
      it('should simply ignore and return undefined', () => {
        expect(interpreter.parseButtonLog(log)).toEqual(undefined);
      });
    });
    describe('a scenario where the radio has booted in a closed state and got opened', () => {
      beforeEach(() => {
        log = [{ state: 'RELEASED', date: new Date() }];
        jest.advanceTimersByTime(1_000);
      });
      it('should reset and play', () => {
        expect(interpreter.parseButtonLog(log)).toEqual('START');
      });
    });
    describe('a scenario where the radio has booted in an open state and got closed', () => {
      beforeEach(() => {
        button_recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(1_000);
      });
      it('should pause', () => {
        expect(interpreter.parseButtonLog(button_recorder.getLog())).toEqual('STOP');
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
        expect(interpreter.parseButtonLog(button_recorder.getLog())).toEqual('TOGGLE_PAUSE');
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
        expect(interpreter.parseButtonLog(button_recorder.getLog())).toEqual('START');
      });
    });
  });
});
