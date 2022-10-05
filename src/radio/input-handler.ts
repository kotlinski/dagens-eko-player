import { Command } from './command';
import Player from '../player/player';

export default class InputHandler {
  constructor(readonly player: Player) {}
  async handle(command: Command) {
    switch (command) {
      case Command.PLAY:
        await this.player.play();
        break;
      case Command.PAUSE:
        await this.player.pause();
        break;
      case Command.RESET:
        this.player.reset();
        break;
      case Command.NEXT:
        await this.player.next();
        break;
    }
    console.log(`command: ${command}`);
  }
}
