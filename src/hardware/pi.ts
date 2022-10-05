import { Gpio } from 'onoff';
import Hardware from './hardware';

import { Command } from '../radio/command';
import InputHandler from '../radio/input-handler';

export default class Pi extends Hardware {
  private button_state: 'playing' | 'off';
  private readonly button: Gpio;

  constructor(handler: InputHandler) {
    super(handler);
    this.button_state = 'off';
    this.button = new Gpio(3, 'in', 'falling', { debounceTimeout: 20 });
    this.button.watch((err, value) => {
      if (err) {
        throw err;
      }
      if (value === 0) {
        if (this.button_state === 'off') {
          this.button_state = 'playing';
          void handler.handle(Command.PLAY);
        } else {
          this.button_state = 'off';
          void handler.handle(Command.PAUSE);
        }
      }
    });
  }
}
