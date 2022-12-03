import { Command } from './command';

export default interface CommandEmitter {
  registerListener(param: (command: Command) => Promise<void>): void;
}
