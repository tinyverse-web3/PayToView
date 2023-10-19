import * as _ from "./wasm-exec/wasm_exec_1.20.3"
import { wasmBrowserInstantiate } from "./wasm-exec/instantiateWasm"


class TvsWasm{
    constructor(){
        this.inputWasmUrl = 'https://tinyverse.space/wasm/tinyverse_sdk.wasm'
        //this.inputLocalWasm = "../lib/wasm/main.wasm"
        this.inputLocalWasm = "../lib/wasm/main_chatgpt.wasm"
        this.go = new Go();
        this.wasm = null
        this.importObject = this.go.importObject;
    }
    
    async initWasm(){
        let mod, inst, exports;
        return await wasmBrowserInstantiate(this.inputLocalWasm, this.go.importObject).then((result) => {
            mod = result.module;
            inst = result.instance;
            exports = inst.exports;
            this.wasm = { inst, mod, exports };
            this.go.run(this.wasm.inst)
        }).catch((err) => {
			console.error(err);
		});
    }


    getWasm(){
        return this.wasm
    }

    createAccount(){
      createTvsAccount()
    }
    sendMsg(msg){
        sendToGpt(msg)
    }
}

export default TvsWasm
