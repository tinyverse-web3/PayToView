package ipfs

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/ipfs/go-cid"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/common/ipfs"
	"github.com/tinyverse-web3/paytoview/gateway/tvn/http3"
)

type ipfsAddResp struct {
	Cid    string
	Code   int
	Result string
}

type ipfsCatResp struct {
	Cid    string
	Code   int
	Result string
}

type Size interface {
	Size() int64
}

type IpfsService struct {
	server *http3.Http3Server
}

func NewIpfsService(h *http3.Http3Server) *IpfsService {
	ret := &IpfsService{
		server: h,
	}
	ret.initHttpHandler()
	return ret
}

func (s *IpfsService) ipfsAddHandler(w http.ResponseWriter, r *http.Request) {
	resp := ipfsAddResp{
		Cid:    "",
		Code:   0,
		Result: "succ",
	}

	if r.Method == http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		var sizeInBytes int64 = 100 * 1024 * 1024 // 100M

		setErrResp := func(code int, result string) {
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			io.WriteString(w, string(jsonData))
		}

		err := r.ParseMultipartForm(sizeInBytes)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
		var file multipart.File
		file, _, err = r.FormFile("uploadfile")
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}
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
		io.WriteString(w, string(jsonData))
		return
	}

	io.WriteString(w, `<html><body><form action="/ipfs/add" method="post" enctype="multipart/form-data">
	<input type="file" name="uploadfile"><br>
	<input type="submit">
</form></body></html>`)
}

func (s *IpfsService) ipfsCatHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		resp := ipfsCatResp{
			Cid:    r.URL.Query().Get("cid"),
			Code:   0,
			Result: "succ",
		}

		setErrResp := func(code int, result string) {
			w.Header().Set("Content-Type", "application/json")
			resp.Code = -1
			resp.Result = result
			jsonData, _ := json.Marshal(resp)
			io.WriteString(w, string(jsonData))
		}

		c, err := cid.Decode(resp.Cid)
		if err != nil {
			setErrResp(-1, err.Error())
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

		_, err = io.Copy(w, reader)
		if err != nil {
			setErrResp(-1, err.Error())
			return
		}

		w.Header().Set("Content-Disposition", "attachment; filename="+resp.Cid)
		return
	}
}

func (s *IpfsService) initHttpHandler() {
	s.server.AddHandler("/ipfs/add", s.ipfsAddHandler)
	s.server.AddHandler("/ipfs/cat", s.ipfsCatHandler)
}
