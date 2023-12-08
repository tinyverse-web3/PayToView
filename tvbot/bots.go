package bot

import (
	"fmt"
	"os"
	"time"

	dotenv "github.com/joho/godotenv"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

func logInit() {
	log.InitAPP(Log_Level)
	log.InitModule(App_Name, Log_Level)
}

// prepare environment
func envInit() {

	currentDir, err := os.Getwd()
	if err != nil {
		log.Logger.Fatal("Error getting current working directory:", err)
	}
	env := currentDir + "/.env"
	log.Logger.Infof("Loading .env file from: %s", env)
	if err := dotenv.Load(env); err != nil {
		log.Logger.Fatal("Error loading .env file, launch failed")
	}
	if os.Getenv("BOT_TOKEN") == "" {
		log.Logger.Fatal("launch failed: Please set the BOT_TOKEN environment variable in .env")
	} else {
		BOT_TOKEN = os.Getenv("BOT_TOKEN")
		log.Logger.Infof("Token from .env: %s", BOT_TOKEN)
	}
	if os.Getenv("SDK_ROOT_PATH") == "" {
		SDK_ROOT_PATH = currentDir
		log.Logger.Infof("SDK_ROOT_PATH from current work dir: %s", SDK_ROOT_PATH)
	} else {
		SDK_ROOT_PATH = os.Getenv("SDK_ROOT_PATH")
		log.Logger.Infof("SDK_ROOT_PATH from .env: %s", SDK_ROOT_PATH)
	}
}

func BotInit() tb.Bot {
	logInit()
	envInit()
	b, err := tb.NewBot(tb.Settings{
		URL:         "",
		Token:       BOT_TOKEN,
		Poller:      &tb.LongPoller{Timeout: 10 * time.Second},
		Synchronous: false,
		Verbose:     false,
		ParseMode:   "HTML",
		Offline:     false,
		OnError: func(e error, c tb.Context) {
			fmt.Println(e)
			log.Logger.Errorf("error: %v", e)
		},
	})
	if err != nil {
		log.Logger.Fatal("tb.NewBot: %s", err.Error())
	}
	return *b
}

var Bot = BotInit()
