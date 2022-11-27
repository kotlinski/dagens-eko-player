# dagens-eko-player

A daily news radio player. Using a raspberry pi as hardware and the Swedish Radio as news source.

The pi should have vlc installed and be able to run vlc via commandline (the command cvlc).
The pi is expecting to have a button connected to input-output pin 3 and a speaker via the 3.5 mm input.

![Board pins](./img/board-pins.png)

## How to run

### locally

> yarn run main mac

The current commands are:
To play enter number `1` and hit enter in the command line.
`2` will pause, `3` to reset and `4` to skip to next episode.

### on a raspberry pi

First of all you need to figure out what ip the raspberry pi connects to. The easist way is probably to plug it in to a display and connect to your preffered network.

> ifconfig

To deploy the code to the raspberry i prefer SFTP and using Filezilla as a client.
And to start the application you have to ssh into it.

> ssh pi@{the ip}

> yarn run main pi


## The Hardware

The button is programmed to be connected to pin gpio 3. So suggestion is to connect it to pin 5 and 6.

## Script start up 

On system start up, a cronjob is trigger that starts the script. 
To add/update a trigger run. A suggestion of what the script looks like can be found in the scripts folder.

> cronjob -e
