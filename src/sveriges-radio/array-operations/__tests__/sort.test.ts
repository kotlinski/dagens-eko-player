import { mockEpisode } from '../../__tests__/test-helper';
import { Episode } from '../../episodes-provider/episode-interface';
import { publishDateSortPredicate } from '../sort';

describe('sort', () => {
  describe('publishDateSortPredicate', () => {
    let old_episode: Episode;
    let new_episode: Episode;
    let another_new_episode: Episode;
    beforeAll(() => {
      old_episode = mockEpisode({ publish_date: new Date('2000-01-22') });
      new_episode = mockEpisode({ publish_date: new Date('2022-12-22') });
      another_new_episode = mockEpisode({ publish_date: new Date('2022-12-22') });
    });
    it('should always put newest episode first', () => {
      const expected_result = [new_episode, another_new_episode, old_episode];
      expect([old_episode, new_episode, another_new_episode].sort(publishDateSortPredicate)).toEqual(expected_result);
      expect([new_episode, old_episode, another_new_episode].sort(publishDateSortPredicate)).toEqual(expected_result);
    });
  });
});
