import * as yup from 'yup';

import { blockchainNodeSchema } from './Nodes';
import { Blockchain } from '../../models';

export const blockchainSchema = yup
  .object()
  .shape({
    platform: yup
      .string()
      .matches(/rchain/)
      .required(),
    chainName: yup.string().required(),
    chainId: yup.string().required(),
    nodes: yup.array(blockchainNodeSchema),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateBlockchain = (bc: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    blockchainSchema
      .validate(bc)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const validateBlockchains = (blockchains: any): Promise<Blockchain[]> => {
  return new Promise((resolve, reject) => {
    if (!blockchains || !Array.isArray(blockchains)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(blockchains.map(validateBlockchain))
      .then(() => {
        resolve(blockchains as Blockchain[]);
      })
      .catch(e => {
        reject(e);
      });
  });
};
