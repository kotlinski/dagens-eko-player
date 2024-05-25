#!/bin/bash


# This scripts expects to...
# * have permissions to run
# * have espeak installed: sudo apt-get install espeak
# * have nvm available: brew install nvm
# * correct reference to the project

# can be triggered by crontab, open crontab edit view by:
# > crontab -e
# Add following line in the end off the file:
# @reboot . /home/pi/<name-of-the-script>.sh > /home/pi/cronlog.txt 2>/home/pi/crontab-errors.txt

#---

#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

espeak "Starting Radio..." 2>/dev/null

export NVM_DIR=$HOME/.nvm;
. $NVM_DIR/nvm.sh;

LOGS=ekot/logs/"`date +"%Y-%m-%d"`"-logs.txt
BUGS=ekot/logs/"`date +"%Y-%m-%d"`"-errors.txt
nvm use node 20 && yarn --cwd /home/pi/ekot/player/ run main pi >> ${LOGS} 2>${BUGS} &
