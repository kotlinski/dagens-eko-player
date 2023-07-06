import readline, { Interface } from 'readline';
import SingleButtonSequenceInterpreter from './single-button-io/interpreter/button-sequence-interpreter';
import SingleButtonRecorder from './single-button-io/recorder/single-button-recorder';
import SingleButtonAbstract from './single-button-io/single-button-abstract';
import CommandEmitter from '../radio/command-emitter';

export default class Keyboard extends SingleButtonAbstract implements CommandEmitter {
  private readonly readline: Interface;

  constructor(readonly interpreter: SingleButtonSequenceInterpreter, readonly button_recorder: SingleButtonRecorder) {
    super(interpreter, button_recorder);
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.readline.on('line', (event: string) => this.listener(event));
  }

  public kill() {
    this.readline.close();
    this.readline.removeAllListeners();
  }

  private listener(input: string): void {
    if (this.command_listeners === undefined) {
      console.log('Got input, but no one cares.');
      return;
    }
    if (input === '1') {
      void this.command_listeners.forEach((listener) => listener('START'));
    }
    if (input === '2') {
      void this.command_listeners.forEach((listener) => listener('TOGGLE_PAUSE'));
    }
    if (input === '3') {
      void this.command_listeners.forEach((listener) => listener('NEXT'));
    }
    if (input === '4') {
      void this.command_listeners.forEach((listener) => listener('SKIP_15_S'));
    }
    if (input === '5') {
      void this.command_listeners.forEach((listener) => listener('REWIND_15_S'));
    }
    if (input === '6') {
      void this.command_listeners.forEach((listener) => listener('STOP'));
    }
    if (input === 'w') {
      this.singleButtonInteraction('RELEASED');
    }
    if (input === 's') {
      this.singleButtonInteraction('PRESSED');
    }
  }
}
