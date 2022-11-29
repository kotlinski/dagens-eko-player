import VlcProcessSupervisor from '../processes/vlc-process-supervisor';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const process_supervisor = new VlcProcessSupervisor();
  process_supervisor.accessProcess().printAvailableCommands();
  setTimeout(() => {
    process_supervisor.killProcess();
  }, 1_000);
})();
