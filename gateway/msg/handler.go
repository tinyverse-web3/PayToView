package msg

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"time"

	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/tinyverse-web3/mtv_go_utils/crypto"
	"github.com/tinyverse-web3/mtv_go_utils/key"
	"github.com/tinyverse-web3/paytoview/gateway/util"
	"github.com/tinyverse-web3/tvbase/dmsg"
)

const (
	logName = "gateway.tvn.msg"
)

var logger = ipfsLog.Logger(logName)

type msgProxySendMsgResp struct {
	ProxyPubKey  string
	SenderPubKey string
	Code         int
	Result       string
}

type msgReadMailboxResp struct {
	Key     string
	MsgList []dmsg.Msg
	Code    int
	Result  string
}

func msgProxySendMsgHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		resp := msgProxySendMsgResp{
			Code:   0,
			Result: "succ",
		}

		setErrResp := func(code int, result string) {
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			len, err := io.WriteString(w, string(jsonData))
			if err != nil {
				logger.Errorf("msg->msgProxySendMsgHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("msg->msgProxySendMsgHandler: WriteString len: %d", len)
		}

		reqParams := map[string]string{}
		err := util.ParseJsonForm(r.Body, reqParams)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		logger.Debugf("msg->msgProxySendMsgHandler: reqParams:\n%+v", reqParams)

		pubkey := reqParams["pubkey"]
		if pubkey == "" {
			setErrResp(-1, "invalid params pubkey")
			return
		}

		destPubkey := reqParams["destPubkey"]
		if destPubkey == "" {
			setErrResp(-1, "invalid params destPubkey")
			return
		}

		sig, err := base64.StdEncoding.DecodeString(reqParams["sig"])
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		content, err := base64.StdEncoding.DecodeString(reqParams["content"])
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		isVerify := verifyUserSig(pubkey, content, sig)
		if !isVerify {
			setErrResp(-1, "invalid sig")
			return
		}

		err = service.sendMsg(pubkey, destPubkey, content)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		jsonData, _ := json.Marshal(resp)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("msg->msgProxySendMsgHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("msg->msgProxySendMsgHandler: WriteString len: %d", len)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}

func msgProxyReadMailboxHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
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
				logger.Errorf("msg->msgProxyReadMailboxHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("msg->msgProxyReadMailboxHandler: WriteString len: %d, resp: %+v", len, resp)
		}

		reqParams := map[string]string{}
		err := util.ParseJsonForm(r.Body, reqParams)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		logger.Debugf("msg->msgProxyReadMailboxHandler: reqParams:\n%+v", reqParams)

		pubkey := reqParams["pubkey"]
		if pubkey == "" {
			setErrResp(-1, "invalid params pubkey")
			return
		}
		resp.Key = pubkey

		sig, err := base64.StdEncoding.DecodeString(reqParams["sig"])
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		isVerify := verifyUserSig(pubkey, []byte(pubkey), sig)
		if !isVerify {
			setErrResp(-1, "invalid sig")
			return
		}

		duration := 30 * time.Second
		timeout, err := strconv.ParseInt(reqParams["timeout"], 10, 64)
		if err == nil {
			duration = time.Second * time.Duration(timeout)
		}

		resp.MsgList, err = service.readMailbox(pubkey, duration)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		jsonData, _ := json.Marshal(resp)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("msg->msgProxyReadMailboxHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("msg->msgProxyReadMailboxHandler: WriteString len: %d", len)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}

func verifyUserSig(pubkeyHex string, content []byte, sign []byte) bool {
	pubkeyData, err := key.TranslateKeyStringToProtoBuf(pubkeyHex)
	if err != nil {
		logger.Errorf("msg->verifyUserSig: TranslateKeyStringToProtoBuf error: %v", err)
		return false
	}
	pubkey, err := key.ECDSAProtoBufToPublicKey(pubkeyData)
	if err != nil {
		logger.Errorf("msg->verifyUserSig: Public key is not ECDSA KEY, error: %v", err)
		return false
	}
	isVerify, err := crypto.VerifyDataSignByEcdsa(pubkey, content, sign)
	if err != nil {
		logger.Errorf("msg->verifyUserSig: VerifyDataSignByEcdsa error: %v", err)
		return false
	}
	return isVerify
}
