package eth

import (
	"context"
	"encoding/json"
	"errors"
	"net/url"
	"runtime"
	"sync"
	"time"

	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-datastore/query"
	levelds "github.com/ipfs/go-ds-leveldb"
	"github.com/libp2p/go-libp2p/core/routing"
	ldbopts "github.com/syndtr/goleveldb/leveldb/opt"
	ethChain "github.com/tinyverse-web3/transferService/chain/eth"
	"github.com/tinyverse-web3/transferService/tvsdk"
)

const DBName = "eth.transfer.db"
const DEFAULT_TTL time.Duration = time.Hour * 24 * (365*100 + 25) // hundred year

const (
	txBasicPrefix  = "/eth/transfer/"
	txInitPrefix   = txBasicPrefix + "init/"
	txFailPrefix   = txBasicPrefix + "fail/"
	txSuccPrefix   = txBasicPrefix + "succ/"
	txExceptPrefix = txBasicPrefix + "except/"
)

const (
	TxTransferInitState = iota
	TxTransferFailState
	TxTransferSuccState
)

type TransferRecord struct {
	Ts      int64
	TxHash  string
	Payload string
	Desc    string
}

type TransferService struct {
	tvSdkInst            *tvsdk.TvSdk
	accountInst          *ethChain.Account
	isCreation           bool
	initInfo             *TransferInitInfo
	db                   *levelds.Datastore
	txsChan              chan *TransferRecord
	loadTxsInterval      time.Duration
	checkFailTxsInterval time.Duration
	workMutex            sync.Mutex
}

type TransferInitInfo struct {
	BlockNumber      string `json:"blockNumber"`
	Hash             string `json:"hash"`
	TransactionIndex string `json:"transactionIndex"`
	To               string `json:"to"`
	Input            string `json:"input"`
}

func NewTransferService(ctx context.Context, tvSdkInst *tvsdk.TvSdk, accountInst *ethChain.Account, dbPath string) (*TransferService, error) {
	ret := &TransferService{
		tvSdkInst:   tvSdkInst,
		accountInst: accountInst,
	}
	err := ret.InitTransferInitInfo(ctx)
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

func (s *TransferService) InitTransferInitInfo(ctx context.Context) error {
	key, err := s.getInitInfoKey()
	if err != nil {
		return err
	}

	data, err := s.tvSdkInst.GetDKVS(key)
	if errors.Is(err, routing.ErrNotFound) {
		s.isCreation = true
		logger.Debugf("TransferService->InitTransferInitInfo: summaryInfo isn't exist, GetDKVS error: %s", err.Error())

		summaryInfo := &TransferInitInfo{
			BlockNumber: "0",
		}
		txList, err := s.accountInst.GetTxList(ctx, "0", 1, "desc")
		if err != nil {
			return err
		}
		if len(txList) == 1 {
			summaryInfo = &TransferInitInfo{
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
		logger.Errorf("TransferService->InitTransferInitInfo: GetDKVS error: %s", err.Error())
		return err
	}

	summaryInfo := &TransferInitInfo{}
	err = json.Unmarshal(data, summaryInfo)
	if err != nil {
		return err
	}

	s.initInfo = summaryInfo

	return nil
}

func (s *TransferService) SetLoadTxsInterval(duration time.Duration) {
	s.loadTxsInterval = duration
}

func (s *TransferService) SetCheckFailTxsInterval(duration time.Duration) {
	s.checkFailTxsInterval = duration
}

func (s *TransferService) SyncInitInfo(initInfo *TransferInitInfo) error {
	key, err := s.getInitInfoKey()
	if err != nil {
		return err
	}

	value, err := json.Marshal(initInfo)
	if err != nil {
		return err
	}

	err = s.tvSdkInst.SetDKVS(key, value, DEFAULT_TTL)
	if err != nil {
		return err
	}

	s.initInfo = initInfo
	return nil
}

func (s *TransferService) getInitInfoKey() (string, error) {
	accountPk, err := s.tvSdkInst.GetAccountStorePubkey()
	if err != nil {
		return "", err
	}
	return GetInitInfoKey(accountPk), nil
}

func (s *TransferService) Start(ctx context.Context, forceCreation bool) error {
	numCPU := runtime.NumCPU()
	s.txsChan = make(chan *TransferRecord, numCPU*4)

	err := s.handleInitTxs(ctx)
	if err != nil {
		return err
	}

	err = s.loadTxsFromBLockChain(ctx, forceCreation)
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

		err = s.transferTvs(record, 100, 3, "paytoview/transferService")
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

				err := s.transferTvs(record, 100, 3, "paytoview/transferService/eth")
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

func (s *TransferService) validTx(tx ethChain.Tx) bool {
	payload, err := ParseCommmentFromTxData(tx.Input)
	if err != nil {
		logger.Errorf("TransferService->validTx: ParseCommmentFromTxData error: %s", err.Error())
		return false
	}
	if payload == "" {
		logger.Debugf("TransferService->validTx: payload is empty")
		return false
	}

	// payload = "https://tinyverse-web3.github.io/paytoview?app=paytoview&tvswallet=080112209e622d535ff6364ec8a7bf2b94624c377560f0d5fb7ebb4bfcb3eb023555a1b4"
	// u, err := url.Parse(payload)
	// if err != nil {
	// 	logger.Errorf("TransferService->waitTxsChan: url.Parse error: %s", err.Error())
	// 	return "", "", fmt.Errorf("TransferService->waitTxsChan: url.Parse error: %s", err.Error())
	// }
	// param := u.RawQuery

	param := payload // u.RawQuery
	if param == "" {
		logger.Errorf("TransferService->validTx: payload is empty")
		return false
	} else {
		logger.Debugf("TransferService->validTx: payload: %s", param)
	}

	values, err := url.ParseQuery(param)
	if err != nil {
		logger.Errorf("TransferService->validTx: url.ParseQuery error: %s", err.Error())
		return false
	}
	walletId := values.Get("tvswallet")
	if walletId == "" {
		logger.Debugf("TransferService->validTx: walletId is empty")
		return false
	}

	// app := values.Get("app")
	// if app != "payToView" {
	// 	logger.Debugf("TransferService->validTx: app is not paytoview")
	// 	return false
	// }

	isExistTx := s.isExistTx(tx.Hash)
	if isExistTx {
		logger.Debugf("TransferService->validTx: isExistTx tx: %+v", tx)
		return false
	}

	if !s.tvSdkInst.IsExistWallet(walletId) {
		logger.Debugf("TransferService->validTx: tvswallet: %s isn't exist", walletId)
		return false
	}

	return true
}

func (s *TransferService) loadTxsFromBLockChain(ctx context.Context, forceCreation bool) error {
	if s.isCreation || forceCreation {
		txs, err := s.accountInst.GetTxList(ctx, "0", ethChain.MaxTxCount, "asc")
		if err != nil {
			return err
		}

		for index, tx := range txs {
			logger.Debugf("TransferService->loadTxsFromBLockChain: index: %v, tx: %+v", index, tx)
			if !s.validTx(tx) {
				logger.Debugf("TransferService->loadTxsFromBLockChain: coreTx is not valid, index:%v, tx: %+v", index, tx)
				continue
			}

			payload, _ := ParseCommmentFromTxData(tx.Input)
			record, err := s.saveTx(ctx, tx.Hash, payload, TxTransferInitState, "init")
			if err != nil {
				logger.Errorf("TransferService->loadTxsFromBLockChain: saveTx error: %s", err.Error())
				continue
			}

			isStop := s.safeSendToTxsChan(record)
			if isStop {
				return nil
			}
		}
		return nil
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
					txs, err := s.accountInst.GetTxList(ctx, "0", 1, "desc")
					if err != nil {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: tonAccountInst.GetState error: %s", err.Error())
						return false
					}
					if len(txs) != 1 {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: len(txs) != 1, len :%v", len(txs))
						return false
					}
					tx := txs[0]
					logger.Debugf("TransferService->LoadTxsFromBLockChain: tx: %+v", tx)

					if tx.To != s.initInfo.To {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: tx.To != s.initInfo.To")
						return false
					}

					if tx.BlockNumber < s.initInfo.BlockNumber {
						return false
					}
					if tx.BlockNumber == s.initInfo.BlockNumber && tx.TransactionIndex <= s.initInfo.TransactionIndex {
						return false
					}

					txs, err = s.accountInst.GetTxList(ctx, s.initInfo.BlockNumber, ethChain.MaxTxCount, "asc")
					if err != nil {
						logger.Errorf("TransferService->LoadTxsFromBLockChain: tonAccountInst.GetState error: %s", err.Error())
						return false
					}

					err = s.SyncInitInfo(&TransferInitInfo{
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

					for index, tx := range txs {
						logger.Debugf("TransferService->loadTxsFromBLockChain: index: %v, tx: %+v", index, tx)
						if !s.validTx(tx) {
							logger.Debugf("TransferService->loadTxsFromBLockChain: tx is not valid, index:%v, tx: %+v", index, tx)
							continue
						}
						payload, _ := ParseCommmentFromTxData(tx.Input)
						record, err := s.saveTx(ctx, tx.Hash, payload, TxTransferInitState, "init")
						if err != nil {
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
	_, err := s.saveTx(ctx, record.TxHash, record.Payload, TxTransferSuccState, "succ")
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
	_, err := s.saveTx(ctx, record.TxHash, record.Payload, TxTransferFailState, errDesc)
	if err != nil {
		return err
	}
	err = s.deleteTx(ctx, record, TxTransferInitState)
	if err != nil {
		return err
	}
	return nil
}

func (s *TransferService) saveTx(ctx context.Context, txHash string, payload string, txTransferState int, errDesc string) (*TransferRecord, error) {
	key := s.getTxWriteDbKey(txHash, txTransferState)
	value := &TransferRecord{
		Ts:      time.Now().UnixMicro(),
		TxHash:  txHash,
		Payload: payload,
		Desc:    errDesc,
	}
	data, err := json.Marshal(value)
	if err != nil {
		logger.Errorf("TransferService->saveTx: json.Marshal error: %s", err.Error())
		return nil, err
	}

	err = s.db.Put(ctx, datastore.NewKey(key), data)
	if err != nil {
		logger.Errorf("TransferService->saveTx: db.Put error: %s", err.Error())
		return nil, err
	}
	return value, nil
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

func (s *TransferService) transferTvs(record *TransferRecord, amount uint64, fee uint64, commit string) error {
	payload := record.Payload

	// payload = "https://tinyverse-web3.github.io/paytoview?app=paytoview&tvswallet=080112209e622d535ff6364ec8a7bf2b94624c377560f0d5fb7ebb4bfcb3eb023555a1b4"
	// u, _ := url.Parse(payload)
	// param := u.RawQuery
	param := payload // u.RawQuery
	values, _ := url.ParseQuery(param)
	walletId := values.Get("tvswallet")
	app := values.Get("app")
	logger.Debugf("TransferService->TransferTvs: tvswallet: %s, app: %s", walletId, app)

	err := s.tvSdkInst.TransferTvs(walletId, amount, fee, commit)
	if err != nil {
		walletId := s.tvSdkInst.GetWallID()
		balance := s.tvSdkInst.GetBalance()
		logger.Errorf("TransferService->waitTxsChan: TransferTvs walletID:%v, blance:%v, error: %s", walletId, balance, err.Error())
		return err
	}
	return nil
}
