package main

import (
	"context"
	"os"

	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/http3"
)

func main() {
	rootPath := parseCmdParams()
	rootPath, err := util.GetRootPath(rootPath)
	if err != nil {
		logger.Fatalf("tvn->main: GetRootPath: %v", err)
	}

	lock, pidFileName := lockProcess(rootPath)
	defer func() {
		err = lock.Unlock()
		if err != nil {
			logger.Errorf("tvn->main: pid file unlock: %v", err)
		}
		err = os.Remove(pidFileName)
		if err != nil {
			logger.Errorf("tvn->main: pid file remove: %v", err)
		}
	}()

	cfg, err := loadConfig(rootPath)
	if err != nil || cfg == nil {
		logger.Fatalf("tvn->main: loadConfig: %v", err)
	}

	err = initLog()
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %v", err)
	}

	_, err = ipfs.CreateIpfsShellProxy(cfg.Ipfs.ShellAddr)
	if err != nil {
		logger.Fatalf("tvn->main: initLog: %v", err)
	}

	http3Svr := http3.NewHttp3Server()
	http3Svr.SetQlog(rootPath)
	http3Svr.SetAddr(cfg.Http3.Addr)
	http3Svr.ListenAndServeTLS(cfg.Http3.CertPath, cfg.Http3.PrivPath)

	ctx := context.Background()
	<-ctx.Done()
}
