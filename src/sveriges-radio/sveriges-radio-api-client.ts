import fetch from 'node-fetch';
import dayjs from 'dayjs';
import { Episode, Episodes } from './interfaces';

export default class SverigesRadioApiClient {
  async fetchLatestEpisodeUrls(): Promise<string[]> {
    const from_date = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const to_date = dayjs().add(1, 'day').format('YYYY-MM-DD');

    const program_id = '4540'; // Ekot nyhetssändning
    const url = `https://api.sr.se/api/v2/episodes/index?programid=${program_id}&fromdate=${from_date}&todate=${to_date}&audioquality=hi&format=json`;
    console.log(`url: ${JSON.stringify(url, null, 2)}`);
    const response = await fetch(url);
    const latest_episode_info = (await response.json()) as Episodes;
    return latest_episode_info.episodes.map((episode: Episode) => episode.listenpodfile.url);
  }
}
