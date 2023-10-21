package ipfs

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/ipfs/go-cid"
	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/tinyverse-web3/mtv_go_utils/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/util"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/webserver"
)

const (
	logName = "gateway.tvn.ipfs"
)

var logger = ipfsLog.Logger(logName)

type ipfsAddResp struct {
	PubKey string
	Cid    string
	Code   int
	Result string
}

type ipfsCatResp struct {
	PubKey string
	Cid    string
	Code   int
	Result string
}

type Size interface {
	Size() int64
}

func RegistHandler(h webserver.WebServerHandle) {
	h.AddHandler("/ipfs/add", ipfsAddHandler)
	h.AddHandler("/ipfs/cat", ipfsCatHandler)
}

func ipfsAddHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		resp := ipfsAddResp{
			PubKey: r.PostFormValue("pubkey"),
			Cid:    "",
			Code:   0,
			Result: "succ",
		}

		setErrResp := func(code int, result string) {
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			len, err := io.WriteString(w, string(jsonData))
			if err != nil {
				logger.Errorf("ipfs->ipfsAddHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("ipfs->ipfsAddHandler: WriteString len: %d", len)
		}

		if !dkvs.IsExistUserProfile(resp.PubKey) {
			setErrResp(-1, "user profile not exist")
			return
		}

		var sizeInBytes int64 = 100 * 1024 * 1024 // 100M
		err := r.ParseMultipartForm(sizeInBytes)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		var file multipart.File
		file, _, err = r.FormFile("file")
		if err != nil {
			file.Close()
			setErrResp(-1, err.Error())
			return
		}
		defer file.Close()

		if sizeInterface, ok := file.(Size); ok {
			size := sizeInterface.Size()
			content := make([]byte, size)
			file.Read(content)
			resp.Cid, err = ipfs.GetIpfsShellProxy().Add(bytes.NewReader(content))
			if err != nil {
				setErrResp(-1, err.Error())
				return
			}
		}

		jsonData, _ := json.Marshal(resp)
		len, err := io.WriteString(w, string(jsonData))
		if err != nil {
			logger.Errorf("ipfs->ipfsAddHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("ipfs->ipfsAddHandler: WriteString len: %d", len)
		return
	}

	io.WriteString(w, `<html><body><form action="/ipfs/add" method="post" enctype="multipart/form-data">
	<input type="file" name="file"><br>
	<input type="submit">
</form></body></html>`)
}

func ipfsCatHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.WriteHeader(http.StatusOK)

		resp := ipfsCatResp{
			PubKey: "",
			Cid:    "",
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
				logger.Errorf("ipfs->ipfsCatHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("ipfs->ipfsCatHandler: WriteString len: %d", len)
		}

		reqParams := map[string]string{}
		err := util.ParseJsonForm(r.Body, reqParams)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		logger.Debugf("ipfs->ipfsCatHandler: reqParams: %+v", reqParams)

		resp.PubKey = reqParams["pubkey"]
		if resp.PubKey == "" {
			setErrResp(-1, "invalid param pubkey")
			return
		}

		resp.Cid = reqParams["cid"]
		if resp.Cid == "" {
			setErrResp(-1, "invalid param cid")
			return
		}

		c, err := cid.Decode(resp.Cid)
		if err != nil {
			setErrResp(-1, "invalid cid format")
			return
		}

		if c.Version() < 1 {
			setErrResp(-1, "invalid cid version")
			return
		}

		if !dkvs.IsExistUserProfile(resp.PubKey) {
			setErrResp(-1, "user profile not exist")
			return
		}

		reader, err := ipfs.GetIpfsShellProxy().Cat(resp.Cid)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		len, err := io.Copy(w, reader)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		logger.Debugf("ipfs->ipfsCatHandler: len: %d", len)

		w.Header().Set("Content-Disposition", "attachment; filename="+resp.Cid)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}
