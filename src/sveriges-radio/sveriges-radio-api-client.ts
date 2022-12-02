import fetch from 'node-fetch';
import { EpisodesApiResponse } from './api-interfaces';

export default class SverigesRadioApiClient {
  public async fetchEpisodes(program_id: string, number_of_episodes: number): Promise<EpisodesApiResponse> {
    const url = `https://api.sr.se/api/v2/episodes/index?programid=${program_id}&audioquality=hi&format=json&size=${number_of_episodes}`;
    const response = await fetch(url);
    return (await response.json()) as EpisodesApiResponse;
  }
}
