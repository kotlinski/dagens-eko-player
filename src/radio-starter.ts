import Keyboard from './io/keyboard';
import PiButton from './io/pi-button';
import SingleButtonSequenceInterpreter from './io/single-button-io/interpreter/button-sequence-interpreter';
import PatternFinder from './io/single-button-io/interpreter/pattern-finder';
import SingleButtonRecorder from './io/single-button-io/recorder/single-button-recorder';
import { NewEpisodeNotifier } from './new-episode-notification/new-episode-notifier';
import VlcProcessSupervisor from './processes/vlc-process-supervisor';
import Player from './radio/player';
import ApiClient from './sveriges-radio/api-client/api-client';
import EpisodesProvider from './sveriges-radio/episodes-provider/episodes-provider';
import RadioUrlProvider from './sveriges-radio/radio-url-provider';

function setUpIO(): (Keyboard | PiButton)[] {
  const single_button_sequence_interpreter = new SingleButtonSequenceInterpreter(new PatternFinder());
  const button_recorder: SingleButtonRecorder = new SingleButtonRecorder();

  const io: (Keyboard | PiButton)[] = [];
  io.push(new Keyboard(single_button_sequence_interpreter, button_recorder));
  io.push(new PiButton(single_button_sequence_interpreter, button_recorder));
  return io;
}

let input_output: (Keyboard | PiButton)[] = [];
let new_episode_notifier: NewEpisodeNotifier;

export function bootRadio() {
  try {
    const episodes_provider = new EpisodesProvider(new ApiClient());
    const program_provider = new RadioUrlProvider(episodes_provider);
    input_output = setUpIO();

    new_episode_notifier = new NewEpisodeNotifier(episodes_provider);
    new_episode_notifier.startPolling();

    const player_vlc_process = new VlcProcessSupervisor();
    return new Player(player_vlc_process, input_output, program_provider);
  } catch (error: any) {
    console.error(`Fatal error: ${(error as Error).message}`, error);
    throw new Error('Fatal error occurred');
  }
}

/**
 * used for testing purposes to ensure that keyboard input is closed
 */
export function killRadio() {
  new_episode_notifier?.stop();
  input_output.forEach((io) => {
    io.kill();
  });
}
