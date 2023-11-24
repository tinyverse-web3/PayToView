package bot

// reference: https://gitlab.com/Athamaxy/telegram-bot-tutorial/

import (
	_ "github.com/btcsuite/btcd/chaincfg/chainhash"
)

var (

	// log
	Server_Type = "sdk"
	App_Name    = "mtv"
	Log_Level   = "debug"
	//gin web server port
	Web_Port = "7070"
	//bot config
	BOT_TOKEN    = "6591734251:AAEHFZXOhX4h-j_s03Y23ojXeSPULClLEtQ"
	MONGO_DB_URI = "mongodb://localhost:27017"
	//ipfs
	IPFS_IMAGE_API_BASE  = "https://dashboard.dkvs.xyz/ipfs/"
	IPFS_IMAGE_API_PARAM = "cat?cid="
	IPFS_IMAGE_API_URL   = IPFS_IMAGE_API_BASE + IPFS_IMAGE_API_PARAM
)
