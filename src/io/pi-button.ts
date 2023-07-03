import { ValueCallback } from 'onoff';
import GpioWrapper from './gpio-wrapper';
import SingleButtonSequenceInterpreter from './single-button-io/interpreter/button-sequence-interpreter';
import SingleButtonRecorder from './single-button-io/recorder/single-button-recorder';
import SingleButtonAbstract from './single-button-io/single-button-abstract';

export enum BinaryButtonValue {
  PRESSED,
  RELEASED,
}

export default class PiButton extends SingleButtonAbstract {
  public readonly button: GpioWrapper;

  constructor(interpreter: SingleButtonSequenceInterpreter, button_recorder: SingleButtonRecorder) {
    super(interpreter, button_recorder);
    this.button = new GpioWrapper();
    this.button.watch(this.handleButtonInteraction());
  }

  public kill() {
    this.button.unwatchAll();
  }

  private handleButtonInteraction(): ValueCallback {
    return (err, value) => {
      if (err) {
        console.error(err);
        return;
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
