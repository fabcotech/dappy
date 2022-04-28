import Ajv from 'ajv';

import { validateRChainTokenPrice } from './RChainToken';
import { validate } from './Validate';

const ajv = new Ajv();

const dappyNodeInfoSchema = {
  schemaId: 'dappyNodeInfoSchema',
  type: 'object',
  properties: {
    lastFinalizedBlockNumber: { type: 'number' },
    dappyNodeVersion: { 'type': 'string' },
    rnodeVersion: { 'type': 'string' },
    dappyBrowserMinVersion: { 'type': 'string',  },
    dappyBrowserDownloadLink: { 'type': 'string' },
    rchainNamesMasterRegistryUri: { 'type': 'string' },
    wrappedRevContractId: { 'type': 'string' },
    rchainNamesContractId: { 'type': 'string' },
    namePrice: { "anyOf": [{ type: "null" }, { type: "array", validate: validateRChainTokenPrice }] },
    rchainNetwork: { 'type': 'string' },
    rchainShardId: { 'type': 'string' },
  },
  required: ['lastFinalizedBlockNumber', 'dappyNodeVersion', 'rnodeVersion',  'rchainNamesMasterRegistryUri', 'wrappedRevContractId', 'rchainNamesContractId', 'rchainNetwork'],
};

const validateDappyNodeInfoSchema = validate(dappyNodeInfoSchema);

const dappyNodeInfoFullSchema = {
  schemaId: 'dappyNodeInfoFullSchema',
  type: 'object',
  properties: {
    chainId: { type: 'string' },
    date: { 'type': 'string' },
    info: dappyNodeInfoSchema,
  },
  required: ["chainId", 'date', 'info']
}
const validateDappyNodeInfoFullSchema = validate(dappyNodeInfoFullSchema);

export const validateDappyNodeFullInfo = (dnfi: any) => {
  return new Promise<true>((resolve, reject) => {
    if (!dnfi) {
      reject();
      return;
    }

    const ve = validateDappyNodeInfoFullSchema(dnfi);
    if (ve.length === 0) {
      resolve(true);
    } else {
      reject(ve)
    }
  });
};
export const validateDappyNodeInfo = (dni: any) => {
  return new Promise<true>((resolve, reject) => {
    if (!dni) {
      reject();
      return;
    }

    const ve = validateDappyNodeInfoSchema(dni);
    if (ve.length === 0) {
      resolve(true);
    } else {
      reject(ve)
    }
  });
};
