package dkvs

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	"github.com/tinyverse-web3/tvbase/common"
	dkvspb "github.com/tinyverse-web3/tvbase/dkvs/pb"
)

type dkvsGetResp struct {
	Key    string
	Record *dkvspb.DkvsRecord
	Code   int
	Result string
}

type dkvsPutResp struct {
	Key    string
	Code   int
	Result string
}

var dkvsService common.DkvsService

func RegistHandler(hs *http3.Http3Server, ds common.DkvsService) {
	dkvsService = ds
	hs.AddHandler("/dkvs/get", dkvsGetHandler)
	hs.AddHandler("/dkvs/put", dkvsPutHandler)
}

func dkvsGetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		r.ParseForm()

		key := r.PostFormValue("key")
		resp := dkvsGetResp{
			Key:    key,
			Record: &dkvspb.DkvsRecord{},
			Code:   0,
			Result: "succ",
		}

		setErrResp := func(code int, result string) {
			w.Header().Set("Content-Type", "application/json")
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			len, err := io.WriteString(w, string(jsonData))
			if err != nil {
				logger.Errorf("dkvs->dkvsGetHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("dkvs->dkvsGetHandler: WriteString len: %d", len)
		}

		var err error
		resp.Record, err = dkvsService.GetRecord(key)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		jsonData, _ := json.Marshal(resp)
		w.WriteHeader(http.StatusOK)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("dkvs->dkvsGetHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("dkvs->dkvsGetHandler: WriteString len: %d", len)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}

func parseJsonForm(reader io.Reader, ret map[string]string) error {
	body, err := io.ReadAll(reader)
	if err != nil {
		return err
	}
	err = json.Unmarshal(body, &ret)
	if err != nil {
		return err
	}
	return nil
}

func dkvsPutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		resp := dkvsPutResp{
			Key:    "",
			Code:   0,
			Result: "succ",
		}
		setErrResp := func(code int, result string) {
			w.Header().Set("Content-Type", "application/json")
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			len, err := io.WriteString(w, string(jsonData))
			if err != nil {
				logger.Errorf("dkvs->dkvsPutHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("dkvs->dkvsPutHandler: WriteString len: %d", len)
		}

		reqParams := map[string]string{}
		err := parseJsonForm(r.Body, reqParams)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		logger.Debugf("dkvs->dkvsPutHandler: reqParams:\n%+v", reqParams)

		key := reqParams["key"]
		if key == "" {
			setErrResp(-1, "invalid params key")
			return
		}
		resp.Key = key

		value, err := base64.StdEncoding.DecodeString(reqParams["value"])
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		pubkey, err := base64.StdEncoding.DecodeString(reqParams["pubkey"])
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		issuetime := uint64(time.Now().UnixMilli())

		sig, err := base64.StdEncoding.DecodeString(reqParams["sig"])
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		ttl, err := strconv.ParseUint(reqParams["ttl"], 10, 64)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		err = dkvsService.Put(key, value, pubkey, issuetime, ttl, sig)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		jsonData, _ := json.Marshal(resp)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("dkvs->dkvsPutHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("dkvs->dkvsPutHandler: WriteString len: %d", len)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}
