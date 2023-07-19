import { EpisodeApiResponse } from '../api-client/api-interfaces';
import { Episode } from '../episodes-provider/episode-interface';

export function formatApiEpisode(episode: EpisodeApiResponse): Episode {
  return {
    title: episode.title,
    url: parseUrl(episode),
    publish_date: parseSverigesRadioDate(episode.publishdateutc),
    description: episode.description,
    program: episode.program,
  };
}

function parseSverigesRadioDate(sveriges_radio_date: string): Date {
  return new Date(Number(sveriges_radio_date.match(/\d+/)![0]));
}

export function hasUrlStream(episode: EpisodeApiResponse): boolean {
  try {
    parseUrl(episode);
    return true;
  } catch (e) {
    return false;
  }
}
function parseUrl(episode: EpisodeApiResponse): string {
  if (episode.listenpodfile?.url !== undefined) {
    return episode.listenpodfile.url;
  } else if (episode.broadcast?.broadcastfiles[0]?.url !== undefined) {
    return episode.broadcast?.broadcastfiles[0]?.url;
  }
  throw new Error(`Can't find stream url for episode id ${episode.id}, \nFull payload: ${JSON.stringify(episode, null, 2)}`);
}
