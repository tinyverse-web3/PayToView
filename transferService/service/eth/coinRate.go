package eth

import (
	"encoding/json"
	"io"
	"math"
	"net/http"
	"time"

	"github.com/tinyverse-web3/transferService/service/common"
)

type EthRateResp struct {
	Data struct {
		Amount float64 `json:"amount"`
	} `json:"data"`
}

var (
	ethRateResp          *EthRateResp
	lastFetchEthRateTime time.Time
)

func GetEthToUsdRatio() (float64, error) {
	if ethRateResp != nil && time.Since(lastFetchEthRateTime) < 30*time.Second {
		return ethRateResp.Data.Amount, nil
	}

	ratesResp, err := http.Get(common.EthGetRatioApiUrl)
	if err != nil {
		logger.Errorf("GetEthToUsdRatio: http.Get error: %v", err)
		return 0, err
	}
	defer ratesResp.Body.Close()

	body, err := io.ReadAll(ratesResp.Body)
	if err != nil {
		logger.Errorf("GetEthToUsdRatio: io.ReadAll error: %v", err)
		return 0, err
	}

	err = json.Unmarshal(body, &ethRateResp)
	if err != nil {
		logger.Errorf("GetEthToUsdRatio: json.Unmarshal error: %v", err)
		return 0, err
	}
	lastFetchEthRateTime = time.Now()
	return ethRateResp.Data.Amount, nil
}

func Tvs2eth(tvs uint64, toUsdRatio float64) float64 {
	usd := float64(tvs) / common.UsdToTvsRatio
	eth := usd / toUsdRatio
	return eth
}

func Eth2tvs(eth float64, toUsdRatio float64) uint64 {
	usd := eth * toUsdRatio
	tvs := usd * common.UsdToTvsRatio
	return uint64(math.Round(tvs))
}

func Ethwei2tvs(ethwei uint64, toUsdRatio float64) uint64 {
	eth := float64(ethwei) / common.EthweiBitLen
	usd := eth * toUsdRatio
	tvs := usd * common.UsdToTvsRatio
	return uint64(math.Round(tvs))
}

func Tvs2ethwei(tvs uint64, toUsdRatio float64) uint64 {
	usd := float64(tvs) / common.UsdToTvsRatio
	eth := usd / toUsdRatio
	ethwei := eth * common.EthweiBitLen
	return uint64(math.Round(ethwei))
}
