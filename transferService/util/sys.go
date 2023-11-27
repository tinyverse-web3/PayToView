package util

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

func HandleInterrupt() {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)

	<-sig

	fmt.Print("Program has been interrupted")
	os.Exit(-1)
}
