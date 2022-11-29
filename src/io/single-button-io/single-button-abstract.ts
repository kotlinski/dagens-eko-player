/**
 * Abstract class radio hardware
 * Currently supporting a keyboard or a pi button
 *
 */
import SingleButtonRecorder, { LONG_THRESHOLD } from './single-button-recorder';
import SingleButtonSequenceInterpreter from './button-interpreter';
import { SingleButtonState } from './button-interfaces';
import CommandEmitter from '../../player/command-emitter';
import { Command } from '../../player/command';

export default abstract class SingleButtonAbstract implements CommandEmitter {
  protected readonly button_recorder: SingleButtonRecorder;
  protected command_listener: ((command: Command) => void) | undefined;

  protected constructor(readonly interpreter: SingleButtonSequenceInterpreter) {
    this.button_recorder = new SingleButtonRecorder();
  }
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
      const command = this.interpreter.parseCommand(this.button_recorder.getLog());
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
