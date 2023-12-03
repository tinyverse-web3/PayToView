package ton

import (
	"encoding/json"
	"io"
	"math"
	"net/http"
	"time"

	"github.com/tinyverse-web3/transferService/service/common"
)

type TonRateResp struct {
	Rates struct {
		TON struct {
			Prices struct {
				USD float64 `json:"USD"`
			} `json:"prices"`
		} `json:"TON"`
	} `json:"rates"`
}

var (
	tonRateResp          *TonRateResp
	lastFetchTonRateTime time.Time
)

func GetTonToUsdRatio() (float64, error) {
	if tonRateResp != nil && time.Since(lastFetchTonRateTime) < 30*time.Second {
		return tonRateResp.Rates.TON.Prices.USD, nil
	}

	ratesResp, err := http.Get(common.TonGetRatioApiUrl)
	if err != nil {
		logger.Errorf("GetTonToUsdRatio: http.Get error: %v", err)
		return 0, err
	}
	defer ratesResp.Body.Close()

	body, err := io.ReadAll(ratesResp.Body)
	if err != nil {
		logger.Errorf("GetTonToUsdRatio: io.ReadAll error: %v", err)
		return 0, err
	}

	err = json.Unmarshal(body, &tonRateResp)
	if err != nil {
		logger.Errorf("GetTonToUsdRatio: json.Unmarshal error: %v", err)
		return 0, err
	}
	lastFetchTonRateTime = time.Now()
	return tonRateResp.Rates.TON.Prices.USD, nil
}

func Tvs2tonwei(tvs uint64, toUsdRatio float64) int64 {
	usd := float64(tvs) / common.UsdToTvsRatio
	ton := usd / toUsdRatio
	tonwei := ton * common.TonweiBitLen
	return int64(math.Round(tonwei))
}

func Tonwei2tvs(tonwei int64, toUsdRatio float64) uint64 {
	ton := float64(tonwei) / common.TonweiBitLen
	usd := ton * toUsdRatio
	tvs := usd * common.UsdToTvsRatio
	return uint64(math.Round((tvs)))
}
