import { ButtonEvent } from '../recorder/single-button-recorder';

export type Pattern =
  | 'STARTED_AND_OPENED'
  | 'STARTED_AND_CLOSED'
  | 'CLOSED'
  | 'OPENED'
  | 'SINGLE_TAP'
  | 'DOUBLE_TAP'
  | 'TRIPLE_TAP'
  | 'QUADRUPLE_TAP';
export default class PatternFinder {
  // Caution: the order of entries matters
  // index 0 of the object is the entry that will be evaluated first.
  // the pattern will have the most resent action indexed 0
  private readonly patterns: Record<Pattern, ButtonEvent[]> = {
    QUADRUPLE_TAP: ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'],
    TRIPLE_TAP: ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'],
    DOUBLE_TAP: ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'],
    SINGLE_TAP: ['OPEN', 'TAP', 'OPEN'],
    CLOSED: ['CLOSED', 'OPEN'], // obs, the most recent action is zero indexed
    OPENED: ['OPEN', 'CLOSED'],
    STARTED_AND_OPENED: ['OPEN'],
    STARTED_AND_CLOSED: ['CLOSED'],
  };
  public findPattern(sequence: ButtonEvent[]): Pattern {
    for (const key in this.patterns) {
      if (this.startsWith(sequence, this.patterns[key as Pattern])) {
        return key as Pattern;
      }
    }
    throw new Error('The impossible has happened');
  }

  /**
   * check if to "tap type" arrays have matching start sequence
   * @param event_types
   * @param taps
   * @private
   */
  private startsWith(event_types: ButtonEvent[], taps: ButtonEvent[]): boolean {
    if (event_types.length < taps.length) return false;
    for (let i = 0; i < taps.length; i++) {
      if (taps[i] !== event_types[i]) {
        return false;
      }
    }
    return true;
  }
}
