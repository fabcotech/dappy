import * as yup from 'yup';

export const uiSchema = yup
  .object()
  .shape({
    menuCollapsed: yup.boolean().required(),
    dappsListDisplay: yup.number().required(),
    devMode: yup.boolean().required(),
    // todo this does not work, navigationUrl can be anything
    navigationUrl: yup
      .string()
      .matches(
        /\/settings\/blockchain|\/settings|\/|\/dapps|\/settings\/names|\/dev\/manifest|transactions|\/deploy\/dapps|\/deploy\/file-upload|\/deploy\/rholang/
      )
      .required()
      .strict(true),
    language: yup
      .string()
      .matches(/en|cn/)
      .required()
      .strict(true),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateUi = (ui: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    uiSchema
      .validate(ui)
      .then(a => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
