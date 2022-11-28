import SverigesRadioApiClient from '../sveriges-radio/sveriges-radio-api-client';
import { ChildProcess, spawn } from 'child_process';

export default class ProcessorProvider {
  constructor(private readonly sveriges_radio_api_client: SverigesRadioApiClient) {}
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
    const p = await this.createProcess();
    p.stdin!.write(`help\n`);
    setTimeout(() => {
      if (p.pid) process.kill(p.pid);
    }, 2_000);
  }

  public async provideProcess(): Promise<ChildProcess> {
    if (!this.process) {
      this.process = await this.createProcess();
      await this.addEpisodesToPlaylist();
    }
    return this.process;
  }

  private async addEpisodesToPlaylist() {
    const urls = await this.sveriges_radio_api_client.fetchLatestEpisodeUrls();
    for (const url of urls) {
      // Not sure if this is needed, but this is my best way of getting the episodes in the correct order
      await new Promise((resolve) => {
        this.process!.stdin!.write(`add ${url}\n`, () => {
          resolve(undefined);
        });
      });
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
