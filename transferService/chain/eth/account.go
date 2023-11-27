package eth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type Account struct {
	accountId       string
	etherScanRpc    string
	etherScanApiKey string
	enableLog       bool
	logPath         string
}

func NewAccount() *Account {
	ret := &Account{}
	return ret
}

func (s *Account) Init(isTestnet bool, etherScanApiKey, addr string) (err error) {
	s.accountId = addr
	s.etherScanApiKey = etherScanApiKey

	if isTestnet {
		s.etherScanRpc = SepoliaEtherScanRpc
	} else {
		s.etherScanRpc = MainnetEtherScanRpc
	}
	return nil
}

func (s *Account) String() string {
	return s.accountId
}

func (s *Account) GetTxList(ctx context.Context, startBlock string, maxTxCount int, sort string) ([]Tx, error) {
	getTxListRpc := fmt.Sprintf("%s?module=account&action=txlist&address=%s&startblock=%s&endblock=99999999&page=1&offset=%d&sort=%s&apikey=%s",
		s.etherScanRpc, s.accountId, startBlock, maxTxCount, sort, s.etherScanApiKey)
	response, err := http.Get(getTxListRpc)
	if err != nil {
		logger.Errorf("Account.GetTxList: http.Get error: %v", err)
		return nil, err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		logger.Errorf("Account.GetTxList: io.ReadAll error: %v", err)
		return nil, err
	}

	resp := AcountTxListResp{}
	err = json.Unmarshal(body, &resp)
	if err != nil {
		logger.Errorf("Account.GetTxList: json.Unmarshal error: %v", err)
		return nil, err
	}
	if resp.Status != "1" {
		logger.Errorf("Account.GetTxList: resp.Status != 1, status: %v", resp.Status)
		return nil, fmt.Errorf("Account.GetTxList: resp.Status != 1, status: %v", resp.Status)
	}
	if resp.Message != "OK" {
		logger.Errorf("Account.GetTxList: resp.Message != OK, message: %v", resp.Message)
		return nil, fmt.Errorf("Account.GetTxList: resp.Message != OK, message: %v", resp.Message)
	}

	if err := s.logTx(resp.Result); err != nil {
		return resp.Result, err
	}

	return resp.Result, nil
}

func (s *Account) GetBalance() (string, error) {
	rpcUrl := fmt.Sprintf("%s?module=account&action=balance&address=%s&tag=latest&apikey=%s",
		s.etherScanRpc, s.accountId, s.etherScanApiKey)

	response, err := http.Get(rpcUrl)
	if err != nil {
		logger.Errorf("GetAccountBalance: http.Get error: %v", err)
		return "", err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		logger.Errorf("GetAccountBalance: io.ReadAll error: %v", err)
		return "", err
	}

	resp := AcountBalanceResp{}
	err = json.Unmarshal(body, &resp)
	if err != nil {
		logger.Errorf("GetAccountBalance: json.Unmarshal error: %v", err)
		return "", err
	}
	if resp.Status != "1" {
		logger.Errorf("GetAccountBalance: resp.Status != 1, status: %v", resp.Status)
		return "", fmt.Errorf("GetAccountBalance: resp.Status != 1, status: %v", resp.Status)
	}
	if resp.Message != "OK" {
		logger.Errorf("GetAccountBalance: resp.Message != OK, message: %v", resp.Message)
		return "", fmt.Errorf("GetAccountBalance: resp.Message != OK, message: %v", resp.Message)
	}
	return resp.Result, nil
}

func (s *Account) Release() {
	s.enableLog = false
	s.logPath = ""
	s.etherScanRpc = ""
	s.etherScanApiKey = ""
}

func (s *Account) SetLog(enableLog bool, logPath string) (err error) {
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

func (s *Account) logTx(txList []Tx) error {
	if !s.enableLog {
		return nil
	}

	filePath := s.logPath + "txs_" + s.accountId + "_" + time.Now().Format("20060102-150405") + ".log"
	logFile, err := os.Create(filePath)
	if err != nil {
		logger.Errorf("Account.logTx: Create error: %v", err)
		return err
	}
	defer logFile.Close()

	data, err := json.MarshalIndent(txList, "", " ")
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
