package ipfs

import (
	ipfsLog "github.com/ipfs/go-log/v2"
)

const (
	logName = "gateway.tvn.ipfs"
)

var logger = ipfsLog.Logger(logName)