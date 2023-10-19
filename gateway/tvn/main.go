package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"os"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	shell "github.com/tinyverse-web3/paytoview/gateway/tvn/common/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"

	// "github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/ipfs"
	// "github.com/tinyverse-web3/paytoview/gateway/tvn/msg"
	// "github.com/tinyverse-web3/paytoview/gateway/tvnode"
)

func main() {
	ctx := context.Background()
	rootPath := parseCmdParams()
	rootPath, err := util.GetRootPath(rootPath)
	if err != nil {
		logger.Fatalf("tvn->main: GetRootPath: %+v", err)
	}

	lock, pidFileName := lockProcess(rootPath)
	defer func() {
		err = lock.Unlock()
		if err != nil {
			logger.Errorf("tvn->main: pid file unlock: %+v", err)
		}
		err = os.Remove(pidFileName)
		if err != nil {
			logger.Errorf("tvn->main: pid file remove: %+v", err)
		}
	}()

	cfg, err := loadConfig(rootPath)
	if err != nil || cfg == nil {
		logger.Fatalf("tvn->main: loadConfig: %+v", err)
	}

	err = initLog()
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	_, err = shell.CreateIpfsShellProxy(cfg.Ipfs.ShellAddr)
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	svr := http3.NewHttp3Server()

	// debug
	// svr.SetQlog(rootPath)

	// node, err := tvnode.NewTvNode(ctx, rootPath, cfg.Tvbase)
	// if err != nil {
	// 	logger.Fatalf("tvn->main: NewTvNode: error: %+v", err)
	// }
	// err = node.Start(ctx)
	// if err != nil {
	// 	logger.Fatalf("tvn->main: node.Start: error: %+v", err)
	// }

	// ipfs
	ipfs.RegistHandle(svr)

	// dkvs
	// dkvs.RegistHandle(svr, node.GetDkvsService())

	// msg
	// userPrivkeyData, userPrivkey, err := getEcdsaPrivKey(cfg.Proxy.PrivKey)
	// if err != nil {
	// 	logger.Fatalf("tvn->main: getEcdsaPrivKey: error: %+v", err)
	// }

	// proxyPrivkeyHex := hex.EncodeToString(userPrivkeyData)
	// proxyPubkeyHex := hex.EncodeToString(eth_crypto.FromECDSAPub(&userPrivkey.PublicKey))
	// logger.Infof("tvn->main:\nproxyPrivkeyHex: %s\nproxyPubkeyHex: %s", proxyPrivkeyHex, proxyPubkeyHex)

	// msgInstance := msg.GetInstance(node.GetTvbase(), userPrivkey)
	// msgInstance.RegistHandle(svr)

	go svr.ListenUdpTLS(cfg.Http3.UdpAddr, cfg.Http3.CertPath, cfg.Http3.PrivPath)
	go svr.ListenTcpTLS(cfg.Http3.TcpAddr, cfg.Http3.CertPath, cfg.Http3.PrivPath)
	<-ctx.Done()
}

func getEcdsaPrivKey(privkeyHex string) ([]byte, *ecdsa.PrivateKey, error) {
	privkeyData, err := hex.DecodeString(privkeyHex)
	if err != nil {
		return privkeyData, nil, err
	}
	privkey, err := eth_crypto.ToECDSA(privkeyData)
	if err != nil {
		return privkeyData, nil, err
	}
	return privkeyData, privkey, nil
}
