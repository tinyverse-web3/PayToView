package ton

import (
	"context"
	"net/url"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/tinyverse-web3/transferService/adnl/core"
	"github.com/tonkeeper/tongo/abi"
	"github.com/tonkeeper/tongo/boc"
	"github.com/tonkeeper/tongo/tlb"
)

func TestBocMessage(t *testing.T) {
	bocStr := "te6cckECGAEAA94AAuGIAPw+fSusxX75v/h3Jgbztc1V8J/15dhCIqkXfY85HnJ2GfG0ejLk52Mmw5bjTXUbbzNZw5/49ojZpAMF7bW+zGN25I7Oy3ZTxtCzQBzxjFm0vks4P9Sm7vWr6tafdwRfNBCmpoxf/////AAAAAAADgEXAgE0AhYBFP8A9KQT9LzyyAsDAgEgBBECAUgFCALm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQYHAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAkQAgEgCg8CAVgLDAA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA0OABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xITFBUAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjF0gHnwKpofqN4lqbTd/X3IYj7lBKl2unsutIavQ0cNFWQADGQgA/D59K6zFfvm/+HcmBvO1zVXwn/Xl2EIiqRd9jzkecnaAJiWgAAAAAAAAAAAAAAAAAAAAAAABodHRwczovL3Rpbnl2ZXJzZS13ZWIzLmdpdGh1Yi5pby9wYXl0b3ZpZXcvBQcWOw=="
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
	tonAccount := NewAccount()
	err := tonAccount.SetNet(true)
	if err != nil {
		logger.Fatalf("tonAccount.SetNet error: %v", err)
	}

	err = tonAccount.SetAccountID("0:327f3cd4eb72f347df6f51b6b4586ec9dd94267b3615e85189fa725052aef8b2")
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

		logger.Infof("tx: index: %d\nTrans: Hash:%+v,Lt:%+v\nPrevTrans: Hash:%+v,Lt:%+v\nBlockID: Workchain:%+v,Shard:%X,Seqno:%+v",
			index,
			coreTx.Hash.Hex(),
			coreTx.Lt,
			coreTx.PrevTransHash.Hex(),
			coreTx.PrevTransLt,
			coreTx.BlockID.Workchain,
			coreTx.BlockID.Shard,
			coreTx.BlockID.Seqno,
		)

		if !isvalidTx(coreTx) {
			logger.Error("isvalidTx error: coreTx is invalid")
			continue
		} else {
			validedTxCount++
		}
		payload, err := GetTransactionPayload(coreTx.InMsg.DecodedBody)
		if err != nil {
			logger.Errorf("GetTransactionPayload error: %v", err)
			continue
		}
		logger.Infof("payload: index:%v, payload:%v", index, payload)
	}
	logger.Infof("valided tx count: %v", validedTxCount)
}

func isvalidTx(coreTx *core.Transaction) bool {
	// skip no tvs transfer tx, because it will be processed in TransferTvs, need payload param
	if coreTx.InMsg.DecodedBody == nil {
		logger.Errorf("isvalidTx: coreTx.InMsg.DecodedBody is nil")
		return false
	}

	if !coreTx.Success {
		logger.Errorf("isvalidTx: coreTx.Success is false")
		return false
	}

	payload, err := GetTransactionPayload(coreTx.InMsg.DecodedBody)
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
	} else {
		logger.Infof("isvalidTx: payload: %s", param)
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

	appName := values.Get("app")
	if appName != "mini-paytoview" {
		logger.Errorf("isvalidTx: app name: %s", appName)
	}

	return true
}
