import SverigesRadioApiClient from '../sveriges-radio/sveriges-radio-api-client';
import { ChildProcess, spawn } from 'child_process';

type SupportedCommandLinePlayers = 'vlc';

export default class ProcessorProvider {
  constructor(
    private readonly sveriges_radio_api_client: SverigesRadioApiClient,
    private readonly player: SupportedCommandLinePlayers,
  ) {}

  process: ChildProcess | undefined = undefined;

  private async createProcess(): Promise<ChildProcess> {
    const child = spawn(this.player);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    child.stdout.pipe(process.stdout);
    child.on('exit', (code: number) => {
      console.log(`code: ${code}`);
    });
    child.stdin.write(`playlist\n`);
    // child.stdin.write(`play\n`);
    return child;
  }

  public async provideProcess(): Promise<ChildProcess> {
    if (!this.process) {
      this.process = await this.createProcess();
      const urls = await this.sveriges_radio_api_client.fetchLatestEpisodeUrls();
      console.log('urls');
      urls.forEach((url: string) => {
        console.log(url);
        this.process!.stdin!.write(`add ${url}\n`);
      });
    }
    return this.process;
  }
  public resetProcessor() {
    if (this.process?.pid) process.kill(this.process.pid);
    this.process = undefined;
  }
}
