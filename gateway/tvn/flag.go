package main

import (
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"flag"
	"os"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/config"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
	tvbaseConfig "github.com/tinyverse-web3/tvbase/common/config"
)

const (
	defaultPath = "."
)

var nodeMode tvbaseConfig.NodeMode = tvbaseConfig.LightMode
var isTest bool

func parseCmdParams() string {
	init := flag.Bool("init", false, "Initialize tvnode with default setting configuration file if not already initialized.")
	mode := flag.String("mode", "service", "Initialize tvnode mode for service mode or light mode.")
	path := flag.String("path", defaultPath, "Path to configuration file and data file to use.")
	help := flag.Bool("help", false, "Show help.")
	test := flag.Bool("test", false, "Test mode.")

	flag.Parse()

	if *help {
		logger.Info("tinverse tvnode")
		logger.Info("Usage step1: Run './tvnode -init' generate identity key and config.")
		logger.Info("Usage step2: Run './tvnode' or './tvnode -path .' start tinyverse tvnode service.")
		os.Exit(0)
	}

	if *mode == "service" {
		nodeMode = tvbaseConfig.ServiceMode
	}

	if *test {
		isTest = true
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

func genEd25519Key() (privkey string, pubkey string, err error) {
	privk, _, err := crypto.GenerateKeyPair(crypto.Ed25519, 0)
	if err != nil {
		return "", "", err
	}

	data, err := crypto.MarshalPrivateKey(privk)
	if err != nil {
		return "", "", err
	}

	pubkData, err := crypto.MarshalPublicKey(privk.GetPublic())
	if err != nil {
		return "", "", err
	}

	return base64.StdEncoding.EncodeToString(data), base64.StdEncoding.EncodeToString(pubkData), nil
}

func genEcdsaKey() (privkey string, pubkey string, err error) {
	privk, err := eth_crypto.GenerateKey()
	if err != nil {
		return "", "", err
	}

	return hex.EncodeToString(eth_crypto.FromECDSA(privk)), hex.EncodeToString(eth_crypto.FromECDSAPub(&privk.PublicKey)), nil
}

func genConfigFile(rootPath string) error {
	cfg := config.NewTvnGatewayConfig()
	privkey, _, err := genEcdsaKey()
	if err != nil {
		return err
	}

	cfg.Tvbase.Mode = nodeMode
	cfg.Proxy.PrivKey = privkey

	privkey, _, err = genEd25519Key()
	if err != nil {
		return err
	}
	cfg.Tvbase.Identity.PrivKey = privkey

	cfg.Tvbase.SetMdns(false)

	file, err := json.MarshalIndent(cfg, "", " ")
	if err != nil {
		return err
	}

	if err := os.WriteFile(rootPath+configFileName, file, 0644); err != nil {
		return err
	}

	logger.Infof("generate config file: " + rootPath + configFileName)
	return nil
}
