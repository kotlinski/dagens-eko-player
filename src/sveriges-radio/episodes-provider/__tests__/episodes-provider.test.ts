import { when } from 'jest-when';
import mock_response_178 from '../../__tests__/api-response/178.json';
import mock_response_2895 from '../../__tests__/api-response/2895.json';
import mock_response_406 from '../../__tests__/api-response/406.json';
import mock_response_4540 from '../../__tests__/api-response/4540.json';
import mock_response_478 from '../../__tests__/api-response/478.json';
import mock_response_5380 from '../../__tests__/api-response/5380.json';
import ApiClient from '../../api-client/api-client';
import EpisodesProvider from '../episodes-provider';
import spyOn = jest.spyOn;

describe('ApiResponseTransformer', () => {
  let episodes_provider: EpisodesProvider;
  let api_mock: jest.SpiedFunction<ApiClient['fetchEpisodes']>;

  beforeAll(() => {
    const api_client = new ApiClient();
    api_mock = spyOn(api_client, 'fetchEpisodes');
    episodes_provider = new EpisodesProvider(api_client);
  });

  beforeEach(() => {
    when(api_mock).calledWith(178, 2).mockResolvedValue(mock_response_178);
    when(api_mock).calledWith(406, 2).mockResolvedValue(mock_response_406);
    when(api_mock).calledWith(478, 2).mockResolvedValue(mock_response_478);
    when(api_mock).calledWith(2895, 2).mockResolvedValue(mock_response_2895);
    when(api_mock).calledWith(4540, 2).mockResolvedValue(mock_response_4540);
    when(api_mock).calledWith(5380, 2).mockResolvedValue(mock_response_5380);
  });

  const cases: [string, number][] = [
    ['Ekonomiekot', 178],
    ['Vetenskapsradion Nyheter', 406],
    ['Kulturnytt i P1', 478],
    ['Radiosportens nyhetssändningar', 2895],
    ['Ekot nyhetssändning', 4540],
    ['Ekot senaste nytt', 5380],
  ];

  describe('transformApiResponse', () => {
    test.each(cases)('given a response %p response', async (_description: string, program_id: number) => {
      const result = await episodes_provider.fetchEpisodes(program_id, 2);
      expect(result).toMatchSnapshot();
    });
  });
});
