import fetch from 'node-fetch';
import dayjs from 'dayjs';
import { Episode, Episodes } from './interfaces';

function publishDateSortPredicate(episode_a: Episode, episode_b: Episode): number {
  const date_a = parseSverigesRadioDate(episode_a.publishdateutc);
  const date_b = parseSverigesRadioDate(episode_b.publishdateutc);
  if (date_a > date_b) return -1;
  if (date_a < date_b) return 1;
  return 0;
}

function parseSverigesRadioDate(sveriges_radio_date: string) {
  return new Date(Number(sveriges_radio_date.match(/\d+/)![0]));
}

export default class SverigesRadioApiClient {
  async fetchLatestEpisodeUrls(): Promise<string[]> {
    const from_date = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const to_date = dayjs().add(1, 'day').format('YYYY-MM-DD');

    const program_id = '4540'; // Ekot nyhetssändning
    const url = `https://api.sr.se/api/v2/episodes/index?programid=${program_id}&fromdate=${from_date}&todate=${to_date}&audioquality=hi&format=json`;
    console.log(`url: ${JSON.stringify(url, null, 2)}`);
    const response = await fetch(url);
    const latest_episode_info = (await response.json()) as Episodes;
    return latest_episode_info.episodes
      .filter((episode: Episode) => episode.listenpodfile)
      .sort(publishDateSortPredicate)
      .map((episode: Episode) => {
        console.log(parseSverigesRadioDate(episode.publishdateutc));
        console.log(episode.title);
        console.log(episode.listenpodfile.url);
        return episode.listenpodfile.url;
      });
  }
}
