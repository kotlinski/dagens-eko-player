import { Gpio, ValueCallback } from 'onoff';

export default class GpioWrapper {
  private readonly gpio: Gpio | undefined;
  constructor() {
    if (Gpio.accessible) {
      this.gpio = new Gpio(3, 'in', 'both', { debounceTimeout: 25 });
    }
  }
  public watch(callback: ValueCallback): void {
    if (Gpio.accessible) {
      this.gpio!.watch(callback);
    }
  }

  unwatchAll() {
    if (Gpio.accessible) {
      this.gpio!.unwatchAll();
    }
  }
}
