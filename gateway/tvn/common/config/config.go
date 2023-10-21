package config

import (
	tvbaseConfig "github.com/tinyverse-web3/tvbase/common/config"
)

type Http3Config struct {
	EnableQlog bool
	TcpAddr    string
	UdpAddr    string
	CertPath   string
	PrivPath   string
}

type IpfsConfig struct {
	ShellAddr string
}

type DkvsConfig struct {
	ServiceUrl string
}

type MsgConfig struct {
	ServerUrl string
}

type ProxyConfig struct {
	PrivKey string
}

type TvnGatewayConfig struct {
	Proxy  *ProxyConfig
	Tvbase *tvbaseConfig.TvbaseConfig
	Http3  *Http3Config
	Ipfs   *IpfsConfig
	Dkvs   *DkvsConfig
	Msg    *MsgConfig
}

func NewTvnGatewayConfig() *TvnGatewayConfig {
	ret := &TvnGatewayConfig{
		Proxy: &ProxyConfig{
			PrivKey: "",
		},
		Http3: &Http3Config{
			EnableQlog: false,
			TcpAddr:    "0.0.0.0:443",
			UdpAddr:    "0.0.0.0:4430",
			CertPath:   "./cert.pem",
			PrivPath:   "./priv.key",
		},
		Ipfs: &IpfsConfig{
			ShellAddr: "/ip4/127.0.0.1/tcp/5001",
		},
		Dkvs: &DkvsConfig{
			ServiceUrl: "http://103.103.245.177:9099/tvbase/",
		},
		Msg: &MsgConfig{
			ServerUrl: "http://103.103.245.177:9099/msg/",
		},
	}
	ret.Tvbase = tvbaseConfig.NewDefaultTvbaseConfig()
	return ret
}
