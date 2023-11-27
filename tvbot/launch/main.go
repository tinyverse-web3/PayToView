package main

import (
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"

	bot "github.com/tinyverse-web3/paytoview/tvbot"
	mod "github.com/tinyverse-web3/paytoview/tvbot/modules"
	web "github.com/tinyverse-web3/paytoview/tvbot/web"
)

func main() {
	// start bot
	log.Logger.Info("TVS Bot Started.")
	go web.Run(bot.Web_Port, &bot.Bot) // start web
	mod.RegisterHandlers()
	go mod.InitSdk()
	bot.Bot.Start()
}
