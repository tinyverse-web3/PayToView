package bot

import (
	"context"
	"log"
	"strings"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type BotService struct {
	bot *tgbotapi.BotAPI
}

func NewBotService(bottoken string) (*BotService, error) {
	ret := &BotService{}
	err := ret.Init(bottoken)
	if err != nil {
		return nil, err
	}
	return ret, nil
}

func (b *BotService) Init(botToken string) error {
	var err error
	b.bot, err = tgbotapi.NewBotAPI(botToken)
	if err != nil {
		return err
	}
	return nil
}

func (b *BotService) SetDebug(isDebug bool) {
	b.bot.Debug = isDebug
}

func (b *BotService) SetUserName(n string) {
	b.bot.Self.UserName = n
}

func (b *BotService) Run(ctx context.Context, offset int, timeout int) {
	go b.receiveUpdates(ctx, offset, timeout)
}

func (b *BotService) receiveUpdates(ctx context.Context, offset int, timeout int) {
	u := tgbotapi.NewUpdate(offset)
	u.Timeout = timeout

	// `updates` is a channel which receives telegram updates
	updates := b.bot.GetUpdatesChan(u)
	for {
		select {
		// stop looping if ctx is cancelled
		case <-ctx.Done():
			return
		// receive update from channel and then handle it
		case update := <-updates:
			switch {
			// Handle messages
			case update.Message != nil:
				b.handleMessage(update.Message)
			// Handle button clicks
			case update.CallbackQuery != nil:
				b.handleButton(update.CallbackQuery)
			}
		}
	}
}

func (b *BotService) handleMessage(message *tgbotapi.Message) {
	user := message.From
	text := message.Text

	if user == nil {
		return
	}

	// Print to console
	log.Printf("%s wrote %s", user.FirstName, text)

	var err error
	if strings.HasPrefix(text, "/") {
		err = b.handleCommand(message.Chat.ID, text)
	} else if screaming && len(text) > 0 {
		msg := tgbotapi.NewMessage(message.Chat.ID, strings.ToUpper(text))
		// To preserve markdown, we attach entities (bold, italic..)
		msg.Entities = message.Entities
		_, err = b.bot.Send(msg)
	} else {
		// This is equivalent to forwarding, without the sender's name
		copyMsg := tgbotapi.NewCopyMessage(message.Chat.ID, message.Chat.ID, message.MessageID)
		_, err = b.bot.CopyMessage(copyMsg)
	}

	if err != nil {
		log.Printf("An error occured: %s", err.Error())
	}
}

// When we get a command, we react accordingly
func (b *BotService) handleCommand(chatId int64, command string) error {
	var err error

	switch command {
	case "/scream":
		screaming = true
	case "/whisper":
		screaming = false
	case "/menu":
		err = b.sendMenu(chatId)
	}
	return err
}

func (b *BotService) handleButton(query *tgbotapi.CallbackQuery) {
	var text string

	markup := tgbotapi.NewInlineKeyboardMarkup()
	message := query.Message

	if query.Data == nextButton {
		text = secondMenu
		markup = secondMenuMarkup
	} else if query.Data == backButton {
		text = firstMenu
		markup = firstMenuMarkup
	}

	callbackCfg := tgbotapi.NewCallback(query.ID, "")
	b.bot.Send(callbackCfg)

	// Replace menu text and keyboard
	msg := tgbotapi.NewEditMessageTextAndMarkup(message.Chat.ID, message.MessageID, text, markup)
	msg.ParseMode = tgbotapi.ModeHTML
	b.bot.Send(msg)
}

func (b *BotService) sendMenu(chatId int64) error {
	msg := tgbotapi.NewMessage(chatId, firstMenu)
	msg.ParseMode = tgbotapi.ModeHTML
	msg.ReplyMarkup = firstMenuMarkup
	_, err := b.bot.Send(msg)
	return err
}
