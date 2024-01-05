package modules

import (
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	tb "gopkg.in/telebot.v3"
)

var (
	sel = &tb.ReplyMarkup{}
)

// vars
var BOT_USERNAME = b.Me.Username
var BOT_NAME = b.Me.FirstName
var BOT_ID = b.Me.ID
var StartTime = time.Now()
var Client = http.Client{Timeout: time.Second * 10}

// default message
var CNT = []string{"locks", "flood", "filters", "get", "notes", "saved", "adminlist", "info", "warns", "rules", "approval"}
var notes_help = "✨ Here is the help for **Notes:**\n**Command for Members**\n**->** `/get notename`: get the note with this notename\n**-** #notename: same as /get\n**->** `/notes`: list all saved notes in this chat\n**Command for Admins**\n**->** `/save notename notedata`: saves notedata as a note with name notename, reply to a message or document to save it\n**->** `/clear notename`: clear note with this name\n**->** `/privatenote on/yes/off/no`: whether or not to send the note in PM. Write del besides on/off to delete hashtag message on group.\n**Note**\n **-** Only admins can use This module\n **-** To save a document (like photo, audio, etc.), reply to a document or media then type /save\n **-** Need help for parsing text? Check /markdownhelp\nSave data for future users with notes!\nNotes are great to save random tidbits of information; a phone number, a nice gif, a funny picture - anything!\nAlso you can save a text/document with buttons, you can even save it in here."
var help = bson.M{"notes": notes_help}
var help_caption = fmt.Sprintf(`
Hey!, My name is %s.
Welcome to my telegram bot
I have lots of handy features.
So what are you waiting for?
Click the buttons below.`, BOT_NAME)

// The maximum number of characters, upon reaching the number of which the bot starts to stretch the width of the block with buttons:
var MAX_NUMBER_OF_SYMBOL = 200
