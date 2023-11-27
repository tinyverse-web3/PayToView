package ton

import (
	"reflect"

	"github.com/tinyverse-web3/transferService/adnl/core"
)

func GetTransactionPayload(decodeBody *core.DecodedMessageBody) (ret string, err error) {
	v := reflect.ValueOf(decodeBody.Value)
	fieldValue := v.FieldByName("Text")
	if fieldValue.Kind() == reflect.String {
		ret = fieldValue.String()
	}
	return ret, err
}
