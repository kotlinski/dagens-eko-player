import ApiResponseTransformer, { Episode } from '../api-response-transformer';
import mock_response_178 from './responses/178.json';
import mock_response_406 from './responses/406.json';
import mock_response_478 from './responses/478.json';
import mock_response_2895 from './responses/2895.json';
import mock_response_4540 from './responses/4540.json';
import mock_response_5380 from './responses/5380.json';
import { EpisodesApiResponse } from '../api-interfaces';
describe('ApiResponseTransformer', () => {
  let transformer: ApiResponseTransformer;

  beforeAll(() => {
    transformer = new ApiResponseTransformer();
  });

  const cases: [string, EpisodesApiResponse, Episode[]][] = [
    [
      'Ekonomiekot',
      mock_response_178,
      [
        {
          description: 'Ekonomiekot är Ekots nyhetsprogram om senaste nytt i ekonomins värld.',
          publish_date: new Date('2022-12-02T07:32:00.000Z'),
          title: 'Ekonomiekot',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8601833.mp3',
        },
        {
          description: 'Ekonomiekot är Ekots nyhetsprogram om senaste nytt i ekonomins värld.',
          publish_date: new Date('2022-12-02T06:32:00.000Z'),
          title: 'Ekonomiekot',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8601735.mp3',
        },
      ],
    ],
    [
      'Vetenskapsradion Nyheter',
      mock_response_406,
      [
        {
          description:
            'Vetenskapsnyheter från alla tänkbara forskningsområden. Här får du som lyssnare ofta höra nyheten innan den blir uppmärksammad av övriga media. Sänds i P1.',
          publish_date: new Date('2022-12-02T05:34:00.000Z'),
          title: 'Nyheter från Vetenskapsradion',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8601648.mp3',
        },
        {
          description:
            'Vetenskapsnyheter från alla tänkbara forskningsområden. Här får du som lyssnare ofta höra nyheten innan den blir uppmärksammad av övriga media. Sänds i P1.',
          publish_date: new Date('2022-12-01T05:34:00.000Z'),
          title: 'Nyheter från Vetenskapsradion',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8600025.mp3',
        },
      ],
    ],
    [
      'Kulturnytt i P1',
      mock_response_478,
      [
        {
          description:
            'Filmfotografen Sven Nykvist hyllas i helgen - filmaren Sophia Olsson om vad som gjorde hans konstnärsskap unikt.',
          publish_date: new Date('2022-12-02T16:30:00.000Z'),
          title: 'Världens bästa filmer kastas om – kvinnlig regissör toppar listan',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8602914.mp3',
        },
        {
          description: 'Nyhetssändning från kulturredaktionen P1, med reportage, nyheter och recensioner.',
          publish_date: new Date('2022-12-02T14:54:00.000Z'),
          title: 'Kulturnytt',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8602757.mp3',
        },
      ],
    ],
    [
      'Vetenskapsradion Nyheter',
      mock_response_406,
      [
        {
          description:
            'Vetenskapsnyheter från alla tänkbara forskningsområden. Här får du som lyssnare ofta höra nyheten innan den blir uppmärksammad av övriga media. Sänds i P1.',
          publish_date: new Date('2022-12-02T05:34:00.000Z'),
          title: 'Nyheter från Vetenskapsradion',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8601648.mp3',
        },
        {
          description:
            'Vetenskapsnyheter från alla tänkbara forskningsområden. Här får du som lyssnare ofta höra nyheten innan den blir uppmärksammad av övriga media. Sänds i P1.',
          publish_date: new Date('2022-12-01T05:34:00.000Z'),
          title: 'Nyheter från Vetenskapsradion',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8600025.mp3',
        },
      ],
    ],
    [
      'Radiosportens nyhetssändningar',
      mock_response_2895,
      [
        {
          description: 'Med det senaste i sportens värld.',
          publish_date: new Date('2022-12-02T21:10:00.000Z'),
          title: 'Radiosporten',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8603103.mp3',
        },
        {
          description: 'Med det senaste i sportens värld.',
          publish_date: new Date('2022-12-02T19:03:00.000Z'),
          title: 'Radiosporten',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8603043.mp3',
        },
      ],
    ],
    [
      'Ekot senaste nytt',
      mock_response_5380,
      [
        {
          description: 'Senaste nytt varje timme från Ekoredaktionen.',
          publish_date: new Date('2022-12-02T22:00:00.000Z'),
          title: 'Nyheter från Ekot',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8603124.mp3',
        },
        {
          description: 'Senaste nytt varje timme från Ekoredaktionen.',
          publish_date: new Date('2022-12-02T21:00:00.000Z'),
          title: 'Nyheter från Ekot',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8603096.mp3',
        },
      ],
    ],
    [
      'Ekot nyhetssändning',
      { ...mock_response_4540 },
      [
        {
          description:
            'Ekots stora dagliga nyhetssändningar. Nyheter och fördjupning – från Sverige och världen. Ansvarig utgivare: Klas Wolf-Watz',
          publish_date: new Date('2022-12-02T21:00:00.000Z'),
          title: 'Kvällsekot: Ger dig koll på nyhetsläget vid dagens slut',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8603100.mp3',
        },
        {
          description:
            'Ekots stora dagliga nyhetssändningar. Nyheter och fördjupning – från Sverige och världen. Ansvarig utgivare: Klas Wolf-Watz',
          publish_date: new Date('2022-12-02T16:45:00.000Z'),
          title: 'Dagens Eko: Nyheter, ekonomi, sport och kultur',
          url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8602987.mp3',
        },
      ],
    ],
  ];

  describe('transformApiResponse', () => {
    test.each(cases)(
      'given a response %p response',
      (_description: string, response: EpisodesApiResponse, expected_result: Episode[]) => {
        const result = transformer.transformApiResponse(response);
        expect(result).toEqual(expected_result);
      },
    );
    describe('a response missing a listenpodfile', () => {
      let raw_response: EpisodesApiResponse;
      beforeEach(() => {
        raw_response = JSON.parse(JSON.stringify(mock_response_4540));
        delete raw_response.episodes[0].listenpodfile;
      });
      it('should fall back to broadcast url', () => {
        const episodes = transformer.transformApiResponse(raw_response);
        expect(episodes[0].url).toEqual(raw_response.episodes[0]!.broadcast!.broadcastfiles[0].url);
        expect(episodes[1].url).toEqual(raw_response.episodes[1]!.listenpodfile!.url);
      });
    });
    describe('a response missing both listenpodfile and broadcast', () => {
      let raw_response: EpisodesApiResponse;
      beforeEach(() => {
        raw_response = JSON.parse(JSON.stringify(mock_response_4540));
        delete raw_response.episodes[0].listenpodfile;
        delete raw_response.episodes[0].broadcast;
      });
      it('should throw an error', () => {
        expect(() => transformer.transformApiResponse(raw_response)).toThrow("Can't find stream url episode id 2053695");
      });
    });
    describe('a response missing listenpodfile and an empty array of broadcast', () => {
      let raw_response: EpisodesApiResponse;
      beforeEach(() => {
        raw_response = JSON.parse(JSON.stringify(mock_response_4540));
        delete raw_response.episodes[0].listenpodfile;
        console.log(`raw_response.episodes[0]: ${JSON.stringify(raw_response.episodes[0], null, 2)}`);
        raw_response.episodes[0].broadcast!.broadcastfiles = [];
      });
      it('should throw an error', () => {
        expect(() => transformer.transformApiResponse(raw_response)).toThrow("Can't find stream url episode id 2053695");
      });
    });
  });
});
