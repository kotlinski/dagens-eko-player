import Player from '../player';
import VlcProcessSupervisor from '../../processes/vlc-process-supervisor';
import RadioUrlProvider from '../../sveriges-radio/radio-url-provider';
import EpisodesProvider from '../../sveriges-radio/episodes-provider/episodes-provider';
import ApiClient from '../../sveriges-radio/api-client/api-client';
import CommandEmitter from '../command-emitter';
import { Command } from '../command';
import VlcProcess from '../../processes/vlc-process';

class TestEmitter implements CommandEmitter {
  private command_listener: ((command: Command) => Promise<void>) | undefined;
  registerListener(command_function: (command: Command) => Promise<void>): void {
    this.command_listener = command_function;
  }

  public async triggerCommand(command: Command) {
    await this.command_listener!(command);
  }
}
describe('player', () => {
  let test_emitter: TestEmitter;
  let access_process_spy: jest.SpiedFunction<VlcProcessSupervisor['accessProcess']>;
  let kill_process_spy: jest.SpiedFunction<VlcProcessSupervisor['killProcess']>;
  let fetch_urls_spy: jest.SpiedFunction<RadioUrlProvider['fetchLatestEpisodeUrls']>;
  let vlc_add_episodes_spy: jest.SpiedFunction<VlcProcess['addEpisodesToPlaylist']>;
  let vlc_command_spy: jest.SpiedFunction<VlcProcess['command']>;
  let vlc_seek_in_time_spy: jest.SpiedFunction<VlcProcess['seekInTime']>;
  const urls = ['http::radio/url.com'];

  beforeEach(() => {
    const supervisor = new VlcProcessSupervisor();
    const process = VlcProcess.prototype;
    vlc_add_episodes_spy = jest.spyOn(process, 'addEpisodesToPlaylist').mockResolvedValue();
    vlc_command_spy = jest.spyOn(process, 'command').mockReturnValue();
    vlc_seek_in_time_spy = jest.spyOn(process, 'seekInTime').mockReturnValue();

    access_process_spy = jest.spyOn(supervisor, 'accessProcess').mockReturnValue(process);
    kill_process_spy = jest.spyOn(supervisor, 'killProcess').mockReturnValue();
    const url_provider = new RadioUrlProvider(new EpisodesProvider(new ApiClient()));
    fetch_urls_spy = jest.spyOn(url_provider, 'fetchLatestEpisodeUrls').mockResolvedValue(urls);
    test_emitter = new TestEmitter();
    new Player(supervisor, [test_emitter], url_provider);
  });

  describe('when START is emitted', () => {
    it('should start playing the radio', async () => {
      await test_emitter.triggerCommand('START');
      expect(fetch_urls_spy).toHaveBeenCalled();
      expect(vlc_add_episodes_spy).toHaveBeenCalledWith(urls);
      expect(access_process_spy).toHaveBeenCalled();
      expect(vlc_command_spy).toHaveBeenCalledWith('play');
    });
  });

  describe('when STOP is emitted', () => {
    it('should kill the process', async () => {
      await test_emitter.triggerCommand('STOP');
      expect(kill_process_spy).toHaveBeenCalled();
    });
  });
  describe('when TOGGLE_PAUSE is emitted', () => {
    it('should toggle pause', async () => {
      await test_emitter.triggerCommand('TOGGLE_PAUSE');
      expect(vlc_command_spy).toHaveBeenCalledWith('pause');
    });
  });
  describe('when NEXT is emitted', () => {
    it('should pass the next command', async () => {
      await test_emitter.triggerCommand('NEXT');
      expect(vlc_command_spy).toHaveBeenCalledWith('next');
    });
  });
  describe('when REWIND_15_S is emitted', () => {
    it('should pass a seek command', async () => {
      await test_emitter.triggerCommand('REWIND_15_S');
      expect(vlc_seek_in_time_spy).toHaveBeenCalledWith(-15);
    });
  });
  describe('when SKIP_15_S is emitted', () => {
    it('should pass a seek command', async () => {
      await test_emitter.triggerCommand('SKIP_15_S');
      expect(vlc_seek_in_time_spy).toHaveBeenCalledWith(15);
    });
  });
});
