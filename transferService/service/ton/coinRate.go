package ton

import (
	"encoding/json"
	"io"
	"net/http"
	"time"
)

type TonRatesResponse struct {
	Rates struct {
		TON struct {
			Prices struct {
				USD float64 `json:"USD"`
			} `json:"prices"`
		} `json:"TON"`
	} `json:"rates"`
}

const weitonLen = 1000000000

var ratesResponse *TonRatesResponse
var lastFetchTime time.Time

func GetTonToUsdRatio() (float64, error) {
	if ratesResponse != nil && time.Since(lastFetchTime) < 30*time.Second {
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

func CalcWeitonAmount(tvsAmount, tonToUsdRatio, usdToTonRatio float64) float64 {
	usdAmount := tvsAmount / usdToTonRatio
	tonAmount := usdAmount / tonToUsdRatio
	weitonAmount := tonAmount * weitonLen
	return weitonAmount
}

func CalTvsAmount(weitonAmount, tonToUsdRatio, usdToTonRatio float64) float64 {
	tonAmount := weitonAmount / weitonLen
	usdAmount := tonAmount * tonToUsdRatio
	tvsAmount := usdAmount * usdToTonRatio
	return tvsAmount
}
