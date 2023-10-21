package webserver

import (
	ipfsLog "github.com/ipfs/go-log/v2"
)

const (
	logName = "gateway.common.webserver"
)

var logger = ipfsLog.Logger(logName)
