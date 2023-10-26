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

type MsgUser struct {
	service *client.DmsgService
}

type MsgService struct {
	tvbase   *tvbase.TvBase
	privkey  *ecdsa.PrivateKey
	userList map[string]*MsgUser

	svrPubkey string
	getSig    func(protoData []byte) ([]byte, error)
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
		userList: make(map[string]*MsgUser),
	}

	// set proxy pubkey
	ret.svrPubkey = hex.EncodeToString(eth_crypto.FromECDSAPub(&ret.privkey.PublicKey))

	// create msg user
	ret.getSig = func(protoData []byte) ([]byte, error) {
		sig, err := crypto.SignDataByEcdsa(ret.privkey, protoData)
		if err != nil {
			logger.Errorf("msg->getUser: SignDataByEcdsa error: %v", err)
		}

		return sig, nil
	}

	return ret
}

func (m *MsgService) RegistHandler(s webserver.WebServerHandle) {
	s.AddHandler("/msg/sendmsg", msgProxySendMsgHandler)
	s.AddHandler("/msg/readmailbox1", msgProxyReadMailboxHandler)
}

func (m *MsgService) getService(pubkey string) (*client.DmsgService, error) {
	user := m.userList[pubkey]
	if user == nil {
		service, err := client.CreateService(m.tvbase)
		if err != nil {
			return nil, err
		}
		err = service.Start()
		if err != nil {
			return nil, err
		}
		// service = m.tvbase.GetClientDmsgService()
		err = service.SubscribeSrcUser(m.svrPubkey, m.getSig, false)
		if err != nil {
			return nil, err
		}
		err = service.SetProxyPubkey(pubkey)
		if err != nil {
			return nil, err
		}

		_, err = service.CreateMailbox(pubkey)
		if err != nil {
			return nil, err
		}

		user = &MsgUser{
			service: service,
		}
		m.userList[pubkey] = user
	}
	return user.service, nil
}

func (m *MsgService) sendMsg(userPubkey string, destPubkey string, content []byte) error {
	service, err := m.getService(userPubkey)
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
	service, err := m.getService(userPubkey)
	if err != nil {
		return nil, err
	}
	return service.RequestReadMailbox(duration)
}
