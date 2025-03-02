# a004 wasm module

golang wasm module.

compile:

```bash
GOOS=js GOARCH=wasm go build -o served_wasm/main.wasm
```

serve wasm files:

```bash
# install goexec: go install github.com/shurcooL/goexec@latest
goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`./served_wasm`)))'
```

compile c code [C not supported in Go wasm compiler yet though.]:

```bash
gcc -c c_interface/test.c -o c_interface/test.o
```

Node-based wasm run:

```bash
export PATH="$PATH:$(go env GOROOT)/misc/wasm"
GOOS=js GOARCH=wasm go run .
#tests
GOOS=js GOARCH=wasm go test ./tests
```

references:

-   https://github.com/mokiat/wasmgpu

research:

-   https://arxiv.org/pdf/2407.07852
-   https://arxiv.org/pdf/2411.19870
-   https://www.primeintellect.ai/blog/opendiloco
-   https://github.com/NousResearch/DisTrO/blob/main/A_Preliminary_Report_on_DisTrO.pdf
-   https://arxiv.org/pdf/2209.01188
-   https://arxiv.org/pdf/2311.08105
