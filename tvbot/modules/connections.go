package modules

import (
	"strings"

	tb "gopkg.in/telebot.v3"
)

func ChatContext(c tb.Context) tb.Context {
	if !c.Message().Private() {
		return c
	}
	chat_id := int64(0)
	if chat_id == int64(0) {
		return c
	}
	if chat_id == int64(0) {
		return c
	}
	cmd := strings.Split(c.Text(), " ")[0][1:]
	if !stringInSlice(cmd, CNT) {
		return c
	}
	Chat, _ := b.ChatByID(chat_id)
	return c.Bot().NewContext(tb.Update{ID: c.Message().ID,
		Message: &tb.Message{
			Sender:      c.Sender(),
			Chat:        Chat,
			Payload:     c.Message().Payload,
			Text:        c.Message().Text,
			ReplyTo:     c.Message().ReplyTo,
			Audio:       c.Message().Audio,
			Video:       c.Message().Video,
			Document:    c.Message().Document,
			Photo:       c.Message().Photo,
			Sticker:     c.Message().Sticker,
			Voice:       c.Message().Voice,
			Animation:   c.Message().Animation,
			ReplyMarkup: c.Message().ReplyMarkup,
			ID:          c.Message().ID,
		},
	})
}
