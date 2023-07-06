import path from 'path';
import VlcProcessSupervisor from '../processes/vlc-process-supervisor';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const process_supervisor = new VlcProcessSupervisor();
  const file_path = path.join(__dirname, '../new-episode-notification/notification.mp3');
  console.log(file_path);
  process_supervisor.accessProcess().addEpisodesToPlaylist([file_path]);
  process_supervisor.accessProcess().command('play');
  setTimeout(() => {
    process_supervisor.killProcess();
  }, 1_000);
})();
