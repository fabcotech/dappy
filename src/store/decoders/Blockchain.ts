import * as yup from 'yup';

const pushManifestResultSchema = yup.object().shape({
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
    pushManifestResultSchema.isValid(pushManifestResult).then(valid => {
      console.log(valid);
      if (valid) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const purchaseOrUpdateRecordSchema = yup.object().shape({
  status: yup
    .string()
    .matches(/completed/)
    .required(),
});

export const validatePurchaseOrUpdateRecordResult = (pushManifestResult: any) => {
  return new Promise((resolve, reject) => {
    if (!pushManifestResult) {
      reject();
      return;
    }
    purchaseOrUpdateRecordSchema.isValid(pushManifestResult).then(valid => {
      if (valid) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
