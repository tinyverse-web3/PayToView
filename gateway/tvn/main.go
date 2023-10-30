package main

import (
	"context"
	"encoding/hex"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/msg"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/webserver"
	"github.com/tinyverse-web3/paytoview/gateway/tvnode"
	"github.com/tinyverse-web3/tvbase/common/config"
)

const (
	logName = "gateway.tvn.main"
)

var logger = ipfsLog.Logger(logName)

func init() {
	ipfsLog.SetLogLevelRegex(logName, "info")
}

func initLog() (err error) {
	var moduleLevels = map[string]string{
		"tvn":    "debug",
		"tvbase": "info",
		"dkvs":   "info",
		"dmsg":   "debug",
	}
	err = util.SetLogModule(moduleLevels)
	if err != nil {
		return err
	}
	return nil
}

const (
	defaultPath     = "."
	productEnv      = "prod"
	localnetTestEnv = "test-localnet"
	internetTestEnv = "test-internet"
	defaultEnv      = localnetTestEnv
)

var env *string
var rootPath *string

func parseCmdParams() {
	rootPath = flag.String("path", defaultPath, "Path to configuration file and data file to use.")
	env = flag.String("env", defaultEnv, "Path to configuration file and data file to use.")

	flag.Parse()

}

func main() {
	go handleInterrupt()

	err := initLog()
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	ctx := context.Background()
	parseCmdParams()
	rootPath, err := util.GetRootPath(*rootPath)
	if err != nil {
		logger.Fatalf("tvn->main: GetRootPath: %+v", err)
	}

	privkey := ""
	privkey, _, err = util.GenEd25519Key()
	if err != nil {
		logger.Fatalf("tvn->main: genEd25519Key: %+v", err)
	}

	cfg := config.NewDefaultTvbaseConfig()
	cfg.Identity.PrivKey = privkey
	cfg.SetMdns(false)

	ipfsShellUrl := "/ip4/103.103.245.177/tcp/5001"

	if *env == localnetTestEnv {
		cfg.SetLocalNet(true)
		cfg.SetDhtProtocolPrefix("/tvnode_test")
		// cfg.DMsg.Pubsub.TraceFile = "pubsub-trace.json"
		cfg.ClearBootstrapPeers()
		cfg.AddBootstrapPeer("/ip4/192.168.1.102/tcp/9000/p2p/12D3KooWGUjKn8SHYjdGsnzjFDT3G33svXCbLYXebsT9vsK8dyHu")
		cfg.AddBootstrapPeer("/ip4/192.168.1.109/tcp/9000/p2p/12D3KooWGhqQa67QMRFAisZSZ1snfCnpFtWtr4rXTZ2iPBfVu1RR")
		ipfsShellUrl = "/ip4/103.103.245.177/tcp/5001"
	}
	if *env == internetTestEnv {
		cfg.SetLocalNet(true)
		cfg.SetDhtProtocolPrefix("/tvnode_test")
		// cfg.DMsg.Pubsub.TraceFile = "pubsub-trace.json"
		cfg.ClearBootstrapPeers()
		cfg.AddBootstrapPeer("/ip4/39.108.147.241/tcp/9000/p2p/12D3KooWJ9BvdU8q6gcEDpDUF42qV3PLaAd8vgh7HGveuktFMHoq")
		cfg.AddBootstrapPeer("/ip4/39.108.96.46/tcp/9000/p2p/12D3KooWDzny9ZpW44Eb2YL5uQQ1CCcgQSQcc851oiB6XyXHG7TM")
		ipfsShellUrl = "/ip4/39.108.147.241/tcp/5001"
	}

	cfg.InitMode(config.LightMode)

	err = ipfs.InitIpfsShell(ipfsShellUrl)
	if err != nil {
		logger.Fatalf("tvn->main: InitIpfsShell: %+v", err)
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

	userPrivkeyData, userPrivkey, err := util.GetEcdsaPrivKey(privkey)
	if err != nil {
		logger.Fatalf("tvn->main: GetEcdsaPrivKey: error: %+v", err)
	}

	proxyPrivkeyHex := hex.EncodeToString(userPrivkeyData)
	proxyPubkeyHex := hex.EncodeToString(eth_crypto.FromECDSAPub(&userPrivkey.PublicKey))
	logger.Infof("tvn->main:\nproxyPrivkeyHex: %s\nproxyPubkeyHex: %s", proxyPrivkeyHex, proxyPubkeyHex)

	msgInstance := msg.GetInstance(node.GetTvbase(), userPrivkey)

	certPath := rootPath + "cert.pem"
	privPath := rootPath + "priv.key"
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

	go msgInstance.TickerCleanRestResource(5 * time.Minute)
	<-ctx.Done()
}

func handleInterrupt() {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)

	<-sig

	fmt.Print("Program has been interrupted")
	os.Exit(-1)
}
