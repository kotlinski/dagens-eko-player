import mock_response_5380 from '../../__tests__/api-response/5380.json';
import { EpisodeApiResponse } from '../../api-client/api-interfaces';
import { formatApiEpisode } from '../map';

describe('map', () => {
  describe('formatApiEpisode', () => {
    let raw_episode: EpisodeApiResponse;
    beforeEach(() => {
      raw_episode = JSON.parse(JSON.stringify(mock_response_5380.episodes[0]));
    });
    describe('a sunshine scenario', () => {
      it('should format episode', () => {
        expect([raw_episode].map(formatApiEpisode)).toEqual([
          {
            description: 'Senaste nytt varje timme från Ekoredaktionen.',
            program: {
              id: 5380,
              name: 'Ekot senaste nytt',
            },
            publish_date: new Date('2022-12-02T22:00:00.000Z'),
            title: 'Nyheter från Ekot',
            url: 'https://sverigesradio.se/topsy/ljudfil/srapi/8603124.mp3',
          },
        ]);
      });
    });

    describe("a response missing the 'listenpodfile' field", () => {
      beforeEach(() => {
        delete raw_episode.listenpodfile;
      });
      it('should should fall back to the broadcast m4a url', () => {
        expect([raw_episode].map(formatApiEpisode)[0].url).toEqual(
          'https://sverigesradio.se/topsy/ljudfil/srapi/8603123-hi.m4a',
        );
      });
    });

    describe("a response missing the 'broadcast' field", () => {
      beforeEach(() => {
        delete raw_episode.listenpodfile;
        delete raw_episode.broadcast;
      });
      it('should should fall back to the broadcast m4a url', () => {
        expect(() => [raw_episode].map(formatApiEpisode)[0].url).toThrow(
          new Error(`Can't find stream url for episode id ${raw_episode.id}`),
        );
      });
    });
    describe("a response having an empty 'broadcast' list", () => {
      beforeEach(() => {
        delete raw_episode.listenpodfile;
        raw_episode.broadcast!.broadcastfiles = [];
      });
      it('should should fall back to the broadcast m4a url', () => {
        expect(() => [raw_episode].map(formatApiEpisode)[0].url).toThrow(
          new Error(`Can't find stream url for episode id ${raw_episode.id}`),
        );
      });
    });
  });
});
