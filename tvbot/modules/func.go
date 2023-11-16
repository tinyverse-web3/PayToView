package modules

import (
	"fmt"
	"regexp"
	"strings"

	bot "github.com/tinyverse-web3/paytoview/tvbot"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

var (
	b        = bot.Bot
	BOT_SUDO = []int{}
	upvote   = sel.Data("upvoteing", "thumbs_up")
	downvote = sel.Data("downvoteing", "thumbs_down")
)

var (
	cmdRx_exclam = regexp.MustCompile(`^(!\w+)(@(\w+))?(\s|$)(.+)?`)
	cmdRx_quest  = regexp.MustCompile(`^(\?\w+)(@(\w+))?(\s|$)(.+)?`)
)

func ConnectFunc(next tb.HandlerFunc) tb.HandlerFunc {
	return func(c tb.Context) error {
		if c.Message().Private() {
			return next(ChatContext(c))
		}
		return next(c)
	}
}

func check(err error) {
	if err != nil {
		log.Logger.Errorf("error: %v", err)
	}
}

func checkWorkId(c tb.Context, workId string) (*WorkInfo, error) {
	wi := getWorkInfo(workId)
	if wi == nil {
		log.Logger.Errorf("failed to find work %s in tvn", workId)
		c.Respond(&tb.CallbackResponse{Text: fmt.Sprintf("Failed to find work %s in tvn", workId), ShowAlert: true})
		return nil, fmt.Errorf("failed to find work %s in tvn", workId)
	}
	return wi, nil
}

func AddPayload(c tb.Context) tb.Context {
	var match [][]string
	if strings.HasPrefix(c.Text(), "!") {
		match = cmdRx_exclam.FindAllStringSubmatch(c.Text(), -1)
	} else if strings.HasPrefix(c.Text(), "?") {
		match = cmdRx_quest.FindAllStringSubmatch(c.Text(), -1)
	}
	if match != nil {
		botName := match[0][3]
		if botName != "" && !strings.EqualFold(b.Me.Username, botName) {
			return nil
		}
		Payload := match[0][5]
		s := c.Bot().NewContext(tb.Update{ID: c.Message().ID,
			Message: &tb.Message{
				Sender:      c.Sender(),
				SenderChat:  c.Message().SenderChat,
				Chat:        c.Message().Chat,
				Payload:     Payload,
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
		if c.Message().Private() {
			return ChatContext(s)
		}
		return s
	}
	if c.Message().Private() {
		return ChatContext(c)
	}
	return c
}

func IsStringEmpty(str string) bool {
	return len(str) == 0
}

// FormatTextToEqualBlockWidth 根据指定的最大字符数将字符串格式化为等宽文本块
func FormatTextToEqualBlockWidth(input string, maxNumberOfSymbol int) string {
	// 特殊的零宽连接器，用于避免截断文本
	nullSeparator := "&#x200D"

	// 分割输入字符串并将其格式化为等宽文本块
	var resultStringArray []string
	for len(input) > 0 {
		// 获取输入字符串中不超过最大字符数的子字符串
		partOfString := input
		if len(input) > maxNumberOfSymbol {
			partOfString = input[:maxNumberOfSymbol]
		}

		// 在子字符串中查找最后一个空格以在其左侧添加空格和换行符
		positionOfCarriageReturn := maxNumberOfSymbol
		if len(input) < maxNumberOfSymbol {
			positionOfCarriageReturn = len(input)
		} else {
			positionOfCarriageReturn = strings.LastIndex(partOfString, " ")
		}

		if positionOfCarriageReturn == -1 {
			positionOfCarriageReturn = len(partOfString)
		}

		// 在子字符串末尾添加空格和换行符
		partOfString = partOfString[:positionOfCarriageReturn]
		partOfString = partOfString + strings.Repeat(" ", maxNumberOfSymbol-len(partOfString)) + nullSeparator

		// 添加到字符串数组中
		resultStringArray = append(resultStringArray, "<pre>"+partOfString+"</pre>")

		// 更新输入字符串以继续处理剩余部分
		input = input[positionOfCarriageReturn:]
	}

	// 将格式化后的字符串作为等宽文本块返回
	return strings.Join(resultStringArray, "\n")
}
