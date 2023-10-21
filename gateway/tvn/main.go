package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"os"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	shell "github.com/tinyverse-web3/mtv_go_utils/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/webserver"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/msg"
	"github.com/tinyverse-web3/paytoview/gateway/tvnode"
	"github.com/tinyverse-web3/tvbase/common/config"
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

	cfg := config.NewDefaultTvbaseConfig()
	privkey, _, err := util.GenEd25519Key()
	if err != nil {
		logger.Fatalf("tvn->main: genEd25519Key: %+v", err)
	}
	cfg.Identity.PrivKey = privkey
	cfg.SetMdns(false)

	if isTest {
		cfg.SetLocalNet(true)
		cfg.SetDhtProtocolPrefix("/tvnode_test")
		cfg.InitMode(nodeMode)
		cfg.ClearBootstrapPeers()
		cfg.AddBootstrapPeer("/ip4/192.168.1.102/tcp/9000/p2p/12D3KooWGUjKn8SHYjdGsnzjFDT3G33svXCbLYXebsT9vsK8dyHu")
		cfg.AddBootstrapPeer("/ip4/192.168.1.109/tcp/9000/p2p/12D3KooWGhqQa67QMRFAisZSZ1snfCnpFtWtr4rXTZ2iPBfVu1RR")
	}

	err = initLog()
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	_, err = shell.CreateIpfsShellProxy("/ip4/127.0.0.1/tcp/5001")
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	node, err := tvnode.NewTvNode(ctx, rootPath, cfg)
	if err != nil {
		logger.Fatalf("tvn->main: NewTvNode: error: %+v", err)
	}
	err = node.Start(ctx)
	if err != nil {
		logger.Fatalf("tvn->main: node.Start: error: %+v", err)
	}
	logger.Infof("tvn->main: node.Start, find rendezvous and join tvnode network")

	// msg
	privkey, _, err = util.GenEcdsaKey()
	if err != nil {
		logger.Fatalf("tvn->main: genEcdsaKey: error: %+v", err)
	}
	userPrivkeyData, userPrivkey, err := getEcdsaPrivKey(privkey)
	if err != nil {
		logger.Fatalf("tvn->main: getEcdsaPrivKey: error: %+v", err)
	}

	proxyPrivkeyHex := hex.EncodeToString(userPrivkeyData)
	proxyPubkeyHex := hex.EncodeToString(eth_crypto.FromECDSAPub(&userPrivkey.PublicKey))
	logger.Infof("tvn->main:\nproxyPrivkeyHex: %s\nproxyPubkeyHex: %s", proxyPrivkeyHex, proxyPubkeyHex)

	msgInstance := msg.GetInstance(node.GetTvbase(), userPrivkey)

	const certPath = "./cert.pem"
	const privPath = "./priv.key"
	var svr webserver.WebServerHandle
	if true {
		httpSvr := webserver.NewWebServer()
		svr = httpSvr
		go httpSvr.Listen("0.0.0.0:80")
		go httpSvr.ListenTLS("0.0.0.0:443", certPath, privPath)
	} else {
		httpSvr := webserver.NewQuicWebServer()
		svr = httpSvr
		go httpSvr.ListenUdpTLS("0.0.0.0:4430", certPath, privPath)
		go httpSvr.ListenTcpTLS("0.0.0.0:443", certPath, privPath)
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
