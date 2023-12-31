package webserver

import (
	"net/http"
	_ "net/http/pprof"

	"github.com/rs/cors"
)

type WebServer struct {
}

func NewWebServer() *WebServer {
	return &WebServer{}
}

func (s *WebServer) AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	mux.HandleFunc(pattern, handler)
}

func (s *WebServer) ListenTLS(addr string, certPath string, prikeyPath string) {
	handler := cors.Default().Handler(mux)
	err := http.ListenAndServeTLS(addr, certPath, prikeyPath, handler)
	if err != nil {
		logger.Fatalf("WebServer:ListenTLS: ListenAndServeTLS error: %v", err)
	}
	return
}

func (s *WebServer) Listen(addr string) {
	handler := cors.Default().Handler(mux)
	err := http.ListenAndServe(addr, handler)
	if err != nil {
		logger.Fatalf("WebServer:Listen: ListenAndServe error: %v", err)
	}
	return
}
