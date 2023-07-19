import { Episode } from './episode-interface';
import ApiClient from '../api-client/api-client';
import { EpisodesApiResponse } from '../api-client/api-interfaces';
import { formatApiEpisode, hasUrlStream } from '../array-operations/map';
import { publishDateSortPredicate } from '../array-operations/sort';

export default class EpisodesProvider {
  constructor(private readonly api_client: ApiClient) {}

  /**
   * returns Episodes sorted by publish date
   * @param program_id
   * @param number_of_episodes
   */
  async fetchEpisodes(program_id: number, number_of_episodes: number): Promise<Episode[]> {
    const response = await this.api_client.fetchEpisodes(program_id, number_of_episodes);
    return this.transformApiResponse(response).sort(publishDateSortPredicate);
  }

  private transformApiResponse(api_response: EpisodesApiResponse): Episode[] {
    const episodes_with_url = api_response.episodes.filter((episode) => hasUrlStream(episode));
    return episodes_with_url.map(formatApiEpisode);
  }
}
