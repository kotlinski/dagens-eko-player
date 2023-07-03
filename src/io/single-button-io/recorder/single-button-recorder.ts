import { ButtonLog, SingleButtonState } from '../button-interfaces';
import { LONG_THRESHOLD } from '../interpreter/button-sequence-interpreter';

export type ButtonEvent = 'TAP' | 'CLOSED' | 'SHORT_OPEN' | 'OPEN';

export default class SingleButtonRecorder {
  button_log: ButtonLog[] = [];

  /**
   * Adds a state to the history. "Duplicates" will be invalidated and cleaned out
   * The log will keep a maximum 50 events in memory
   *
   * @param new_interaction
   */
  public logButtonInteraction(new_interaction: SingleButtonState): void {
    const prior_interaction = this.button_log.length > 0 ? this.button_log[0] : undefined;
    this.verifyInput(prior_interaction, new_interaction);
    this.button_log.unshift({ date: new Date(), state: new_interaction });
    this.pruneOutdatedLogs();
  }

  /**
   * returns a copy of the button log history.
   * The list has the most recent event first of the array.
   *
   */
  public getRawLog(): ButtonLog[] {
    return [...this.button_log];
  }

  public getButtonSequence(): ButtonEvent[] {
    return this.getRawLog().reduce<ButtonEvent[]>(
      (button_events: ButtonEvent[], current: ButtonLog, index: number, commands: ButtonLog[]) => {
        const duration_ms = (index === 0 ? new Date().getTime() : commands[index - 1].date.getTime()) - current.date.getTime();
        const type = this.parseEventType(current.state, duration_ms);
        button_events.push(type);
        return button_events;
      },
      [],
    );
  }

  private verifyInput(previous: ButtonLog | undefined, state: 'PRESSED' | 'RELEASED') {
    if (previous?.state === state) {
      // Something is wrong, can't register same action twice
      throw Error(
        `Registered ${state} twice. ${new Date().toLocaleTimeString('sv-SE')} and ${previous.date.toLocaleTimeString('sv-SE')}`,
      );
    }
  }

  private pruneOutdatedLogs() {
    if (this.button_log.length > 50) {
      this.button_log = this.button_log.slice(0, 50);
    }
  }

  private parseEventType(state: SingleButtonState, duration_ms: number): ButtonEvent {
    switch (state) {
      case 'PRESSED':
        return duration_ms >= LONG_THRESHOLD ? 'CLOSED' : 'TAP';
      case 'RELEASED':
        return duration_ms >= LONG_THRESHOLD ? 'OPEN' : 'SHORT_OPEN';
    }
  }
}
