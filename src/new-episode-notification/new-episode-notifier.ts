import { exec } from 'child_process';
import path from 'path';
import { clearInterval } from 'timers';
import { Episode } from '../sveriges-radio/episodes-provider/episode-interface';
import EpisodesProvider from '../sveriges-radio/episodes-provider/episodes-provider';
import { NewsProgramId } from '../sveriges-radio/news-program-ids';

export class NewEpisodeNotifier {
  private last_episode: Episode | undefined;
  private refresh_interval_id: NodeJS.Timeout | undefined;

  constructor(private readonly episodes_provider: EpisodesProvider) {}

  startPolling() {
    const ONE_MINUTE = 60 * 1_000;
    this.refresh_interval_id = setInterval(() => {
      try {
        void this.notifyIfNewEpisode();
      } catch (error) {
        console.error('The notifier failed', error);
      }
    }, ONE_MINUTE * 45);
  }

  public async notifyIfNewEpisode() {
    const list_with_last_episodes = await this.episodes_provider.fetchEpisodes(NewsProgramId.EKOT_MAIN_NEWS, 1);
    const last_episode = list_with_last_episodes[0];
    if (this.last_episode === undefined) {
      this.last_episode = last_episode;
      console.log(`${new Date().toISOString()}, NewEpisodeNotifier initiated`);
    } else if (last_episode.publish_date.getTime() !== this.last_episode.publish_date.getTime()) {
      NewEpisodeNotifier.playNotificationSound();
      this.last_episode = last_episode;
      console.log(`---`);
      console.log(`${new Date().toISOString()}: New episode found, ${last_episode.title}: ${last_episode.description}`);
      console.log(`Publish date: ${last_episode.publish_date.toISOString()}`);
      console.log(`---`);
    }
  }

  static playNotificationSound() {
    const file_path = path.join(__dirname, '../new-episode-notification/notification.mp3');
    exec(`mpg123 --quiet --gain 25 ${file_path}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }

  stop() {
    try {
      clearInterval(this.refresh_interval_id);
    } catch (error) {
      console.log(error);
    }
  }
}
