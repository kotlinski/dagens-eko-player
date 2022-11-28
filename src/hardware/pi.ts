import { Gpio } from 'onoff';
import Hardware from './hardware';

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
    this.button.watch((err, value) => {
      if (err) {
        console.error(err);
        throw err;
      }

      if (value === Button.PRESSED) {
        void handler.handleCommand('STOP');
      }
      if (value === Button.RELEASED) {
        void handler.handleCommand('START');
      }
    });
  }
}
