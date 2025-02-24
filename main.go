//go:build js && wasm

package main

import (
	"github.com/alwinsDen/a004/actions"
)

func main() {
	actions.EntryPoint()
	// [C not supported in Go wasm compiler yet.]
	// actions.CExperimental()
}
