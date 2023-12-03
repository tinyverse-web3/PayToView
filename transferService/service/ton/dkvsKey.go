package ton

const (
	SummaryInfoKeyPrefix = "/paytoview-transfer-service-ton/"
	SummaryInfoKeySuffix = "/summary"

	txBasicPrefix  = "/ton/transfer/"
	txInitPrefix   = txBasicPrefix + "init/"
	txFailPrefix   = txBasicPrefix + "fail/"
	txSuccPrefix   = txBasicPrefix + "succ/"
	txExceptPrefix = txBasicPrefix + "except/"
)

func GetSummaryInfoKey(accountPk string) string {
	return SummaryInfoKeyPrefix + accountPk + "DkvsKeySuffix"
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
