import SingleButtonAbstract from './single-button-io/single-button-abstract';

import readline, { Interface } from 'readline';
import SingleButtonSequenceInterpreter from './single-button-io/interpreter/button-sequence-interpreter';
import CommandEmitter from '../radio/command-emitter';

export default class Keyboard extends SingleButtonAbstract implements CommandEmitter {
  private readonly readline: Interface;
  constructor(readonly interpreter: SingleButtonSequenceInterpreter) {
    super(interpreter);
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.readline.on('line', (event: string) => this.listener(event));
  }
  private listener(key_data: string): void {
    const input = key_data.toString();
    if (this.command_listener === undefined) {
      console.log('Got input, but no one cares.');
      return;
    }
    if (input === '1') {
      void this.command_listener('START');
    }
    if (input === '2') {
      void this.command_listener('TOGGLE_PAUSE');
    }
    if (input === '3') {
      void this.command_listener('NEXT');
    }
    if (input === '4') {
      void this.command_listener('SKIP_15_S');
    }
    if (input === '5') {
      void this.command_listener('REWIND_15_S');
    }
    if (input === '6') {
      void this.command_listener('STOP');
    }
    if (input === 'w') {
      this.singleButtonInteraction('RELEASED');
    }
    if (input === 's') {
      this.singleButtonInteraction('PRESSED');
    }
  }
}
