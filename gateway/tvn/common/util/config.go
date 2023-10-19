package util

import (
	"encoding/json"
	"os"
)

func LoadConfig(cfg any, path string) error {
	if path != "" {
		f, err := os.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()

		d := json.NewDecoder(f)
		err = d.Decode(&cfg)
		if err != nil {
			return err
		}
	}
	return nil
}
