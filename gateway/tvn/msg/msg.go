package msg

import (
	"crypto/ecdsa"
	"encoding/hex"
	"time"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/mtv_go_utils/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/webserver"
	"github.com/tinyverse-web3/tvbase/dmsg"
	"github.com/tinyverse-web3/tvbase/dmsg/client"
	"github.com/tinyverse-web3/tvbase/tvbase"
)

type MsgService struct {
	tvbase   *tvbase.TvBase
	privkey  *ecdsa.PrivateKey
	userList map[string]any
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
		tvbase:   base,
		privkey:  privkey,
		userList: nil,
	}
	service := ret.tvbase.GetClientDmsgService()
	// set proxy pubkey
	svrPubkey := hex.EncodeToString(eth_crypto.FromECDSAPub(&ret.privkey.PublicKey))

	// create msg user
	getSig := func(protoData []byte) ([]byte, error) {
		sig, err := crypto.SignDataByEcdsa(ret.privkey, protoData)
		if err != nil {
			logger.Errorf("msg->getUser: SignDataByEcdsa error: %v", err)
		}

		return sig, nil
	}

	err := service.SubscribeSrcUser(svrPubkey, getSig, false)
	if err != nil {
		logger.Panicf("msg->newMsgService: SubscribeSrcUser error: %+v", err)
	}

	return ret
}

func (m *MsgService) RegistHandler(s webserver.WebServerHandle) {
	s.AddHandler("/msg/sendmsg", msgProxySendMsgHandler)
	s.AddHandler("/msg/readmailbox", msgProxyReadMailboxHandler)
}

func (m *MsgService) getService() *client.DmsgService {
	service := m.tvbase.GetClientDmsgService()
	return service
}

func (m *MsgService) getUser(userPubkey string) (existUser bool, err error) {
	service := m.getService()
	if service.GetProxyPubkey() != userPubkey {
		service.ClearProxyPubkey()
		err = service.SetProxyPubkey(userPubkey)
		if err != nil {
			return false, err
		}

		existUser, err = service.CreateMailbox(userPubkey)
		if err != nil {
			return existUser, err
		}
	}

	return existUser, nil
}

func (m *MsgService) sendMsg(userPubkey string, destPubkey string, content []byte) error {
	service := m.getService()
	_, err := m.getUser(userPubkey)
	if err != nil {
		return err
	}

	// if !service.IsExistDestUser(destPubkey) {
	// 	err := service.SubscribeDestUser(destPubkey, false)
	// 	if err != nil {
	// 		return err
	// 	}
	// }

	sendMsgReq, err := service.SendMsg(destPubkey, content)
	if err != nil {
		return err
	}
	logger.Debugf("msg->sendMsg: sendMsgReq: %s", sendMsgReq)
	return nil
}

func (m *MsgService) readMailbox(userPubkey string, duration time.Duration) ([]dmsg.Msg, error) {
	service := m.getService()
	_, err := m.getUser(userPubkey)
	if err != nil {
		return nil, err
	}
	return service.RequestReadMailbox(duration)
}
