export interface RChainTokenCreatePursesReturn {
  status: string;
  values: { [purseId: string]: true | string };
}
export interface RChainTokenUpdatePursePriceReturn {
  status: string;
}
export interface RChainTokenDeployPayload {
  status: string;
  masterRegistryUri: string;
  contractId: string;
}
export interface RChainTokenDeployBoxPayload {
  status: string;
  boxId: string;
}

export type Fee = [string, number];

export interface ContractConfig {
  fee?: Fee;
  expires: number;
  contractId: number;
  counter: number;
  fungible: boolean;
  locked: boolean;
  version: string;
}