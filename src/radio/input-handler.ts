import { Command } from './command';
import Player from '../player/player';

export default class InputHandler {
  constructor(readonly player: Player) {}
  async handleCommands(commands: Command[]) {
    for (const command of commands) {
      await this.handleCommand(command);
    }
  }
  async handleCommand(command: Command) {
    console.log(command);
    switch (command) {
      case 'START':
        await this.player.start();
        break;
      case 'STOP':
        await this.player.stop();
        break;
      case 'TOGGLE_PAUSE':
        await this.player.togglePause();
        break;
      case 'NEXT':
        await this.player.next();
        break;
      case 'SKIP_15_S':
        await this.player.skip15s();
        break;
      case 'REWIND_15_S':
        await this.player.rewind15s();
        break;
    }
  }
}
