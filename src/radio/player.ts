import VlcProcessSupervisor from '../processes/vlc-process-supervisor';
import CommandEmitter from './command-emitter';
import { Command } from './command';
import RadioUrlProvider from '../sveriges-radio/radio-url-provider';
import { getNewsProgramIds, getOtherNewsProgramIds } from '../sveriges-radio/news-program-ids';

export default class Player {
  private readonly program_ids = [getNewsProgramIds(), getOtherNewsProgramIds()];
  constructor(
    private readonly vlc_process_supervisor: VlcProcessSupervisor,
    command_emitters: CommandEmitter[],
    private readonly program_provider: RadioUrlProvider,
  ) {
    command_emitters.forEach((command_emitter) => {
      command_emitter.registerListener(this.commandHandler());
    });
  }

  private commandHandler(): (command: Command) => Promise<void> {
    return async (command: Command) => {
      const vlc_process = this.vlc_process_supervisor.accessProcess();
      console.log(command);
      switch (command) {
        case 'START':
          await vlc_process.addEpisodesToPlaylist(await this.program_provider.fetchLatestEpisodeUrls(this.program_ids));
          vlc_process.command('play');
          break;
        case 'STOP':
          this.vlc_process_supervisor.killProcess();
          break;
        case 'TOGGLE_PAUSE':
          vlc_process.command('pause');
          break;
        case 'NEXT':
          vlc_process.command('next');
          break;
        case 'SKIP_15_S':
          vlc_process.seekInTime(15);
          break;
        case 'REWIND_15_S':
          vlc_process.seekInTime(-15);
          break;
      }
    };
  }
}
