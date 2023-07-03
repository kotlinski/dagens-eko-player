import { ChildProcess } from 'child_process';
import VlcProcess from '../vlc-process';

const mock_std_in = require('mock-stdin').stdin();

describe('vlc-process', () => {
  let vlc_process: VlcProcess;

  beforeAll(() => {
    const child_process = new ChildProcess();
    child_process.stdin = mock_std_in;
    child_process.stdout = mock_std_in;
    vlc_process = new VlcProcess(child_process);
  });
  beforeEach(() => {
    vlc_process.stdin!.write = jest.fn();
  });
  describe('printAvailableCommands', () => {
    it('should have written vlc command', () => {
      vlc_process.printAvailableCommands();
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('help\n');
    });
  });
  describe('addEpisodesToPlaylist', () => {
    it('should have written vlc command', () => {
      vlc_process.addEpisodesToPlaylist(['url_1', 'url_2']);
      expect(vlc_process.stdin!.write).toHaveBeenCalledTimes(3);
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('enqueue url_1\n');
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('enqueue url_2\n');
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('goto 0\n');
    });
  });
  describe('command', () => {
    it('should have written vlc command', () => {
      vlc_process.command('pause');
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('pause\n');
    });
  });
  describe('seekInTime', () => {
    it('should act on number output', () => {
      vlc_process.seekInTime(10);
      vlc_process.stdout?.emit('data', '100');
      expect(vlc_process.stdin!.write).toHaveBeenCalledTimes(3);
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('get_time\n');
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('seek 110\n');
      expect(vlc_process.stdin!.write).toHaveBeenCalledWith('get_time\n');
    });
  });
});
