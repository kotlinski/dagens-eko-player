# Scripts

## radio start up

The script can be found [here](dagens-eko-starter.sh) with a suggestion of what the triggering crontab line would look like.

Make the script runnable by

> chmod +x <script.sh>

To add/update a trigger run

> cronjob -e

## ip helper

Since we have a speaker connected the radio, I created a simple [script](ip-reporter.sh) that will read out the ip. The file also includes steps of how to add it to the `systemd` startup.
