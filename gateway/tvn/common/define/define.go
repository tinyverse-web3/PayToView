package define

import "net/http"

type WebServer interface {
	AddHandler(pattern string, handler func(http.ResponseWriter, *http.Request))
}
