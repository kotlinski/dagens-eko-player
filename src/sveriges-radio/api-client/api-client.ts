import { EpisodesApiResponse } from './api-interfaces';

export default class ApiClient {
  public async fetchEpisodes(program_id: number, number_of_episodes: number): Promise<EpisodesApiResponse> {
    const url = `https://api.sr.se/api/v2/episodes/index?programid=${program_id}&audioquality=hi&format=json&size=${number_of_episodes}`;
    const response = await fetch(url);
    return (await response.json()) as EpisodesApiResponse;
  }
}
