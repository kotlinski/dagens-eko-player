import fetch from 'node-fetch';
import { Episode, Episodes } from './interfaces';

function publishDateSortPredicate(episode_a: Episode, episode_b: Episode): number {
  const date_a = parseSverigesRadioDate(episode_a.publishdateutc);
  const date_b = parseSverigesRadioDate(episode_b.publishdateutc);
  if (date_a > date_b) return -1;
  if (date_a < date_b) return 1;
  return 0;
}

function uniqueDescriptionPredicate(episode: Episode, index: number, episodes: Episode[]): boolean {
  for (let i = 0; i < index; i++) {
    if (episodes[i].description === episode.description) {
      return false;
    }
  }
  return true;
}

function parseSverigesRadioDate(sveriges_radio_date: string) {
  return new Date(Number(sveriges_radio_date.match(/\d+/)![0]));
}

export default class SverigesRadioApiClient {
  prio_1_program_ids = [
    '5380', // Ekot senaste nytt
    '4540', // Ekot nyhetssändning
    '178', // Ekonomiekot
  ];
  prio_2_program_ids = [
    // '4880', // P3 Nyheter på en minut
    '406', // Vetenskapsradion Nyheter
    '2895', // Radiosportens nyhetssändningar
    '478', // Kulturnytt i P1
  ];

  // will pick the latest episode of each program id
  // Todo: remove logic from sveriges-radio-api-client
  async fetchLatestEpisodeUrls(): Promise<string[]> {
    return (
      await Promise.all(
        [this.prio_1_program_ids, this.prio_2_program_ids].map(async (program_ids: string[]) =>
          Promise.all(
            program_ids.map(async (program_id: string) =>
              this.fetchEpisodes(
                `https://api.sr.se/api/v2/episodes/index?programid=${program_id}&audioquality=hi&format=json&size=2`,
              ),
            ),
          ),
        ),
      )
    )
      .flat()
      .flat()
      .map((episode: Episode, index: number) => {
        console.log(`${index + 1}. ${episode.title}`);
        return episode.listenpodfile.url;
      });
  }

  private async fetchEpisodes(url: string): Promise<Episode[]> {
    const response = await fetch(url);
    const latest_episode_info = (await response.json()) as Episodes;
    return latest_episode_info.episodes
      .filter((episode: Episode) => episode?.listenpodfile?.url)
      .sort(publishDateSortPredicate)
      .filter(uniqueDescriptionPredicate);
  }
}
