import Pi from './hardware/pi';
import Hardware, { HardwareIdentifier } from './hardware/hardware';
import Mac from './hardware/mac';
import InputHandler from './radio/input-handler';
import Player from './player/player';
import SverigesRadioApiClient from './sveriges-radio/sveriges-radio-api-client';
import ProcessorProvider from './player/processor-provider';

export function bootHardwareFromInput(input: HardwareIdentifier = 'mac'): Hardware {
  const sveriges_radio_api_client = new SverigesRadioApiClient();
  const input_handler = new InputHandler(new Player(new ProcessorProvider(sveriges_radio_api_client)));
  if (input === 'mac') {
    return new Mac(input_handler);
  }
  if (input === 'pi') {
    return new Pi(input_handler);
  }
  throw new Error(`could not verify hardware, add a hardware as input. For instance 'mac' or 'pi'`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  bootHardwareFromInput(process.argv[2] as HardwareIdentifier);
})();
