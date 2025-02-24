//go:build js && wasm

package tests

import (
	"bytes"
	"io"
	"os"
	"testing"

	"github.com/alwinsDen/a004/actions"
)

func TestEntryPoint(t *testing.T) {
	originialOutputChannel := os.Stdout
	var r *os.File
	var w *os.File
	var err error
	if r, w, err = os.Pipe(); err != nil {
		t.Errorf("Failed to create pipe: %v", err)
	}
	os.Stdout = w
	actions.EntryPoint()
	w.Close()
	var outputData bytes.Buffer
	io.Copy(&outputData, r)
	os.Stdout = originialOutputChannel
	expectedOutputData := "wasm compile test::alwinsDens\n"
	if outputData.String() != expectedOutputData {
		t.Errorf("Expected output: %s, but got: %s", expectedOutputData, outputData.String())
	}
}
