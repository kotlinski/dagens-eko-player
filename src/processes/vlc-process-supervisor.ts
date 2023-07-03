import { ChildProcess, spawn } from 'child_process';
import VlcProcess from './vlc-process';

export default class VlcProcessSupervisor {
  private vlc_process: VlcProcess | undefined = undefined;
  private child: ChildProcess | undefined;

  public accessProcess(): VlcProcess {
    if (!this.vlc_process) {
      this.child = spawn('vlc', ['-I', 'rc', '--no-random', '--no-playlist-autostart']);
      this.vlc_process = new VlcProcess(this.child);
    }
    return this.vlc_process;
  }

  public killProcess() {
    try {
      this.vlc_process?.command('shutdown');
      this.child?.kill();
      this.vlc_process = undefined;
    } catch (e) {
      console.error(e);
    }
  }
}
