package common

const (
	TonweiBitLen      = 1000000000
	TonGetRatioApiUrl = "https://tonapi.io/v2/rates?tokens=ton&currencies=ton%2Cusd%2Crub"

	EthweiBitLen      = 1000000000000000000
	EthGetRatioApiUrl = "https://api.coinbase.com/v2/prices/ETH-USD/spot"
)

var (
	UsdToTvsRatio float64 = 1000
)
