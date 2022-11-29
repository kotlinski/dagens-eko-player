import Player from './player/player';
import SverigesRadioApiClient from './sveriges-radio/sveriges-radio-api-client';
import ProcessorProvider from './player/processor-provider';
import Keyboard from './io/keyboard';
import SingleButtonSequenceInterpreter from './io/single-button-io/button-interpreter';
import PiButton from './io/pi-button';
import SverigesRadioProgramProvider from './sveriges-radio/sveriges-radio-program-provider';

function setUpIO(): (Keyboard | PiButton)[] {
  const single_button_sequence_interpreter = new SingleButtonSequenceInterpreter();

  const io: (Keyboard | PiButton)[] = [];
  try {
    io.push(new Keyboard(single_button_sequence_interpreter));
  } catch (error) {
    console.log((error as Error).message);
  }
  try {
    io.push(new PiButton(single_button_sequence_interpreter));
  } catch (error) {
    console.log((error as Error).message);
  }
  if (io.length < 1) {
    throw new Error('No input, you need to connect a keyboard or a button and then restart the Radio');
  }
  return io;
}

export function bootHardwareFromInput() {
  const program_provider = new SverigesRadioProgramProvider(new SverigesRadioApiClient());

  // todo: separate vlc_process and processor_provider
  // rename processor-provider to VLC-process provider
  const processor_provider = new ProcessorProvider(program_provider);

  new Player(processor_provider, setUpIO());
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  bootHardwareFromInput();
})();
