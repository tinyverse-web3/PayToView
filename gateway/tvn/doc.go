package main

//gateway service

// 1 dkvs service
// getValue
// path: /dkvs/get
// method: post
// params:
// - key string
// return:
// - code int
//  - 0: succ
//  - -1 failure
// - result string
// DkvsRecord struct

// putValue
// path: /dkvs/put
// method: post
// params:
// - key string
// - value []byte
// - pubkey string
// - issuetime uin64
// - ttl uin64
// - sig []byte
// return
// - 0: succ
// - -1 failure

// 2 ipfs service
// add
// path: /ipfs/add
// method: post
// enctype: "multipart/form-data"
// input name: file
// params:
// - pubkey string
// return:
// - code int
//  -  0: succ
//  - -1 failure
// - result string

// cat download cid content for file
// path: /ipfs/cat
// method: post
// params:
// - pubkey string
// - cid string
// return:
// - code int
//  - 0: succ
//  - -1 failure
// - result string
// DkvsRecord struct

// cat download cid content for file
// path:  http://103.103.245.177:8080/ipfs/{cid}
// method: get
// params:
// - cid string

// 3 msg service

// sendmsg
// path: /msg/sendmsg
// method: post
// params:
// - pubkey string
// - destPubkey string
// - content []byte
// return:
// - code int
//  -  0: succ
//  - -1 failure
// - result string

// readmailbox
// path: /msg/readmailbox
// method: post
// params:
// - pubkey string
// - timeout int64, no must
// - content []byte
// return:
// - code int
//  -  0: succ
//  - -1 failure
// - result string
// - MsgList []dmsg.Msg
