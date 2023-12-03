package eth

import (
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"
)

func ParseCommmentFromTxData(txDataHex string) (string, error) {
	const prefix = "0x"
	if strings.HasPrefix(strings.ToLower(txDataHex), prefix) {
		txDataHex = txDataHex[len(prefix):]
	}
	bigInt := new(big.Int)
	_, success := bigInt.SetString(txDataHex, 16)
	if !success {
		return "", fmt.Errorf("eth->ParseTxDataCommment: can not convert txDataHex to bigInt")
	}

	byteArr, err := hex.DecodeString(fmt.Sprintf("%x", bigInt))
	if err != nil {
		return "", fmt.Errorf("eth->ParseTxDataCommment: can not decode hexStr")
	}
	return string(byteArr), nil
}
