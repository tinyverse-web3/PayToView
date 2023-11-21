export interface ApplyViewProofParams {
  ContractName: string;
  Tx: string;
}
export interface CreateAccountParams {
  userID: string;
  sssData?: string;
}
export interface DeployCommissionParams {
  Name: string;
  AgentPercent: number;
  NetworkPercent: number;
}
export interface DeployPayToViewParams {
  Name: string;
  CommissionName: string;
  Content: {
    Cid: string;
    CidForpreview: string;
    ContentType: string;
    Description: string;
  };
  Ratio: {
    AgentPercent: number;
    ForwarderPercent: number;
    NetworkPercent: number;
    PublisherPercent: number;
  };
  Fee: number;
  Password: string;
}
export interface ForwardAPayViewParams {
  Name: string;
  ContractID: string;
}
export interface GetViewContractContentParams {
  ContractID: string;
}
export interface GetViewPasswordParams {
  ContractID: string;
}
export interface PayToViewParams {
  ContractID: string;
}
