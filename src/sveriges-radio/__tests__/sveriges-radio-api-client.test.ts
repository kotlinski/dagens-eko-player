import SverigesRadioApiClient from '../sveriges-radio-api-client';

describe('SverigesRadioApiClient', () => {
  let api_client: SverigesRadioApiClient;
  beforeEach(() => {
    api_client = new SverigesRadioApiClient();
  });
  describe('fetchLatestEpisode', () => {
    it('should fetch an object containing an episode url', async () => {
      const episodes = await api_client.fetchEpisodes('5380', 2);
      // should match an url mp3-file
      expect(episodes.length).toEqual(2);
      episodes.forEach((episode) => {
        expect(episode).toHaveProperty('listenpodfile');
      });
    });
  });
});
