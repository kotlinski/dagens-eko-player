import { when } from 'jest-when';
import ApiClient from '../../sveriges-radio/api-client/api-client';
import EpisodesProvider from '../../sveriges-radio/episodes-provider/episodes-provider';
import { NewsProgramId } from '../../sveriges-radio/news-program-ids';
import { NewEpisodeNotifier } from '../new-episode-notifier';

describe('NewEpisodeNotifier', () => {
  let notifier: NewEpisodeNotifier;
  let fetch_episodes_spy: jest.SpiedFunction<EpisodesProvider['fetchEpisodes']>;

  jest.useFakeTimers();

  beforeEach(() => {
    const episodes_provider = new EpisodesProvider(new ApiClient());
    fetch_episodes_spy = jest.spyOn(episodes_provider, 'fetchEpisodes');
    notifier = new NewEpisodeNotifier(episodes_provider);
    NewEpisodeNotifier.playNotificationSound = jest.fn();
  });
  afterEach(() => {
    notifier.stop();
  });
  describe('startPolling', () => {
    it('should notify', () => {
      notifier.startPolling();
      expect(NewEpisodeNotifier.playNotificationSound).not.toHaveBeenCalled();
    });
  });
  describe('notifyIfNewEpisode', () => {
    const program_ids = [NewsProgramId.EKOT_MAIN_NEWS];
    describe('having a new episode', function () {
      beforeEach(() => {
        program_ids.flat().forEach((program_id) => {
          when(fetch_episodes_spy)
            .calledWith(program_id, 1)
            .mockResolvedValueOnce([
              {
                title: `title ${program_id}`,
                url: `http://www.url/${program_id}.mp3`,
                publish_date: new Date('2023-02-01T15:05:00'),
                description: 'description',
                program: { id: Number(program_id), name: 'name' },
              },
            ])
            .mockResolvedValue([
              {
                title: `title ${program_id}`,
                url: `http://www.url/${program_id}.mp3`,
                publish_date: new Date('2023-02-01T20:05:00'),
                description: 'description',
                program: { id: Number(program_id), name: 'name' },
              },
            ]);
        });
      });

      it('should notify only play once', async () => {
        await notifier.notifyIfNewEpisode();
        expect(NewEpisodeNotifier.playNotificationSound).not.toHaveBeenCalled();
        await notifier.notifyIfNewEpisode();
        expect(NewEpisodeNotifier.playNotificationSound).toHaveBeenCalledTimes(1);
      });
    });
    describe('not having a new episode', function () {
      beforeEach(() => {
        program_ids.flat().forEach((program_id) => {
          when(fetch_episodes_spy)
            .calledWith(program_id, 1)
            .mockResolvedValue([
              {
                title: `title ${program_id}`,
                url: `http://www.url/${program_id}.mp3`,
                publish_date: new Date('2023-02-01T20:05:00'),
                description: 'description',
                program: { id: Number(program_id), name: 'name' },
              },
            ]);
        });
      });
      it('should not play sound', async () => {
        await notifier.notifyIfNewEpisode();
        expect(NewEpisodeNotifier.playNotificationSound).not.toHaveBeenCalled();
        await notifier.notifyIfNewEpisode();
        expect(NewEpisodeNotifier.playNotificationSound).not.toHaveBeenCalled();
      });
    });
    describe('not being able to fetch episode info', function () {
      beforeEach(() => {
        program_ids.flat().forEach((program_id) => {
          when(fetch_episodes_spy)
            .calledWith(program_id, 1)
            .mockResolvedValueOnce([
              {
                title: `title ${program_id}`,
                url: `http://www.url/${program_id}.mp3`,
                publish_date: new Date('2023-02-01T20:05:00'),
                description: 'description',
                program: { id: Number(program_id), name: 'name' },
              },
            ])
            .mockResolvedValue([]);
        });
      });
      it('should not play sound', async () => {
        await notifier.notifyIfNewEpisode();
        expect(NewEpisodeNotifier.playNotificationSound).not.toHaveBeenCalled();
        await notifier.notifyIfNewEpisode();
        expect(NewEpisodeNotifier.playNotificationSound).not.toHaveBeenCalled();
      });
    });
  });
});
