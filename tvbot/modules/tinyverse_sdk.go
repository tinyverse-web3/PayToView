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
