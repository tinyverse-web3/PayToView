package eth

import (
	ipfsLog "github.com/ipfs/go-log/v2"
)

const (
	logName = "transferService.chain.eth"
)

var logger = ipfsLog.Logger(logName)

func init() {
	ipfsLog.SetLogLevelRegex(logName, "info")
}
