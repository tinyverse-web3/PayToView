package ton

const DkvsKeyPrefix = "/paytoview-transfer-service-ton/"
const DkvsKeySuffix = "/summary"

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
