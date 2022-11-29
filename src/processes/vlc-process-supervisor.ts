import { spawn } from 'child_process';
import VlcProcess from './vlc-process';

export default class VlcProcessSupervisor {
  private vlc_process: VlcProcess | undefined = undefined;

  public accessProcess(): VlcProcess {
    if (!this.vlc_process) {
      this.vlc_process = new VlcProcess(spawn('vlc', ['--no-random', '--no-playlist-autostart']));
    }
    return this.vlc_process;
  }

  public killProcess() {
    try {
      this.vlc_process?.command('shutdown');
      this.vlc_process = undefined;
    } catch (e) {
      console.error(e);
    }
  }
}
