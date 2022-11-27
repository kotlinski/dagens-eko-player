/**
 * Abstract class radio hardware
 * Currently supporting mac or pi
 *
 */
import InputHandler from '../radio/input-handler';
import ButtonLogger from '../command-history/button-logger';

export type HardwareIdentifier = 'mac' | 'pi';

export default abstract class Hardware {
  readonly button_state_history: ButtonLogger;
  protected constructor(readonly handler: InputHandler) {
    this.button_state_history = new ButtonLogger();
  }
}
