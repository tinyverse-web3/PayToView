package main

import (
	"context"
	"os"

	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	ipfsShell "github.com/tinyverse-web3/paytoview/gateway/tvn/common/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/ipfs"
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

	err = initLog()
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	_, err = ipfsShell.CreateIpfsShellProxy(cfg.Ipfs.ShellAddr)
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %+v", err)
	}

	http3Svr := http3.NewHttp3Server()
	http3Svr.SetQlog(rootPath)
	http3Svr.SetAddr(cfg.Http3.Addr)

	node, err := tvnode.NewTvNode(ctx, rootPath, cfg.Tvbase)
	if err != nil {
		logger.Fatalf("tvn->main: NewTvNode: error: %+v", err)
	}
	err = node.Start(ctx)
	if err != nil {
		logger.Fatalf("tvn->main: node.Start: error: %+v", err)
	}

	ipfs.RegistIpfsHandle(http3Svr)
	dkvs.RegistDkvsHandle(http3Svr, node.GetDkvsService())

	http3Svr.ListenAndServeTLS(cfg.Http3.CertPath, cfg.Http3.PrivPath)
	<-ctx.Done()
}
