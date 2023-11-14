package start

import (
	"net/http"

	"github.com/gin-gonic/gin"
	routers "github.com/tinyverse-web3/paytoview/tvbot/web/routes"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

//var wg sync.WaitGroup // 协程

// @title Bot Web Server
// @version 1.0
func Run(port string, bot *tb.Bot) {

	log.Logger.Info("Bot Web Server Run")

	log.Logger.Info("Init gin ...")
	r := gin.Default()
	r.Use(cors())

	gin.SetMode(gin.ReleaseMode)
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		log.Logger.Info("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
	}
	routers.ServerRouter(r, bot) //init routers
	log.Logger.Info("start Bot Web server...")
	go r.Run(":" + port)
}

// 跨域
func cors() gin.HandlerFunc {
	return func(context *gin.Context) {
		method := context.Request.Method

		context.Header("Access-Control-Allow-Origin", "*")
		context.Header("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token, x-token")
		context.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PATCH, PUT")
		context.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
		context.Header("Access-Control-Allow-Credentials", "true")

		if method == "OPTIONS" {
			context.AbortWithStatus(http.StatusNoContent)
		}
	}
}
