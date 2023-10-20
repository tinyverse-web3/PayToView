package util

import (
	"encoding/json"
	"io"
)

func ParseJsonForm(reader io.Reader, ret map[string]string) error {
	body, err := io.ReadAll(reader)
	if err != nil {
		return err
	}
	err = json.Unmarshal(body, &ret)
	if err != nil {
		return err
	}
	return nil
}
