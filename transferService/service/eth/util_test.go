package eth

import "testing"

func TestParseCommmentFromTxData(t *testing.T) {
	txDataHex := "0x48656c6c6f20776f726c642c204920616d206a61636b79206368656e2e74767377616c6c65743d303830313132323039653632326435333566663633363465633861376266326239343632346333373735363066306435666237656262346266636233656230323335353561316234266170703d706179546f56696577"
	const expectedComment = "Hello world, I am jacky chen.tvswallet=080112209e622d535ff6364ec8a7bf2b94624c377560f0d5fb7ebb4bfcb3eb023555a1b4&app=payToView"

	comment, err := ParseCommmentFromTxData(txDataHex)
	if err != nil {
		t.Error(err)
	}
	if comment != expectedComment {
		t.Error("expected comment", expectedComment, "but got", comment)
	}
}
