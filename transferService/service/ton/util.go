package ton

import (
	"encoding/json"
	"io"
	"net/http"
	"time"
)

func GetInitInfoKey(accountPk string) string {
	return "/paytoview-transfer-service-ton/" + accountPk + "/summary"
}

func GetTxDbKeyPrefix(txTransferState int) string {
	prefix := txInitPrefix
	switch txTransferState {
	case TxTransferInitState:
		prefix = txInitPrefix
	case TxTransferFailState:
		prefix = txFailPrefix
	case TxTransferSuccState:
		prefix = txSuccPrefix
	}
	return prefix
}

type TonRatesResponse struct {
	Rates struct {
		TON struct {
			Prices struct {
				USD float64 `json:"USD"`
			} `json:"prices"`
		} `json:"TON"`
	} `json:"rates"`
}

var ratesResponse *TonRatesResponse
var lastFetchTime time.Time

func GetTonValueForUSD() (float64, error) {
	if ratesResponse != nil && time.Since(lastFetchTime) < 3*time.Minute {
		return ratesResponse.Rates.TON.Prices.USD, nil
	}

	url := "https://tonapi.io/v2/rates?tokens=ton&currencies=ton%2Cusd%2Crub"
	ratesResp, err := http.Get(url)
	if err != nil {
		logger.Errorf("getTonValueForUSD: http.Get error: %v", err)
		return 0, err
	}
	defer ratesResp.Body.Close()

	body, err := io.ReadAll(ratesResp.Body)
	if err != nil {
		logger.Errorf("getTonValueForUSD: io.ReadAll error: %v", err)
		return 0, err
	}

	err = json.Unmarshal(body, &ratesResponse)
	if err != nil {
		logger.Errorf("getTonValueForUSD: json.Unmarshal error: %v", err)
		return 0, err
	}
	lastFetchTime = time.Now()
	return ratesResponse.Rates.TON.Prices.USD, nil
}
