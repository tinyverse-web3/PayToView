package msg

import (
	"crypto/ecdsa"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"sync"
	"time"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/mtv_go_utils/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/tvbase/dmsg"
	"github.com/tinyverse-web3/tvbase/dmsg/client"
	"github.com/tinyverse-web3/tvbase/tvbase"
)

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

type MsgService struct {
	tvbase       *tvbase.TvBase
	proxyPrivkey *ecdsa.PrivateKey
	serviceList  sync.Map
}

var service *MsgService

func GetInstance(base *tvbase.TvBase, privkey *ecdsa.PrivateKey) *MsgService {
	if service == nil {
		service = newMsgService(base, privkey)
	}
	return service
}

func newMsgService(base *tvbase.TvBase, privkey *ecdsa.PrivateKey) *MsgService {
	service := &MsgService{
		tvbase:       base,
		proxyPrivkey: privkey,
		serviceList:  sync.Map{},
	}
	return service
}

func (m *MsgService) RegistHandle(s *http3.Http3Server) {
	s.AddHandler("/msg/sendmsg", msgProxySendMsgHandler)
	s.AddHandler("/msg/readmailbox", msgProxyReadMailboxHandler)
}

func (m *MsgService) getUser(pubkey string) (*client.DmsgService, error) {
	var ret *client.DmsgService
	var err error
	s, ok := m.serviceList.Load(pubkey)
	if ok && s != nil {
		return s.(*client.DmsgService), nil
	}

	ret, err = client.CreateService(m.tvbase)
	if err != nil {
		return nil, nil
	}

	// set proxy pubkey
	proxyPubkey := hex.EncodeToString(eth_crypto.FromECDSAPub(&m.proxyPrivkey.PublicKey))
	ret.SetProxyPubkey(proxyPubkey)

	// create msg user
	getSig := func(protoData []byte) ([]byte, error) {
		sig, err := crypto.SignDataByEcdsa(m.proxyPrivkey, protoData)
		if err != nil {
			logger.Errorf("msg->getUser: SignDataByEcdsa error: %v", err)
		}

		return sig, nil
	}

	err = ret.SubscribeSrcUser(pubkey, getSig, false)
	if err != nil {
		return nil, err
	}

	err = ret.CreateMailbox(pubkey)
	if err != nil {
		return nil, err
	}

	m.serviceList.Store(pubkey, ret)
	return ret, nil
}

func (m *MsgService) sendMsg(userPubkey string, destPubkey string, content []byte) error {
	service, err := m.getUser(userPubkey)
	if err != nil {
		return err
	}
	sendMsgReq, err := service.SendMsg(destPubkey, content)
	if err != nil {
		return err
	}
	logger.Debugf("msg->sendMsg: sendMsgReq: %s", sendMsgReq)
	return nil
}

func (m *MsgService) readMailbox(userPubkey string, duration time.Duration) ([]dmsg.Msg, error) {
	service, err := m.getUser(userPubkey)
	if err != nil {
		return nil, err
	}
	return service.RequestReadMailbox(duration)
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

		setErrResp := func(code int, result string) {
			w.Header().Set("Content-Type", "application/json")
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			len, err := io.WriteString(w, string(jsonData))
			if err != nil {
				logger.Errorf("msgProxySendMsgHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("msgProxySendMsgHandler: WriteString len: %d", len)
		}

		pubkey := r.PostFormValue("pubkey")
		if pubkey == "" {
			setErrResp(-1, "invalid params pubkey")
			return
		}

		destPubkey := r.PostFormValue("destPubkey")
		if destPubkey == "" {
			setErrResp(-1, "invalid params destPubkey")
			return
		}

		if !dkvs.IsExistUserProfile(pubkey) {
			setErrResp(-1, "user profile not exist")
			return
		}

		if !dkvs.IsExistUserProfile(destPubkey) {
			setErrResp(-1, "dest user profile not exist")
			return
		}

		content, err := base64.StdEncoding.DecodeString(r.PostFormValue("content"))
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		err = service.sendMsg(pubkey, destPubkey, content)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		jsonData, _ := json.Marshal(resp)
		w.WriteHeader(http.StatusOK)
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
				logger.Errorf("msg->msgProxyReadMailboxHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("msg->msgProxyReadMailboxHandler: WriteString len: %d", len)
		}

		pubkey := r.PostFormValue("pubkey")
		if pubkey == "" {
			setErrResp(-1, "invalid params pubkey")
			return
		}
		resp.Key = pubkey

		if !dkvs.IsExistUserProfile(pubkey) {
			setErrResp(-1, "user profile not exist")
			return
		}

		duration := 30 * time.Second
		timeout, err := strconv.ParseInt(r.PostFormValue("timeout"), 10, 64)
		if err == nil {
			duration = time.Second * time.Duration(timeout)
		}
		if timeout <= 10 {
			duration = 30 * time.Second
		}
		if timeout > 180 {
			duration = 180 * time.Second
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
