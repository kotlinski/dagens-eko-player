import { EpisodeApiResponse, EpisodesApiResponse } from './api-interfaces';

export interface Episode {
  title: string;
  url: string;
  publish_date: Date;
  description: string;
}

export default class ApiResponseTransformer {
  transformApiResponse(api_response: EpisodesApiResponse): Episode[] {
    return api_response.episodes.map((episode: EpisodeApiResponse) => ({
      title: episode.title,
      url: this.findUrl(episode),
      publish_date: this.parseSverigesRadioDate(episode.publishdateutc),
      description: episode.description,
    }));
  }

  private parseSverigesRadioDate(sveriges_radio_date: string): Date {
    return new Date(Number(sveriges_radio_date.match(/\d+/)![0]));
  }

  private findUrl(episode: EpisodeApiResponse): string {
    if (episode.listenpodfile?.url !== undefined) {
      return episode.listenpodfile.url;
    } else if (episode.broadcast?.broadcastfiles[0]?.url !== undefined) {
      return episode.broadcast?.broadcastfiles[0]?.url;
    }
    throw new Error(`Can't find stream url episode id ${episode.id}`);
  }
}
