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
  ContractName: string;
}
export interface GetViewContractContentParams {
  ContractName: string;
}
export interface GetViewPasswordParams {
  ContractName: string;
}
export interface PayToViewParams {
  ContractName: string;
}
