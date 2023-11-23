import { file2array } from '@/lib/utils';
import i18n from '@/locales';
export class Tvs {
  async createAccount(params) {
    console.log('createAccount params: ', params);
    try {
      const result = await window.createAccount(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('createAccount data: ', data);
      return data;
    } catch (error) {
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
    }
  }
  async forwardAPayView(params) {
    try {
      const result = await window.forwardAPayView(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('forwardAPayView data: ', data);
      return data;
    } catch (error) {
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
    }
  }
  async getViewContractContent(params) {
    try {
      const result = await window.getViewContractContent(JSON.stringify(params));
      const data = JSON.parse(result);
      console.log('forwardAPayView data: ', data);
      return data;
    } catch (error) {
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
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
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
    }
  }
  // 获取付费列表
  async getPaidList() {
    try {
      const result = await window.getPaidList();
      const data = JSON.parse(result);
      console.log('getPaidList data: ', data);
      return data;
    } catch (error) {
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
    }
  }
  async addFileToIPFS(params, file: File) {
    try {
      const content = await file2array(file);
      const result = await window.addFileToIPFS(
        JSON.stringify(params),
        content,
      );
      const data = JSON.parse(result);
      console.log('addFileToIPFS data: ', data);
      return data;
    } catch (error) {
      return { data: { code: '500000', msg: i18n.t('common.request_error') } };
    }
  }
}
