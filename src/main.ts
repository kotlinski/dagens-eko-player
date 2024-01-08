// eslint-disable-next-line @typescript-eslint/no-floating-promises
import { bootRadio } from './radio-starter';

void (async () => {
  try {
    bootRadio();
  } catch (error: any) {
    console.error(`Radio crashed with reason: ${error}`);
  }
})();
