import { Episode } from '../episodes-provider/episode-interface';

/**
 * true if description is unique in the array of episodes
 *
 * @private
 */
export function uniqueDescriptionPredicate(episode: Episode, index: number, episodes: Episode[]): boolean {
  for (let i = 0; i < index; i++) {
    if (episodes[i].description === episode.description) {
      return false;
    }
  }
  return true;
}

/**
 * Doesn't filter, only printing
 */
export function printEpisodeDetails(episode: Episode, index: number) {
  const local_time = episode.publish_date.toLocaleTimeString('sv-SE');
  console.log(`${index + 1}. ${local_time.slice(0, 5)} ${episode.program.name} - ${episode.title}`);
  return true;
}
