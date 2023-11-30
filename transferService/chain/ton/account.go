package ton

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"reflect"
	"strings"
	"time"

	"github.com/tonkeeper/tongo"
	"github.com/tonkeeper/tongo/liteapi"
	"github.com/tonkeeper/tongo/liteclient"
	"github.com/tonkeeper/tongo/tlb"
	"github.com/tonkeeper/tongo/ton"
)

const MaxTransactionCount = 999999999

type Account struct {
	cli       *liteapi.Client
	accountId *ton.AccountID
	enableLog bool
	logPath   string
}

func NewAccount() *Account {
	ret := &Account{}
	return ret
}

func (s *Account) SetNet(isTestnet bool) (err error) {
	if isTestnet {
		s.cli, err = liteapi.NewClientWithDefaultTestnet()
	} else {
		s.cli, err = liteapi.NewClientWithDefaultMainnet()
	}
	if err != nil {
		logger.Errorf("Account.SetNet: NewClientWithDefaultTestnet error: %v", err)
	}
	return err
}

func (s *Account) SetAccountID(id string) error {
	accountId, err := tongo.ParseAccountID(id)
	if err != nil {
		logger.Errorf("Account.SetAccountID: ParseAccountID error: %v", err)
		return err
	}
	s.accountId = &accountId
	return err
}

func (s *Account) String() string {
	return s.accountId.String()
}

func (s *Account) ToRaw() string {
	return s.accountId.ToRaw()
}

func (s *Account) ToHuman(bounce bool, isTestnet bool) string {
	return s.accountId.ToHuman(bounce, isTestnet)
}

func (s *Account) GetState(ctx context.Context) (*tlb.ShardAccount, error) {
	sa, err := s.cli.GetAccountState(ctx, *s.accountId)
	if err != nil {
		logger.Errorf("Account.GetState: GetAccountState error: %v", err)
		return nil, err
	}

	return &sa, nil
}

func (s *Account) GetLastTransLt(ctx context.Context) (uint64, error) {
	sa, err := s.GetState(ctx)
	if err != nil {
		logger.Errorf("Account.GetLastTransLt: GetState error: %v", err)
		return 0, err
	}

	return sa.LastTransLt, nil
}

func (s *Account) GetLastTransHash(ctx context.Context) (*tlb.Bits256, error) {
	sa, err := s.GetState(ctx)
	if err != nil {
		logger.Errorf("Account.GetLastTransHash: GetState error: %v", err)
		return nil, err
	}

	return &sa.LastTransHash, nil
}

func (s *Account) GetStatus(ctx context.Context) (tlb.AccountStatus, error) {
	sa, err := s.GetState(ctx)
	if err != nil {
		logger.Errorf("Account.GetStatus: GetState error: %v", err)
		return tlb.AccountNone, err
	}
	return sa.Account.Status(), nil
}

func (s *Account) GetBalance(ctx context.Context) (uint64, error) {
	state, err := s.GetState(ctx)
	if err != nil {
		logger.Errorf("Account.GetBalance: GetState error: %v", err)
		return 0, err
	}
	balance := reflect.ValueOf(state.Account.Account.Storage.Balance.Grams).Uint()
	return balance, nil
}

func (s *Account) GetContractSeqno(ctx context.Context) (uint32, error) {
	ret, err := s.cli.GetSeqno(ctx, *s.accountId)
	if err != nil {
		logger.Errorf("Account.GetContractSeqno: GetSeqno error: %v", err)
		return 0, err
	}
	return ret, nil
}

func (s *Account) GetLastTxList(ctx context.Context, maxRetries int) ([]ton.Transaction, error) {
	retryCount := 0

	for retryCount < maxRetries {
		transactions, err := s.cli.GetLastTransactions(ctx, *s.accountId, MaxTransactionCount)
		if err == nil {
			if err := s.logTx(transactions); err != nil {
				return transactions, err
			}
			return transactions, nil
		}

		retryCount++
		logger.Errorf("Account.GetLastTxList: cli.GetLastTransactions error: %v. Retry attempt: %d", err, retryCount)
	}
	return nil, fmt.Errorf("Account.GetLastTxList: Max retries reached, failed after %d attempts", maxRetries)
}

func (s *Account) GetLastTxListUtil(ctx context.Context, lastTxLt uint64, lastTxHash tlb.Bits256, utilLt uint64, utilhash *tlb.Bits256) ([]ton.Transaction, error) {
	getTransactions := func(ctx context.Context, lt uint64, hash ton.Bits256) ([]ton.Transaction, error) {
		transactions, err := s.cli.GetTransactions(ctx, MaxTransactionCount, *s.accountId, lt, hash)
		if err != nil {
			logger.Errorf("Account.GetLastTxListUtil.getTransactions: cli.GetTransactions error: %v", err)
			return nil, err
		}
		return transactions, nil
	}

	lt := lastTxLt
	hash := lastTxHash
	var txList []ton.Transaction
	for {
		if lt == 0 {
			break
		}

		txs, err := getTransactions(ctx, lt, ton.Bits256(hash))
		if err != nil {
			if e, ok := err.(liteclient.LiteServerErrorC); ok && int32(e.Code) == -400 { // liteserver can store not full history. in that case it return error -400 for old transactions
				break
			}
			logger.Errorf("Account.GetLastTxListUtil: getTransactions error: %v", err)
			return nil, err
		}
		txsLen := len(txs)
		if txsLen == 0 {
			break
		}

		lt, hash = txs[txsLen-1].PrevTransLt, txs[txsLen-1].PrevTransHash
		if lt == utilLt && hash.Equal(utilhash) {
			break
		}
		txList = append(txList, txs...)
	}

	if err := s.logTx(txList); err != nil {
		return txList, err
	}
	return txList, nil
}

func (s *Account) Release() {
	s.cli = nil
	s.accountId = nil
	s.enableLog = false
	s.logPath = ""
}

func (s *Account) SetLog(enableLog bool, logPath string) (err error) {
	if !strings.HasSuffix(logPath, string(os.PathSeparator)) {
		logPath += string(os.PathSeparator)
	}
	_, err = os.Stat(logPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(logPath, 0755)
		if err != nil {
			logger.Errorf("Account.SetLog: MkdirAll error: %v", err)
			return err
		}
	}

	s.logPath = logPath
	s.enableLog = enableLog
	return nil
}

func (s *Account) logTx(transactions []ton.Transaction) error {
	if !s.enableLog {
		return nil
	}

	filePath := s.logPath + "txs_" + s.ToRaw() + "_" + time.Now().Format("20060102-150405") + ".log"
	logFile, err := os.Create(filePath)
	if err != nil {
		logger.Errorf("Account.logTx: Create error: %v", err)
		return err
	}
	defer logFile.Close()

	data, err := json.MarshalIndent(transactions, "", " ")
	if err != nil {
		logger.Errorf("Account.logTx: MarshalIndent error: %v", err)
		return err
	}
	_, err = logFile.Write(data)
	if err != nil {
		logger.Errorf("Account.logTx: Write error: %v", err)
		return err
	}
	return nil
}
