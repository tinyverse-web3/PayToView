import { Request } from './dauth/request';
import dauth from './dauth';

import {
  ApplyViewProofParams,
  DeployCommissionParams,
  DeployPayToViewParams,
  ForwardAPayViewParams,
  GetViewContractContentParams,
  GetViewPasswordParams,
  PayToViewParams,
} from './type';
class PayToView {
  dauthRequest: Request = new Request();
  async request({ data, name }: { data?: any; name: string }) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!window.createAccount) {
      const funHandler = window[name];
      let result;
      if (data) {
        result = await funHandler(JSON.stringify(data));
        result = JSON.parse(result);
      }
      return result;
    } else {
      const result = await this.dauthRequest.invoke({
        name: `paytoview/${name}`,
        data: data,
      });
      return result;
    }
  }
  async applyViewProof({ ContractName, Tx }: ApplyViewProofParams) {
    const data = await this.request({
      name: 'applyViewProof',
      data: {
        ContractName,
        Tx,
      },
    });
    return data;
  }
  async deployCommission({
    Name,
    AgentPercent,
    NetworkPercent,
  }: DeployCommissionParams) {
    const data = await this.request({
      name: 'deployCommission',
      data: {
        Name,
        AgentPercent,
        NetworkPercent,
      },
    });
    return data;
  }
  async deployPayToView({
    Name,
    CommissionName,
    Content,
    Ratio,
    Fee,
    Password,
  }: DeployPayToViewParams) {
    const data = await this.request({
      name: 'deployPayToView',
      data: {
        Name,
        CommissionName,
        Content,
        Ratio,
        Fee,
        Password,
      },
    });
    return data;
  }
  async forwardAPayView({ Name, ContractName }: ForwardAPayViewParams) {
    const data = await this.request({
      name: 'forwardAPayView',
      data: {
        Name,
        ContractName,
      },
    });
    return data;
  }
  async getCommissionList() {
    const data = await this.request({
      name: 'getCommissionList',
    });
    return data;
  }
  async getMyForwardPayToViewContractList() {
    const data = await this.request({
      name: 'getMyForwardPayToViewContractList',
    });
    return data;
  }
  async getPaiedList() {
    const data = await this.request({
      name: 'getPaiedList',
    });
    return data;
  }
  async getPayToViewList() {
    const data = await this.request({
      name: 'getPayToViewList',
    });
    return data;
  }
  async getViewContractContent({ ContractName }: GetViewContractContentParams) {
    const data = await this.request({
      name: 'getViewContractContent',
      data: {
        ContractName,
      },
    });
    return data;
  }
  async getViewPassword({ ContractName }: GetViewPasswordParams) {
    const data = await this.request({
      name: 'getViewPassword',
      data: {
        ContractName,
      },
    });
    return data;
  }
  async payToView({ ContractName }: PayToViewParams) {
    const data = await this.request({
      name: 'payToView',
      data: {
        ContractName,
      },
    });
    return data;
  }
  async addFileToIPFS({
    file,
    fileName,
    password,
  }: {
    file: File;
    fileName: string;
    password?: string;
  }) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FileName', fileName);
    if (password) {
      formData.append('Password', password);
    }
    const result = await this.dauthRequest.invoke({
      name: `paytoview/addData`,
      method: 'post',
      formData: formData,
    });
    return result;
  }
}

export default new PayToView();
