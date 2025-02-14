package tests

import (
	"bytes"
	"io"
	"os"
	"testing"
)

func TestMain(t *testing.T) {
	originialOutputChannel := os.Stdout
	w, r, _ := os.Pipe()
	os.Stdout = w

	// a004.Main()

	w.Close()
	var outputData bytes.Buffer
	io.Copy(&outputData, r)
	os.Stdout = originialOutputChannel
	expectedOutputData := "wasm compile test\n"
	if outputData.String() != expectedOutputData {
		t.Errorf("Expected output: %s, but got: %s", expectedOutputData, outputData.String())
	}
}
