package util

import (
	"os"
	"path/filepath"
	"strings"
)

func GetRootPath(path string) (string, error) {
	path = strings.Trim(path, " ")
	if path == "" {
		path = "."
	}

	if !filepath.IsAbs(path) {
		defaultRootPath, err := os.Getwd()
		if err != nil {
			return path, err
		}
		path = filepath.Join(defaultRootPath, path)
	}
	if !strings.HasSuffix(path, string(os.PathSeparator)) {
		path += string(os.PathSeparator)
	}
	return path, nil
}
