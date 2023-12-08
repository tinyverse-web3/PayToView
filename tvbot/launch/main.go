package main

import (
	bot "github.com/tinyverse-web3/paytoview/tvbot"
	mod "github.com/tinyverse-web3/paytoview/tvbot/modules"
	web "github.com/tinyverse-web3/paytoview/tvbot/web"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
)

func main() {
	// start bot
	log.Logger.Info("TVS Bot Started.")
	mod.InitSdk()
	mod.RegisterHandlers()
	go web.Run(bot.Web_Port, &bot.Bot) // start web
	go bot.Bot.Start()
	select {}
}
