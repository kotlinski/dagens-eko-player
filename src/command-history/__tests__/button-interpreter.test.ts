import ButtonInterpreter from '../button-interpreter';
import ButtonLogger from '../button-logger';
import { Command } from '../../radio/command';

describe('button-interpreter', () => {
  let interpreter: ButtonInterpreter;
  let logger: ButtonLogger;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    logger = new ButtonLogger();
    interpreter = new ButtonInterpreter(logger);
  });
  describe('getNextCommands', () => {
    describe('a scenario where the radio has booted in a closed state and got opened', () => {
      beforeEach(() => {
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(1_000);
      });
      it('should reset and play', () => {
        expect(interpreter.getNextCommands()).toEqual([Command.START]);
      });
    });
    describe('a scenario where the radio has booted in an open state and got closed', () => {
      beforeEach(() => {
        logger.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(1_000);
      });
      it('should pause', () => {
        expect(interpreter.getNextCommands()).toEqual([Command.STOP]);
      });
    });
    describe('when radio is opened and got a tap', () => {
      beforeEach(() => {
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(800);
        logger.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(20);
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(1_000);
      });
      it('should toggle play', () => {
        expect(interpreter.getNextCommands()).toEqual([Command.TOGGLE_PAUSE]);
      });
    });
    describe('with two short and one long press', function () {
      beforeEach(() => {
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(800);
        // short click
        logger.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(20);
        // short click #2
        logger.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(20);
        // long press
        logger.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(5_000);
        logger.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(5_000);
      });
      it('should pause and ignore the prior short taps', () => {
        expect(interpreter.getNextCommands()).toEqual([Command.START]);
      });
    });
  });
});
