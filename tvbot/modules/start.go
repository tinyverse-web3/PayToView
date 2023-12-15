package modules

import (
	"fmt"
	"strconv"

	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

var (
	menu           = &tb.ReplyMarkup{}
	pay_to_view    = menu.Data("Pay to view", "p2v")
	points_payment = menu.Data("Points payment", "pp")
)

func Start(c tb.Context) error {
	m := c.Message()
	userId := strconv.FormatInt(c.Sender().ID, 10)
	userId = userId + "15" // for test
	isExist := checkUserExists(userId)
	if m.Private() && isExist {
		showBotView(c)
		return nil
	}
	if m.Private() && !isExist {
		showCreateAccountView(c)
		return nil
	}
	b.Reply(m, "Hey I'm TVS bot.")
	return nil
}

func showCreateAccountView(c tb.Context) {
	//menu = &tb.ReplyMarkup{}
	//userId := strconv.FormatInt(c.Sender().ID, 10)
	m := c.Message()
	menu.Inline(
		menu.Row(
			menu.WebApp(
				"Create Account",
				&tb.WebApp{URL: "https://p2v.tinyverse.space/#/"})), //主页即创建账号
		menu.Row(
			menu.URL("Help", "https://tinyverse.space/"),
		),
	)
	_, err := b.Send(m.Sender, fmt.Sprintf("Hey there! I am <b>%s</b>.\nIm an Tinverse Space Bot, you can call me anytime by click the buttons below! ", BOT_NAME), menu)
	if err != nil {
		log.Logger.Error(err)
	}
}

func showBotView(c tb.Context) {
	startPayload := c.Message().Payload
	queryMap := parseParameters(startPayload) //The parameter can be up to 64 characters long
	log.Logger.Infof("queryMap = %+v", queryMap)
	cmd := queryMap["cmd"]
	switch cmd {
	case "fwd": //forward
		showWorkView(c)
	case "cp": //Complete payment
		showRechargeCompletedView(c)
	default:
		showBotMainView(c)
	}
}

func showBotMainView(c tb.Context) {
	userId := strconv.FormatInt(c.Sender().ID, 10)
	userId = userId + "15" // for test
	ai := getAccountInfo(userId)
	var accountInfo = "<b>TVN wallet account address:      </b><i>%s</i>\n\n<b>TVN points balance:                        </b><i>%s</i>\n\n<b>Total revenue (last 24 hours):      </b><i>%s</i>"
	accountInfoStr := fmt.Sprintf(accountInfo, ai.Address, ai.Balance, ai.Income)
	//menu = &tb.ReplyMarkup{}
	menu.Inline(
		menu.Row(menu.WebApp("New Content", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/publish", //发布新内容
		})),
		menu.Row(menu.WebApp("Earnings", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/earn", //收益
		}), menu.WebApp("Published", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/published", //已发布列表
		})),
		menu.Row(menu.WebApp("Paid", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/paid", //已付费列表
		}), menu.WebApp("Forwarded", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/forwarded", //转发列表
		})),
		menu.Row(menu.WebApp("Home", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/", //收益
		})),
	)
	_, err := b.Send(c.Message().Sender, accountInfoStr, menu)
	if err != nil {
		log.Logger.Error(err)
	}
}

// func genKeyboardButton(userId string) {
// 	reply_button.Reply(reply_button.Row(reply_button.WebApp("Create Account", &tb.WebApp{
// 		URL: fmt.Sprintf("https://192.168.1.103:5173/#/?user=%s", userId),
// 	})))
// }

func showWorkView(c tb.Context) {
	userId := strconv.FormatInt(c.Sender().ID, 10)
	userId = userId + "15" // for test
	startPayload := c.Message().Payload
	queryMap := parseParameters(startPayload)
	workId := queryMap["work_id"]
	wi, err := checkWorkId(c, workId)
	if err != nil {
		return
	}

	var workDesInfo = "<b>Title:      </b><i>%s</i>\n<b>Description:      </b><i>%s</i>\n<b>Creteor:                        </b><i>%s</i>\n<b>Fee:      </b><i>%s</i>\n<b>Share ratio:      </b><i>%s</i>"
	workDescInfoStr := fmt.Sprintf(workDesInfo, wi.Title, wi.Description, wi.Creator, wi.Fee, wi.ShareRatio)

	p := &tb.Photo{
		File:    tb.FromURL(wi.ImageUrl),
		Caption: workDescInfoStr,
	}

	queryText := fmt.Sprintf("cmd=fwd&work_id=%s", workId)
	encodeQueryText := encodeParameters(queryText)
	var viewButton tb.Btn
	//menu = &tb.ReplyMarkup{}
	//Pay or not
	if isPaid(userId, workId) { //Paid
		urlParam := fmt.Sprintf("https://p2v.tinyverse.space/#/detail/view?contract=%s", workId)
		viewButton = menu.WebApp("View", &tb.WebApp{URL: urlParam})
	} else { //no payment
		// workIdStr := fmt.Sprintf("work_id=%s", wi.Id)
		// pay_to_view.Data = workIdStr
		// log.Logger.Infof("workIdStr: %s", workIdStr)
		// viewButton = pay_to_view

		//change jump to miniapp pay page
		urlParam := fmt.Sprintf("https://p2v.tinyverse.space/#/detail?contract=%s", workId)
		viewButton = menu.WebApp("View", &tb.WebApp{URL: urlParam})
	}
	menu.Inline(
		menu.Row(
			menu.Query("Forward", encodeQueryText),
			viewButton))
	_, err = b.Send(c.Message().Sender, p, menu)
	if err != nil {
		log.Logger.Error(err)
	}
}

// func PayToViewButtonTap(c tb.Context) error {
// 	userId := strconv.FormatInt(c.Sender().ID, 10)
// 	userId = userId + "15" // for test
// 	callbackData := c.Callback().Data
// 	queryMap := parseParameters(callbackData)
// 	workId := queryMap["work_id"]
// 	wi, err := checkWorkId(c, workId)
// 	if err != nil {
// 		return nil
// 	}
// 	//menu = &tb.ReplyMarkup{}
// 	if pointsIsSufficient(userId, wi.Id) {
// 		menu.Inline(menu.Row(menu.WebApp("Points payment", &tb.WebApp{
// 			URL: fmt.Sprintf("https://p2v.tinyverse.space/#/detail?contract=%s", wi.Id)})))
// 	} else {
// 		points_payment.Data = callbackData
// 		menu.Inline(menu.Row(points_payment))
// 	}
// 	err = c.Edit(menu)
// 	if err != nil {
// 		log.Logger.Error(err)
// 	}
// 	return nil
// }

func PayToViewButtonTap(c tb.Context) error {
	userId := strconv.FormatInt(c.Sender().ID, 10)
	userId = userId + "15" // for test
	callbackData := c.Callback().Data
	queryMap := parseInlineQueryArgs(callbackData)
	workId := queryMap["work_id"]
	wi, err := checkWorkId(c, workId)
	if err != nil {
		return nil
	}
	//menu = &tb.ReplyMarkup{}
	if pointsIsSufficient(userId, wi.Id) {
		menu.Inline(menu.Row(menu.WebApp("Points payment", &tb.WebApp{
			URL: fmt.Sprintf("https://p2v.tinyverse.space/#/detail?contract=%s", wi.Id)})))
	} else {
		menu.Inline(menu.Row(menu.WebApp("Points payment", &tb.WebApp{
			URL: "https://p2v.tinyverse.space/#/topup"})))
	}
	err = c.Edit(menu)
	if err != nil {
		log.Logger.Error(err)
	}
	return nil
}

// paid view not doing it yet
func PointsPaymentButtonTap(c tb.Context) error {
	callbackData := c.Callback().Data
	queryMap := parseInlineQueryArgs(callbackData)
	workId := queryMap["work_id"]
	wi, err := checkWorkId(c, workId)
	if err != nil {
		return nil
	}
	var workDesInfo = "<b>Title:      </b><i>%s</i>\n<b>Description:      </b><i>%s</i>\n<b>Creteor:                        </b><i>%s</i>\n<b>Fee:      </b><i>%s</i>\n<b>Share ratio:      </b><i>%s</i>"
	workDescInfoStr := fmt.Sprintf(workDesInfo, wi.Title, wi.Description, wi.Creator, wi.Fee, wi.ShareRatio)
	var paymentDesc = fmt.Sprintf("%s\n\n<b>Here is an explanation of what TVS is and its exchange ratio with other Tokens and etc. </b>", workDescInfoStr)
	//menu = &tb.ReplyMarkup{}
	menu.Inline(
		menu.Row(menu.WebApp("Wallet Pay", &tb.WebApp{
			URL: fmt.Sprintf("https://p2v.tinyverse.space/#/?user=%s", wi.Id)})),
		menu.Row(menu.WebApp("Ton Connect", &tb.WebApp{
			URL: fmt.Sprintf("https://p2v.tinyverse.space/#/?user=%s", "test")})),
	)
	err = c.EditCaption(paymentDesc, menu)
	if err != nil {
		log.Logger.Error(err)
		return err
	}
	return nil
}

func showRechargeCompletedView(c tb.Context) {
	startPayload := c.Message().Payload
	queryMap := parseParameters(startPayload)
	workId := queryMap["work_id"]
	wi, err := checkWorkId(c, workId)
	if err != nil {
		return
	}
	//menu = &tb.ReplyMarkup{}
	caption := "Payment completed, you can now watch the content, or repost and earn a share of the fees."
	var workDesInfo = "%s\n\n<b>Title:      </b><i>%s</i>\n<b>Description:      </b><i>%s</i>\n<b>Creteor:                        </b><i>%s</i>\n<b>Fee:      </b><i>%s</i>\n<b>Share ratio:      </b><i>%s</i>"
	workDescInfoStr := fmt.Sprintf(workDesInfo, caption, wi.Title, wi.Description, wi.Creator, wi.Fee, wi.ShareRatio)

	p := &tb.Photo{
		File:    tb.FromURL(wi.ImageUrl),
		Caption: workDescInfoStr,
	}

	queryText := fmt.Sprintf("cmd=fwd&work_id=%s", workId)
	encodeQueryText := encodeParameters(queryText)
	viewButton := menu.WebApp("View", &tb.WebApp{
		URL: fmt.Sprintf("https://p2v.tinyverse.space/#/?user=%s", "test")})
	menu.Inline(
		menu.Row(
			menu.Query("Forward", encodeQueryText),
			viewButton))
	_, err = b.Send(c.Message().Sender, p, menu)
	if err != nil {
		log.Logger.Error(err)
	}
}
