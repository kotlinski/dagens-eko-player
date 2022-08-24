import Pi from './hardware/pi';
import Hardware, { HardwareIdentifier } from './hardware/hardware';
import Mac from './hardware/mac';
import InputHandler from './radio/input-handler';
import Player from './player/player';

export async function startRadio(hardware: Hardware) {
  console.log(`Started radio on ${hardware.constructor.name}`);
}

export function parseInput(input: HardwareIdentifier): Hardware {
  if (input === 'mac') {
    return new Mac(new InputHandler(new Player('vlc')));
  }
  if (input === 'pi') {
    return new Pi(new InputHandler(new Player('cvlc')));
  }
  throw new Error(`could not verify hardware, add a hardware as input. For instance 'mac' or 'pi'`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('starting...');
  const hardware = parseInput(process.argv[2] as HardwareIdentifier);
  await startRadio(hardware);
})();
