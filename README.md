# dagens-eko-player

A daily news radio player. Using a raspberry pi as hardware and the Swedish Radio as news source.

The pi should have vlc installed and be able to run vlc via commandline (the command cvlc). 
The pi is expecting to have a button connected to input-output pin 3 and a speaker via the 3.5 mm input. 

## How to run

### locally
> yarn run main mac

### on a raspberry pi

First of all you need to figure out what ip the raspberry pi connects to. The easist way is probably to plug it in to a display and connect to your preffered network. 
> ifconfig


To deploy the code to the raspberry i prefer SFTP and using Filezilla as a client. 
And to start the application you have to ssh into it. 
>ssh pi@<the ip>

> yarn run main pi


