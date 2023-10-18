package msg

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	"github.com/tinyverse-web3/tvbase/common"
)

type msgProxySendMsgResp struct {
	ProxyPubKey  string
	SenderPubKey string
	Code         int
	Result       string
}

type msgReadMailboxResp struct {
	Key    string
	Code   int
	Result string
}

type Size interface {
	Size() int64
}

var msgService common.DmsgService

func RegistMsgHandle(hs *http3.Http3Server, ms common.DmsgService) {
	msgService = ms
	hs.AddHandler("/msg/sendmsg", msgProxySendMsgHandler)
	hs.AddHandler("/msg/readmailbox", msgProxyReadMailboxHandler)
}

func msgProxySendMsgHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		r.ParseForm()

		// key := r.PostFormValue("key")
		resp := msgProxySendMsgResp{
			Code:   0,
			Result: "succ",
		}

		// setErrResp := func(code int, result string) {
		// 	w.Header().Set("Content-Type", "application/json")
		// 	resp.Code = -1
		// 	resp.Result = result
		// 	jsonData, _ := json.Marshal(resp)
		// 	len, err := io.WriteString(w, string(jsonData))
		// 	if err != nil {
		// 		logger.Errorf("dkvsGetHandler: WriteString: error: %+v", err)
		// 	}
		// 	logger.Debugf("dkvsGetHandler: WriteString len: %d", len)
		// }

		jsonData, _ := json.Marshal(resp)
		w.WriteHeader(http.StatusOK)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("dkvsGetHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("dkvsGetHandler: WriteString len: %d", len)
		return
	}
}

func msgProxyReadMailboxHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		r.ParseForm()

		resp := msgReadMailboxResp{
			Key:    "",
			Code:   0,
			Result: "succ",
		}
		setErrResp := func(code int, result string) {
			w.Header().Set("Content-Type", "application/json")
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			len, err := io.WriteString(w, string(jsonData))
			if err != nil {
				logger.Errorf("dkvsPutHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("dkvsPutHandler: WriteString len: %d", len)
		}

		key := r.PostFormValue("key")
		if key == "" {
			setErrResp(-1, "invalid params key")
			return
		}
		resp.Key = key

		// pubkey, err := base64.StdEncoding.DecodeString(r.PostFormValue("pubkey"))
		// if err != nil {
		// 	setErrResp(-1, err.Error())
		// 	return
		// }

		// sig, err := base64.StdEncoding.DecodeString(r.PostFormValue("sig"))
		// if err != nil {
		// 	setErrResp(-1, err.Error())
		// 	return
		// }

		jsonData, _ := json.Marshal(resp)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("dkvsPutHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("dkvsPutHandler: WriteString len: %d", len)
		return
	}
}
