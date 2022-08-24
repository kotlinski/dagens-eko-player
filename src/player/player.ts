import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export default class Player {
  constructor(readonly player: 'cvlc' | 'vlc') {}
  current_process: ChildProcessWithoutNullStreams | undefined = undefined;

  private spawnPlayer(): ChildProcessWithoutNullStreams {
    const child = spawn(this.player, ['https://sverigesradio.se/topsy/ljudfil/srapi/8368057.mp3']);
    child.stdout.on('data', (data: string) => {
      console.log(`stdout: ${data}`);
    });
    child.stderr.on('data', (data: string) => {
      console.error(`stderr: ${data}`);
    });
    child.on('close', (code: string) => {
      console.log(`child process exited with code ${code}`);
    });
    return child;
  }

  play() {
    if (this.current_process) {
      this.stop();
    }
    this.current_process = this.spawnPlayer();
  }

  stop() {
    if (this.current_process?.pid) process.kill(this.current_process.pid);
    this.current_process = undefined;
  }
}
