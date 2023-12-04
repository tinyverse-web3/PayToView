#!/bin/sh

echo "start go deploy"

echo "go build for Linux system"
export GOOS=linux
export GOARCH=amd64
go build -a

# 39.108.147.241
user=$1
ip=$2

## ssh-copy-id root@192.168.1.103 noneed password
ssh-copy-id "$user@$ip"

echo "terminate process"
ssh "$user@$ip" 'killall transferService'

echo "copy to $user@$ip"
scp ./transferService "$user@$ip:/root/transferService"

echo "start ..."
ssh "$user@$ip" 'nohup /root/transferService/transferService -rootPath /root/transferService/data -tvsAccountPassword 12345678 > /root/transferService/log.log 2>&1 &'