package ton

import (
	"context"
	"encoding/base64"
	"net/url"
	"testing"

	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/stretchr/testify/require"
	"github.com/tinyverse-web3/transferService/adnl/core"
	"github.com/tonkeeper/tongo/abi"
	"github.com/tonkeeper/tongo/boc"
	"github.com/tonkeeper/tongo/tlb"
)

func TestBocMessage(t *testing.T) {
	bocStr := "b5ee9c720101010100660000c80000000074767377616c6c65743d303830313132323033643366313261323533366539393963343066346436623338353430386463663730623531623630323664353439326233303134346264646134383438353665266170703d706179546f56696577"
	c, err := boc.DeserializeSinglRootBase64(bocStr)
	if err != nil {
		cells, err := boc.DeserializeBocHex(bocStr)
		if err != nil {
			t.Errorf("boc.DeserializeBocHex() error: %v", err)
		}
		c = cells[0]
	}

	var m abi.JettonBurnMsgBody
	err = tlb.Unmarshal(c, &m)
	if err != nil {
		t.Errorf("boc error: %v", err)
	}
	t.Logf("Message: %+v\n", m.Amount)
	require.NotEqual(t, 0, m.Amount)
}

func TestAccount(t *testing.T) {
	ipfsLog.SetLogLevelRegex(logName, "debug")
	tonAccount := NewAccount()
	err := tonAccount.SetNet(false) // prod: false dev: true
	if err != nil {
		logger.Fatalf("tonAccount.SetNet error: %v", err)
	}

	err = tonAccount.SetAccountID("0:7e1f3e95d662bf7cdffc3b930379dae6aaf84ffaf2ec2111548bbec79c8f393b")
	if err != nil {
		logger.Fatalf("tonAccount.SetAccountID error: %v", err)
	}

	err = tonAccount.SetLog(true, "./log/")
	if err != nil {
		logger.Fatalf("tonAccount.SetLog error: %v", err)
	}

	logger.Infof(
		"Account info\nraw address: %v\nmainnet human address: bounce: %v, nohounce: %v\ntestnet human address: bounce: %v, nohounce: %v",
		tonAccount.ToRaw(),
		tonAccount.ToHuman(true, false), tonAccount.ToHuman(false, false),
		tonAccount.ToHuman(true, true), tonAccount.ToHuman(false, true),
	)

	ctx := context.Background()
	state, err := tonAccount.GetState(ctx)
	if err != nil {
		logger.Errorf("tonAccount.GetState error: %v", err)
	}

	lastTransHashStr, _ := state.LastTransHash.MarshalJSON()
	logger.Infof("state:\nstate.LastTransHash:%+v\nstate.LastTransLt:%+v\nstate.Account.Status:%+v",
		string(lastTransHashStr), state.LastTransLt, state.Account.Status())

	status, err := tonAccount.GetStatus(ctx)
	if err != nil {
		logger.Errorf("tonAccount.GetStatus error: %v", err)
	}
	balance, err := tonAccount.GetBalance(ctx)
	if err != nil {
		logger.Errorf("tonAccount.GetBalance error: %v", err)
	}
	logger.Infof("Account status: %v Balance: %v", status, balance)

	lastTransLt, err := tonAccount.GetLastTransLt(ctx)
	if err != nil {
		logger.Errorf("tonAccount.GetLastTransLt error: %v", err)
	}
	logger.Infof("LastTransLt: %v", lastTransLt)

	lastTransHash, err := tonAccount.GetLastTransHash(ctx)
	if err != nil {
		logger.Errorf("tonAccount.GetLastTransHash error: %v", err)
	}
	logger.Infof("LastTransHash: %v", lastTransHash.Hex())

	seqno, err := tonAccount.GetContractSeqno(ctx)
	if err != nil {
		logger.Errorf("Get seqno error: %v", err)
	} else {
		logger.Infof("Seqno: %v\n", seqno)
	}

	const maxRetryCount = 10
	const maxTxCount = 1000
	transactions, err := tonAccount.TryGetAllTxList(ctx, maxTxCount, maxRetryCount)
	if err != nil {
		logger.Fatalf("tonAccount.GetLastTransactions error: %v", err)
	}
	logger.Infof("Transactions len: %v", len(transactions))

	validedTxCount := 0
	for index := 0; index < len(transactions); index++ {
		transaction := transactions[index]
		// logger.Infof("index:%d,Transaction: %v", i, transaction)
		coreTx, err := core.ConvertTransaction(0, transaction)
		if err != nil {
			logger.Errorf("ConvertTransaction error: %v", err)
			continue
		}

		logger.Infof("tx: index: %d\nTrans: HashHex:%+v, HashBase64:%+v, Lt:%+v\nPrevTrans: HashHex:%+v, HashBase64:%+v, Lt:%+v\nBlockID: Workchain:%+v,Shard:%X,Seqno:%+v\nInMsg Value:%+v",
			index,
			coreTx.Hash.Hex(),
			base64.StdEncoding.EncodeToString([]byte(coreTx.Hash[:])),
			coreTx.Lt,
			coreTx.PrevTransHash.Hex(),
			base64.StdEncoding.EncodeToString([]byte(coreTx.PrevTransHash[:])),
			coreTx.PrevTransLt,
			coreTx.BlockID.Workchain,
			coreTx.BlockID.Shard,
			coreTx.BlockID.Seqno,
			coreTx.InMsg.Value,
		)

		if !isValidTx(coreTx) {
			logger.Error("isValidTx error: coreTx is invalid")
			continue
		} else {
			validedTxCount++
		}
		payload, err := GetTxPayload(coreTx.InMsg.DecodedBody)
		if err != nil {
			logger.Errorf("GetTransactionPayload error: %v", err)
			continue
		}
		logger.Infof("payload: payload:%v", payload)
	}
	logger.Infof("valided tx count: %v", validedTxCount)
}

func isValidTx(coreTx *core.Transaction) bool {
	// skip no tvs transfer tx, because it will be processed in TransferTvs, need payload param
	if coreTx.InMsg.DecodedBody == nil {
		logger.Errorf("isvalidTx: coreTx.InMsg.DecodedBody is nil")
		return false
	}

	if !coreTx.Success {
		logger.Errorf("isvalidTx: coreTx.Success is false")
		return false
	}

	payload, err := GetTxPayload(coreTx.InMsg.DecodedBody)
	if err != nil {
		logger.Errorf("isvalidTx: tonChain.GetTransactionPayload error: %s", err.Error())
		return false
	}

	if payload == "" {
		logger.Errorf("isvalidTx: payload is empty")
		return false
	}

	param := payload
	if param == "" {
		logger.Errorf("isvalidTx: payload is empty")
		return false
	}

	values, err := url.ParseQuery(param)
	if err != nil {
		logger.Errorf("isvalidTx: url.ParseQuery error: %s", err.Error())
		return false
	}
	walletId := values.Get("tvswallet")
	if walletId == "" {
		logger.Errorf("isvalidTx: walletId is empty")
		return false
	}

	// appName := values.Get("app")
	// if appName != "mini-paytoview" {
	// 	logger.Errorf("isvalidTx: app name: %s", appName)
	// }

	return true
}
