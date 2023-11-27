package main

import (
	"encoding/json"
	"os"
	"time"
)

type CustomProtocolConfig struct {
	IpfsSyncFile IpfsSyncFileConfig
}

type IpfsSyncFileConfig struct {
	IpfsURL string
}

type AppConfig struct {
	Ton       *TonConfig
	Eth       *EthConfig
	LogLevels map[string]string
}

type ChainConfig struct {
	AccountID            string
	EnableTxLog          bool
	LoadTxsInterval      time.Duration
	CheckFailTxsInterval time.Duration
}

type TonConfig struct {
	ChainConfig
}

type EthConfig struct {
	ChainConfig
	EtherScanApiKey string
}

type LogConfig struct {
	ModuleLevels map[string]string
}

func NewDefaultAppConfig() *AppConfig {
	ret := AppConfig{
		LogLevels: map[string]string{
			"transferService": "debug",
			"mtv.dauth":       "panic",
			"dmsg":            "panic",
			"tvbase":          "info",
			"dkvs":            "panic",
		},
		Ton: &TonConfig{
			ChainConfig: ChainConfig{
				AccountID:            "0xeA7e42C7C9262e6831bfa7Be71d67aa5523E27BD",
				EnableTxLog:          false,
				LoadTxsInterval:      5 * time.Second,
				CheckFailTxsInterval: 5 * time.Second,
			},
		},
		Eth: &EthConfig{
			ChainConfig: ChainConfig{
				AccountID:            "0xeA7e42C7C9262e6831bfa7Be71d67aa5523E27BD",
				EnableTxLog:          false,
				LoadTxsInterval:      5 * time.Second,
				CheckFailTxsInterval: 5 * time.Second,
			},
			EtherScanApiKey: "6TD7F3VHX9YS62YKRGDHJWPANM4SF7DPBN",
		},
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
