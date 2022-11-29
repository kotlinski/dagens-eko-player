import { Episode } from './interfaces';
import SverigesRadioApiClient from './sveriges-radio-api-client';

function publishDateSortPredicate(episode_a: Episode, episode_b: Episode): number {
  const date_a = parseSverigesRadioDate(episode_a.publishdateutc);
  const date_b = parseSverigesRadioDate(episode_b.publishdateutc);
  if (date_a > date_b) return -1;
  if (date_a < date_b) return 1;
  return 0;
}

function fetchOrderedProgramEpisodes(api_client: SverigesRadioApiClient): (program_ids: string[]) => Promise<Episode[]> {
  return async (program_ids: string[]) =>
    (await Promise.all(program_ids.map(fetchProgramEpisodes(api_client)))).flat().sort(publishDateSortPredicate);
}

function fetchProgramEpisodes(api_client: SverigesRadioApiClient): (program_id: string) => Promise<Episode[]> {
  return async (program_id: string): Promise<Episode[]> =>
    (await api_client.fetchEpisodes(program_id, 2))
      .filter((episode: Episode) => episode?.listenpodfile?.url)
      .filter(uniqueDescriptionPredicate);
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

export default class SverigesRadioProgramProvider {
  constructor(private readonly api_client: SverigesRadioApiClient) {}

  tier_1_program_ids = [
    '5380', // Ekot senaste nytt
    '4540', // Ekot nyhetssändning
    '178', // Ekonomiekot
  ];
  tier_2_program_ids = [
    // '4880', // P3 Nyheter på en minut
    '406', // Vetenskapsradion Nyheter
    '2895', // Radiosportens nyhetssändningar
    '478', // Kulturnytt i P1
  ];

  async fetchLatestEpisodeUrls(): Promise<string[]> {
    return (
      await Promise.all([this.tier_1_program_ids, this.tier_2_program_ids].map(fetchOrderedProgramEpisodes(this.api_client)))
    )
      .flat()
      .map((episode: Episode, index: number) => {
        const local_time = parseSverigesRadioDate(episode.publishdateutc).toLocaleTimeString('sv-SE');
        console.log(`${index + 1}. ${local_time.slice(0, 5)} ${episode.title}`);
        return episode.listenpodfile!.url;
      });
  }
}
