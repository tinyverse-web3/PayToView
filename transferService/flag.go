package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"sort"
	"time"

	"github.com/ipfs/go-datastore/query"
	levelds "github.com/ipfs/go-ds-leveldb"
	ldbopts "github.com/syndtr/goleveldb/leveldb/opt"
	"github.com/tinyverse-web3/transferService/service/eth"
	"github.com/tinyverse-web3/transferService/service/ton"
	"github.com/tinyverse-web3/transferService/util"
)

const (
	defaultPathRoot = "./data"
	configFileName  = "config.json"
)

func parseCmdParams() (string, string, string) {
	rootPath := flag.String("rootPath", defaultPathRoot, "config file path")
	tvsAccountPassword := flag.String("tvsAccountPassword", "12345678", "account password")
	env := flag.String("env", "dev", "env dev or prod.")
	exportTxs := flag.Bool("exportTxs", false, "Export txs.")
	init := flag.Bool("init", false, "Init.")
	help := flag.Bool("help", false, "Display help")
	flag.Parse()

	if *help {
		logger.Info("tinverse paytoview chain transfer service for ton and eth")
		logger.Info("Step1: Run './transferService -rootPath ./data -init'")
		logger.Info("Step2: Run './transferService -rootPath ./data -tvsAccountPassword 12345678 -env dev' start service.")
		logger.Info("Step3: Run './transferService -rootPath ./data -exportTxs' export all tx list for ton and eth.")
		os.Exit(0)
	}

	if *init {
		// init config
		dataPath, err := util.GetFullPath(*rootPath)
		if err != nil {
			logger.Fatalf("GetFullPath error: %v", err)
		}
		_, err = os.Stat(dataPath)
		if os.IsNotExist(err) {
			err := os.MkdirAll(dataPath, 0755)
			if err != nil {
				logger.Fatalf("MkdirAll error: %v", err)
			}
		}
		cfg := NewDefaultAppConfig()
		file, _ := json.MarshalIndent(cfg, "", " ")
		if err := os.WriteFile(dataPath+configFileName, file, 0644); err != nil {
			logger.Fatalf("WriteFile error: %v", err)
		}

		logger.Infof("init transfer service config success.")

		// init sdk
		tvSdkInst, err = initTvSdk(dataPath, *tvsAccountPassword)
		if err != nil {
			logger.Fatalf("initTvSdk error: %v", err)
		}
		logger.Infof("init tvsdk account data success.")

		// init transferSummary in dkvs
		err = initAccountSummaryForDkvs(dataPath, *tvsAccountPassword)
		if err != nil {
			logger.Fatalf("initDkvs error: %v", err)
		}
		logger.Infof("init account transfer summary in dkvs is success.")
		os.Exit(0)
	}

	if *exportTxs {
		err := exportTxList(*rootPath, "ton")
		if err != nil {
			logger.Fatalf("exportTxs error: %v", err)
		}
		err = exportTxList(*rootPath, "eth")
		if err != nil {
			logger.Fatalf("exportTxs error: %v", err)
		}

		os.Exit(0)
	}

	return *rootPath, *tvsAccountPassword, *env
}

func initAccountSummaryForDkvs(rootPath string, tvsAccountPassword string) error {
	accountPk, err := tvSdkInst.GetAccountStorePubkey()
	if err != nil {
		return err
	}

	// init ton dkvs
	key := ton.GetInitInfoKey(accountPk)
	logger.Infof("initAccountSummaryForDkvs: init ton account summary key: %s", key)
	err = tvSdkInst.SetDKVS(key, nil, 2*time.Second)
	if err != nil {
		return err
	}

	// show record.Validity
	// record, err := tvSdkInst.GetRecordFromDKVS(key)
	// if err != nil {
	// 	return err
	// }

	// fmt.Printf("record.Validity: %v\n", time.UnixMilli(int64(record.Validity)).Format("2006-01-02 15:04:05"))
	// fmt.Printf("record: %v\n", record)

	// init eth dkvs
	key = eth.GetInitInfoKey(accountPk)
	logger.Infof("initAccountSummaryForDkvs: init eth account summary key: %s", key)
	err = tvSdkInst.SetDKVS(key, nil, 2*time.Second)
	if err != nil {
		return err
	}

	// show record.Validity
	// record, err := tvSdkInst.GetRecordFromDKVS(key)
	// if err != nil {
	// 	return err
	// }

	// fmt.Printf("record.Validity: %v\n", time.UnixMilli(int64(record.Validity)).Format("2006-01-02 15:04:05"))
	// fmt.Printf("record: %v\n", record)

	return nil
}

func exportTxList(rootPath string, chain string) error {
	dbname := ""
	switch chain {
	case "ton":
		dbname = ton.DBName
	case "eth":
		dbname = eth.DBName
	default:
		return fmt.Errorf("invalid chain: %s", chain)
	}
	rootPath, err := util.GetFullPath(rootPath)
	if err != nil {
		return err
	}
	dbFilePath := rootPath + dbname
	_, err = os.Stat(dbFilePath)
	if os.IsNotExist(err) {
		return fmt.Errorf("db file not exist: %s", dbFilePath)
	}
	db, err := levelds.NewDatastore(dbFilePath, &levelds.Options{
		Compression: ldbopts.NoCompression,
	})
	if err != nil {
		return err
	}
	defer db.Close()

	exportTxs := func(exportFilePath string, transferState int) error {
		var query = query.Query{
			Prefix: ton.GetTxDbKeyPrefix(transferState),
		}
		results, err := db.Query(context.Background(), query)
		if err != nil {
			return err
		}
		defer results.Close()

		var recordList []*ton.TransferRecord
		for result := range results.Next() {
			record := ton.TransferRecord{}
			err := json.Unmarshal(result.Value, &record)
			if err != nil {
				fmt.Printf("err: %v\n", err)
				return err
			}

			recordList = append(recordList, &record)
		}
		sort.Slice(recordList, func(i, j int) bool {
			return recordList[i].Seqno < recordList[j].Seqno
		})

		jsonData, err := json.MarshalIndent(recordList, "", "  ")
		if err != nil {
			return err
		}
		err = os.WriteFile(exportFilePath, jsonData, 0644)
		if err != nil {
			return err
		}
		return nil
	}

	err = exportTxs(rootPath+"txs-init.json", ton.TxTransferInitState)
	if err != nil {
		return err
	}
	exportTxs(rootPath+"txs-succ.json", ton.TxTransferSuccState)
	if err != nil {
		return err
	}
	exportTxs(rootPath+"txs-fail.json", ton.TxTransferFailState)
	if err != nil {
		return err
	}
	return nil
}
