package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"os"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/define"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http2"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	shell "github.com/tinyverse-web3/paytoview/gateway/tvn/common/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/msg"

	"github.com/tinyverse-web3/paytoview/gateway/tvnode"
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

	if isTest {
		cfg.Tvbase.SetLocalNet(true)
		cfg.Tvbase.SetMdns(false)
		cfg.Tvbase.SetDhtProtocolPrefix("/tvnode_test")
		cfg.Tvbase.InitMode(nodeMode)
		cfg.Tvbase.ClearBootstrapPeers()
		cfg.Tvbase.AddBootstrapPeer("/ip4/192.168.1.102/tcp/9000/p2p/12D3KooWGUjKn8SHYjdGsnzjFDT3G33svXCbLYXebsT9vsK8dyHu")
		cfg.Tvbase.AddBootstrapPeer("/ip4/192.168.1.109/tcp/9000/p2p/12D3KooWGhqQa67QMRFAisZSZ1snfCnpFtWtr4rXTZ2iPBfVu1RR")
	}

	err = initLog()
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	_, err = shell.CreateIpfsShellProxy(cfg.Ipfs.ShellAddr)
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	node, err := tvnode.NewTvNode(ctx, rootPath, cfg.Tvbase)
	if err != nil {
		logger.Fatalf("tvn->main: NewTvNode: error: %+v", err)
	}
	err = node.Start(ctx)
	if err != nil {
		logger.Fatalf("tvn->main: node.Start: error: %+v", err)
	}
	logger.Infof("tvn->main: node.Start, find rendezvous and join tvnode network")

	// msg
	userPrivkeyData, userPrivkey, err := getEcdsaPrivKey(cfg.Proxy.PrivKey)
	if err != nil {
		logger.Fatalf("tvn->main: getEcdsaPrivKey: error: %+v", err)
	}

	proxyPrivkeyHex := hex.EncodeToString(userPrivkeyData)
	proxyPubkeyHex := hex.EncodeToString(eth_crypto.FromECDSAPub(&userPrivkey.PublicKey))
	logger.Infof("tvn->main:\nproxyPrivkeyHex: %s\nproxyPubkeyHex: %s", proxyPrivkeyHex, proxyPubkeyHex)

	msgInstance := msg.GetInstance(node.GetTvbase(), userPrivkey)

	var svr define.WebServer
	if cfg.Http3 == nil {
		httpSvr := http2.NewWebServer()
		svr = httpSvr

		go httpSvr.Listen("0.0.0.0:80")
		go httpSvr.ListenTLS("0.0.0.0:443", cfg.Http3.CertPath, cfg.Http3.PrivPath)
	} else {
		httpSvr := http3.NewWebServer()
		svr = httpSvr
		if isTest {
			httpSvr.SetQlog(rootPath)
		}

		go httpSvr.ListenUdpTLS(cfg.Http3.UdpAddr, cfg.Http3.CertPath, cfg.Http3.PrivPath)
		go httpSvr.ListenTcpTLS(cfg.Http3.TcpAddr, cfg.Http3.CertPath, cfg.Http3.PrivPath)
	}
	msgInstance.RegistHandler(svr)
	ipfs.RegistHandler(svr)
	dkvs.RegistHandler(svr, node.GetDkvsService())
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
