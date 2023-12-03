package main

import (
	"context"
	"os"

	"github.com/tinyverse-web3/transferService/chain/eth"
	"github.com/tinyverse-web3/transferService/chain/ton"
	"github.com/tinyverse-web3/transferService/tvsdk"
	"github.com/tinyverse-web3/transferService/util"
)

var tonAccountInst *ton.Account
var ethAccountInst *eth.Account
var tvSdkInst *tvsdk.TvSdk

func main() {

	rootPath, tvsAccountPassword := parseCmdParams()
	rootPath, err := util.GetFullPath(rootPath)
	if err != nil {
		logger.Fatalf("GetFullPath error: %v", err)
	}

	_, err = os.Stat(rootPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(rootPath, 0755)
		if err != nil {
			logger.Fatalf("MkdirAll error: %v", err)
		}
	}

	cfg, err := LoadConfig(rootPath + configFileName)
	if err != nil {
		logger.Fatalf("LoadConfig error: %v", err)
	}

	err = setLogModule(cfg.LogLevels)
	if err != nil {
		logger.Fatalf("initLog error: %v", err)
	}

	tvSdkInst, err = initTvSdk(rootPath, tvsAccountPassword, cfg.DkvsEnv == EnvDev)
	if err != nil {
		logger.Fatalf("initTvSdk error: %v", err)
	}

	err = setLogModule(cfg.LogLevels)
	if err != nil {
		logger.Fatalf("initLog error: %v", err)
	}

	ctx := context.Background()

	tonAccountInst, err = initTonAccount(cfg.Ton.AccountID, cfg.Ton.Env == EnvDev, cfg.Ton.EnableTxLog, rootPath+"log")
	if err != nil {
		logger.Fatalf("initTonAccount error: %v", err)
	}
	_, err = initTonTransferService(ctx, rootPath, cfg.Ton)
	if err != nil {
		logger.Fatalf("initTonTransferService error: %v", err)
	}

	// ethAccountInst, err = initEthAccount(cfg.Eth.AccountID, cfg.Eth.EtherScanApiKey, env == "dev", cfg.Eth.EnableTxLog, rootPath+"log")
	// if err != nil {
	// 	logger.Fatalf("initEthAccount error: %v", err)
	// }
	// _, err = initEthTransferService(ctx, rootPath, cfg.Eth)
	// if err != nil {
	// 	logger.Fatalf("initTonTransferService error: %v", err)
	// }

	go util.HandleInterrupt()

	<-ctx.Done()
}
