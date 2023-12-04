#!/bin/sh

echo "start go deploy transferService"

echo "go build for Linux system"
export GOOS=linux
export GOARCH=amd64
go build -a

# 39.108.147.241
user=$1
ip=$2

## ssh-copy-id root@192.168.1.103 noneed password
ssh-copy-id "$user@$ip"

echo "terminate tvnode process"
ssh "$user@$ip" 'killall transferService'

echo "copy tvnode to $user@$ip"
scp ./tvnode "$user@$ip:/usr/local/bin"

echo "start tvnode..."
ssh "$user@$ip" '/usr/local/bin/transferService -rootPath /usr/transferService/data -tvsAccountPassword 12345678'