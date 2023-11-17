package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/tinyverse-web3/paytoview/tvbot/web/controllers"
	"github.com/tinyverse-web3/paytoview/tvbot/web/middleware"
	tb "gopkg.in/telebot.v3"
)

func ServerRouter(r *gin.Engine, bot *tb.Bot) {
	var miniapp controllers.MiniAppController
	var middleware middleware.MiniAppMiddleware
	miniapp.InitBot(bot)
	middleware.InitBot(bot)
	miniappGroup := r.Group("miniapp")
	miniappGroup.Use(middleware.Authorize())
	{
		miniappGroup.POST("/sendMsg", miniapp.SendMessage)
	}
}
