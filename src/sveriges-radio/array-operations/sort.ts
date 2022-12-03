import { Episode } from '../episodes-provider/episode-interface';

/**
 * Simply sorts an array of episodes based on their publish date
 */
export function publishDateSortPredicate(episode_a: Episode, episode_b: Episode): number {
  const date_a = episode_a.publish_date;
  const date_b = episode_b.publish_date;
  if (date_a > date_b) return -1;
  if (date_a < date_b) return 1;
  return 0;
}
