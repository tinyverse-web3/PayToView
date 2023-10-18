package main

import (
	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
)

const (
	logName = "gateway.tvn.main"
)

var logger = ipfsLog.Logger(logName)

func init() {
	ipfsLog.SetLogLevelRegex(logName, "info")
}

func initLog() (err error) {
	var moduleLevels = map[string]string{
		"tvn":            "debug",
		"tvbase":         "debug",
		"dkvs":           "debug",
		"dmsg":           "debug",
		"customProtocol": "debug",
	}
	err = util.SetLogModule(moduleLevels)
	if err != nil {
		return err
	}
	return nil
}
