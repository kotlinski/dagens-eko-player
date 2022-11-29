import { ButtonLog, SingleButtonState } from './button-interfaces';

export const LONG_THRESHOLD = 750; // milliseconds until a "tap" becomes a "long press"
export default class SingleButtonRecorder {
  button_log: ButtonLog[] = [];

  /**
   * Adds a state to the history. "Duplicates" will be invalidated and cleaned out
   * The log will hold maximum 50 events
   *
   * @param state
   */
  public logButtonInteraction(state: SingleButtonState): void {
    const previous: ButtonLog | undefined = this.button_log.length > 0 ? this.button_log[0] : undefined;
    const current = { date: new Date(), state };

    if (previous?.state === state) {
      // Something is wrong, can't register same action twice
      throw Error(`Registered ${state} twice. ${new Date().toString()} and ${previous.date.toISOString()}`);
    }
    this.button_log.unshift(current);

    // We don't really care about too many sequences
    if (this.button_log.length > 50) {
      this.button_log.slice(0, 50);
    }
  }

  /**
   * returns a copy of the button log history.
   * The list has the most recent event first of the array.
   *
   */
  public getLog(): ButtonLog[] {
    return [...this.button_log];
  }
}
