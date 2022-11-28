import Hardware from './hardware';

import InputHandler from '../radio/input-handler';
import readline, { Interface } from 'readline';
import ButtonLogger, { LONG_THRESHOLD } from '../command-history/button-logger';
import ButtonInterpreter from '../command-history/button-interpreter';

export default class Mac extends Hardware {
  private readonly readline: Interface;
  private readonly logger: ButtonLogger;
  private readonly interpreter: ButtonInterpreter;
  constructor(readonly handler: InputHandler) {
    super(handler);
    this.logger = new ButtonLogger();
    this.interpreter = new ButtonInterpreter(this.logger);
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
      void this.handler.handleCommand('START');
    }
    if (input === '2') {
      void this.handler.handleCommand('STOP');
    }
    if (input === '3') {
      void this.handler.handleCommand('TOGGLE_PAUSE');
    }
    if (input === '4') {
      void this.handler.handleCommand('NEXT');
    }
    if (input === 'w') {
      this.logger.logButtonInteraction('RELEASED');
      this.delayedHandler();
    }
    if (input === 's') {
      this.logger.logButtonInteraction('PRESSED');
      this.delayedHandler();
    }
  }

  private delayedHandler() {
    // before taking any action on the button sequence, we need to wait a bit
    setTimeout(() => {
      const commands = this.interpreter.getNextCommands();
      void this.handler.handleCommands(commands);
    }, LONG_THRESHOLD);
  }
}
