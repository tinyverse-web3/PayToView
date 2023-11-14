package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	initData "github.com/telegram-mini-apps/init-data-golang"
	cfg "github.com/tinyverse-web3/paytoview/tvbot/web/configs"
	controllers "github.com/tinyverse-web3/paytoview/tvbot/web/controllers"
	dto "github.com/tinyverse-web3/paytoview/tvbot/web/dto"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

type MiniAppMiddleware struct {
	Bot *tb.Bot
}

func (m *MiniAppMiddleware) InitBot(bot *tb.Bot) {
	m.Bot = bot
}

// Authorize is a function that returns a gin.HandlerFunc.
//
// It validates the web init data and if the validation is successful, it calls the next controller.
// If the validation fails, it aborts the request and returns an error message.
func (m *MiniAppMiddleware) Authorize() gin.HandlerFunc {
	return func(c *gin.Context) {
		//validate the web init data
		if err := m.ValidateInit(c); err == nil {
			// 验证通过，会继续访问下一个中间件
			c.Next()
		} else {
			// 验证不通过，不再调用后续的函数处理
			c.Abort()
			controllers.Response(c, nil, "Access is not authorized: "+err.Error())
			// return可省略, 只要前面执行Abort()就可以让后面的handler函数不再执行
			return
		}
	}
}

func (m *MiniAppMiddleware) ValidateInit(c *gin.Context) error {
	var req dto.MiniAppInitData
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		log.Logger.Error(err.Error())
		return err
	}
	err := initData.Validate(req.InitData, m.Bot.Token, cfg.WebAppExpIn)
	if err != nil {
		log.Logger.Error("init_data validate error")
		return err
	}
	return nil
}
