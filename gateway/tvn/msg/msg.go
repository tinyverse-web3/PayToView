package msg

import (
	"crypto/ecdsa"
	"encoding/hex"
	"sync"
	"time"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/mtv_go_utils/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/define"
	"github.com/tinyverse-web3/tvbase/dmsg"
	"github.com/tinyverse-web3/tvbase/dmsg/client"
	"github.com/tinyverse-web3/tvbase/tvbase"
)

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

func (m *MsgService) RegistHandler(s define.WebServer) {
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
	ret.SetProxyReqPubkey(pubkey)

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
