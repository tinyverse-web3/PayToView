package util

import (
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"

	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	log "github.com/ipfs/go-log/v2"
	"github.com/libp2p/go-libp2p/core/crypto"
)

func GetRootPath(path string) (string, error) {
	path = strings.Trim(path, " ")
	if path == "" {
		path = "."
	}

	if !filepath.IsAbs(path) {
		defaultRootPath, err := os.Getwd()
		if err != nil {
			return path, err
		}
		path = filepath.Join(defaultRootPath, path)
	}
	if !strings.HasSuffix(path, string(os.PathSeparator)) {
		path += string(os.PathSeparator)
	}
	return path, nil
}

func ParseJsonForm(reader io.Reader, ret map[string]string) error {
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

func SetLogModule(moduleLevels map[string]string) error {
	var sortedModuleList []string
	for module := range moduleLevels {
		sortedModuleList = append(sortedModuleList, module)
	}
	sort.Strings(sortedModuleList)
	for _, module := range sortedModuleList {
		level := moduleLevels[module]
		err := log.SetLogLevelRegex(module, level)
		if err != nil {
			return err
		}
	}
	return nil
}

func GenEd25519Key() (privkey string, pubkey string, err error) {
	privk, _, err := crypto.GenerateKeyPair(crypto.Ed25519, 0)
	if err != nil {
		return "", "", err
	}

	data, err := crypto.MarshalPrivateKey(privk)
	if err != nil {
		return "", "", err
	}

	pubkData, err := crypto.MarshalPublicKey(privk.GetPublic())
	if err != nil {
		return "", "", err
	}

	return base64.StdEncoding.EncodeToString(data), base64.StdEncoding.EncodeToString(pubkData), nil
}

func GenEcdsaKey() (privkey string, pubkey string, err error) {
	privk, err := eth_crypto.GenerateKey()
	if err != nil {
		return "", "", err
	}

	return hex.EncodeToString(eth_crypto.FromECDSA(privk)), hex.EncodeToString(eth_crypto.FromECDSAPub(&privk.PublicKey)), nil
}
