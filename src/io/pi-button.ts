import { Gpio, ValueCallback } from 'onoff';
import SingleButtonAbstract from './single-button-io/single-button-abstract';

import SingleButtonSequenceInterpreter from './single-button-io/interpreter/button-sequence-interpreter';

enum BinaryButtonValue {
  PRESSED,
  RELEASED,
}
export default class PiButton extends SingleButtonAbstract {
  private readonly button: Gpio;
  constructor(interpreter: SingleButtonSequenceInterpreter) {
    super(interpreter);
    this.button = new Gpio(3, 'in', 'both', { debounceTimeout: 25 });
    this.button.watch(this.handleButtonInteraction());
  }

  private handleButtonInteraction(): ValueCallback {
    return (err, value) => {
      if (err) {
        console.error(err);
        throw err;
      }
      if (value === BinaryButtonValue.PRESSED) {
        this.singleButtonInteraction('PRESSED');
      }
      if (value === BinaryButtonValue.RELEASED) {
        this.singleButtonInteraction('RELEASED');
      }
    };
  }
}
