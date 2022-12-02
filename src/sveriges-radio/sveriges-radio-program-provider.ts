import SverigesRadioApiClient from './sveriges-radio-api-client';
import ApiResponseTransformer, { Episode } from './api-response-transformer';

export default class SverigesRadioProgramProvider {
  constructor(
    private readonly api_client: SverigesRadioApiClient,
    private readonly response_transformer: ApiResponseTransformer,
  ) {}

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
    return (await Promise.all([this.tier_1_program_ids, this.tier_2_program_ids].map(this.fetchOrderedProgramEpisodes())))
      .flat()
      .map((episode: Episode, index: number) => {
        const local_time = episode.publish_date.toLocaleTimeString('sv-SE');
        console.log(`${index + 1}. ${local_time.slice(0, 5)} ${episode.title}`);
        return episode.url;
      });
  }

  private fetchOrderedProgramEpisodes(): (program_ids: string[]) => Promise<Episode[]> {
    return async (program_ids: string[]) =>
      (await Promise.all(program_ids.map(this.fetchProgramEpisodes()))).flat().sort(this.publishDateSortPredicate);
  }

  private fetchProgramEpisodes(): (program_id: string) => Promise<Episode[]> {
    return async (program_id: string): Promise<Episode[]> =>
      this.response_transformer
        .transformApiResponse(await this.api_client.fetchEpisodes(program_id, 2))
        .filter(this.uniqueDescriptionPredicate);
  }
  private publishDateSortPredicate(episode_a: Episode, episode_b: Episode): number {
    const date_a = episode_a.publish_date;
    const date_b = episode_b.publish_date;
    if (date_a > date_b) return -1;
    if (date_a < date_b) return 1;
    return 0;
  }

  private uniqueDescriptionPredicate(episode: Episode, index: number, episodes: Episode[]): boolean {
    for (let i = 0; i < index; i++) {
      if (episodes[i].description === episode.description) {
        return false;
      }
    }
    return true;
  }
}
