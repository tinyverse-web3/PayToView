package ton

const (
	DkvsKeyPrefix = "/paytoview-transfer-service-ton/"
	DkvsKeySuffix = "/summary"

	txBasicPrefix  = "/ton/transfer/"
	txInitPrefix   = txBasicPrefix + "init/"
	txFailPrefix   = txBasicPrefix + "fail/"
	txSuccPrefix   = txBasicPrefix + "succ/"
	txExceptPrefix = txBasicPrefix + "except/"
)

func GetInitInfoKey(accountPk string) string {
	return DkvsKeyPrefix + accountPk + "DkvsKeySuffix"
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
