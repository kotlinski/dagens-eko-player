import SverigesRadioApiClient from '../sveriges-radio-api-client';
import SverigesRadioProgramProvider from '../sveriges-radio-program-provider';
import mock_response_178 from './responses/178.json';
import mock_response_406 from './responses/406.json';
import mock_response_478 from './responses/478.json';
import mock_response_2895 from './responses/2895.json';
import mock_response_4540 from './responses/4540.json';
import mock_response_5380 from './responses/5380.json';
import { when } from 'jest-when';

describe('SverigesRadioApiClient', () => {
  let provider: SverigesRadioProgramProvider;
  let api_mock: jest.SpiedFunction<SverigesRadioApiClient['fetchEpisodes']>;
  beforeEach(() => {
    const api_client: SverigesRadioApiClient = new SverigesRadioApiClient();
    api_mock = jest.spyOn(api_client, 'fetchEpisodes');
    provider = new SverigesRadioProgramProvider(api_client);
  });
  describe('fetchLatestEpisode', () => {
    let urls: string[];
    beforeEach(async () => {
      when(api_mock).calledWith('178', 2).mockResolvedValue(mock_response_178);
      when(api_mock).calledWith('406', 2).mockResolvedValue(mock_response_406);
      when(api_mock).calledWith('478', 2).mockResolvedValue(mock_response_478);
      when(api_mock).calledWith('2895', 2).mockResolvedValue(mock_response_2895);
      when(api_mock).calledWith('4540', 2).mockResolvedValue(mock_response_4540);
      when(api_mock).calledWith('5380', 2).mockResolvedValue(mock_response_5380);
      urls = await provider.fetchLatestEpisodeUrls();
    });
    it('should fetch all tier 1 and 2 programs', async () => {
      [...provider.tier_1_program_ids, ...provider.tier_2_program_ids].forEach((program_id: string) => {
        expect(api_mock).toHaveBeenCalledWith(program_id, 2);
      });
    });
    it('should return mp3 urls', async () => {
      // should match an url mp3-file
      expect(urls.length).toEqual(7);
      urls.forEach((url) => {
        expect(url).toMatch(/^(https?:)\/\/(([^:\\/?#]*)(?::([0-9]+))?)(\/?[^?#]*).mp3$/);
      });
    });
    it('should contain expected urls', async () => {
      // should match an url mp3-file
      expect(urls).toEqual([
        'https://sverigesradio.se/topsy/ljudfil/srapi/8598068.mp3',
        'https://sverigesradio.se/topsy/ljudfil/srapi/8598075.mp3',
        'https://sverigesradio.se/topsy/ljudfil/srapi/8597854.mp3',
        'https://sverigesradio.se/topsy/ljudfil/srapi/8597021.mp3',
        'https://sverigesradio.se/topsy/ljudfil/srapi/8598083.mp3',
        'https://sverigesradio.se/topsy/ljudfil/srapi/8597769.mp3',
        'https://sverigesradio.se/topsy/ljudfil/srapi/8596821.mp3',
      ]);
    });
  });
});
