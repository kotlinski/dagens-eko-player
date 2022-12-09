import ApiClient from '../api-client';

describe('SverigesRadioApiClient', () => {
  let api_client: ApiClient;
  beforeEach(() => {
    api_client = new ApiClient();
  });
  describe('fetchLatestEpisode', () => {
    jest.setTimeout(10_000);
    it('should fetch an object containing an episode url', async () => {
      const response = await api_client.fetchEpisodes(5380, 2);
      expect(response.episodes.length).toEqual(2);
      response.episodes.forEach((episode) => {
        expect(episode).toHaveProperty('description');
      });
    });
  });
});
