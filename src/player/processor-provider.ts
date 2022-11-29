import { ChildProcess, spawn } from 'child_process';
import SverigesRadioProgramProvider from '../sveriges-radio/sveriges-radio-program-provider';

export default class ProcessorProvider {
  constructor(private readonly program_provider: SverigesRadioProgramProvider) {}
  process: ChildProcess | undefined = undefined;

  private async createProcess(): Promise<ChildProcess> {
    const child = spawn('vlc', ['--no-random', '--no-playlist-autostart']);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    child.stdout.pipe(process.stdout);
    child.on('exit', (code: number) => {
      console.log(`code: ${code}`);
    });
    return child;
  }

  public async printProcessorCommands() {
    (await this.provideProcess()).stdin!.write(`help\n`);
  }

  public async provideProcess(): Promise<ChildProcess> {
    if (!this.process) {
      this.process = await this.createProcess();
    }
    return this.process;
  }

  public async addEpisodesToPlaylist() {
    const [urls] = await Promise.all([
      await this.program_provider.fetchLatestEpisodeUrls(),
      await this.provideProcess(), // to ensure that a process exists
    ]);

    for (const url of urls) {
      // Not sure if this is needed, but this is my best way of getting the episodes in the correct order
      this.process!.stdin!.write(`enqueue ${url}\n`);
    }
    // make sure that we start from the top of the playlist
    this.process!.stdin!.write(`goto 0\n`);
  }

  public resetProcessor() {
    try {
      if (this.process?.pid) process.kill(this.process.pid);
      this.process = undefined;
    } catch (e) {
      console.error(e);
    }
  }
}
