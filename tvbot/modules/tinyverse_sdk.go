package modules

import (
	"strconv"

	bot "github.com/tinyverse-web3/paytoview/tvbot"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/sdk"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/tvbot"
)

var BM *tvbot.BotManager

func InitSdk() {
	err := sdk.StartUpBase(bot.SDK_ROOT_PATH, bot.App_Name)
	if err != nil {
		log.Logger.Error("InitSdk failed--->%v", err)
	}
	BM = tvbot.GetInstance()
}

func checkUserExists(userId string) bool {
	return BM.CheckAccountExist(userId)
	//return true
}

func getWorkInfo(workId string) *WorkInfo {
	contract, walletKey, err := BM.GetContractInfo(workId)
	if err != nil {
		log.Logger.Errorf("getWorkInfo--->%v", err)
		return nil
	}
	if contract == nil {
		log.Logger.Errorf("getWorkInfo--->contract is nil")
		return nil
	}
	log.Logger.Infof("getWorkInfo--->contract:%+v", contract)
	if walletKey == "" {
		log.Logger.Errorf("getWorkInfo--->walletKey is nil")
		return nil
	}
	if contract.Ratio == nil {
		log.Logger.Errorf("getWorkInfo--->contract.Ratio is nil")
		return nil
	}

	return &WorkInfo{
		Id:          workId,
		Title:       contract.Name,
		Description: contract.Content.Description,
		Creator:     walletKey,
		Fee:         strconv.FormatUint(contract.Fee, 10),
		ShareRatio:  strconv.Itoa(int(contract.Ratio.ForwarderPercent)),
		ImageUrl:    bot.IPFS_IMAGE_API_URL + contract.Content.CidForpreview,
	}
	// return &WorkInfo{
	// 	Id:          "080112201d2260111e",
	// 	Title:       "Beautiful Work",
	// 	Description: "Work Description",
	// 	Creator:     "Jack",
	// 	Fee:         "10",
	// 	ShareRatio:  "10%",
	// 	ImageUrl:    "https://test.tinyverse.space/paytoview_blur.png",
	// }
}

func getAccountInfo(userId string) accountInfo {
	ac, err := BM.GetAccountProfile(userId)
	if err != nil {
		log.Logger.Error("getAccountInfo--->%v", err)
		return accountInfo{}
	}
	if ac == nil {
		log.Logger.Error("getAccountInfo--->ac is nil")
		return accountInfo{}
	}
	return accountInfo{
		Address: ac.WalletKey,
		Balance: strconv.FormatUint(ac.Balance, 10),
		Income:  "N/A",
	}
	// return accountInfo{
	// 	Address: "xxxxxxxxxxxxxxxxxx",
	// 	Balance: "100",
	// 	Income:  "N/A",
	// }
}

func isPaid(userId string, workId string) bool {
	return BM.IsPaid(userId, workId)
}

func pointsIsSufficient(userId string, workId string) bool {
	return BM.CheckBalanceIsEnough(userId, workId)
}
