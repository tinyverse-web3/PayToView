package modules

// stringInSlice checks if a string is present in a slice of strings.
//
// Parameters:
// - a: the string to check for.
// - list: the slice of strings to search in.
//
// Returns:
// - bool: true if the string is found in the slice, false otherwise.
func stringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}
