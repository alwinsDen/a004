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