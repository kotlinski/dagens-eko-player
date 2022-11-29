import fetch from 'node-fetch';
import { Episode, Episodes } from './interfaces';

export default class SverigesRadioApiClient {
  public async fetchEpisodes(program_id: string, number_of_episodes: number): Promise<Episode[]> {
    const url = `https://api.sr.se/api/v2/episodes/index?programid=${program_id}&audioquality=hi&format=json&size=${number_of_episodes}`;
    const response = await fetch(url);
    return ((await response.json()) as Episodes).episodes;
  }
}
