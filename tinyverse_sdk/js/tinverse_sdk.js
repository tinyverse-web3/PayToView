import WebAssembly from './wasm_exec_1.20.3'
function initWasm(){
    let mod, inst;
    WebAssembly.instantiateStreaming(fetch("../wasm/main.wasm"), go.importObject).then((result) => {
        mod = result.module;
        inst = result.instance;
        document.getElementById("runButton").disabled = false;
    }).catch((err) => {
        console.error(err);
    });
}