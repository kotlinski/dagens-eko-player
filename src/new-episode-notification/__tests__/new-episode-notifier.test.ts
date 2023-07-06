import { when } from 'jest-when';
import VlcProcess from '../../processes/vlc-process';
import VlcProcessSupervisor from '../../processes/vlc-process-supervisor';
import ApiClient from '../../sveriges-radio/api-client/api-client';
import EpisodesProvider from '../../sveriges-radio/episodes-provider/episodes-provider';
import { NewsProgramId } from '../../sveriges-radio/news-program-ids';
import { NewEpisodeNotifier } from '../new-episode-notifier';

describe('NewEpisodeNotifier', () => {
  let notifier: NewEpisodeNotifier;
  let fetch_episodes_spy: jest.SpiedFunction<EpisodesProvider['fetchEpisodes']>;
  let access_process_spy: jest.SpiedFunction<VlcProcessSupervisor['accessProcess']>;
  let vlc_add_episodes_spy: jest.SpiedFunction<VlcProcess['addEpisodesToPlaylist']>;
  let vlc_command_spy: jest.SpiedFunction<VlcProcess['command']>;

  let vlc_supervisor: VlcProcessSupervisor;
  jest.useFakeTimers();

  beforeEach(() => {
    vlc_supervisor = new VlcProcessSupervisor();
    const process = VlcProcess.prototype;
    vlc_add_episodes_spy = jest.spyOn(process, 'addEpisodesToPlaylist').mockReturnValue();
    vlc_command_spy = jest.spyOn(process, 'command').mockReturnValue();
    access_process_spy = jest.spyOn(vlc_supervisor, 'accessProcess').mockReturnValue(process);

    const episodes_provider = new EpisodesProvider(new ApiClient());
    fetch_episodes_spy = jest.spyOn(episodes_provider, 'fetchEpisodes');
    notifier = new NewEpisodeNotifier(episodes_provider, vlc_supervisor);
  });
  afterEach(() => {
    notifier.stop();
    vlc_command_spy.mockReset();
  });
  describe('startPolling', () => {
    it('should notify', () => {
      notifier.startPolling();
      expect(access_process_spy).toHaveBeenCalled();
      expect(vlc_add_episodes_spy).toHaveBeenCalledWith([
        expect.stringContaining('/src/new-episode-notification/audio/notification.mp3'),
      ]);
      expect(vlc_command_spy).not.toHaveBeenCalled();
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
        expect(vlc_command_spy).not.toHaveBeenCalled();
        await notifier.notifyIfNewEpisode();
        expect(vlc_command_spy).toHaveBeenCalledTimes(1);
        expect(vlc_command_spy).toHaveBeenCalledWith('play');
      });
    });
    describe('having not having a new episode', function () {
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

      it('should notify only play once', async () => {
        await notifier.notifyIfNewEpisode();
        expect(vlc_command_spy).not.toHaveBeenCalled();
        await notifier.notifyIfNewEpisode();
        expect(vlc_command_spy).not.toHaveBeenCalled();
      });
    });
  });
});
