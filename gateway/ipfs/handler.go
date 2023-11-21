package ipfs

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/ipfs/go-cid"
	ipfsLog "github.com/ipfs/go-log/v2"
	"github.com/tinyverse-web3/mtv_go_utils/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/dkvs"
	"github.com/tinyverse-web3/paytoview/gateway/webserver"
)

const (
	logName = "gateway.tvn.ipfs"
)

var logger = ipfsLog.Logger(logName)
var ipfsShell *ipfs.IpfsShellProxy

type ipfsAddResp struct {
	PubKey string
	Cid    string
	Code   int
	Result string
}

type Size interface {
	Size() int64
}

func InitIpfsShell(url string) error {
	var err error
	ipfsShell, err = ipfs.CreateIpfsShellProxy(url)
	if err != nil {
		return err
	}
	return nil
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

		logger.Debugf("ipfs->ipfsAddHandler: pubkey: %s", resp.PubKey)

		if resp.PubKey == "" {
			setErrResp(-1, "invalid param pubkey")
			return
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
			setErrResp(-1, err.Error())
			return
		}
		if file == nil {
			setErrResp(-1, fmt.Errorf("ipfs->ipfsAddHandler: FormFile file is nil").Error())
			return
		}

		defer file.Close()

		if sizeInterface, ok := file.(Size); ok {
			size := sizeInterface.Size()
			content := make([]byte, size)
			file.Read(content)
			resp.Cid, err = ipfsShell.Add(bytes.NewReader(content))
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
	if r.Method == http.MethodGet {
		w.WriteHeader(http.StatusOK)

		setErrResp := func(code int, result string) {
			logger.Debugf("ipfs->ipfsCatHandler: setErrResp: code: %d, result: %s", code, result)
			w.Header().Set("Content-Type", "application/json")

			msg := fmt.Sprintf(`{"code":%d,"result":"%s"}`, code, result)
			w.Write([]byte(msg))
		}

		logger.Debugf("ipfs->ipfsCatHandler: reqParams: %+v", r.URL.Query())

		// pubkey := r.URL.Query().Get("pubkey")

		// if pubkey == "" {
		// 	setErrResp(-1, "invalid param pubkey")
		// 	return
		// }

		cidStr := r.URL.Query().Get("cid")
		if cidStr == "" {
			setErrResp(-1, "invalid param cid")
			return
		}

		_, err := cid.Decode(cidStr)
		if err != nil {
			setErrResp(-1, "invalid cid format")
			return
		}

		// if c.Version() < 1 {
		// 	setErrResp(-1, "invalid cid version")
		// 	return
		// }

		// if !dkvs.IsExistUserProfile(pubkey) {
		// 	setErrResp(-1, "user profile not exist")
		// 	return
		// }

		isPin := ipfsShell.IsPin(cidStr)
		if !isPin {
			setErrResp(-1, "cid is not pin")
			return
		}

		logger.Debugf("ipfs->ipfsCatHandler: cidStr: %s", cidStr)

		reader, err := ipfsShell.Cat(cidStr)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		logger.Debugf("ipfs->ipfsCatHandler: cidStr: %s", cidStr)
		// data, err := io.ReadAll(reader)
		// if err != nil {
		// 	setErrResp(-1, err.Error())
		// 	return
		// }

		// w.Header().Set("Content-Type", "image/jpeg")
		// w.Header().Set("Cache-Control", "no-cache")
		// w.Header().Set("Transfer-Encoding", "chunked")

		// len1 := len(data)
		// logger.Debugf("ipfs->ipfsCatHandler: len: %d", len1)
		// // data1 := data[:len1-200000]
		// len, err := w.Write(data)

		len, err := io.Copy(w, reader)
		if err != nil {
			logger.Errorf("ipfs->ipfsCatHandler: error: %+v", err)
			setErrResp(-1, err.Error())
			return
		}

		logger.Debugf("ipfs->ipfsCatHandler: len: %d", len)

		w.Header().Set("Content-Disposition", "attachment; filename="+cidStr)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}
