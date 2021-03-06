import * as yup from 'yup';

const pushManifestResultSchema = yup
  .object()
  .shape({
    registry_uri: yup.string().required(),
    unforgeable_name: yup.string().required(),
  })
  .required()
  .strict(true);

export const validatePushManifestResult = (pushManifestResult: any) => {
  return new Promise((resolve, reject) => {
    if (!pushManifestResult) {
      reject();
      return;
    }
    pushManifestResultSchema.isValid(pushManifestResult).then((valid) => {
      console.log(valid);
      if (valid) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const rchainTokenOperationSchema = yup.object().shape({
  status: yup
    .string()
    .matches(/completed|failed/)
    .required(),
  message: yup.object(),
});

export const validateRchainTokenOperationResult = (rchainTokenOperationResult: any) => {
  return new Promise((resolve, reject) => {
    if (!rchainTokenOperationResult) {
      reject();
      return;
    }
    rchainTokenOperationSchema.isValid(rchainTokenOperationResult).then((valid) => {
      if (valid) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
