package dkvs

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

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

type Size interface {
	Size() int64
}

var dkvsService common.DkvsService

func IsExistUserProfile(userPubkey string) bool {
	key := fmt.Sprintf("/%s/%s/%s", "user", userPubkey, "Profile")
	value, _, _, _, _, err := dkvsService.Get(key)
	if err != nil || value == nil {
		return false
	}
	return true
}

func RegistHandle(hs *http3.Http3Server, ds common.DkvsService) {
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
				logger.Errorf("dkvsGetHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("dkvsGetHandler: WriteString len: %d", len)
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
			logger.Errorf("dkvsGetHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("dkvsGetHandler: WriteString len: %d", len)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}

func dkvsPutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		r.ParseForm()

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
				logger.Errorf("dkvsPutHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("dkvsPutHandler: WriteString len: %d", len)
		}

		key := r.PostFormValue("key")
		if key == "" {
			setErrResp(-1, "invalid params key")
			return
		}
		resp.Key = key

		value, err := base64.StdEncoding.DecodeString(r.PostFormValue("value"))
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		pubkey, err := base64.StdEncoding.DecodeString(r.PostFormValue("pubkey"))
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		issuetime, err := strconv.ParseUint(r.PostFormValue("issuetime"), 10, 64)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		ttl, err := strconv.ParseUint(r.PostFormValue("ttl"), 10, 64)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		sig, err := base64.StdEncoding.DecodeString(r.PostFormValue("sig"))
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
			logger.Errorf("dkvsPutHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("dkvsPutHandler: WriteString len: %d", len)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}
