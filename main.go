//go:build js && wasm

package main

import (
	"syscall/js"

	"github.com/alwinsDen/a004/actions"
)

func main() {
	actions.EntryPoint()

	c := make(chan struct{}, 0)
	js.Global().Set("initWebGPU", js.FuncOf(actions.InitWebGPU))
	<-c
	// [C not supported in Go wasm compiler yet.]
	// actions.CExperimental()
}
