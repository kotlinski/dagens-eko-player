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
      case Command.PLAY:
        await this.player.start();
        break;
      case Command.STOP:
        await this.player.stop();
        break;
      case Command.TOGGLE_PAUSE:
        await this.player.togglePause();
        break;
      case Command.NEXT:
        await this.player.next();
        break;
      case Command.SKIP_15_S:
        await this.player.skip15s();
        break;
      case Command.REWIND_15_S:
        await this.player.rewind15s();
        break;
    }
  }
}
