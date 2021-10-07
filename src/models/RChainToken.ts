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

export interface RChainContractConfig {
  fee?: Fee;
  expires?: number;
  contractId: string;
  counter: number;
  fungible: boolean;
  locked: boolean;
  version: string;
}

export interface RChainTokenPurse {
  quantity: number;
  price: undefined | number;
  id: string;
}
