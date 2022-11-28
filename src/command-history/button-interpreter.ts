import { ButtonLog, ButtonState } from './button-interfaces';
import { Command } from '../radio/command';
import ButtonLogger, { LONG_THRESHOLD } from './button-logger';

type Event = 'TAP' | 'CLOSED' | 'SHORT_OPEN' | 'OPEN';
type Pattern =
  | 'STARTED_AND_OPENED'
  | 'STARTED_AND_CLOSED'
  | 'CLOSED'
  | 'OPENED'
  | 'SINGLE_TAP'
  | 'DOUBLE_TAP'
  | 'TRIPLE_TAP'
  | 'QUADRUPLE_TAP';

export default class ButtonInterpreter {
  // Caution: the order of entries matters
  // index 0 of the object is the entry that will be evaluated first.
  // the pattern will have the most resent action indexed 0
  private readonly patterns: Record<Pattern, Event[]> = {
    QUADRUPLE_TAP: ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'],
    TRIPLE_TAP: ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'],
    DOUBLE_TAP: ['OPEN', 'TAP', 'SHORT_OPEN', 'TAP', 'OPEN'],
    SINGLE_TAP: ['OPEN', 'TAP', 'OPEN'],
    CLOSED: ['CLOSED', 'OPEN'], // obs, the most recent action is zero indexed
    OPENED: ['OPEN', 'CLOSED'],
    STARTED_AND_OPENED: ['OPEN'],
    STARTED_AND_CLOSED: ['CLOSED'],
  };
  constructor(private readonly button_logger: ButtonLogger) {}

  private parseEventType(state: ButtonState, duration_ms: number): Event {
    switch (state) {
      case 'PRESSED':
        return duration_ms >= LONG_THRESHOLD ? 'CLOSED' : 'TAP';
      case 'RELEASED':
        return duration_ms >= LONG_THRESHOLD ? 'OPEN' : 'SHORT_OPEN';
    }
  }
  /**
   * This class will parse the logs and transform them into "TapTypes"
   * @private
   */
  private getButtonSequence(): Event[] {
    return this.button_logger
      .getLog()
      .reduce<Event[]>((button_events: Event[], current: ButtonLog, index: number, commands: ButtonLog[]) => {
        const duration_ms = (index === 0 ? new Date().getTime() : commands[index - 1].date.getTime()) - current.date.getTime();
        const type = this.parseEventType(current.state, duration_ms);
        button_events.push(type);
        return button_events;
      }, []);
  }

  private findPattern(sequence: Event[]): Pattern | undefined {
    for (const key in this.patterns) {
      if (this.startsWith(sequence, this.patterns[key as Pattern])) {
        return key as Pattern;
      }
    }
    return undefined;
  }

  public getNextCommands(): Command[] {
    const sequence = this.getButtonSequence();
    if (sequence.length === 0) {
      console.error('No commands to parse');
      return [];
    }
    const current_event = sequence[0];
    if (current_event === 'SHORT_OPEN' || current_event === 'TAP') {
      // Need to wait until we had a "long" command
      return [];
    }
    const matched_pattern = this.findPattern(sequence);
    if (!matched_pattern) {
      console.log('no pattern found');
      return [];
    }
    console.log(`found pattern ${matched_pattern}`);

    switch (matched_pattern) {
      case 'TRIPLE_TAP':
        return [Command.SKIP_15_S];
      case 'QUADRUPLE_TAP':
        return [Command.REWIND_15_S];
      case 'DOUBLE_TAP':
        return [Command.NEXT];
      case 'SINGLE_TAP':
        return [Command.TOGGLE_PAUSE];
      case 'STARTED_AND_OPENED':
      case 'OPENED':
        return [Command.START];
      case 'STARTED_AND_CLOSED':
      case 'CLOSED':
        return [Command.STOP];
      default:
        console.error('Unknown radio-box-event');
        return [];
    }
  }

  /**
   * check if to "tap type" arrays have matching start sequence
   * @param event_types
   * @param taps
   * @private
   */
  private startsWith(event_types: Event[], taps: Event[]): boolean {
    if (event_types.length < taps.length) return false;
    for (let i = 0; i < taps.length; i++) {
      if (taps[i] !== event_types[i]) {
        return false;
      }
    }
    return true;
  }
}
