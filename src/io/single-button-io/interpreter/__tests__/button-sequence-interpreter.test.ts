import ButtonSequenceInterpreter, { LONG_THRESHOLD } from '../button-sequence-interpreter';
import { ButtonEvent } from '../../recorder/single-button-recorder';
import PatternFinder, { Pattern } from '../pattern-finder';
import SpiedFunction = jest.SpiedFunction;

describe('button-interpreter', () => {
  let interpreter: ButtonSequenceInterpreter;
  let sequence: ButtonEvent[];
  let find_pattern_spy: SpiedFunction<PatternFinder['findPattern']>;

  beforeEach(() => {
    const pattern_finder = new PatternFinder();
    find_pattern_spy = jest.spyOn(pattern_finder, 'findPattern');
    interpreter = new ButtonSequenceInterpreter(pattern_finder);
  });
  describe('parseButtonLog', () => {
    describe('with an empty sequence', () => {
      it('should return undefined', () => {
        expect(interpreter.parseButtonSequence([])).toEqual(undefined);
        expect(find_pattern_spy).not.toBeCalled();
      });
    });
    describe('with an unknown pattern', () => {
      it('should throw', () => {
        sequence = ['AN-UNKNOWN-COMMAND' as ButtonEvent];
        expect(() => interpreter.parseButtonSequence(sequence)).toThrow('The impossible has happened');
      });
    });
    describe(`when it hasn't passed a "LONG_THRESHOLD" (${LONG_THRESHOLD} ms) since the last interaction`, () => {
      describe('SHORT_OPEN', () => {
        it('should simply ignore and return undefined', () => {
          expect(interpreter.parseButtonSequence(['SHORT_OPEN'])).toEqual(undefined);
          expect(find_pattern_spy).not.toBeCalled();
        });
      });
      describe('TAP', () => {
        it('should simply ignore and return undefined', () => {
          expect(interpreter.parseButtonSequence(['TAP'])).toEqual(undefined);
          expect(find_pattern_spy).not.toBeCalled();
        });
      });
    });
    describe('a scenario where the radio has booted in a closed state and got opened', () => {
      it('should reset and play', () => {
        sequence = ['OPEN'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('START');
      });
    });
    describe('a scenario where the radio has booted in an open state and got closed', () => {
      it('should pause', () => {
        sequence = ['CLOSED'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('STOP');
      });
    });
    describe('when radio is opened and got a tap', () => {
      it('should toggle play', () => {
        sequence = ['OPEN', 'TAP', 'OPEN'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('TOGGLE_PAUSE');
      });
    });
    describe('a sequence of short events followed by a long press(CLOSE)', () => {
      it('should toggle play', () => {
        sequence = ['CLOSED', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('STOP');
      });
    });
    describe('with double tap', () => {
      it('should pause', () => {
        sequence = ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('NEXT');
      });
    });
    describe('with triple tap', () => {
      it('should pause', () => {
        sequence = ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('SKIP_15_S');
      });
    });
    describe('with quadruple tap', () => {
      it('should pause', () => {
        sequence = ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'];
        expect(interpreter.parseButtonSequence(sequence)).toEqual('REWIND_15_S');
      });
    });
    describe('when the finder returns an unknown button event', () => {
      beforeEach(() => {
        find_pattern_spy.mockReturnValue('UNKNOWN-BUTTON-EVENT' as Pattern);
      });
      it('should pause', () => {
        expect(() => interpreter.parseButtonSequence(['OPEN'])).toThrow(new Error('Unknown radio-box-event'));
      });
    });
  });
});
