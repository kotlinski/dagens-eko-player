import path from 'path';
import { clearInterval } from 'timers';
import VlcProcessSupervisor from '../processes/vlc-process-supervisor';
import { Episode } from '../sveriges-radio/episodes-provider/episode-interface';
import EpisodesProvider from '../sveriges-radio/episodes-provider/episodes-provider';
import { NewsProgramId } from '../sveriges-radio/news-program-ids';

export class NewEpisodeNotifier {
  private last_episode: Episode | undefined;
  private refresh_interval_id: NodeJS.Timer | undefined;

  constructor(
    private readonly episodes_provider: EpisodesProvider,
    private readonly episode_notifier_vlc_process: VlcProcessSupervisor,
  ) {
    const file_path = path.join(__dirname, 'audio/notification.mp3');
    console.log(file_path);
    this.episode_notifier_vlc_process.accessProcess().addEpisodesToPlaylist([file_path]);
  }

  startPolling() {
    const ONE_MINUTE = 60 * 1_000;
    this.refresh_interval_id = setInterval(() => {
      void this.notifyIfNewEpisode();
    }, ONE_MINUTE * 5);
  }

  public async notifyIfNewEpisode() {
    const list_with_last_episode: Episode[] = await this.episodes_provider.fetchEpisodes(NewsProgramId.EKOT_MAIN_NEWS, 1);
    const last_episode = list_with_last_episode[0];
    if (this.last_episode === undefined) {
      this.last_episode = last_episode;
      console.log('NewEpisodeNotifier initiated');
    } else if (last_episode.publish_date.getTime() !== this.last_episode.publish_date.getTime()) {
      await this.playSound();
      this.last_episode = last_episode;
      console.log('New episode found');
    } else {
      console.log('No new episodes past five minutes');
    }
  }

  public async playSound() {
    this.episode_notifier_vlc_process.accessProcess().command('play');
  }

  stop() {
    try {
      clearInterval(this.refresh_interval_id);
      this.episode_notifier_vlc_process.killProcess();
    } catch (error) {
      console.log(error);
    }
  }
}
