package dkvs

import "fmt"

func IsExistUserProfile(userPubkey string) bool {
	key := fmt.Sprintf("/%s/%s/%s", "user", userPubkey, "Profile")
	value, _, _, _, _, err := dkvsService.Get(key)
	if err != nil || value == nil {
		return false
	}
	return true
}
