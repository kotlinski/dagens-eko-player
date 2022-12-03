import { mockEpisode } from '../../__tests__/test-helper';
import { uniqueDescriptionPredicate } from '../filter';

describe('filter', () => {
  describe('uniqueDescriptionPredicate', () => {
    it('should return both episodes if containing different descriptions', () => {
      const episode_a = mockEpisode({ description: 'a' });
      const episode_b = mockEpisode({ description: 'b' });
      expect([episode_a, episode_b].filter(uniqueDescriptionPredicate).length).toEqual(2);
    });
    it('should return 1 episode if containing equal description', () => {
      const episode_a1 = mockEpisode({ description: 'a' });
      const episode_a2 = mockEpisode({ description: 'a' });
      expect([episode_a1, episode_a2].filter(uniqueDescriptionPredicate)).toEqual([episode_a1]);
    });
  });
});
