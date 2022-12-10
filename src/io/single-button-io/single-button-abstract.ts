/**
 * Abstract class radio hardware
 * Currently supporting a keyboard or a pi button
 *
 */
import SingleButtonRecorder from './recorder/single-button-recorder';
import SingleButtonSequenceInterpreter, { LONG_THRESHOLD } from './interpreter/button-sequence-interpreter';
import { SingleButtonState } from './button-interfaces';
import CommandEmitter from '../../radio/command-emitter';
import { Command } from '../../radio/command';

export default abstract class SingleButtonAbstract implements CommandEmitter {
  protected command_listener: ((command: Command) => void) | undefined;

  protected constructor(
    readonly interpreter: SingleButtonSequenceInterpreter,
    readonly button_recorder: SingleButtonRecorder,
  ) {}
  registerListener(command_listener: (command: Command) => void): void {
    this.command_listener = command_listener;
  }

  protected singleButtonInteraction(state: SingleButtonState) {
    try {
      this.button_recorder.logButtonInteraction(state);
      this.delayedHandler();
    } catch (e) {
      console.error((e as Error).message);
    }
  }

  private delayedHandler() {
    // before taking any action on the button sequence, we need to wait a bit
    setTimeout(() => {
      const command = this.interpreter.parseButtonSequence(this.button_recorder.getButtonSequence());
      if (!command) {
        return;
      }
      if (this.command_listener) {
        void this.command_listener(command);
      } else {
        console.error(`Missing Command Listener, no one will receive the ${command} command.`);
      }
    }, LONG_THRESHOLD);
  }
}
