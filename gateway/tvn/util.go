package main

import (
	"os"
	"path/filepath"

	filelock "github.com/MichaelS11/go-file-lock"
)

func getPidFileName(rootPath string) string {
	return rootPath + filepath.Base(os.Args[0]) + ".pid"
}

func lockProcess(rootPath string) (lock *filelock.LockHandle, pidFileName string) {
	pidFileName = getPidFileName(rootPath)
	lock, err := filelock.New(pidFileName)
	logger.Infof("tvnode->main: PID: %v", os.Getpid())
	if err == filelock.ErrFileIsBeingUsed {
		logger.Fatalf("tvnode->main: pid file is being locked: %v", err)
	}
	if err != nil {
		logger.Fatalf("tvnode->main: pid file lock error: %v", err)
	}
	return lock, pidFileName
}
