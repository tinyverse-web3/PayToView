package http2

import (
	"net/http"

	_ "net/http/pprof"
)

type WebServer struct {
}

func NewWebServer() *WebServer {
	return &WebServer{}
}

func (s *WebServer) AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	http.HandleFunc(pattern, handler)
}

func (s *WebServer) ListenTLS(addr string, certPath string, prikeyPath string) {
	err := http.ListenAndServeTLS(addr, certPath, prikeyPath, nil)
	if err != nil {
		logger.Fatalf("WebServer:ListenTLS: ListenAndServeTLS error: %v", err)
	}
	return
}

func (s *WebServer) Listen(addr string) {
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		logger.Fatalf("WebServer:Listen: ListenAndServe error: %v", err)
	}
	return
}
