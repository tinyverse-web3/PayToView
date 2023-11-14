package modules

import (
	"encoding/base64"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/microcosm-cc/bluemonday"
	log "github.com/tinyverse-web3/tinyverse_sdk/tinyverse/log"
	tb "gopkg.in/telebot.v3"
)

type User struct {
	ID       int64
	Username string
	First    string
	Last     string
	Full     string
	DC       int64
	Mention  string
	Error    string
	Giga     bool
	Type     string
}

func parseInlineQueryArgs(queryArgs string) map[string]string {
	// URL-encoded string
	//queryArgs := "id=324234&title=xyz&userName=jack"

	// Parse the URL-encoded string into a Values type
	values, err := url.ParseQuery(queryArgs)
	if err != nil {
		fmt.Printf("Error parsing URL-encoded string: %v\n", err)
		return nil
	}

	// Convert Values to a map[string]string
	keyValueMap := make(map[string]string)
	for key, values := range values {
		if len(values) > 0 {
			keyValueMap[key] = values[0]
		}
	}
	return keyValueMap
}

func encodeParameters(s string) string {
	originalBytes := []byte(s)
	base64URL := base64.URLEncoding.EncodeToString(originalBytes)
	return base64URL
}

func parseParameters(s string) map[string]string {
	decodedBytes, err := base64.URLEncoding.DecodeString(s)
	if err != nil {
		log.Logger.Errorf("Error decoding: %v\n", err)
		return nil
	}
	decodedString := string(decodedBytes)
	return parseInlineQueryArgs(decodedString)
}

func EscapeHTML(s string) string {
	for x, y := range map[string]string{"<": "&lt;", ">": "&gt;", "&": "&amp;"} {
		s = strings.ReplaceAll(s, x, y)
	}
	return s
}

func GetMention(id int64, name string) string {
	return fmt.Sprintf("<a href='tg://user?id=%d'>%s</a>", id, EscapeHTML(name))
}

func GetObj(c tb.Context) (interface{}, string, error) {
	if c.Message().IsReply() {
		user := c.Message().ReplyTo.Sender
		if user.ID == int64(136817688) {
			user := c.Message().ReplyTo.SenderChat
			return *user, c.Message().Payload, nil
		}
		return *user, c.Message().Payload, nil
	} else if c.Message().Payload != string("") {
		Args := strings.SplitN(c.Message().Payload, " ", 1)
		if isInt(Args[0]) {
			id, _ := strconv.ParseInt(Args[0], 10, 64)
			user, err := c.Bot().ChatByID(id)
			if err != nil {
				return nil, "", err
			}
			if len(Args) > 1 {
				return *user, Args[1], err
			} else {
				return *user, "", err
			}

		} else {
			if len(Args) > 1 {
				return Args[0], Args[1], nil
			} else {
				return Args[0], "", nil
			}
		}
	} else {
		return nil, "", fmt.Errorf("you dont seem to be referring to a user or the ID specified is incorrect")
	}
}

func GetForwardID(c tb.Context) (int64, string, string) {
	Message := c.Message().ReplyTo
	var ID int64
	var FirstName string
	var Type = "user"
	if Message.OriginalSender != nil {
		if Message.OriginalSender.ID != 0 {
			ID = Message.OriginalSender.ID
		}
		if Message.OriginalSender.FirstName != string("") {
			FirstName = Message.OriginalSender.FirstName
		}
	} else if Message.OriginalChat != nil {
		if Message.OriginalChat.ID != 0 {
			ID = Message.OriginalChat.ID
		}
		if Message.OriginalChat.Title != string("") {
			FirstName = Message.OriginalChat.Title
		}
		Type = "chat"
	} else if Message.OriginalSignature != string("") {
		FirstName = Message.OriginalSignature
	} else if Message.OriginalSenderName != string("") {
		FirstName = Message.OriginalSenderName
	}
	return ID, FirstName, Type
}

func GetArgs(c tb.Context) string {
	if c.Message().IsReply() {
		if c.Message().ReplyTo.Text != "" {
			return c.Message().ReplyTo.Text
		} else {
			return c.Message().ReplyTo.Caption
		}
	} else {
		Args := strings.SplitN(c.Message().Text, " ", 2)
		if len(Args) > 1 {
			return Args[1]
		}
	}
	return ""
}

func FormatString(s string) string {
	p := bluemonday.StripTagsPolicy()
	return p.Sanitize(s)
}

func GetUser(c tb.Context) (User, string) {
	Obj, Payload, err := GetObj(c)
	if err != nil {
		c.Reply(err.Error())
		return User{}, ""
	}
	var user User
	switch Obj := Obj.(type) {
	case tb.User:
		user = User{
			ID:       Obj.ID,
			Username: "@" + Obj.Username,
			First:    EscapeHTML(Obj.FirstName),
			Last:     EscapeHTML(Obj.LastName),
			DC:       0,
			Mention:  GetMention(Obj.ID, Obj.FirstName),
			Giga:     false,
			Type:     "user",
		}
	case tb.Chat:
		if Obj.Title != string("") {
			user = User{
				ID:       Obj.ID,
				Username: "@" + Obj.Username,
				First:    EscapeHTML(Obj.Title),
				DC:       0,
				Mention:  EscapeHTML(Obj.Title),
				Giga:     false,
				Type:     "chat",
			}
		} else {
			user = User{
				ID:       Obj.ID,
				Username: "@" + Obj.Username,
				First:    EscapeHTML(Obj.FirstName),
				Last:     EscapeHTML(Obj.LastName),
				DC:       0,
				Mention:  GetMention(Obj.ID, Obj.FirstName),
				Giga:     false,
				Type:     "user",
			}
		}
	case string:
		//user = ResolveUsername(Obj)
	}
	if user.Error != string("") {
		c.Reply(user.Error)
		return User{}, ""
	}
	return user, Payload

}
