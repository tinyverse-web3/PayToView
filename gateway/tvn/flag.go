package main

import (
	"encoding/json"
	"flag"
	"os"

	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/config"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
)

const (
	defaultPath = "."
)

func parseCmdParams() string {
	init := flag.Bool("init", false, "Initialize tvnode with default setting configuration file if not already initialized.")
	path := flag.String("path", defaultPath, "Path to configuration file and data file to use.")
	help := flag.Bool("help", false, "Show help.")

	flag.Parse()

	if *help {
		logger.Info("tinverse tvnode")
		logger.Info("Usage step1: Run './tvnode -init' generate identity key and config.")
		logger.Info("Usage step2: Run './tvnode' or './tvnode -path .' start tinyverse tvnode service.")
		os.Exit(0)
	}

	if *init {
		dataPath, err := util.GetRootPath(*path)
		if err != nil {
			logger.Fatalf("GetRootPath error: %v", err)
		}
		_, err = os.Stat(dataPath)
		if os.IsNotExist(err) {
			err := os.MkdirAll(dataPath, 0755)
			if err != nil {
				logger.Fatalf("MkdirAll error: %v", err)
			}
		}
		err = genConfigFile(dataPath)
		if err != nil {
			logger.Fatalf("Failed to generate config file: %v", err)
		}
		os.Exit(0)
	}
	return *path
}

func genConfigFile(rootPath string) error {
	defaultCfg := config.NewTvnGatewayConfig()

	cfg, err := loadConfig(rootPath)
	if err != nil {
		return err
	}
	if cfg == nil {
		cfg = defaultCfg
	}

	file, _ := json.MarshalIndent(cfg, "", " ")
	if err := os.WriteFile(rootPath+configFileName, file, 0644); err != nil {
		logger.Infof("failed to WriteFile:", err)
		return err
	}
	logger.Infof("generate config file: " + rootPath + configFileName)
	return nil
}
