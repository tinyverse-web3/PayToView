package modules

import (
	bot "github.com/tinyverse-web3/paytoview/tvbot"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	"github.com/tinyverse-web3/tinyverse_sdk/tinyverse/sdk"
)

func InitSdk() {
	err := sdk.StartUp(bot.Server_Name)
	if err != nil {
		log.Logger.Error(err)
	}
}

func checkUserExists(userId string) bool {
	// var req controller.AccountReq
	// req.UserID = userId
	// req.SssData = ""
	// res := controller.GetAuthInstance().CheckAccountExist(req)
	// var resJson controller.RespJson
	// err := json.Unmarshal([]byte(res), &resJson)
	// if err != nil {
	// 	log.Logger.Errorf("checkUserExists--->", err)
	// 	return false
	// }
	// log.Logger.Info("check account exist = ", resJson.Data)
	// if condition, ok := resJson.Data.(bool); ok {
	// 	return condition

	// }
	return true
}

func getWorkInfo(workId string) WorkInfo {

	return WorkInfo{
		Id:          "080112201d2260111e",
		Title:       "Beautiful Work",
		Description: "Work Description",
		Creator:     "Jack",
		Fee:         "10",
		ShareRatio:  "10%",
		ImageUrl:    "https://test.tinyverse.space/paytoview_blur.png",
	}
}

func getAccountInfo(userId string) accountInfo {
	return accountInfo{
		Address: "080112201d2260111e0c737a1a919121466f7568660e5796b1559fbaac49c9af3f620ffb",
		Balance: "50000",
		Income:  "200",
	}
}

func isPaid(userId string, workId string) bool {
	return false
}

func pointsIsSufficient(userId string, workId string) bool {
	return true
}
