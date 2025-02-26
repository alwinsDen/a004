//go:build js && wasm

package actions

import (
	"fmt"
	"syscall/js"
)

func EntryPoint() {
	fmt.Println("wasm compile test::alwinsDens")
}

// glbal variable definition
var (
	window   = js.Global()
	document = window.Get("document")
	gpu      = window.Get("navigator").Get("gpu")
)

// initialize webgpu
func InitWebGPU(this js.Value, args []js.Value) interface{} {
	renderState := document.Call("getElementById", "gpuCanvas")
	//request adapter
	adapter_promise := gpu.Call("requestAdapter", map[string]interface{}{
		"powerPreference": "high-performance",
	})

	//handle adapter promise
	adapter_promise.Call("then", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		adapter := args[0]
		device_promise := adapter.Call("requestDevice", map[string]interface{}{})
		device_promise.Call("then", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			device := args[0]
			context := renderState.Call("getContext", "webgpu")
			context.Call("configure", map[string]interface{}{
				"device": device,
				"format": "bgra8unorm",
				"usage":  js.ValueOf(GPUTextureUsage_RENDER_ATTACHMENT),
			})
			return nil
		}))
		return nil
	}))
	return nil
}

const (
	GPUTextureUsage_RENDER_ATTACHMENT = 0x4
)
