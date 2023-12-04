package ton

import (
	"context"
	"encoding/base64"
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
	"github.com/tinyverse-web3/transferService/adnl/core"
	tonChain "github.com/tinyverse-web3/transferService/chain/ton"
	"github.com/tinyverse-web3/transferService/service/common"
	"github.com/tinyverse-web3/transferService/tvsdk"
	"github.com/tinyverse-web3/tvbase/dkvs"
	"github.com/tonkeeper/tongo/tlb"
	"github.com/tonkeeper/tongo/ton"
)

const DBName = "ton.transfer.db"

const (
	TxTransferInitState = iota
	TxTransferFailState
	TxTransferSuccState
)

type TransferRecord struct {
	Ts      int64
	Seqno   uint32
	Value   int64
	Payload string
	Desc    string
}

type TransferService struct {
	tvSdkInst            *tvsdk.TvSdk
	accountInst          *tonChain.Account
	isCreation           bool
	summaryInfo          *TransferSummaryInfo
	db                   *levelds.Datastore
	txsChan              chan *TransferRecord
	loadTxsInterval      time.Duration
	checkFailTxsInterval time.Duration
	workMutex            sync.Mutex
}

type TransferSummaryInfo struct {
	LastTransLt   uint64
	LastTransHash *tlb.Bits256
}

func NewTransferService(ctx context.Context, tvSdkInst *tvsdk.TvSdk, tonAccountInst *tonChain.Account, dbPath string, forceCreation bool) (*TransferService, error) {
	ret := &TransferService{
		tvSdkInst:   tvSdkInst,
		accountInst: tonAccountInst,
	}
	err := ret.InitSummaryInitInfo(ctx, forceCreation)
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

func (s *TransferService) InitSummaryInitInfo(ctx context.Context, forceCreation bool) error {
	key, err := s.getInitInfoKey()
	if err != nil {
		logger.Errorf("TransferService->InitSummaryInitInfo: getInitInfoKey error: %s", err.Error())
		return err
	}

	data, err := s.tvSdkInst.GetDKVS(key)
	if forceCreation || errors.Is(err, routing.ErrNotFound) || errors.Is(err, dkvs.ErrNotFound) {
		s.isCreation = true
		if err != nil {
			logger.Debugf("TransferService->InitSummaryInitInfo: summaryInfo isn't exist, GetDKVS error: %s", err.Error())
		}

		state, err := s.accountInst.GetState(ctx)
		if err != nil {
			logger.Errorf("TransferService->InitSummaryInitInfo: tonAccountInst.GetState error: %s", err.Error())
			return err
		}

		summaryInfo := &TransferSummaryInfo{
			LastTransLt:   state.LastTransLt,
			LastTransHash: &state.LastTransHash,
		}
		err = s.SyncInitInfo(summaryInfo)
		if err != nil {
			logger.Errorf("TransferService->InitSummaryInitInfo: SyncInitInfo error: %s", err.Error())
			return err
		}
		return nil
	}

	if err != nil {
		logger.Errorf("TransferService->InitSummaryInitInfo: GetDKVS error: %s", err.Error())
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

func (s *TransferService) SyncInitInfo(initInfo *TransferSummaryInfo) error {
	key, err := s.getInitInfoKey()
	if err != nil {
		logger.Errorf("TransferService->SyncInitInfo: getInitInfoKey error: %s", err.Error())
		return err
	}

	value, err := json.Marshal(initInfo)
	if err != nil {
		logger.Errorf("TransferService->SyncInitInfo: json.Marshal error: %s", err.Error())
		return err
	}

	err = s.tvSdkInst.SetDKVS(key, value, common.MaxDkvsTTL)
	if err != nil {
		logger.Errorf("TransferService->SyncInitInfo: SetDKVS error: %s", err.Error())
		return err
	}

	s.summaryInfo = initInfo
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

		// TODO: delete
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

func (s *TransferService) isExistTx(seqno uint32) bool {
	existSucc := s.isExistTxKey(seqno, TxTransferSuccState)
	if existSucc {
		return true
	}
	existFail := s.isExistTxKey(seqno, TxTransferFailState)
	if existFail {
		return true
	}
	existInit := s.isExistTxKey(seqno, TxTransferInitState)
	return existInit
}

func (s *TransferService) isExistTxKey(seqno uint32, transferState int) bool {
	var query = query.Query{
		Prefix:   s.getTxReadDbKey(seqno, transferState),
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
					record.Seqno,
					record)

				err := s.transferTvs(record, 3, "paytoview/transferService/ton")
				if err != nil {
					s.saveFailTx(ctx, record, err.Error())
					continue
				}

				err = s.saveSuccTx(ctx, record)
				if err != nil {
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

func (s *TransferService) IsValidTx(coreTx *core.Transaction) bool {
	if coreTx.InMsg.DecodedBody == nil {
		logger.Debugf("TransferService->IsvalidTx: coreTx.InMsg.DecodedBody is nil, it isn't in tx(need out tx)")
		return false
	}

	if !coreTx.Success {
		logger.Debugf("TransferService->IsvalidTx: coreTx.Success is false")
		return false
	}
	payload, err := tonChain.GetTxPayload(coreTx.InMsg.DecodedBody)
	if err != nil {
		logger.Debugf("TransferService->IsvalidTx: tonChain.GetTransactionPayload error: %s", err.Error())
		return false
	}

	if payload == "" {
		logger.Errorf("TransferService->IsvalidTx: payload is empty")
		return false
	} else {
		logger.Debugf("TransferService->IsvalidTx: payload: %s", payload)
	}

	values, err := url.ParseQuery(payload)
	if err != nil {
		logger.Errorf("TransferService->IsvalidTx: url.ParseQuery error: %s", err.Error())
		return false
	}
	walletId := values.Get("tvswallet")
	if walletId == "" {
		logger.Debugf("TransferService->IsvalidTx: walletId is empty")
		return false
	}

	isExistTx := s.isExistTx(coreTx.BlockID.Seqno)
	if isExistTx {
		logger.Debugf("TransferService->IsvalidTx: isExistTx seqno: %v", coreTx.BlockID.Seqno)
		return false
	}

	if !s.tvSdkInst.IsExistWallet(walletId) {
		logger.Debugf("TransferService->IsvalidTx: tvswalletId: %s isn't exist", walletId)
		return false
	}

	return true
}

func (s *TransferService) loadTxsFromBLockChain(ctx context.Context) error {
	handleTxList := func(txList []ton.Transaction) bool {
		validedTxCount := 0
		for index, tx := range txList {
			coreTx, err := core.ConvertTransaction(0, tx)
			if err != nil {
				logger.Errorf("TransferService->loadTxsFromBLockChain: core.ConvertTransaction error: %s", err.Error())
				continue
			}

			logger.Debugf("TransferService->loadTxsFromBLockChain: tx: index: %d\nTrans: HashHex:%+v, HashBase64:%+v, Lt:%+v\nPrevTrans: HashHex:%+v, HashBase64:%+v, Lt:%+v\nBlockID: Workchain:%+v,Shard:%X,Seqno:%+v\nInMsg Value:%+v",
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

			if !s.IsValidTx(coreTx) {
				logger.Debugf("TransferService->loadTxsFromBLockChain: coreTx is invalid")
				continue
			} else {
				validedTxCount++
			}

			payload, _ := tonChain.GetTxPayload(coreTx.InMsg.DecodedBody)
			record, err := s.saveTx(ctx, coreTx.BlockID.Seqno, payload, coreTx.InMsg.Value, TxTransferInitState, "init")
			if err != nil {
				continue
			}

			isStop := s.safeSendToTxsChan(record)
			if isStop {
				return true
			}
		}
		logger.Debugf("TransferService->loadTxsFromBLockChain: tx: len: %d, valided tx count: %d", len(txList), validedTxCount)
		return false
	}

	if s.isCreation {
		const maxRetryCount = 100
		const maxTxCount = 10000
		txList, err := s.accountInst.TryGetAllTxList(ctx, maxTxCount, maxRetryCount)
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
				workFunc := func() bool {
					s.workMutex.Lock()
					defer s.workMutex.Unlock()

					state, err := s.accountInst.GetState(ctx)
					if err != nil {
						return false
					}

					logger.Debugf("TransferService->loadTxsFromBLockChain->go:\nAccountState: (LastTransLt: %+v, LastTransHashHex: %+v,LastTransHashHexBase64: %s)\nsummaryInfo: (LastTransLt: %+v, LastTransHashHex: %+v, LastTransHashBbase64: %s)",
						state.LastTransLt, state.LastTransHash.Hex(), base64.StdEncoding.EncodeToString([]byte(state.LastTransHash[:])),
						s.summaryInfo.LastTransLt, s.summaryInfo.LastTransHash.Hex(), base64.StdEncoding.EncodeToString([]byte(s.summaryInfo.LastTransHash[:])),
					)
					if state.LastTransLt == s.summaryInfo.LastTransLt && state.LastTransHash.Hex() == s.summaryInfo.LastTransHash.Hex() {
						return false
					}

					txList, err := s.accountInst.GetLastTxListUtil(ctx, state.LastTransLt, state.LastTransHash, s.summaryInfo.LastTransLt, s.summaryInfo.LastTransHash)
					if err != nil {
						logger.Errorf("TransferService->loadTxsFromBLockChain->go: GetLastTransactionsUtil error: %s", err.Error())
						return false
					}

					err = s.SyncInitInfo(&TransferSummaryInfo{
						LastTransLt:   state.LastTransLt,
						LastTransHash: &state.LastTransHash,
					})
					if err != nil {
						logger.Errorf("TransferService->loadTxsFromBLockChain->go: SyncSummaryInfo error: %s", err.Error())
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
	_, err := s.saveTx(ctx, record.Seqno, record.Payload, record.Value, TxTransferSuccState, "succ")
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
	_, err := s.saveTx(ctx, record.Seqno, record.Payload, record.Value, TxTransferFailState, errDesc)
	if err != nil {
		return err
	}
	err = s.deleteTx(ctx, record, TxTransferInitState)
	if err != nil {
		return err
	}
	return nil
}

func (s *TransferService) saveTx(ctx context.Context, seqno uint32, payload string, value int64, txTransferState int, errDesc string) (*TransferRecord, error) {
	key := s.getTxWriteDbKey(seqno, txTransferState)
	record := &TransferRecord{
		Ts:      time.Now().UnixMicro(),
		Seqno:   seqno,
		Payload: payload,
		Value:   value,
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
	key := s.getTxWriteDbKey(record.Seqno, txTransferState)
	err := s.db.Delete(ctx, datastore.NewKey(key))
	if err != nil {
		logger.Errorf("TransferService->deleteTx: db.Delete error: %s", err.Error())
		return err
	}
	return nil
}

func (s *TransferService) getTxReadDbKey(seqno uint32, txTransferState int) string {
	prefix := GetTxDbKeyPrefix(txTransferState)
	key := prefix + strconv.FormatUint(uint64(seqno), 10)
	return key
}

func (s *TransferService) getTxWriteDbKey(seqno uint32, txTransferState int) string {
	prefix := GetTxDbKeyPrefix(txTransferState)
	key := prefix + strconv.FormatUint(uint64(seqno), 10) + "/tx"
	return key
}

func (s *TransferService) GetBalance(ctx context.Context) (uint64, error) {
	return s.accountInst.GetBalance(ctx)
}

func (s *TransferService) transferTvs(record *TransferRecord, fee uint64, comment string) error {
	values, _ := url.ParseQuery(record.Payload)
	walletId := values.Get("tvswallet")
	app := values.Get("app")
	logger.Debugf("TransferService->transferTvs: tvswallet: %s, app: %s", walletId, app)

	usdRatio, err := GetTonToUsdRatio()
	if err != nil {
		logger.Errorf("TransferService->transferTvs: GetTonValueForUSD error: %s", err.Error())
		return err
	}

	tvs := Tonwei2tvs(record.Value, usdRatio)
	logger.Debugf("TransferService->transferTvs:\nton wei: %v, usd ratio: %.4f, tvs value: %v", float64(record.Value), usdRatio, tvs)
	err = s.tvSdkInst.TransferTvs(walletId, tvs, fee, comment)
	if err != nil {
		walletId := s.tvSdkInst.GetWallID()
		balance := s.tvSdkInst.GetBalance()
		logger.Errorf("TransferService->waitTxsChan: transferTvs walletID:%v, blance:%v, error: %s", walletId, balance, err.Error())
		return err
	}
	return nil
}
