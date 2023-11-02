package webserver

import (
	"net/http"

	ipfsLog "github.com/ipfs/go-log/v2"
)

type WebServerHandle interface {
	AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request))
}

const (
	logName = "gateway.common.webserver"
)

var logger = ipfsLog.Logger(logName)
var mux *http.ServeMux

func init() {
	mux = http.NewServeMux()
}
