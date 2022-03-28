import * as yup from 'yup';

import { networkMemberSchema } from './Nodes';
import { Blockchain } from '/models';

export const blockchainSchema = yup
  .object()
  .shape({
    platform: yup
      .string()
      .matches(/rchain/)
      .required(),
    auto: yup.boolean().required(),
    chainName: yup.string().required(),
    chainId: yup.string().required(),
    nodes: yup.array(networkMemberSchema),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateBlockchain = (bc: any) =>
  new Promise<true>((resolve, reject) => {
    blockchainSchema
      .validate(bc)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateBlockchains = (blockchains: any): Promise<Blockchain[]> => {
  return new Promise<Blockchain[]>((resolve, reject) => {
    if (!blockchains || !Array.isArray(blockchains)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(blockchains.map(validateBlockchain))
      .then(() => {
        resolve(blockchains as Blockchain[]);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
