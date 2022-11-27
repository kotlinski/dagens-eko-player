# dagens-eko-player

A daily news radio player. Using a raspberry pi as hardware and the Swedish Radio as news source.

## prerequisites

### software set up

This project uses vlc as a media player, so you need to be able to run vlc from command line to make this project work as expected.

### hardware set up

The pi is expected to have a button connected to gpio(general purpose input-output) 3 and a speaker via the 3.5 mm input.
So suggestion is to connect the button to pin 5 and 6.

![Board pins](./img/board-pins.png)

### Script start up

I suggest to start the script on system start up. Preferrably with a `cronjob`.
To add/update a trigger run:

> cronjob -e

A suggestion of what the script looks like can be found in the scripts folder.

## development

First of all you need to figure out what `ip` address the raspberry pi connects to. The easist way is probably to plug it in to a display and a keyboard and connect to your preffered network.

After that you can run `ifconfig` to figur out it's current ip. This ip may change over time, so make sure to configure your
home network/router to give your raspberry pi's `mac address` a static ip.

> ifconfig

To deploy the code to the raspberry i prefer SFTP and using Filezilla as a client.
And to start the application you have to ssh into it.

> ssh pi@{the ip}

## how to run

### locally

> yarn run main mac

The current commands are:
To play enter number `1` and hit enter in the command line.
`2` will pause, `3` to reset and `4` to skip to next episode.

### on a raspberry pi

> yarn run main pi

The pi is designed to be in a box. When the box is opened (the button is released) the pi should start playing.
