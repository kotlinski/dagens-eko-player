import { ChildProcess } from 'child_process';

/* +----[ CLI commands ]
| add XYZ  . . . . . . . . . . . . . . . . . . . . add XYZ to playlist
| enqueue XYZ  . . . . . . . . . . . . . . . . . queue XYZ to playlist
| playlist . . . . . . . . . . . . .  show items currently in playlist
| search [string]  . .  search for items in playlist (or reset search)
| delete [X] . . . . . . . . . . . . . . . . delete item X in playlist
| move [X][Y]  . . . . . . . . . . . . move item X in playlist after Y
| sort key . . . . . . . . . . . . . . . . . . . . . sort the playlist
| sd [sd]  . . . . . . . . . . . . . show services discovery or toggle
| play . . . . . . . . . . . . . . . . . . . . . . . . . . play stream
| stop . . . . . . . . . . . . . . . . . . . . . . . . . . stop stream
| next . . . . . . . . . . . . . . . . . . . . . .  next playlist item
| prev . . . . . . . . . . . . . . . . . . . .  previous playlist item
| goto, gotoitem . . . . . . . . . . . . . . . . .  goto item at index
| repeat [on|off]  . . . . . . . . . . . . . .  toggle playlist repeat
| loop [on|off]  . . . . . . . . . . . . . . . .  toggle playlist loop
| random [on|off]  . . . . . . . . . . . . . .  toggle playlist random
| clear  . . . . . . . . . . . . . . . . . . . . .  clear the playlist
| status . . . . . . . . . . . . . . . . . . . current playlist status
| title [X]  . . . . . . . . . . . . . . set/get title in current item
| title_n  . . . . . . . . . . . . . . . .  next title in current item
| title_p  . . . . . . . . . . . . . .  previous title in current item
| chapter [X]  . . . . . . . . . . . . set/get chapter in current item
| chapter_n  . . . . . . . . . . . . . .  next chapter in current item
| chapter_p  . . . . . . . . . . . .  previous chapter in current item
|
| seek X . . . . . . . . . . . seek in seconds, for instance `seek 12'
| pause  . . . . . . . . . . . . . . . . . . . . . . . .  toggle pause
| fastforward  . . . . . . . . . . . . . . . . . . set to maximum rate
| rewind . . . . . . . . . . . . . . . . . . . . . set to minimum rate
| faster . . . . . . . . . . . . . . . . . .  faster playing of stream
| slower . . . . . . . . . . . . . . . . . .  slower playing of stream
| normal . . . . . . . . . . . . . . . . . .  normal playing of stream
| rate [playback rate] . . . . . . . . . .  set playback rate to value
| frame  . . . . . . . . . . . . . . . . . . . . . play frame by frame
| fullscreen, f, F [on|off]  . . . . . . . . . . . . toggle fullscreen
| info [X] . .  information about the current stream (or specified id)
| stats  . . . . . . . . . . . . . . . .  show statistical information
| get_time . . . . . . . . .  seconds elapsed since stream's beginning
| is_playing . . . . . . . . . . . .  1 if a stream plays, 0 otherwise
| get_title  . . . . . . . . . . . . . the title of the current stream
| get_length . . . . . . . . . . . .  the length of the current stream
|
| volume [X] . . . . . . . . . . . . . . . . . .  set/get audio volume
| volup [X]  . . . . . . . . . . . . . . .  raise audio volume X steps
| voldown [X]  . . . . . . . . . . . . . .  lower audio volume X steps
| achan [X]  . . . . . . . . . . . .  set/get stereo audio output mode
| atrack [X] . . . . . . . . . . . . . . . . . . . set/get audio track
| vtrack [X] . . . . . . . . . . . . . . . . . . . set/get video track
| vratio [X] . . . . . . . . . . . . . . .  set/get video aspect ratio
| vcrop, crop [X]  . . . . . . . . . . . . . . . .  set/get video crop
| vzoom, zoom [X]  . . . . . . . . . . . . . . . .  set/get video zoom
| vdeinterlace [X] . . . . . . . . . . . . . set/get video deinterlace
| vdeinterlace_mode [X]  . . . . . . .  set/get video deinterlace mode
| snapshot . . . . . . . . . . . . . . . . . . . . take video snapshot
| strack [X] . . . . . . . . . . . . . . . . .  set/get subtitle track
|
| vlm  . . . . . . . . . . . . . . . . . . . . . . . . .  load the VLM
| description  . . . . . . . . . . . . . . . . .  describe this module
| help, ? [pattern]  . . . . . . . . . . . . . . . . .  a help message
| longhelp [pattern] . . . . . . . . . . . . . . a longer help message
| lock . . . . . . . . . . . . . . . . . . . .  lock the telnet prompt
| logout . . . . . . . . . . . . . .  exit (if in a socket connection)
| quit . . . . . . . .  quit VLC (or logout if in a socket connection)
| shutdown . . . . . . . . . . . . . . . . . . . . . . .  shutdown VLC
+----[ end of help ] */

type VlcCommand = 'play' | 'pause' | 'next' | 'shutdown' | 'playlist' | 'volume';

export default class VlcProcess extends ChildProcess {
  number_broadcast_listeners: ((number: number) => void)[] = [];

  constructor(child: ChildProcess) {
    super();
    Object.assign(this, child);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.stdout!.pipe(process.stdout);
    this.stdout!.on('data', (data: Buffer) => {
      const number = parseInt(data.toString(), 10);
      if (!Number.isNaN(number)) {
        while (this.number_broadcast_listeners.length > 0) {
          this.number_broadcast_listeners.pop()!(number);
        }
      }
    });
    this.on('exit', (code: number) => {
      console.log(`code: ${code}`);
    });
  }

  public printAvailableCommands() {
    this.stdin!.write(`help\n`);
  }

  public addEpisodesToPlaylist(urls: string[]): void {
    for (const url of urls) {
      // Not sure if this is needed, but this is my best way of getting the episodes in the correct order
      console.log(`enqueue ${url}\n`);
      this.stdin!.write(`enqueue ${url}\n`);
    }
    // make sure that we start from the top of the playlist
    this.stdin!.write(`goto 0\n`);
  }

  public command(command: VlcCommand) {
    console.log(`${command}`);
    this.stdin!.write(`${command}\n`);
  }

  public seekInTime(diff_s: number) {
    this.number_broadcast_listeners.push((number: number) => {
      this.stdin!.write(`seek ${number + diff_s}\n`);
      this.stdin!.write(`get_time\n`);
    });

    this.stdin!.write(`get_time\n`);
  }
}
