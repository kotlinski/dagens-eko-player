const Gpio = require('onoff').Gpio;
const { exec } = require('child_process');
var spawn = require('child_process').spawn;

const button = new Gpio(3, 'in', 'falling', { debounceTimeout: 20 });
let state = 'off';
let child;

console.log('starting...');
button.watch((err, value) => {
  if (err) {
    throw err;
  }
  const event = new Date();
  if (value === 0) {
    if (state === 'off') {
      state = 'playing';
      child = play();
    } else {
      state = 'off';
      console.log('child pid: ' + child.pid);
      process.kill(-child.pid);
    }
  }
  console.log(event.toISOString() + 'The Ekot Player is: ' + state);
});

process.on('SIGINT', (_) => {
  button.unexport();
});

const play = function () {
  // const episode = await fetchEpisode()
  // console.log(episode);
  // const child = spawn('cvlc', ['https://sverigesradio.se/topsy/ljudfil/srapi/8368165-hi.m4a'], { detached: true });
  const child = spawn('cvlc', ['https://sverigesradio.se/topsy/ljudfil/srapi/8368057.mp3'], { detached: true });

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  return child;

  console.log(`stdout:\n${stdout}`);
};
