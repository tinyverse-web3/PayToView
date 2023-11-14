package controllers

import (
	"github.com/gin-gonic/gin"
	initData "github.com/telegram-mini-apps/init-data-golang"
	mod "github.com/tinyverse-web3/paytoview/tvbot/modules"
	dto "github.com/tinyverse-web3/paytoview/tvbot/web/dto"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

type MiniAppController struct {
	Bot *tb.Bot
}

func (m *MiniAppController) SendMessage(c *gin.Context) {
	var req dto.MiniAppInitData
	if err := c.ShouldBind(&req); err != nil {
		log.Logger.Error(err.Error())
		Response(c, nil, err.Error())
		return
	}
	webInitData, err := initData.Parse(req.InitData)
	if err != nil {
		log.Logger.Error("init_data parse error")
		Response(c, nil, "Parse error")
		return
	}
	log.Logger.Debugf("webData = %+v", webInitData)
	mod.OnWebAppDataQuery(m.Bot, webInitData)
	Response(c, webInitData, "")
}

// 	keys := make([]string, 0, len(items))
// 	for k := range items {
// 		if k == "hash" {
// 			continue
// 		}
// 		keys = append(keys, k)
// 	}
// 	sort.Strings(keys)
// 	var pairs []string
// 	for _, key := range keys {
// 		pairs = append(pairs, key+"="+items[key])
// 	}
// 	return strings.Join(pairs, "\n")
// }

func (m *MiniAppController) InitBot(bot *tb.Bot) {
	m.Bot = bot
}
