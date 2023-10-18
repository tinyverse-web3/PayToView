package config

type Http3Config struct {
	EnableQlog bool
	Addr       string
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

type TvnGatewayConfig struct {
	Http3 Http3Config
	Ipfs  IpfsConfig
	Dkvs  DkvsConfig
	Msg   MsgConfig
}

func NewTvnGatewayConfig() *TvnGatewayConfig {
	ret := &TvnGatewayConfig{
		Http3: Http3Config{
			EnableQlog: false,
			Addr:       "localhost:80",
			CertPath:   "./cert.pem",
			PrivPath:   "./priv.key",
		},
		Ipfs: IpfsConfig{
			ShellAddr: "/ip4/127.0.0.1/5001",
		},
		Dkvs: DkvsConfig{
			ServiceUrl: "http://103.103.245.177:9099/tvbase/",
		},
		Msg: MsgConfig{
			ServerUrl: "http://103.103.245.177:9099/msg/",
		},
	}

	return ret
}

/*
// 			GatewayAddr: "http://103.103.245.177/8080/ipfs/",
[
    {
        "key": "local: /tvnode/0801122040dec635f54ce18e0786a2df9560fde1d749405abb2aaf7e55891bb1f60b8c42",
        "put_time": "",
        "validity": "",
        "pub_key": "",
        "value": "key does not exist in dht datastore: datastore: key not found"
    },
    {
        "key": "network: /tvnode/0801122040dec635f54ce18e0786a2df9560fde1d749405abb2aaf7e55891bb1f60b8c42",
        "put_time": "",
        "validity": "",
        "pub_key": "",
        "value": "failed to call  dkvsService.GetRecord(queryKey): routing: not found"
    }
]


// http://103.103.245.177:9099/tvbase/queryKey?key=/tvnode/0801122040dec635f54ce18e0786a2df9560fde1d749405abb2aaf7e55891bb1f60b8c42
*/
