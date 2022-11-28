import Player from '../../player/player';
import InputHandler from '../input-handler';

describe('InputHandler', () => {
  let input_handler: InputHandler;
  let play_spy: jest.SpiedFunction<Player['start']>;

  beforeEach(() => {
    play_spy = jest.spyOn(Player.prototype, 'start').mockResolvedValue();
    input_handler = new InputHandler(Player.prototype);
  });
  describe('handling commands', () => {
    it('should handle the command play', () => {
      void input_handler.handleCommand('START');
      expect(play_spy).toHaveBeenCalled();
    });
  });
});
