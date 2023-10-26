export {};
declare global {
  interface Window {
    Telegram: any;
    createAccount: (params: any) => Promise<any>;
    deployCommission: (params: any) => Promise<any>;
    deployPayToView: (params: any) => Promise<any>;
    payToView: (params: any) => Promise<any>;
    applyViewProof: (params: any) => Promise<any>;
    getViewPassword: (params: any) => Promise<any>;
    getCommissionList: () => Promise<any>;
    getPayToViewList: () => Promise<any>;
    getPaiedList: () => Promise<any>;
    sendToGpt: (params: any) => Promise<any>;
    addFileToIPFS: (params: any, content: string | file) => Promise<any>;
  }
  interface globalThis {
    Telegram: any;
    createAccount: (params: any) => Promise<any>;
    deployCommission: (params: any) => Promise<any>;
    deployPayToView: (params: any) => Promise<any>;
    payToView: (params: any) => Promise<any>;
    applyViewProof: (params: any) => Promise<any>;
    getViewPassword: (params: any) => Promise<any>;
    getCommissionList: () => Promise<any>;
    getPayToViewList: () => Promise<any>;
    getPaiedList: () => Promise<any>;
    sendToGpt: (params: any) => Promise<any>;
    addFileToIPFS: (params: any, content: string | file) => Promise<any>;
  }
}
