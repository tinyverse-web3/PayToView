export class Tvs {
  async createAccount(params) {
    try {
      const result = await window.createAccount(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('createAccount data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 部署代理人合约
  async deployCommission(params) {
    try {
      const result = await window.deployCommission(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('deployCommission data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 部署付费阅读合约
  async deployPayToView(params) {
    try {
      const result = await window.deployPayToView(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('deployPayToView data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 付费
  async payToView(params) {
    try {
      const result = await window.payToView(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('payToView data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 获取阅读凭证
  async applyViewProof(params) {
    try {
      const result = await window.applyViewProof(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('applyViewProof data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 获取阅读密码
  async getViewPassword(params) {
    try {
      const result = await window.getViewPassword(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('getViewPassword data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 获取代理人合约列表
  async getCommissionList() {
    try {
      const result = await window.getCommissionList();
      const data = JSON.parse(result);
      console.log('getCommissionList data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 获取付费阅读合约列表
  async getPayToViewList() {
    try {
      const result = await window.getPayToViewList();
      const data = JSON.parse(result);
      console.log('getPayToViewList data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  // 获取付费列表
  async getPaiedList() {
    try {
      const result = await window.getPaiedList();
      const data = JSON.parse(result);
      console.log('getPaiedList data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  async sendToGpt(params) {
    try {
      const result = await window.sendToGpt(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('sendToGpt data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
  async addFileToIPFS(params, content) {
    try {
      const result = await window.addFileToIPFS(JSON.stringify(params), content);
      const data = JSON.parse(result);
      console.log('addFileToIPFS data: ', data);
      return data;
    } catch (error) {
      return { code: 1, msg: error };
    }
  }
}