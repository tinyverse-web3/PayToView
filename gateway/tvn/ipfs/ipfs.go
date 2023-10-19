package ipfs

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/ipfs/go-cid"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/http3"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/ipfs"
)

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

func RegistIpfsHandle(h *http3.Http3Server) {
	h.AddHandler("/ipfs/add", ipfsAddHandler)
	h.AddHandler("/ipfs/cat", ipfsCatHandler)
}

func ipfsAddHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		r.ParseForm()

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
				logger.Errorf("ipfsAddHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("ipfsAddHandler: WriteString len: %d", len)
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
			logger.Errorf("ipfsAddHandler: WriteString: error: %+v", err)
		}
		logger.Debugf("ipfsAddHandler: WriteString len: %d", len)
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
		r.ParseForm()
		resp := ipfsCatResp{
			PubKey: r.PostFormValue("pubkey"),
			Cid:    r.PostFormValue("cid"),
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
				logger.Errorf("ipfsCatHandler: WriteString: error: %+v", err)
			}
			logger.Debugf("ipfsCatHandler: WriteString len: %d", len)
		}

		if resp.PubKey == "" || resp.Cid == "" {
			setErrResp(-1, "invalid params")
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
		logger.Debugf("ipfsCatHandler: len: %d", len)

		w.Header().Set("Content-Disposition", "attachment; filename="+resp.Cid)
		return
	}
}