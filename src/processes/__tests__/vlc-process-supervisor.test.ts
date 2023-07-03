import VlcProcess from '../vlc-process';
import VlcProcessSupervisor from '../vlc-process-supervisor';

jest.mock('../vlc-process');
const mock_spawn = require('mock-spawn');
const my_spawn = mock_spawn();
require('child_process').spawn = my_spawn;
describe('VlcProcessSupervisor', () => {
  let supervisor: VlcProcessSupervisor;

  beforeAll(() => {
    supervisor = new VlcProcessSupervisor();
  });
  afterEach(() => {
    supervisor.killProcess();
  });
  describe('accessProcess', () => {
    it('should only create vlc player once', () => {
      supervisor.accessProcess();
      supervisor.accessProcess();
      expect(VlcProcess).toHaveBeenCalledTimes(1);
    });
  });
});
