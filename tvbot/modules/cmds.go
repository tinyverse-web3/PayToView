package modules

import (
	"encoding/json"
	"fmt"
	"strings"

	bot "github.com/tinyverse-web3/paytoview/tvbot"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

type HANDLE struct {
	FUNC       func(tb.Context) error
	MIDDLEWARE func(tb.HandlerFunc) tb.HandlerFunc
}

var HANDLERS = GatherHandlers()

func GatherHandlers() map[string]HANDLE {
	var HANDLERS = make(map[string]HANDLE)

	// start.go
	HANDLERS["start"] = HANDLE{FUNC: Start}
	HANDLERS["help"] = HANDLE{FUNC: Help_Menu}

	return HANDLERS
}

func RegisterHandlers() {
	for endpoint, function := range HANDLERS {
		if function.MIDDLEWARE != nil {
			bot.Bot.Handle("/"+endpoint, function.FUNC, function.MIDDLEWARE, ConnectFunc)
		} else {
			bot.Bot.Handle(fmt.Sprintf("/%s", endpoint), function.FUNC, ConnectFunc)
		}
	}
	CallBackHandlers()
}

func CallBackHandlers() {
	bot.Bot.Handle(&help_button, HelpCB)
	bot.Bot.Handle(&back_button, back_cb)

	// common handlers
	bot.Bot.Handle(tb.OnText, OnTextHandler)

	// webApp handlers
	bot.Bot.Handle(tb.OnWebApp, OnWebAppDataHandler)
}

func OnTextHandler(c tb.Context) error {
	if strings.HasPrefix(c.Message().Text, "!") || strings.HasPrefix(c.Message().Text, "?") {
		cmd := strings.Split(c.Message().Text, " ")[0][1:]
		for endpoint, function := range HANDLERS {
			if endpoint == cmd {
				c = AddPayload(c)
				if c.Message().Private() {
					c = ChatContext(c)
				}
				if function.MIDDLEWARE == nil {
					return function.FUNC(c)
				} else {
					if proc := function.MIDDLEWARE(function.FUNC); proc != nil {
						return proc(c)
					}
				}
			}
		}
	}
	// FLOOD_EV(c)
	// Chat_bot(c)
	// if ok, err := FilterEvent(c); ok {
	// 	return err
	// }
	// if match, _ := regexp.MatchString("\\#(\\S+)", c.Message().Text); match {
	// 	HashNote(c)
	// 	return nil
	// }
	// if afk := AFK(c); afk {
	// 	return nil
	// }
	return nil
}

func OnWebAppDataHandler(c tb.Context) error {
	webapp := c.Message().WebAppData
	if webapp.Data != "" {
		webData := webapp.Data
		var sharePaytoViewData SharePaytoViewData
		err := json.Unmarshal([]byte(webData), &sharePaytoViewData)
		if err != nil {
			log.Logger.Error(err)
		}
		title := sharePaytoViewData.Title
		description := sharePaytoViewData.Description
		imageUrl := sharePaytoViewData.ImageUrl
		var text string
		if !IsStringEmpty(title) {
			text = text + fmt.Sprintf("<b>%s</b>\n\n", title)
		}
		if IsStringEmpty(description) {
			text = text + fmt.Sprintf("%s\n\n", description)
		}
		if IsStringEmpty(imageUrl) {
			text = text + "Share this image with your friends!"
		}
		p := &tb.Photo{
			File:    tb.FromURL(imageUrl),
			Caption: text,
		}

		imageButton := &tb.InlineButton{
			Text: "Read Detail!",
			URL:  "https://t.me/ItToolBot?start=read",
		}
		receiveMsg, err := b.Send(c.Message().Sender, tb.Album{p}, imageButton)
		if err != nil {
			log.Logger.Error(err)
			return nil
		}
		log.Logger.Debugf("receiveMsg: %v", receiveMsg)
	}
	return nil
}
