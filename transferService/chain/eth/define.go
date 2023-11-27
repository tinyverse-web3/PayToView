package eth

const (
	SepoliaEtherScanRpc = "https://api-sepolia.etherscan.io/api"
	MainnetEtherScanRpc = "https://api.etherscan.io/api"
	MaxTxCount          = 10000
)

type AcountTxListResp struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  []Tx   `json:"result"`
}

type Tx struct {
	BlockNumber       string `json:"blockNumber"` // The unique identifier of the transaction block. The time sequence of the transaction and other information of the block can be traced through the block number.
	TimeStamp         string `json:"timeStamp"`
	Hash              string `json:"hash"` // Transaction unique identifier, transaction hash is generated by hashing the transaction content.
	Nonce             string `json:"nonce"`
	BlockHash         string `json:"blockHash"`        // Generated by hashing the entire block content. Verify the location of the transaction in the block and the integrity of the block
	TransactionIndex  string `json:"transactionIndex"` //The exchange is at the block index position. Start from 0
	From              string `json:"from"`
	To                string `json:"to"`
	Value             string `json:"value"`
	Gas               string `json:"gas"`
	GasPrice          string `json:"gasPrice"`
	IsError           string `json:"isError"`
	TxReceiptStatus   string `json:"txreceipt_status"`
	Input             string `json:"input"`
	ContractAddress   string `json:"contractAddress"`
	CumulativeGasUsed string `json:"cumulativeGasUsed"`
	GasUsed           string `json:"gasUsed"`
	Confirmations     string `json:"confirmations"`
	MethodId          string `json:"methodId"`
	FunctionName      string `json:"functionName"`
}

type AcountBalanceResp struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  string `json:"result"`
}
