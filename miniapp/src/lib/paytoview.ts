import { Request } from './dauth/request';
import dauth from './dauth';
import { file2array } from '@/lib/utils';

import {
  ApplyViewProofParams,
  DeployCommissionParams,
  DeployPayToViewParams,
  ForwardAPayViewParams,
  GetViewContractContentParams,
  GetViewPasswordParams,
  PayToViewParams,
  CreateAccountParams,
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
      } else {
        result = await funHandler();
        result = JSON.parse(result);
      }
      console.log(name + '  result: ');
      console.log(result);
      return result;
    } else {
      const result = await this.dauthRequest.invoke({
        name: `paytoview/${name}`,
        data: data,
      });
      return result;
    }
  }
  async createAccount({ userID, sssData }: CreateAccountParams) {
    const data = await this.request({
      name: 'createAccount',
      data: {
        userID,
        sssData,
      },
    });
    return data;
  }
  async getProfile() {
    const data = await this.request({
      name: 'getProfile',
    });
    return data;
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
  async addFileToIPFS(param: {
    file: File;
    fileName: string;
    password?: string;
  }) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!window.createAccount) {
      const content = await file2array(param.file);
      console.log(content);
      const result = await window.addFileToIPFS(
        JSON.stringify({ fileName: param.fileName, password: param.password }),
        content,
      );
      const data = JSON.parse(result);
      console.log('addFileToIPFS data: ', data);
      return data;
    } else {
      const result = await dauth.account.payToViewUpload(param);
      return result;
    }
  }
}

export default new PayToView();
