import * as _ from "./wasm-exec/wasm_exec_1.20.3"
import { wasmBrowserInstantiate } from "./wasm-exec/instantiateWasm"
import wasmData from "../../../../tinyverse_sdk_pay2view/wasm/main.wasm?url"


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
    jsCreateAccount(parameters){
      createAccount(parameters)
    }

    // 部署代理人合约
    jsDeployCommission(parameters){
        deployCommission(parameters)
    }
    
    // 部署付费阅读合约
    jsDeployPayToView(parameters){
        deployPayToView(parameters)
    }
    
    // 付费
    jsPayToView(parameters){
        payToView(parameters)
    }
    
    // 获取阅读凭证
    jsApplyViewProof(parameters){
        applyViewProof(parameters)
    }
    
    // 获取阅读密码
    jsGetViewPassword(parameters){
        getViewPassword(parameters)
    }
    
    // 获取代理人合约列表
    jsGetCommissionList(){
        getCommissionList()
    }
    
    // 获取付费阅读合约列表
    jsGetPayToViewList(){
        getPayToViewList()
    }
    
    // 获取付费列表
    jsGetPaiedList(){
        getPaiedList()
    }
   
    sendMsg(msg){
        sendToGpt(msg)
    }
}

export default TvsWasm
