package modules

import tb "gopkg.in/telebot.v3"

type SharePaytoViewData struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	ImageUrl    string `json:"image"`
}

type sendContent struct {
	HtmlText    string
	ReplyMarkup *tb.ReplyMarkup
	Photo       *tb.Photo
}

type WorkInfo struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Creator     string `json:"creator"`
	Fee         string `json:"fee"`
	ImageUrl    string `json:"image"`
	ShareRatio  string `json:"share_ratio"`
}

type WorkId struct {
	Id string `json:"id"`
}

type accountInfo struct {
	Address string
	Balance string
	Income  string
}
