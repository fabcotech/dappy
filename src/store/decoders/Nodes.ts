import * as yup from 'yup';

import { NodeFromNetwork } from '../../models';

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

export const blockchainNodeSchema = yup
  .object()
  .shape({
    origin: yup
      .string()
      .matches(/user|network|default/)
      .required(),
    ip: yup.string().required(),
    host: yup.string().required(),
    active: yup.boolean().required(),
    readyState: yup.number().required(),
    ssl: yup.boolean().required(),
    name: yup.string(),
    contact: yup.string(),
    location: yup.string(),
    cert: yup.string(),
  })
  .required();

export const validateNodeFromNetwork = (node: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    nodeFromNetworkSchema
      .validate(node)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const validateNodesFromNetwork = (nodes: any): Promise<NodeFromNetwork[]> => {
  return new Promise((resolve, reject) => {
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
