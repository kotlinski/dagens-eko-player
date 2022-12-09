#!/bin/bash

### setting up the systemd config
# sudo systemctl edit --force --full my_script.service
# sudo systemctl restart my_script.service
# sudo systemctl reboot
### end

### systemd config
# [Unit]
# Description=My Script Service
# Wants=network.target
# After=network.target

# [Service]
# ExecStartPre=/bin/sh -c 'until ping -c1 google.com; do sleep 1; done;'
# Type=simple
# User=pi
# WorkingDirectory=/home/pi
# ExecStart=/home/pi/<script-name>.sh

# [Install]
# WantedBy=multi-user.target
# WantedBy=network-online.target
# WantedBy=network.target
### end

IP=$(hostname -I)
echo $IP
arrIN=(${IP//./ })

for i in "${arrIN[@]}"; do
  espeak "$i" 2>/dev/null
done
