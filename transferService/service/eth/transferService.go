package eth

import (
	"context"
	"encoding/json"
	"errors"
	"net/url"
	"runtime"
	"strconv"
	"sync"
	"time"

	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-datastore/query"
	levelds "github.com/ipfs/go-ds-leveldb"
	"github.com/libp2p/go-libp2p/core/routing"
	ldbopts "github.com/syndtr/goleveldb/leveldb/opt"
	ethChain "github.com/tinyverse-web3/transferService/chain/eth"
	"github.com/tinyverse-web3/transferService/service/common"
	"github.com/tinyverse-web3/transferService/tvsdk"
	"github.com/tinyverse-web3/tvbase/dkvs"
)

const DBName = "eth.transfer.db"

const (
	TxTransferInitState = iota
	TxTransferFailState
	TxTransferSuccState
)

type TransferRecord struct {
	Ts      int64
	TxHash  string
	Value   string
	Payload string
	Desc    string
}

type TransferService struct {
	tvSdkInst            *tvsdk.TvSdk
	accountInst          *ethChain.Account
	isCreation           bool
	summaryInfo          *TransferSummaryInfo
	db                   *levelds.Datastore
	txsChan              chan *TransferRecord
	loadTxsInterval      time.Duration
	checkFailTxsInterval time.Duration
	workMutex            sync.Mutex
}

type TransferSummaryInfo struct {
	BlockNumber      string `json:"blockNumber"`
	Hash             string `json:"hash"`
	TransactionIndex string `json:"transactionIndex"`
	To               string `json:"to"`
	Input            string `json:"input"`
}

func NewTransferService(ctx context.Context, tvSdkInst *tvsdk.TvSdk, accountInst *ethChain.Account, dbPath string, forceCreate bool) (*TransferService, error) {
	ret := &TransferService{
		tvSdkInst:   tvSdkInst,
		accountInst: accountInst,
	}
	err := ret.InitSummaryInfo(ctx, forceCreate)
	if err != nil {
		return nil, err
	}
	err = ret.InitDb(dbPath)
	if err != nil {
		return nil, err
	}

	ret.loadTxsInterval = 10 * time.Second
	ret.checkFailTxsInterval = 10 * time.Second
	return ret, nil
}

func (s *TransferService) InitDb(dataPath string) (err error) {
	s.db, err = levelds.NewDatastore(dataPath+DBName, &levelds.Options{
		Compression: ldbopts.NoCompression,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *TransferService) InitSummaryInfo(ctx context.Context, forceCreate bool) error {
	key, err := s.getInitInfoKey()
	if err != nil {
		return err
	}

	data, err := s.tvSdkInst.GetDKVS(key)
	if forceCreate || errors.Is(err, dkvs.ErrNotFound) || errors.Is(err, routing.ErrNotFound) {
		s.isCreation = true
		if err != nil {
			logger.Debugf("TransferService->InitSummaryInfo: summaryInfo isn't exist, GetDKVS error: %s", err.Error())
		}

		summaryInfo := &TransferSummaryInfo{
			BlockNumber: "0",
		}
		txList, err := s.accountInst.GetTxList(ctx, "0", 1, "desc")
		if err != nil {
			return err
		}
		if len(txList) == 1 {
			summaryInfo = &TransferSummaryInfo{
				BlockNumber:      txList[0].BlockNumber,
				Hash:             txList[0].Hash,
				TransactionIndex: txList[0].TransactionIndex,
				To:               txList[0].To,
				Input:            txList[0].Input,
			}
		}

		err = s.SyncInitInfo(summaryInfo)
		if err != nil {
			return err
		}
		return nil
	}

	if err != nil {
		logger.Errorf("TransferService->InitSummaryInfo: GetDKVS error: %s", err.Error())
		return err
	}

	summaryInfo := &TransferSummaryInfo{}
	err = json.Unmarshal(data, summaryInfo)
	if err != nil {
		return err
	}

	s.summaryInfo = summaryInfo

	return nil
}

func (s *TransferService) SetLoadTxsInterval(duration time.Duration) {
	s.loadTxsInterval = duration
}

func (s *TransferService) SetCheckFailTxsInterval(duration time.Duration) {
	s.checkFailTxsInterval = duration
}

func (s *TransferService) SyncInitInfo(summaryInfo *TransferSummaryInfo) error {
	key, err := s.getInitInfoKey()
	if err != nil {
		return err
	}

	value, err := json.Marshal(summaryInfo)
	if err != nil {
		return err
	}

	err = s.tvSdkInst.SetDKVS(key, value, common.MaxDkvsTTL)
	if err != nil {
		return err
	}

	s.summaryInfo = summaryInfo
	return nil
}

func (s *TransferService) getInitInfoKey() (string, error) {
	accountPk, err := s.tvSdkInst.GetAccountStorePubkey()
	if err != nil {
		return "", err
	}
	return GetSummaryInfoKey(accountPk), nil
}

func (s *TransferService) Start(ctx context.Context) error {
	numCPU := runtime.NumCPU()
	s.txsChan = make(chan *TransferRecord, numCPU*4)

	err := s.handleInitTxs(ctx)
	if err != nil {
		return err
	}

	err = s.loadTxsFromBLockChain(ctx)
	if err != nil {
		return err
	}

	s.waitTxsChan(ctx)
	s.checkFailTxs(ctx)
	return nil
}

func (s *TransferService) handleInitTxs(ctx context.Context) (err error) {
	if s.isCreation {
		dbQuery := query.Query{
			Prefix:   txBasicPrefix,
			KeysOnly: true,
		}
		results, err := s.db.Query(ctx, dbQuery)
		if err != nil {
			logger.Errorf("TransferService->handleInitTxs: db.Query error: %s", err.Error())
			return err
		}
		defer results.Close()

		for result := range results.Next() {
			err = s.db.Delete(ctx, datastore.NewKey(result.Key))
			if err != nil {
				logger.Errorf("TransferService->handleInitTxs: db.Delete error: %s", err.Error())
			}
		}
		return nil
	}

	var query = query.Query{
		Prefix: GetTxDbKeyPrefix(TxTransferInitState),
	}
	results, err := s.db.Query(ctx, query)
	if err != nil {
		logger.Errorf("TransferService->handleInitTxs: db.Query error: %s", err.Error())
		return err
	}
	defer results.Close()

	for result := range results.Next() {
		record := &TransferRecord{}
		err := json.Unmarshal(result.Value, record)
		if err != nil {
			logger.Errorf("TransferService->handleInitTxs: json.Unmarshal error: %s", err.Error())
			continue
		}

		err = s.transferTvs(record, 3, "paytoview/transferService")
		if err != nil {
			s.saveFailTx(ctx, record, err.Error())
			continue
		}

		err = s.saveSuccTx(ctx, record)
		if err != nil {
			logger.Errorf("TransferService->handleInitTxs: saveSuccessTx error: %s", err.Error())
			continue
		}
	}

	return nil
}

func (s *TransferService) checkFailTxs(ctx context.Context) {
	go func() {
		ticker := time.NewTicker(s.checkFailTxsInterval)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				workFunc := func() bool {
					s.workMutex.Lock()
					defer s.workMutex.Unlock()

					query := query.Query{
						Prefix: GetTxDbKeyPrefix(TxTransferFailState),
					}
					results, err := s.db.Query(ctx, query)
					if err != nil {
						logger.Errorf("TransferService->checkFailTxs: db.Query error: %s", err.Error())
						return false
					}
					defer results.Close()

					for result := range results.Next() {
						record := &TransferRecord{}
						err := json.Unmarshal(result.Value, record)
						if err != nil {
							logger.Errorf("TransferService->checkFailTxs: json.Unmarshal error: %s", err.Error())
							continue
						}
						isStop := s.safeSendToTxsChan(record)
						if isStop {
							return true
						}
					}
					return false
				}
				abort := workFunc()
				if abort {
					return
				}
			}
		}
	}()
}

func (s *TransferService) isExistTx(txHash string) bool {
	existSucc := s.isExistTxKey(txHash, TxTransferSuccState)
	if existSucc {
		return true
	}
	existFail := s.isExistTxKey(txHash, TxTransferFailState)
	if existFail {
		return true
	}
	existInit := s.isExistTxKey(txHash, TxTransferInitState)
	return existInit
}

func (s *TransferService) isExistTxKey(txHash string, transferState int) bool {
	var query = query.Query{
		Prefix:   s.getTxReadDbKey(txHash, transferState),
		KeysOnly: true,
	}
	results, err := s.db.Query(context.Background(), query)
	if err != nil {
		logger.Errorf("TransferService->getTx: db.Query error: %s", err.Error())
		return false
	}
	defer results.Close()

	result := <-results.Next()
	return result.Key != ""
}

func (s *TransferService) waitTxsChan(ctx context.Context) {
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case record, ok := <-s.txsChan:
				if !ok {
					logger.Errorf("TransferService->waitTxsChan: ok = false")
					continue
				}
				logger.Debugf("TransferService->waitTxsChan: receive record:\ntime:%s\nseqno: %v\nrecord: %v",
					time.UnixMicro(record.Ts).Format("2006-01-02 15:04:05"),
					record.TxHash,
					record)

				err := s.transferTvs(record, 3, "paytoview/transferService/eth")
				if err != nil {
					s.saveFailTx(ctx, record, err.Error())
					continue
				}

				err = s.saveSuccTx(ctx, record)
				if err != nil {
					logger.Errorf("TransferService->waitTxsChan: saveSuccessTx error: %s", err.Error())
					continue
				}
				continue
			}
		}

	}()
}

func (s *TransferService) Stop() {
	close(s.txsChan)
}

func (s *TransferService) IsValidTx(tx ethChain.Tx) bool {
	payload, err := ParseCommmentFromTxData(tx.Input)
	if err != nil {
		logger.Errorf("TransferService->IsValidTx: ParseCommmentFromTxData error: %s", err.Error())
		return false
	}

	if payload == "" {
		logger.Errorf("TransferService->IsValidTx: payload is empty")
		return false
	} else {
		logger.Debugf("TransferService->IsValidTx: payload: %s", payload)
	}

	values, err := url.ParseQuery(payload)
	if err != nil {
		logger.Errorf("TransferService->IsValidTx: url.ParseQuery error: %s", err.Error())
		return false
	}
	walletId := values.Get("tvswallet")
	if walletId == "" {
		logger.Debugf("TransferService->IsValidTx: walletId is empty")
		return false
	}

	isExistTx := s.isExistTx(tx.Hash)
	if isExistTx {
		logger.Debugf("TransferService->IsValidTx: isExistTx tx: %+v", tx)
		return false
	}

	if !s.tvSdkInst.IsExistWallet(walletId) {
		logger.Debugf("TransferService->IsValidTx: tvswallet: %s isn't exist", walletId)
		return false
	}

	return true
}

func (s *TransferService) loadTxsFromBLockChain(ctx context.Context) error {
	handleTxList := func(txList []ethChain.Tx) bool {
		for index, tx := range txList {
			txBasicFormat := "BlockNumber:%+v\nTimeStamp:%+v\nHash:%+v\nNonce:%+v\nBlockHash:%+v\nTransactionIndex:%+v\nFrom:%+v\nTo:%v\nValue:%+v\nGas:%+v\nGasPrice:%+v\n"
			txAdFormat := "TxReceiptStatus:%+v\nInput:%+v\nContractAddress:%+v\nCumulativeGasUsed:%+v\nGasUsed:%+v"
			logger.Debugf("TransferService->loadTxsFromBLockChain: tx: index: %d\n"+txBasicFormat+txAdFormat,
				index,
				tx.BlockNumber,
				tx.TimeStamp,
				tx.Hash,
				tx.Nonce,
				tx.BlockHash,
				tx.TransactionIndex,
				tx.From,
				tx.To,
				tx.Value,
				tx.Gas,
				tx.GasPrice,
				tx.TxReceiptStatus,
				tx.Input,
				tx.ContractAddress,
				tx.CumulativeGasUsed,
				tx.GasUsed,
			)

			if !s.IsValidTx(tx) {
				logger.Debugf("TransferService->loadTxsFromBLockChain: tx is invalid")
				continue
			}
			payload, _ := ParseCommmentFromTxData(tx.Input)
			record, err := s.saveTx(ctx, tx.Hash, payload, tx.Value, TxTransferInitState, "init")
			if err != nil {
				continue
			}
			isStop := s.safeSendToTxsChan(record)
			if isStop {
				return true
			}
		}
		logger.Debugf("TransferService->loadTxsFromBLockChain: tx: len: %d", len(txList))
		return false
	}
	if s.isCreation {
		txList, err := s.accountInst.GetTxList(ctx, "0", ethChain.MaxTxCount, "asc")
		if err != nil {
			return err
		}

		abort := handleTxList(txList)
		if abort {
			return nil
		}
	}

	go func() {
		ticker := time.NewTicker(s.loadTxsInterval)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				s.workMutex.Lock()
				defer s.workMutex.Unlock()

				workFunc := func() bool {
					txList, err := s.accountInst.GetTxList(ctx, "0", 1, "desc")
					if err != nil {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: tonAccountInst.GetState error: %s", err.Error())
						return false
					}
					if len(txList) != 1 {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: len(txs) != 1, len :%v", len(txList))
						return false
					}
					tx := txList[0]
					logger.Debugf("TransferService->LoadTxsFromBLockChain: tx: %+v", tx)

					if tx.To != s.summaryInfo.To {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: tx.To != s.initInfo.To")
						return false
					}

					if tx.BlockNumber < s.summaryInfo.BlockNumber {
						return false
					}
					if tx.BlockNumber == s.summaryInfo.BlockNumber && tx.TransactionIndex <= s.summaryInfo.TransactionIndex {
						return false
					}

					txList, err = s.accountInst.GetTxList(ctx, s.summaryInfo.BlockNumber, ethChain.MaxTxCount, "asc")
					if err != nil {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: tonAccountInst.GetState error: %s", err.Error())
						return false
					}

					err = s.SyncInitInfo(&TransferSummaryInfo{
						BlockNumber:      tx.BlockNumber,
						Hash:             tx.Hash,
						TransactionIndex: tx.TransactionIndex,
						To:               tx.To,
						Input:            tx.Input,
					})
					if err != nil {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: SyncSummaryInfo error: %s", err.Error())
						return false
					}

					abort := handleTxList(txList)
					if abort {
						return abort
					}

					return false
				}
				abort := workFunc()
				if abort {
					return
				}
			}
		}
	}()
	return nil
}

func (s *TransferService) safeSendToTxsChan(record *TransferRecord) (abort bool) {
	defer func() {
		if recoverErr := recover(); recoverErr != nil {
			logger.Debugf("TransferService->safeGetTxs: error: %v", recoverErr)
			abort = true
		}
	}()
	s.txsChan <- record
	return abort
}

func (s *TransferService) saveSuccTx(ctx context.Context, record *TransferRecord) error {
	_, err := s.saveTx(ctx, record.TxHash, record.Payload, record.Value, TxTransferSuccState, "succ")
	if err != nil {
		return err
	}
	err = s.deleteTx(ctx, record, TxTransferInitState)
	if err != nil {
		return err
	}
	err = s.deleteTx(ctx, record, TxTransferFailState)
	if err != nil {
		return err
	}
	return nil
}

func (s *TransferService) saveFailTx(ctx context.Context, record *TransferRecord, errDesc string) error {
	_, err := s.saveTx(ctx, record.TxHash, record.Payload, record.Value, TxTransferFailState, errDesc)
	if err != nil {
		return err
	}
	err = s.deleteTx(ctx, record, TxTransferInitState)
	if err != nil {
		return err
	}
	return nil
}

func (s *TransferService) saveTx(ctx context.Context, txHash string, payload string, value string, txTransferState int, errDesc string) (*TransferRecord, error) {
	key := s.getTxWriteDbKey(txHash, txTransferState)
	record := &TransferRecord{
		Ts:      time.Now().UnixMicro(),
		Value:   value,
		TxHash:  txHash,
		Payload: payload,
		Desc:    errDesc,
	}
	data, err := json.Marshal(record)
	if err != nil {
		logger.Errorf("TransferService->saveTx: json.Marshal error: %s", err.Error())
		return nil, err
	}

	err = s.db.Put(ctx, datastore.NewKey(key), data)
	if err != nil {
		logger.Errorf("TransferService->saveTx: db.Put error: %s", err.Error())
		return nil, err
	}
	return record, nil
}

func (s *TransferService) deleteTx(ctx context.Context, record *TransferRecord, txTransferState int) error {
	key := s.getTxWriteDbKey(record.TxHash, txTransferState)
	err := s.db.Delete(ctx, datastore.NewKey(key))
	if err != nil {
		logger.Errorf("TransferService->deleteTx: db.Delete error: %s", err.Error())
		return err
	}
	return nil
}

func (s *TransferService) getTxReadDbKey(txHash string, txTransferState int) string {
	prefix := GetTxDbKeyPrefix(txTransferState)
	key := prefix + txHash
	return key
}

func (s *TransferService) getTxWriteDbKey(txHash string, txTransferState int) string {
	prefix := GetTxDbKeyPrefix(txTransferState)
	key := prefix + txHash + "/tx"
	return key
}

func (s *TransferService) GetBalance() (string, error) {
	return s.accountInst.GetBalance()
}

func (s *TransferService) transferTvs(record *TransferRecord, fee uint64, comment string) error {
	values, _ := url.ParseQuery(record.Payload)
	walletId := values.Get("tvswallet")
	app := values.Get("app")
	logger.Debugf("TransferService->transferTvs: tvswallet: %s, app: %s", walletId, app)

	usdRatio, err := GetEthToUsdRatio()
	if err != nil {
		logger.Errorf("TransferService->transferTvs: GetEthToUsdRatio error: %s", err.Error())
		return err
	}

	ethwei, err := strconv.ParseUint(record.Value, 10, 64)
	if err != nil {
		logger.Errorf("TransferService->transferTvs: ParseUint error: %s", err.Error())
		return err
	}

	tvs := Ethwei2tvs(ethwei, usdRatio)
	logger.Debugf("TransferService->transferTvs:\neth wei: %v, usd ratio: %.4f, tvs: %v", record.Value, usdRatio, tvs)
	err = s.tvSdkInst.TransferTvs(walletId, tvs, fee, comment)
	if err != nil {
		walletId := s.tvSdkInst.GetWallID()
		balance := s.tvSdkInst.GetBalance()
		logger.Errorf("TransferService->waitTxsChan: transferTvs walletID:%v, blance:%v, error: %s", walletId, balance, err.Error())
		return err
	}
	return nil
}
