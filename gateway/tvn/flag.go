package main

import (
	"flag"

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
	test := flag.Bool("test", false, "Test mode.")

	flag.Parse()

	if *mode == "service" {
		nodeMode = tvbaseConfig.ServiceMode
	}

	if *test {
		isTest = true
	}

	return *path
}
