package webserver

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"

	_ "net/http/pprof"

	"github.com/quic-go/quic-go"
	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/quic-go/logging"
	"github.com/quic-go/quic-go/qlog"
)

type WebQuicServer struct {
	server *http3.Server
}

func NewQuicWebServer() *WebQuicServer {
	return &WebQuicServer{
		server: &http3.Server{
			Handler:    http.NewServeMux(),
			Addr:       "localhost",
			QuicConfig: &quic.Config{},
		},
	}
}

func (s *WebQuicServer) AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	mux := s.server.Handler.(*http.ServeMux)
	mux.HandleFunc(pattern, handler)
}

func (s *WebQuicServer) SetQlog(logPath string) {
	s.server.QuicConfig.Tracer = func(ctx context.Context, p logging.Perspective, connID quic.ConnectionID) logging.ConnectionTracer {
		filename := fmt.Sprintf(logPath+"server_%x.qlog", connID)
		f, err := os.Create(filename)
		if err != nil {
			logger.Errorf("WebQuicServer:setQlog: os.Create error: %v", err)
		}
		return qlog.NewConnectionTracer(newBufferedWriteCloser(bufio.NewWriter(f), f), p, connID)
	}
}

func (s *WebQuicServer) ListenUdpTLS(addr string, certPath string, prikeyPath string) {
	s.server.Addr = addr
	err := s.server.ListenAndServeTLS(certPath, prikeyPath)
	if err != nil {
		logger.Fatalf("WebQuicServer:ListenUdpTLS: ListenAndServeTLS error: %v", err)
	}
}

func (s *WebQuicServer) ListenTcpTLS(addr string, certPath string, prikeyPath string) {
	err := http3.ListenAndServe(addr, certPath, prikeyPath, s.server.Handler)
	if err != nil {
		logger.Fatalf("WebQuicServer:ListenTcpTLS: ListenAndServe error: %v", err)
	}
}

type bufferedWriteCloser struct {
	*bufio.Writer
	io.Closer
}

// newBufferedWriteCloser creates an io.WriteCloser from a bufio.Writer and an io.Closer
func newBufferedWriteCloser(writer *bufio.Writer, closer io.Closer) io.WriteCloser {
	return &bufferedWriteCloser{
		Writer: writer,
		Closer: closer,
	}
}

func (h bufferedWriteCloser) Close() error {
	if err := h.Writer.Flush(); err != nil {
		return err
	}
	return h.Closer.Close()
}
