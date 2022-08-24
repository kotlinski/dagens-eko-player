import { Command } from './command';
import Player from '../player/player';

export default class InputHandler {
  constructor(readonly player: Player) {}
  handle(command: Command) {
    switch (command) {
      case Command.PLAY:
        this.player.play();
        break;
      case Command.STOP:
        this.player.stop();
        break;
    }
    console.log(`command: ${command}`);
  }
}
