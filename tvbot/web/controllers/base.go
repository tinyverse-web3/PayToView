package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	mtvHttp "github.com/tinyverse-web3/mtv_go_utils/http"
)

func Response(c *gin.Context, data interface{}, msg string) {
	var res mtvHttp.RespJson
	if msg != "" {
		res = mtvHttp.ErrorJson("400000", msg)
	} else {
		res = mtvHttp.SuccessJson(data)
	}
	c.JSONP(http.StatusOK, res)
}
