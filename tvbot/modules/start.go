package modules

import (
	"fmt"
	"strconv"

	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

var (
	menu         = &tb.ReplyMarkup{}
	help_button  = sel.Data("HELP", "help_button")
	back_button  = sel.Data("Back", "back_button")
	reply_button = &tb.ReplyMarkup{ResizeKeyboard: true}
)

func Start(c tb.Context) error {
	m := c.Message()
	userId := strconv.FormatInt(c.Sender().ID, 10)
	isExist := checkUserExists(userId)
	if m.Private() && isExist {
		genKeyboardButton(userId)
		genHaveAccountButtons(userId)
		_, err := b.Send(m.Sender, displayAccountInfo("xxxx", "xxxx", "xxxxx"), reply_button, menu)
		if err != nil {
			log.Logger.Error(err)
		}
		return nil
	}
	if m.Private() && !isExist {
		createAccountInlineKeyboard(userId)
		b.Send(m.Sender, fmt.Sprintf("Hey there! I am <b>%s</b>.\nIm an Tinverse Space Bot, you can call me anytime by click the buttons below! ", BOT_NAME), menu)
		return nil
	}

	b.Reply(m, "Hey I'm TVS bot.")
	return nil
}

func Help_Menu(c tb.Context) error {
	if c.Message().Private() {
		gen_help_buttons(c, help_caption, true)
	}
	return nil
}

func gen_help_buttons(c tb.Context, text string, Reply bool) {
	sel.Inline(sel.Row(sel.Data("AFK", "help_button", "afk"), sel.Data("Admin", "help_button", "admin"), sel.Data("Bans", "help_button", "bans")), sel.Row(sel.Data("Chatbot", "help_button", "chatbot"), sel.Data("Feds", "help_button", "feds"), sel.Data("Greetings", "help_button", "greetings")), sel.Row(sel.Data("Inline", "help_button", "inline"), sel.Data("Locks", "help_button", "locks"), sel.Data("Misc", "help_button", "misc")), sel.Row(sel.Data("Notes", "help_button", "notes"), sel.Data("Pin", "help_button", "pin"), sel.Data("Stickers", "help_button", "stickers")), sel.Row(sel.Data("Warns", "help_button", "warns")))
	if Reply {
		c.Reply(text, sel)
	} else {
		c.Edit(text, sel)
	}
}

func HelpCB(c tb.Context) error {
	arg := c.Callback().Data
	text, ok := help[arg]
	sel.Inline(sel.Row(back_button))
	if ok {
		err := c.Edit(text.(string), &tb.SendOptions{ParseMode: "Markdown", ReplyMarkup: sel})
		check(err)
	}
	return nil
}

func back_cb(c tb.Context) error {
	gen_help_buttons(c, help_caption, false)
	return nil
}

func createAccountInlineKeyboard(userId string) {
	menu.Inline(
		menu.Row(menu.WebApp("Create Account", &tb.WebApp{
			URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
		})),
		menu.Row(menu.URL("Help", "https://tinyverse.space/")))
}

func displayAccountInfo(tvn_address, tvs_balance, tvs_income string) string {
	var accountInfo = "<b>TVN master account address:      </b><i>%s</i>\n\n<b>TVN points balance:                        </b><i>%s</i>\n\n<b>Total revenue (last 24 hours):      </b><i>%s</i>"
	accountInfoStr := fmt.Sprintf(accountInfo, tvn_address, tvs_balance, tvs_income)
	return accountInfoStr
}

func genHaveAccountButtons(userId string) {
	menu.Inline(
		menu.Row(menu.WebApp("New Content", &tb.WebApp{
			URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
		})),
		menu.Row(menu.WebApp("Earnings", &tb.WebApp{
			URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
		}), menu.WebApp("Published", &tb.WebApp{
			URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
		})),
		menu.Row(menu.WebApp("Paid", &tb.WebApp{
			URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
		}), menu.WebApp("Forwarded", &tb.WebApp{
			URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
		})))
}

func genKeyboardButton(userId string) {
	reply_button.Reply(reply_button.Row(reply_button.WebApp("Create Account", &tb.WebApp{
		URL: fmt.Sprintf("https://throbbing-art-9358.on.fleek.co/#/?user=%s", userId),
	})))
}
