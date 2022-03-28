import * as yup from 'yup';

import { NodeFromNetwork } from '/models';

const nodeFromNetworkSchema = yup
  .object()
  .shape({
    ip: yup.string().required(),
    host: yup.string().required(),
    name: yup.string().required(),
    contact: yup.string().required(),
    location: yup.string().required(),
    cert: yup.string().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const networkMemberSchema = yup
  .object()
  .shape({
    ip: yup.string().required(),
    port: yup.string(),
    hostname: yup.string().required(),
    caCert: yup.string(),
    scheme: yup
      .string()
      .matches(/http|https/)
      .required(),
  })
  .required();

export const validateNodeFromNetwork = (node: any) =>
  new Promise<true>((resolve, reject) => {
    nodeFromNetworkSchema
      .validate(node)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateNodesFromNetwork = (nodes: any): Promise<NodeFromNetwork[]> => {
  return new Promise<NodeFromNetwork[]>((resolve, reject) => {
    if (!nodes || !Array.isArray(nodes)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(nodes.map(validateNodeFromNetwork))
      .then(() => {
        resolve(nodes as NodeFromNetwork[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
