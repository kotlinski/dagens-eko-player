import Player from '../radio/player';
import { bootRadio, killRadio } from '../radio-starter';

jest.mock('../radio/player');
describe('bootRadio', () => {
  let radio: Player;
  afterAll(() => {
    killRadio();
    radio.kill();
  });
  it('should have created a player', () => {
    radio = bootRadio();
    expect(Player).toHaveBeenCalledTimes(1);
  });
});
