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
	r,w, _ := os.Pipe()
	os.Stdout = w
	actions.EntryPoint()
	w.Close()
	var outputData bytes.Buffer
	io.Copy(&outputData, r)
	os.Stdout = originialOutputChannel
	expectedOutputData := "wasm compile test::alwinsDen\n"
	if outputData.String() != expectedOutputData {
		t.Errorf("Expected output: %s, but got: %s", expectedOutputData, outputData.String())
	}
}
