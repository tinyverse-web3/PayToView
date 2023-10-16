# Build
## build wasm with go
```shell
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" wasm_exec.js
GOOS=js GOARCH=wasm go build -o web/main.wasm
```

## build wasm with tinygo
```shell
cp $(tinygo env TINYGOROOT)/targets/wasm_exec.js wasm_exec_tinygo.js
GOOS=js GOARCH=wasm tinygo build -o web/main_tinygo.wasm -target wasm ./main.go
```