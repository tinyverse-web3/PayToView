package msg

import (
	"crypto/ecdsa"
	"encoding/hex"
	"sync"
	"time"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/tinyverse-web3/mtv_go_utils/crypto"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/webserver"
	"github.com/tinyverse-web3/tvbase/dmsg"
	"github.com/tinyverse-web3/tvbase/dmsg/client"
	"github.com/tinyverse-web3/tvbase/tvbase"
)

type MsgUser struct {
	service        *client.DmsgService
	mu             *sync.Mutex
	lastAccessTime time.Time
}

type MsgService struct {
	tvbase    *tvbase.TvBase
	privkey   *ecdsa.PrivateKey
	mu        sync.Mutex
	userList  sync.Map
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
		tvbase:  base,
		privkey: privkey,
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
	s.AddHandler("/msg/readmailbox", msgProxyReadMailboxHandler)
}

func (m *MsgService) getService(pubkey string) (*client.DmsgService, error) {
	m.mu.Lock()
	data, _ := m.userList.Load(pubkey)
	user, _ := data.(*MsgUser)
	if user == nil {
		user = &MsgUser{
			service: nil,
			mu:      &sync.Mutex{},
		}
	}
	m.mu.Unlock()

	user.mu.Lock()
	defer user.mu.Unlock()
	if user.service == nil {
		var lastErr error
		var service *client.DmsgService

		service, lastErr = client.CreateService(m.tvbase)
		if lastErr != nil {
			return nil, lastErr
		}

		lastErr = service.Start()
		if lastErr != nil {
			return nil, lastErr
		}

		defer func() {
			if lastErr != nil {
				err := service.Stop()
				if err != nil {
					logger.Errorf("MsgService->getService: Stop error: %v", err)
				}
			}
		}()

		var privkey string
		privkey, _, lastErr = util.GenEcdsaKey()
		if lastErr != nil {
			logger.Error("MsgService->getService: genEcdsaKey: error: %+v", lastErr)
			return nil, lastErr
		}

		var userPrivkey *ecdsa.PrivateKey
		_, userPrivkey, lastErr = util.GetEcdsaPrivKey(privkey)
		if lastErr != nil {
			logger.Error("MsgService->getService: GetEcdsaPrivKey: error: %+v", lastErr)
			return nil, lastErr
		}

		getSig := func(protoData []byte) ([]byte, error) {
			sig, err := crypto.SignDataByEcdsa(userPrivkey, protoData)
			if err != nil {
				logger.Errorf("MsgService->getService: SignDataByEcdsa error: %v", err)
			}
			return sig, nil
		}

		lastErr = service.SubscribeSrcUser(hex.EncodeToString(eth_crypto.FromECDSAPub(&userPrivkey.PublicKey)), getSig, false)
		if lastErr != nil {
			return nil, lastErr
		}

		lastErr = service.SetProxyPubkey(pubkey)
		if lastErr != nil {
			return nil, lastErr
		}

		_, lastErr = service.CreateMailbox(pubkey)
		if lastErr != nil {
			return nil, lastErr
		}
		user.service = service
		m.userList.Store(pubkey, user)
	}

	user.lastAccessTime = time.Now()
	return user.service, nil
}

func (m *MsgService) sendMsg(userPubkey string, destPubkey string, content []byte) error {
	service, err := m.getService(userPubkey)
	if err != nil {
		return err
	}

	if !service.IsExistDestUser(destPubkey) {
		err = service.SubscribeDestUser(destPubkey, true) // false: private user key,  true: public user key
		if err != nil {
			logger.Errorf("msg->getService: SubscribeSrcUser failed: %v", err)
			return err
		}
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

func (m *MsgService) TickerCleanRestResource() {
	defaultTimeout := 5 * time.Minute
	ticker := time.NewTicker(defaultTimeout)
	for {
		select {
		case <-ticker.C:
			func() {
				m.mu.Lock()
				defer m.mu.Unlock()
				m.userList.Range(func(key, value any) bool {
					user := value.(*MsgUser)
					user.mu.Lock()
					if time.Since(user.lastAccessTime) > defaultTimeout {
						if user.service != nil {
							user.service.Stop()
							user.service = nil
						}
						m.userList.Delete(key)
					}
					user.mu.Unlock()
					return true
				})
			}()
		case <-m.tvbase.GetCtx().Done():
			ticker.Stop()

		}
	}
}
