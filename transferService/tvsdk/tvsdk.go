package tvsdk

import (
	"fmt"
	"time"

	keyutils "github.com/tinyverse-web3/mtv_go_utils/key"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/defines"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/sdk"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/sdkutils"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/tvwallet"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/usercenter"
	useraccountmanager "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/usercenter/useraccountManager"
	dkvsPb "github.com/tinyverse-web3/tvbase/dkvs/pb"
)

type TvSdk struct {
}

func NewSdk() *TvSdk {
	ret := &TvSdk{}
	return ret
}

func (t *TvSdk) Init(rootPath string, password string) (err error) {
	err = sdk.StartUpBase("", rootPath)
	if err != nil {
		logger.Errorf("TvSdk.Init: StartUpBase error: %v", err)
		return err
	}
	userAccount := useraccountmanager.GetInstance()
	userAccount.Unlock(password)
	_, err = userAccount.LoadAccountFromLocal()
	if err != nil {
		const defaultPassword = "123456"
		userAccount.CreateMasterAccount("")
		userAccount.UpdatePassword(defaultPassword, password)
	}
	usercenter.InitUserCenter(false)

	return nil
}

func (t *TvSdk) SetDKVS(key string, value []byte, ttl time.Duration) error {
	err := sdkutils.SaveToDKVS(key, value, ttl)
	if err != nil {
		logger.Errorf("TvSdk.SetDKVS: SetDKVS error: %v", err)
		return err
	}
	return nil
}

func (t *TvSdk) GetRecordFromDKVS(key string) (*dkvsPb.DkvsRecord, error) {
	record, err := sdkutils.GetRecordFromDKVS(key)
	if err != nil {
		logger.Errorf("TvSdk.GetRecordFromDKVS: GetRecordFromDKVS error: %v", err)
		return nil, err
	}
	return record, nil
}

func (t *TvSdk) GetWallID() string {
	userAccount := useraccountmanager.GetInstance()
	walletData, err := userAccount.GetUserAccountID(useraccountmanager.USERACCOUNT_WALLET)
	if err != nil {
		logger.Errorf("TvSdk.GetWallID: GetUserAccountID error: %v", err)
		return ""
	}

	walletAddr := keyutils.TranslateKeyProtoBufToString(walletData)
	return walletAddr
}

func (t *TvSdk) GetBalance() uint64 {
	myWalletInst := tvwallet.GetWalletInst()
	balance, err := myWalletInst.GetBalance()
	if err != nil {
		logger.Errorf("TvSdk.GetBalance: GetBalance error: %v", err)
		return 0
	}
	return balance
}

func (t *TvSdk) GetDKVS(key string) ([]byte, error) {
	data, err := sdkutils.ReadFromDKVS(key)
	if err != nil {
		logger.Errorf("TvSdk.GetDKVS: GetDKVS error: %v", err)
		return nil, err
	}
	return data, nil
}

func (t *TvSdk) GetAccountStorePubkey() (string, error) {
	userID, err := useraccountmanager.GetInstance().GetUserAccountID(useraccountmanager.USERACCOUNT_STORAGE)
	if err != nil {
		logger.Errorf("TvSdk.GetAccountStorePubkey: GetUserAccountID error: %v", err)
		return "", err
	}
	ret := keyutils.TranslateKeyProtoBufToString(userID)
	if err != nil {
		logger.Errorf("TvSdk.GetAccountStorePubkey: TranslateKeyProtoBufToString error: %v", err)
		return "", err
	}
	return ret, nil
}

func (t *TvSdk) TransferTvs(walletID string, amount uint64, fee uint64, info string) error {
	myWalletInst := tvwallet.GetWalletInst()
	walletAddr, err := keyutils.TranslateKeyStringToProtoBuf(walletID)
	if err != nil {
		logger.Errorf("TvSdk.TransferTvs: TranslateKeyStringToProtoBuf error: %v", err)
		return err
	}

	comments := []byte(info)
	err = myWalletInst.TransferScoreWait(walletAddr, amount, fee, comments)
	if err != nil {
		logger.Errorf("TvSdk.TransferTvs: TransferScoreWait error: %v", err)
		return err
	}
	return nil
}

func (t *TvSdk) IsExistWallet(walletID string) bool {
	key_profile := fmt.Sprintf(defines.KEY_TEMPLETE, "user", walletID, "master")
	_, err := sdkutils.ReadFromDKVS(key_profile)
	if err != nil {
		logger.Errorf("TvSdk.IsExistWallet: ReadFromDKVS error: %v", err)
	}
	return err == nil
}
