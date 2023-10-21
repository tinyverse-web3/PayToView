package main

import (
	"encoding/base64"
	"encoding/hex"
	"flag"
	"os"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/libp2p/go-libp2p/core/crypto"
	tvbaseConfig "github.com/tinyverse-web3/tvbase/common/config"
)

const (
	defaultPath = "."
)

var nodeMode tvbaseConfig.NodeMode = tvbaseConfig.LightMode
var isTest bool

func parseCmdParams() string {
	mode := flag.String("mode", "light", "Initialize tvnode mode for service mode or light mode.")
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
