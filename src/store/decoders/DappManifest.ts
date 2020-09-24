import * as yup from 'yup';
import { loadStateSchema } from '.';
import { DappManifestWithLoadState } from '../../models';

export const dappManifestFromNetworkSchema = yup
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

export const dappManifestSchema = yup
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

export const validateDappManifestFromNetwork = (dappManifest: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    dappManifestFromNetworkSchema
      .validate(dappManifest)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const validateDappManifest = (dappManifest: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    dappManifestSchema
      .validate(dappManifest)
      .then(() => {
        loadStateSchema
          .validate(dappManifest.loadState)
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

export const validateDappManifests = (dappManifests: any): Promise<DappManifestWithLoadState[]> => {
  return new Promise((resolve, reject) => {
    if (!dappManifests || !Array.isArray(dappManifests)) {
      reject();
      return;
    }

    return Promise.all(dappManifests.map(validateDappManifest))
      .then(() => {
        resolve(dappManifests as DappManifestWithLoadState[]);
      })
      .catch(e => {
        reject(e);
      });
  });
};
