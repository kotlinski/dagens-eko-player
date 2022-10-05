import SverigesRadioApiClient from '../sveriges-radio-api-client';

describe('SverigesRadioApiClient', () => {
  let api_client: SverigesRadioApiClient;
  beforeEach(() => {
    api_client = new SverigesRadioApiClient();
  });
  describe('fetchLatestEpisode', () => {
    it('should fetch an object containing an episode url', async () => {
      const episode_urls = await api_client.fetchLatestEpisodeUrls();
      // should match an url mp3-file
      episode_urls.forEach((url) => {
        expect(url).toMatch(/^(https?:)\/\/(([^:\\/?#]*)(?::([0-9]+))?)(\/?[^?#]*).mp3$/);
      });
    });
  });
});
