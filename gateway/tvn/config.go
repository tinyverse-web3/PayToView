package main

import (
	"os"

	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/config"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
)

const (
	configFileName = "config.json"
)

func loadConfig(rootPath string) (*config.TvnGatewayConfig, error) {
	ret := &config.TvnGatewayConfig{}

	configFilePath := rootPath + configFileName
	_, err := os.Stat(configFilePath)
	if os.IsNotExist(err) {
		return nil, nil
	}
	err = util.LoadConfig(ret, configFilePath)
	if err != nil {
		return nil, err
	}
	return ret, nil
}
