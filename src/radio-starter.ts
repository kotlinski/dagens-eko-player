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
  io.push(new Keyboard(single_button_sequence_interpreter, button_recorder));
  io.push(new PiButton(single_button_sequence_interpreter, button_recorder));
  return io;
}

let input_output: (Keyboard | PiButton)[] = [];
export function bootRadio() {
  const program_provider = new RadioUrlProvider(new EpisodesProvider(new ApiClient()));
  const processor_provider = new VlcProcessSupervisor();
  input_output = setUpIO();
  return new Player(processor_provider, input_output, program_provider);
}

/**
 * used for testing purposes to ensure that keyboard input is closed
 */
export function killRadio() {
  input_output.forEach((io) => {
    io.kill();
  });
}
