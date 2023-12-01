package main

import (
	"context"
	"sort"

	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/tinyverse-web3/transferService/chain/eth"
	"github.com/tinyverse-web3/transferService/chain/ton"
	ethService "github.com/tinyverse-web3/transferService/service/eth"
	tonService "github.com/tinyverse-web3/transferService/service/ton"
	"github.com/tinyverse-web3/transferService/tvsdk"
)

const (
	logName = "transferService.main"
)

var logger = ipfsLog.Logger(logName)

func init() {
	ipfsLog.SetLogLevelRegex(logName, "info")
}

func setLogModule(moduleLevels map[string]string) error {
	var sortedModuleList []string
	for module := range moduleLevels {
		sortedModuleList = append(sortedModuleList, module)
	}
	sort.Strings(sortedModuleList)
	for _, module := range sortedModuleList {
		level := moduleLevels[module]
		err := ipfsLog.SetLogLevelRegex(module, level)
		if err != nil {
			return err
		}
	}
	return nil
}

func initTonAccount(id string, isTest bool, enableLog bool, logPath string) (*ton.Account, error) {
	tonAccount := ton.NewAccount()
	err := tonAccount.SetNet(isTest)
	if err != nil {
		return nil, err
	}

	err = tonAccount.SetAccountID(id)
	if err != nil {
		return nil, err
	}

	err = tonAccount.SetLog(enableLog, logPath)
	if err != nil {
		return nil, err
	}

	logger.Infof(
		"Account info\nraw address: %v\nmainnet human address: bounce: %v, nohounce: %v\ntestnet human address: bounce: %v, nohounce: %v",
		tonAccount.ToRaw(),
		tonAccount.ToHuman(true, false), tonAccount.ToHuman(false, false),
		tonAccount.ToHuman(true, true), tonAccount.ToHuman(false, true),
	)
	return tonAccount, nil
}

func initEthAccount(id string, etherScanApiKey string, isTest bool, enableLog bool, logPath string) (*eth.Account, error) {
	account := eth.NewAccount()
	err := account.Init(isTest, etherScanApiKey, id)
	if err != nil {
		return nil, err
	}

	err = account.SetLog(enableLog, logPath)
	if err != nil {
		return nil, err
	}

	logger.Infof("Account info\naddress: %v", account.String())
	return account, nil
}

func initTvSdk(rootPath, password string, isTest bool) (*tvsdk.TvSdk, error) {
	ret := tvsdk.NewSdk()
	err := ret.Init(rootPath, password, isTest)
	if err != nil {
		return nil, err
	}
	logger.Infof("tvsWallet ID:%v, balance:%v", ret.GetWallID(), ret.GetBalance())
	return ret, nil
}

func initTonTransferService(ctx context.Context, rootPath string, cfg *TonConfig) (*tonService.TransferService, error) {
	service, err := tonService.NewTransferService(ctx, tvSdkInst, tonAccountInst, rootPath)
	if err != nil {
		return nil, err
	}

	service.SetLoadTxsInterval(cfg.LoadTxsInterval)
	service.SetCheckFailTxsInterval(cfg.CheckFailTxsInterval)
	err = service.Start(ctx, cfg.ForceCreation)
	if err != nil {
		return nil, err
	}
	return service, nil
}

func initEthTransferService(ctx context.Context, rootPath string, cfg *EthConfig) (*ethService.TransferService, error) {
	service, err := ethService.NewTransferService(ctx, tvSdkInst, ethAccountInst, rootPath)
	if err != nil {
		return nil, err
	}

	service.SetLoadTxsInterval(cfg.LoadTxsInterval)
	service.SetCheckFailTxsInterval(cfg.CheckFailTxsInterval)
	err = service.Start(ctx, cfg.ForceCreation)
	if err != nil {
		return nil, err
	}
	return service, nil
}
