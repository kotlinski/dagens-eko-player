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
          new Error(`Can't find stream url for episode id ${raw_episode.id}, \nFull payload: {
  "id": 2052189,
  "title": "Nyheter från Ekot",
  "description": "Senaste nytt varje timme från Ekoredaktionen.",
  "url": "https://sverigesradio.se/avsnitt/2052189",
  "program": {
    "id": 5380,
    "name": "Ekot senaste nytt"
  },
  "audiopreference": "default",
  "audiopriority": "aac",
  "audiopresentation": "format",
  "availableuntilutc": "2023-01-01T22:07:00Z",
  "publishdateutc": "/Date(1670018400000)/",
  "imageurl": "https://static-cdn.sr.se/images/5380/a7898d6c-786f-4fcb-b68e-c5f56f4b3bef.jpg?preset=api-default-square",
  "imageurltemplate": "https://static-cdn.sr.se/images/5380/a7898d6c-786f-4fcb-b68e-c5f56f4b3bef.jpg",
  "photographer": "",
  "broadcasttime": {
    "starttimeutc": "/Date(1670018400000)/",
    "endtimeutc": "/Date(1670018820000)/"
  },
  "downloadpodfile": {
    "title": "Nyheter från Ekot 20221202 23:00",
    "description": "",
    "filesizeinbytes": 6721502,
    "program": {
      "id": 5380,
      "name": "Ekot senaste nytt"
    },
    "availablefromutc": "/Date(1670018400000)/",
    "duration": 420,
    "publishdateutc": "/Date(1670018400000)/",
    "id": 8603124,
    "url": "https://sverigesradio.se/topsy/ljudfil/srapi/8603124.mp3",
    "statkey": "/app/avsnitt/nyheter (ekot)[k(83)]/ekot senaste nytt[p(5380)]/[e(2052189)]"
  },
  "channelid": 164
}`),
        );
      });
    });
    describe("a response having an empty 'broadcast' list", () => {
      beforeEach(() => {
        delete raw_episode.listenpodfile;
        raw_episode.broadcast!.broadcastfiles = [];
      });
      it('should should throw with detailed info', () => {
        expect(() => [raw_episode].map(formatApiEpisode)[0].url).toThrow(
          new Error(`Can't find stream url for episode id ${raw_episode.id}, \nFull payload: {
  "id": 2052189,
  "title": "Nyheter från Ekot",
  "description": "Senaste nytt varje timme från Ekoredaktionen.",
  "url": "https://sverigesradio.se/avsnitt/2052189",
  "program": {
    "id": 5380,
    "name": "Ekot senaste nytt"
  },
  "audiopreference": "default",
  "audiopriority": "aac",
  "audiopresentation": "format",
  "availableuntilutc": "2023-01-01T22:07:00Z",
  "publishdateutc": "/Date(1670018400000)/",
  "imageurl": "https://static-cdn.sr.se/images/5380/a7898d6c-786f-4fcb-b68e-c5f56f4b3bef.jpg?preset=api-default-square",
  "imageurltemplate": "https://static-cdn.sr.se/images/5380/a7898d6c-786f-4fcb-b68e-c5f56f4b3bef.jpg",
  "photographer": "",
  "broadcast": {
    "availablestoputc": "/Date(1672610820000)/",
    "playlist": {
      "duration": 420,
      "publishdateutc": "/Date(1670018400000)/",
      "id": 8603123,
      "url": "https://api.sr.se/api/radio/radio.aspx?type=broadcast&id=8603123&codingformat=.m4a&metafile=asx&quality=hi",
      "statkey": "/app/avsnitt/nyheter (ekot)[k(83)]/ekot senaste nytt[p(5380)]/[e(2052189)]"
    },
    "broadcastfiles": []
  },
  "broadcasttime": {
    "starttimeutc": "/Date(1670018400000)/",
    "endtimeutc": "/Date(1670018820000)/"
  },
  "downloadpodfile": {
    "title": "Nyheter från Ekot 20221202 23:00",
    "description": "",
    "filesizeinbytes": 6721502,
    "program": {
      "id": 5380,
      "name": "Ekot senaste nytt"
    },
    "availablefromutc": "/Date(1670018400000)/",
    "duration": 420,
    "publishdateutc": "/Date(1670018400000)/",
    "id": 8603124,
    "url": "https://sverigesradio.se/topsy/ljudfil/srapi/8603124.mp3",
    "statkey": "/app/avsnitt/nyheter (ekot)[k(83)]/ekot senaste nytt[p(5380)]/[e(2052189)]"
  },
  "channelid": 164
}`),
        );
      });
    });
  });
});
