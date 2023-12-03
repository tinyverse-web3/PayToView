package main

import (
	"encoding/json"
	"os"
	"time"
)

const (
	EnvDev  = "dev"
	EnvProd = "prod"
)

type AppConfig struct {
	Ton       *TonConfig
	Eth       *EthConfig
	DkvsEnv   string
	LogLevels map[string]string
}

type ChainConfig struct {
	AccountID            string
	Env                  string
	EnableTxLog          bool
	LoadTxsInterval      time.Duration
	CheckFailTxsInterval time.Duration
}

type TonConfig struct {
	ChainConfig
	ForceCreation bool
}

type EthConfig struct {
	ChainConfig
	EtherScanApiKey string
	ForceCreation   bool
}

type LogConfig struct {
	ModuleLevels map[string]string
}

func NewDefaultAppConfig() *AppConfig {
	ret := AppConfig{
		LogLevels: map[string]string{
			"transferService.main":        "info",
			"transferService.tvsdk":       "info",
			"transferService.chain.ton":   "info",
			"transferService.service.ton": "info",
			"transferService.chain.eth":   "info",
			"transferService.service.eth": "info",
			"mtv.dauth":                   "panic",
			"tvbase":                      "info",
			"dmsg":                        "panic",
			"dkvs":                        "panic",
		},
		Ton: &TonConfig{
			ChainConfig: ChainConfig{
				AccountID:            "0:7e1f3e95d662bf7cdffc3b930379dae6aaf84ffaf2ec2111548bbec79c8f393b",
				Env:                  EnvProd,
				EnableTxLog:          false,
				LoadTxsInterval:      5 * time.Second,
				CheckFailTxsInterval: 5 * time.Second,
			},
			ForceCreation: false,
		},
		Eth: &EthConfig{
			ChainConfig: ChainConfig{
				AccountID:            "0x563f451c79003571bBFD2Acbcc265C82C0884519",
				Env:                  EnvProd,
				EnableTxLog:          false,
				LoadTxsInterval:      5 * time.Second,
				CheckFailTxsInterval: 5 * time.Second,
			},
			EtherScanApiKey: "6TD7F3VHX9YS62YKRGDHJWPANM4SF7DPBN",
			ForceCreation:   false,
		},
		DkvsEnv: EnvProd,
	}

	return &ret
}

func LoadConfig(filePath string) (*AppConfig, error) {
	ret := &AppConfig{}
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		return nil, nil
	}

	cfgFile, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer cfgFile.Close()

	decoder := json.NewDecoder(cfgFile)
	err = decoder.Decode(&ret)
	if err != nil {
		return nil, err
	}

	return ret, nil
}
