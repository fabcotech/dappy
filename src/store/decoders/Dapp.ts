import * as yup from 'yup';
import { loadStateSchema } from '.';
import { Dapp } from '/models';

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

export const validateDappFromNetwork = (dapp: any) =>
  new Promise<true>((resolve, reject) => {
    dappFromNetworkSchema
      .validate(dapp)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateDapp = (dapp: any) =>
  new Promise<true>((resolve, reject) => {
    dappSchema
      .validate(dapp)
      .then(() => {
        loadStateSchema
          .validate(dapp.loadState)
          .then(() => {
            resolve(true);
          })
          .catch((err: yup.ValidationError) => {
            reject(err);
          });
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateDapps = (dapps: any): Promise<Dapp[]> => {
  return new Promise<Dapp[]>((resolve, reject) => {
    if (!dapps || !Array.isArray(dapps)) {
      reject();
      return;
    }

    return Promise.all(dapps.map(validateDapp))
      .then(() => {
        resolve(dapps as Dapp[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
