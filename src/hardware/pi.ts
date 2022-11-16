import { Gpio } from 'onoff';
import Hardware from './hardware';

import { Command } from '../radio/command';
import InputHandler from '../radio/input-handler';

enum Button {
  PRESSED,
  RELEASED,
}
export default class Pi extends Hardware {
  private readonly button: Gpio;

  constructor(handler: InputHandler) {
    super(handler);
    this.button = new Gpio(3, 'in', 'both', { debounceTimeout: 25 });
    console.log('Spinning up button handler');
    this.button.watch((err, value) => {
      console.log('Button got triggered');
      if (err) {
        console.error(err);
        throw err;
      }

      if (value === Button.PRESSED) {
        void handler.handle(Command.PAUSE);
      }
      if (value === Button.RELEASED) {
        void handler.handle(Command.PLAY);
      }
    });
  }
}
