import { printEpisodeDetails, uniqueDescriptionPredicate } from './array-operations/filter';
import { publishDateSortPredicate } from './array-operations/sort';
import { Episode } from './episodes-provider/episode-interface';
import EpisodesProvider from './episodes-provider/episodes-provider';

export default class RadioUrlProvider {
  constructor(private readonly episodes_provider: EpisodesProvider) {}

  async fetchLatestEpisodeUrls(program_ids: number[][]): Promise<string[]> {
    const ordered_episodes = (await Promise.all(program_ids.map(this.fetchOrderedProgramEpisodes()))).flat();
    return ordered_episodes.filter(printEpisodeDetails).map((episode: Episode) => episode.url);
  }

  /**
   * Returns all episodes for programs ordered by publish date
   * @private
   */
  private fetchOrderedProgramEpisodes(): (program_ids: number[]) => Promise<Episode[]> {
    return async (program_ids: number[]) =>
      (await Promise.all(program_ids.map(this.fetchProgramEpisodes()))).flat().sort(publishDateSortPredicate);
  }

  /**
   * Fetch latest episodes not having the same description
   * @private
   */
  private fetchProgramEpisodes(): (program_id: number) => Promise<Episode[]> {
    return async (program_id: number): Promise<Episode[]> =>
      (await this.episodes_provider.fetchEpisodes(program_id, 2)).filter(uniqueDescriptionPredicate);
  }
}
