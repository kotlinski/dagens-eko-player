import VlcProcessSupervisor from '../vlc-process-supervisor';
import VlcProcess from '../vlc-process';
jest.mock('../vlc-process');
const mockSpawn = require('mock-spawn');
const my_spawn = mockSpawn();
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
