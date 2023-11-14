package modules

import (
	initData "github.com/telegram-mini-apps/init-data-golang"
	tb "gopkg.in/telebot.v3"
)

var (
	replayMarkup = &tb.ReplyMarkup{}
)

func OnWebAppDataQuery(bot *tb.Bot, webInitData *initData.InitData) tb.Context {
	var query = &tb.Query{
		ID: webInitData.QueryID,
	}
	replayMarkup.Inline(
		replayMarkup.Row(
			replayMarkup.Text("Web Query Function"),
		),
		replayMarkup.Row(replayMarkup.URL("Help", "https://tinyverse.space/")))

	r := &tb.ArticleResult{ResultBase: tb.ResultBase{ReplyMarkup: replayMarkup}, Title: "Help", Description: "Here is the inline help menu", Text: "Help"}
	bot.AnswerWebApp(query, r)
	return nil
}
