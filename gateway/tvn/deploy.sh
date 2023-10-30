#!/bin/sh

echo "start go deploy tvn gateway"

echo "go build for Linux system"
export GOOS=linux
export GOARCH=amd64
go build -a

user=$1
ip=$2

## ssh-copy-id root@192.168.1.103 noneed password
ssh-copy-id "$user@$ip"

echo "terminate tvnode process"
ssh "$user@$ip" 'killall tvn'

echo "copy tvnode to $user@$ip"
scp ./tvn "$user@$ip:/root/tvn"

