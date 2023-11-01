package main

import (
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"

	bot "github.com/tinyverse-web3/paytoview/tvbot"
	mod "github.com/tinyverse-web3/paytoview/tvbot/modules"
)

func main() {
	// start bot
	log.Logger.Info("TVS Bot Started.")
	mod.RegisterHandlers()
	mod.InitSdk()
	bot.Bot.Start()
}
