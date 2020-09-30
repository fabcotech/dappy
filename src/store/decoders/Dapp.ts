import * as yup from 'yup';
import { loadStateSchema } from '.';
import { Dapp } from '../../models';

// todo remove this file ?

export const dappFromNetworkSchema = yup
  .object()
  .shape({
    version: yup.string().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    author: yup.string().required(),
    img: yup.string(),
    js: yup.string(),
    css: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const dappSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    origin: yup
      .string()
      .matches(/network|file/)
      .required(),
    account: yup.string().required(),
    chainId: yup.string().required(),
    platform: yup
      .string()
      .matches(/rchain|/)
      .required(),
    version: yup.string().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    author: yup.string().required(),
    img: yup.string(),
    js: yup.string(),
    css: yup.string(),
    html: yup.string(),
    loadState: yup.object().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateDappFromNetwork = (dapp: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    dappFromNetworkSchema
      .validate(dapp)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const validateDapp = (dapp: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    dappSchema
      .validate(dapp)
      .then(() => {
        loadStateSchema
          .validate(dapp.loadState)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });

export const validateDapps = (dapps: any): Promise<Dapp[]> => {
  return new Promise((resolve, reject) => {
    if (!dapps || !Array.isArray(dapps)) {
      reject();
      return;
    }

    return Promise.all(dapps.map(validateDapp))
      .then(() => {
        resolve(dapps as Dapp[]);
      })
      .catch(e => {
        reject(e);
      });
  });
};
