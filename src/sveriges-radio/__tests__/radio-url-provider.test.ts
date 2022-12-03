import ApiClient from '../api-client/api-client';
import RadioUrlProvider from '../radio-url-provider';
import { when } from 'jest-when';
import EpisodesProvider from '../episodes-provider/episodes-provider';
import { getNewsProgramIds, getOtherNewsProgramIds } from '../news-program-ids';

describe('RadioEpisodesProvider', () => {
  let provider: RadioUrlProvider;
  let urls: string[];
  let episodes_provider: EpisodesProvider;
  let program_ids: number[][];
  beforeAll(() => {
    episodes_provider = new EpisodesProvider(new ApiClient());
    program_ids = [getNewsProgramIds(), getOtherNewsProgramIds()];
  });
  describe('fetchLatestEpisode', () => {
    describe('acceptance test', () => {
      beforeEach(() => {
        provider = new RadioUrlProvider(episodes_provider);
      });
      it('should return at least one mp3 or m4a url per program', async () => {
        urls = await provider.fetchLatestEpisodeUrls(program_ids);
        expect(urls.length).toBeGreaterThanOrEqual(program_ids.flat().length);
        urls.forEach((url) => {
          expect(url).toMatch(/^(https?:)\/\/(([^:\\/?#]*)(?::([0-9]+))?)(\/?[^?#]*).(mp3|m4a)$/);
        });
      });
    });

    describe('sunshine scenario', () => {
      let fetch_episodes_mock: jest.SpiedFunction<EpisodesProvider['fetchEpisodes']>;
      beforeEach(() => {
        fetch_episodes_mock = jest.spyOn(episodes_provider, 'fetchEpisodes');
        provider = new RadioUrlProvider(episodes_provider);
      });

      beforeEach(async () => {
        program_ids.flat().forEach((program_id) => {
          when(fetch_episodes_mock)
            .calledWith(program_id, 2)
            .mockResolvedValue([
              {
                title: `title ${program_id}`,
                url: `http://www.url/${program_id}.mp3`,
                publish_date: new Date(Number(program_id) * 15000),
                description: 'description',
                program: { id: Number(program_id), name: 'name' },
              },
              {
                title: `title ${program_id} old`,
                url: `http://www.url/${program_id}-old.mp3`,
                publish_date: new Date(Number(program_id) * 10000),
                description: 'description',
                program: { id: Number(program_id), name: 'name' },
              },
            ]);
        });
      });
      beforeEach(async () => {
        urls = await provider.fetchLatestEpisodeUrls(program_ids);
      });
      it('should fetch all tier 1 and 2 programs', async () => {
        program_ids.flat().forEach((program_id: number) => {
          expect(fetch_episodes_mock).toHaveBeenCalledWith(program_id, 2);
        });
      });
      it('should contain expected urls', async () => {
        // should match an url mp3-file
        expect(urls).toEqual([
          'http://www.url/5380.mp3',
          'http://www.url/4540.mp3',
          'http://www.url/178.mp3',
          'http://www.url/2895.mp3',
          'http://www.url/478.mp3',
          'http://www.url/406.mp3',
        ]);
      });
    });
  });
});
