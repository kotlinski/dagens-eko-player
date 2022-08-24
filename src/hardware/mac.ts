import Hardware from './hardware';

import InputHandler from '../radio/input-handler';
import { Command } from '../radio/command';
import readline, { Interface } from 'readline';

export default class Mac extends Hardware {
  private readonly readline: Interface;
  constructor(readonly handler: InputHandler) {
    super(handler);
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.readline.on('line', (event: string) => this.listener(event));
  }
  private listener(key_data: string) {
    const input = key_data.toString();
    if (input === '1') {
      this.handler.handle(Command.PLAY);
    }
    if (input === '2') {
      this.handler.handle(Command.STOP);
    }
  }
}
