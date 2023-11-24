package bot

import (
	"fmt"

	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

func BotInit() tb.Bot {
	// init log
	log.InitAPP(Log_Level)
	log.InitModule(App_Name, Log_Level)

	// if err := dotenv.Load(); err != nil {
	// 	log.Logger.Error("Error loading .env file")
	// }
	if BOT_TOKEN == "" {
		log.Logger.Error("Please set the TOKEN environment variable")
	}
	b, _ := tb.NewBot(tb.Settings{
		URL:         "",
		Token:       BOT_TOKEN,
		Poller:      &tb.LongPoller{Timeout: 10},
		Synchronous: false,
		Verbose:     false,
		ParseMode:   "HTML",
		Offline:     false,
		OnError: func(e error, c tb.Context) {
			fmt.Println(e)
			log.Logger.Errorln(e)
		},
	})
	return *b
}

var Bot = BotInit()
