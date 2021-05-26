import * as yup from 'yup';

const dappyNodeInfoSchema = yup
  .object()
  .shape({
    lastFinalizedBlockNumber: yup.number().required(),
    dappyNodeVersion: yup.string().required(),
    rchainNamesMasterRegistryUri: yup.string().required(),
    rchainNamesContractId: yup.string().required(),
    rnodeVersion: yup.string().required(),
    rchainNetwork: yup.string().required(),
    namePrice: yup.number().required(),
    special: yup
      .object()
      .shape({
        name: yup.string().required(),
        max: yup.number().required(),
        current: yup.number().required(),
      })
      .noUnknown(true)
      .strict(true),
  })
  .required()
  .noUnknown(true)
  .strict(true);

const dappyNodeInfoFullSchema = yup
  .object()
  .shape({
    chainId: yup.string().required(),
    date: yup.string().required(),
    info: dappyNodeInfoSchema.required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateDappyNodeFullInfo = (dnfi: any) => {
  return new Promise((resolve, reject) => {
    if (!dnfi) {
      reject();
      return;
    }
    dappyNodeInfoFullSchema.isValid(dnfi).then((valid) => {
      if (valid) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
export const validateDappyNodeInfo = (dni: any) => {
  return new Promise((resolve, reject) => {
    if (!dni) {
      reject();
      return;
    }

    dappyNodeInfoSchema
      .validate(dni)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
