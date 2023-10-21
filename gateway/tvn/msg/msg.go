package msg

import (
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"time"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/mtv_go_utils/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/webserver"
	"github.com/tinyverse-web3/tvbase/dmsg"
	"github.com/tinyverse-web3/tvbase/dmsg/client"
	"github.com/tinyverse-web3/tvbase/tvbase"
)

type MsgService struct {
	tvbase       *tvbase.TvBase
	proxyPrivkey *ecdsa.PrivateKey
}

var service *MsgService

func GetInstance(base *tvbase.TvBase, privkey *ecdsa.PrivateKey) *MsgService {
	if service == nil {
		service = newMsgService(base, privkey)
	}
	return service
}

func newMsgService(base *tvbase.TvBase, privkey *ecdsa.PrivateKey) *MsgService {
	ret := &MsgService{
		tvbase:       base,
		proxyPrivkey: privkey,
	}
	service := ret.tvbase.GetClientDmsgService()
	// set proxy pubkey
	proxyPubkey := hex.EncodeToString(eth_crypto.FromECDSAPub(&ret.proxyPrivkey.PublicKey))
	service.SetProxyPubkey(proxyPubkey)

	// create msg user
	getSig := func(protoData []byte) ([]byte, error) {
		sig, err := crypto.SignDataByEcdsa(ret.proxyPrivkey, protoData)
		if err != nil {
			logger.Errorf("msg->getUser: SignDataByEcdsa error: %v", err)
		}

		return sig, nil
	}

	err := service.SubscribeSrcUser(proxyPubkey, getSig, false)
	if err != nil {
		logger.Panicf("msg->newMsgService: SubscribeSrcUser error: %+v", err)
	}

	return ret
}

func (m *MsgService) RegistHandler(s webserver.WebServerHandle) {
	s.AddHandler("/msg/sendmsg", msgProxySendMsgHandler)
	s.AddHandler("/msg/readmailbox", msgProxyReadMailboxHandler)
	s.AddHandler("msg/createmailbox", msgProxyCreateMailbox)
}

func (m *MsgService) getService() *client.DmsgService {
	service := m.tvbase.GetClientDmsgService()
	return service
}

func (m *MsgService) createUser(pubkey string) error {
	service := m.getService()
	err := service.CreateMailbox(pubkey)
	if err != nil {
		return err
	}
	return nil
}

func (m *MsgService) sendMsg(userPubkey string, destPubkey string, content []byte) error {
	service := m.getService()
	isExist := service.IsExistMailbox(destPubkey)
	if !isExist {
		return fmt.Errorf("msg->sendmsg: dest mailbox isn't exist")
	}
	service.SetProxyReqPubkey(userPubkey)
	service.SubscribeDestUser(destPubkey, false)
	sendMsgReq, err := service.SendMsg(destPubkey, content)
	if err != nil {
		return err
	}
	logger.Debugf("msg->sendMsg: sendMsgReq: %s", sendMsgReq)
	return nil
}

func (m *MsgService) readMailbox(userPubkey string, duration time.Duration) ([]dmsg.Msg, error) {
	return m.getService().RequestReadMailbox(duration)
}
