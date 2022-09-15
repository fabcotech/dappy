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
  price: null | [String, String] | [String, Number];
  id: string;
  boxId: string;
  timestamp: number;
}
export interface RChainTokenCreatePursePayload {
  masterRegistryUri: string;
  boxId: string;
  contractId: string;
  purses: {
    [tmpId: string]: {
      id: string;
      boxId: string;
      quantity: number;
      price: null | [String, Number] | [String, String];
    };
  };
  data: {
    [tmpId: string]: string;
  };
}

export type RChainTokenOperation =
  | 'withdraw'
  | 'update-purse-price'
  | 'tips'
  | 'deploy'
  | 'create-purses'
  | 'purchase'
  | 'update-purse-data';

export interface TransactionOriginRChainToken {
  origin: 'rchain-token';
  accountName: undefined | string;
  operation: RChainTokenOperation;
}
