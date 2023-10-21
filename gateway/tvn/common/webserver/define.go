package webserver

import "net/http"

type WebServerHandle interface {
	AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request))
}
