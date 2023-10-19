package http3

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

type Http3Server struct {
	server *http3.Server
}

func NewHttp3Server() *Http3Server {
	return &Http3Server{
		server: &http3.Server{
			Handler:    http.NewServeMux(),
			Addr:       "localhost",
			QuicConfig: &quic.Config{},
		},
	}
}

func (s *Http3Server) SetAddr(addr string) {
	s.server.Addr = addr
}

func (s *Http3Server) AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	mux := s.server.Handler.(*http.ServeMux)
	mux.HandleFunc(pattern, handler)
}

func (s *Http3Server) SetQlog(logPath string) {
	s.server.QuicConfig.Tracer = func(ctx context.Context, p logging.Perspective, connID quic.ConnectionID) logging.ConnectionTracer {
		filename := fmt.Sprintf(logPath+"server_%x.qlog", connID)
		f, err := os.Create(filename)
		if err != nil {
			logger.Errorf("Http3Server:setQlog: os.Create error: %v", err)
		}
		return qlog.NewConnectionTracer(newBufferedWriteCloser(bufio.NewWriter(f), f), p, connID)
	}
}

func (s *Http3Server) ListenAndServeTLS(certPath string, prikeyPath string) {
	err := s.server.ListenAndServeTLS(certPath, prikeyPath)
	if err != nil {
		logger.Errorf("Http3Server:setQlog: ListenAndServeTLS error: %v", err)
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
