import * as _ from "./wasm-exec/wasm_exec_1.20.3"
import { wasmBrowserInstantiate } from "./wasm-exec/instantiateWasm"
import wasmData from "../../../../tinyverse_sdk-paytoview/wasm/main.wasm?url"


class TvsWasm{
    constructor(){
        //this.inputWasmUrl = 'https://tinyverse.space/wasm/tinyverse_sdk.wasm'
        //this.inputLocalWasm = "../lib/wasm/main.wasm"
        this.inputLocalWasm = wasmData
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

    /**
     * Creates an account.
     * 
     * @param {string}  parameters - jsonString: {"telegramID":"123456","sssData":""} The parameters for creating the account.
     * @return {undefined}
     */
    createAccount(parameters){
      createTvsAccount(parameters)
    }
   
    sendMsg(msg){
        sendToGpt(msg)
    }
}

export default TvsWasm
