package modules

import (
	"fmt"

	tb "gopkg.in/telebot.v3"
)

func genRecipientView(wi WorkInfo) sendContent {
	recipientView := &tb.ReplyMarkup{}
	var workDescInfo = "<b>Title:      </b><i>%s</i>\n<b>Creteor:                        </b><i>%s</i>\n<b>Fee:      </b><i>%s</i>"
	workDescInfoStr := fmt.Sprintf(workDescInfo, wi.Title, wi.Creator, wi.Title)
	inlineLinkStr := fmt.Sprintf("https://t.me/%s?start=workid_%s", BOT_USERNAME, wi.Id)
	recipientView.Inline(recipientView.Row(recipientView.URL("View", inlineLinkStr)))
	p := &tb.Photo{
		File: tb.FromURL(wi.ImageUrl),
	}
	return sendContent{
		HtmlText:    workDescInfoStr,
		ReplyMarkup: recipientView,
		Photo:       p,
	}
}
