import ProcessProvider from './processor-provider';

export default class Player {
  constructor(private readonly process_provider: ProcessProvider) {}

  async play(): Promise<void> {
    const process = await this.process_provider.provideProcess();
    if (process.stdin) {
      process.stdin.write(`play\n`);
    }
  }

  async pause() {
    const process = await this.process_provider.provideProcess();
    if (process.stdin) {
      process.stdin.write(`pause\n`);
    }
  }

  reset() {
    this.process_provider.resetProcessor();
  }

  async next() {
    const process = await this.process_provider.provideProcess();
    if (process.stdin) {
      process.stdin.write(`next\n`);
    }
  }
}
