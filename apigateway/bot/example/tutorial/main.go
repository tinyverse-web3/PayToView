package main

import (
	"bufio"
	"context"
	"log"
	"os"

	"github.com/tinyverse-web3/paytoview/apigateway/bot"
)

func main() {
	// Create a new cancellable background context. Calling `cancel()` leads to the cancellation of the context

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)

	botToken := "6691782694:AAF0lRrKyRSzlW--F7gcEhrkK8dn44BrPRg"
	bs, err := bot.NewBotService(botToken)
	if err != nil {
		// Abort if something is wrong
		log.Panic(err)
	}

	// Set this to true to log all interactions with telegram servers
	bs.SetDebug(false)

	// Pass cancellable context to goroutine
	bs.Run(ctx, 0, 60)

	// Tell the user the bot is online
	log.Println("Start listening for updates. Press enter to stop")

	// Wait for a newline symbol, then cancel handling updates
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	cancel()

}
