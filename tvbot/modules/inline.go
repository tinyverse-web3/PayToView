package modules

import (
	"fmt"
	"strings"

	tb "gopkg.in/telebot.v3"
)

func InlineQueryHandler(c tb.Context) error {
	query := c.Query().Text //Text of the query (up to 256 characters)
	if strings.HasPrefix(query, "cmd=fwd&work_id=") {
		showRecipientView(c)
		return nil
	} else if strings.HasPrefix(query, "google") {
		//ToDo
		return nil
	} else if strings.HasPrefix(query, "ud") {
		//ToDo
		return nil
	}
	return nil
}

func showRecipientView(c tb.Context) {
	query := c.Query().Text
	queryMap := parseInlineQueryArgs(query)
	workId := queryMap["work_id"]
	wi := getWorkInfo(workId)

	//Generate text and buttons
	recipientView := &tb.ReplyMarkup{}
	var formatText = "<a>%s</a>\n<b>Title:         </b><i>%s</i>\n<b>Creteor:                        </b><i>%s</i>\n<b>Fee:      </b><i>%s</i>"
	textStr := fmt.Sprintf(formatText, wi.ImageUrl, wi.Title, wi.Creator, wi.Fee)
	startParameters := encodeParameters(fmt.Sprintf("cmd=fwd&work_id=%s", workId))
	inlineLinkStr := fmt.Sprintf("https://t.me/%s?start=%s", BOT_USERNAME, startParameters)
	recipientView.Inline(recipientView.Row(recipientView.URL("View", inlineLinkStr)))

	//generate result obj
	// result := &tb.ArticleResult{
	// 	ResultBase: tb.ResultBase{
	// 		ReplyMarkup: recipientView,
	// 		ParseMode:   "HTML",
	// 		Content: &tb.InputTextMessageContent{
	// 			Text:           textStr,
	// 			DisablePreview: false,
	// 		},
	// 	},
	// 	Title:    wi.Title,
	// 	ThumbURL: wi.ImageUrl,
	// }

	result := &tb.PhotoResult{
		ResultBase: tb.ResultBase{
			ReplyMarkup: recipientView,
			ParseMode:   "HTML",
			Content: &tb.InputTextMessageContent{
				Text:           textStr,
				DisablePreview: false,
			},
		},
		URL:      wi.ImageUrl,
		Title:    wi.Title,
		ThumbURL: wi.ImageUrl,
	}
	results := make(tb.Results, 1)
	results[0] = result
	results[0].SetResultID("0")
	b.Answer(c.Query(), &tb.QueryResponse{
		Results:   results,
		CacheTime: 60,
	})
}

func TestInlineMainMenu(c tb.Context) {
	var sharePaytoViewData SharePaytoViewData = SharePaytoViewData{
		Title:       "PayToView",
		Description: "PayToView First Image",
		ImageUrl:    "https://test.tinyverse.space/paytoview_blur.png",
	}
	var menu = &tb.ReplyMarkup{}
	title := sharePaytoViewData.Title
	description := sharePaytoViewData.Description
	imageUrl := sharePaytoViewData.ImageUrl
	var text string
	if !IsStringEmpty(title) {
		text = text + fmt.Sprintf("<b>%s</b>\n\n", title)
	}
	if !IsStringEmpty(description) {
		text = text + fmt.Sprintf("%s\n\n", description)
	}
	if !IsStringEmpty(imageUrl) {
		text = text + "Share this image with your friends!"
	}
	// p := &tb.Photo{
	// 	File:    tb.FromURL(imageUrl),
	// 	Caption: text,
	// }
	menu.Inline(
		menu.Row(menu.URL("Share", "https://t.me/@tvnb_bot?start=share"), menu.URL("Read Detail!", "https://t.me/@tvnb_bot?start=read")),
	//menu.Row(menu.WebApp("Read Details!", &tb.WebApp{URL: "https://throbbing-art-9358.on.fleek.co/#/?user=test"}))// not work
	)

	result := &tb.ArticleResult{
		ResultBase:  tb.ResultBase{ReplyMarkup: menu, Content: &tb.InputTextMessageContent{Text: "<a>https://test.tinyverse.space/paytoview_blur.png</a>", DisablePreview: false}, ParseMode: "HTML"},
		Title:       text,
		Description: description,
		ThumbURL:    imageUrl,
		Text:        text,
	}
	results := make(tb.Results, 1)
	results[0] = result
	results[0].SetResultID("0")
	c.Bot().Answer(c.Query(), &tb.QueryResponse{
		Results:   results,
		CacheTime: 60,
	})
}
