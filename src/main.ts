import Player from './radio/player';
import ApiClient from './sveriges-radio/api-client/api-client';
import VlcProcessSupervisor from './processes/vlc-process-supervisor';
import Keyboard from './io/keyboard';
import SingleButtonSequenceInterpreter from './io/single-button-io/interpreter/button-sequence-interpreter';
import PiButton from './io/pi-button';
import RadioUrlProvider from './sveriges-radio/radio-url-provider';
import EpisodesProvider from './sveriges-radio/episodes-provider/episodes-provider';
import PatternFinder from './io/single-button-io/interpreter/pattern-finder';
import SingleButtonRecorder from './io/single-button-io/recorder/single-button-recorder';

function setUpIO(): (Keyboard | PiButton)[] {
  const single_button_sequence_interpreter = new SingleButtonSequenceInterpreter(new PatternFinder());
  const button_recorder: SingleButtonRecorder = new SingleButtonRecorder();

  const io: (Keyboard | PiButton)[] = [];
  try {
    io.push(new Keyboard(single_button_sequence_interpreter, button_recorder));
  } catch (error) {
    console.log((error as Error).message);
  }
  try {
    io.push(new PiButton(single_button_sequence_interpreter, button_recorder));
  } catch (error) {
    console.log((error as Error).message);
  }
  if (io.length < 1) {
    throw new Error('No input, you need to connect a keyboard or a button and then restart the Radio');
  }
  return io;
}

export function bootHardwareFromInput() {
  const program_provider = new RadioUrlProvider(new EpisodesProvider(new ApiClient()));
  const processor_provider = new VlcProcessSupervisor();
  new Player(processor_provider, setUpIO(), program_provider);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  bootHardwareFromInput();
})();
