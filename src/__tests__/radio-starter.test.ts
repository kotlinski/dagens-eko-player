import Player from '../radio/player';
import { bootRadio, killRadio } from '../radio-starter';

jest.mock('../radio/player');
describe('bootRadio', () => {
  it('should have created a player', () => {
    const radio = bootRadio();
    expect(Player).toHaveBeenCalledTimes(1);
    radio.kill();
    killRadio();
  });
});
