package core

// Pointer returns pointer to copy of object
func Pointer[T any](o T) *T {
	return &o
}
