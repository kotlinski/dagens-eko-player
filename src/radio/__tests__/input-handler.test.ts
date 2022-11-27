import Player from '../../player/player';
import { Command } from '../command';
import InputHandler from '../input-handler';

describe('InputHandler', () => {
  let input_handler: InputHandler;
  let play_spy: jest.SpiedFunction<Player['play']>;

  beforeEach(() => {
    play_spy = jest.spyOn(Player.prototype, 'play').mockResolvedValue();
    input_handler = new InputHandler(Player.prototype);
  });
  describe('handling commands', () => {
    it('should handle the command play', () => {
      void input_handler.handleCommand(Command.PLAY);
      expect(play_spy).toHaveBeenCalled();
    });
  });
});
