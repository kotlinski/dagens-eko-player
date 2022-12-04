import { Command } from '../../../radio/command';
import PatternFinder from './pattern-finder';
import { ButtonEvent } from '../recorder/single-button-recorder';

export const LONG_THRESHOLD = 750; // milliseconds until a "tap" becomes a "long press"

export default class ButtonSequenceInterpreter {
  constructor(private readonly pattern_finder: PatternFinder) {}

  public parseButtonSequence(sequence: ButtonEvent[]): Command | undefined {
    if (!this.isValidSequence(sequence)) {
      return;
    }
    const matched_pattern = this.pattern_finder.findPattern(sequence);
    console.log(`found pattern ${matched_pattern}`);

    switch (matched_pattern) {
      case 'TRIPLE_TAP':
        return 'SKIP_15_S';
      case 'QUADRUPLE_TAP':
        return 'REWIND_15_S';
      case 'DOUBLE_TAP':
        return 'NEXT';
      case 'SINGLE_TAP':
        return 'TOGGLE_PAUSE';
      case 'STARTED_AND_OPENED':
      case 'OPENED':
        return 'START';
      case 'STARTED_AND_CLOSED':
      case 'CLOSED':
        return 'STOP';
      default:
        throw new Error('Unknown radio-box-event');
    }
  }

  private shortCommand(current_event: 'TAP' | 'CLOSED' | 'SHORT_OPEN' | 'OPEN') {
    return current_event === 'SHORT_OPEN' || current_event === 'TAP';
  }

  private isValidSequence(sequence: ButtonEvent[]): boolean {
    if (sequence.length === 0) {
      console.error('No commands to parse');
      return false;
    } else if (this.shortCommand(sequence[0])) {
      // Need to wait until we had a "long" command
      return false;
    }
    return true;
  }
}
