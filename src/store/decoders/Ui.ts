import * as yup from 'yup';

export const uiSchema = yup
  .object()
  .shape({
    menuCollapsed: yup.boolean().required(),
    dappsListDisplay: yup.number().required(),
    devMode: yup.boolean().required(),
    gcu: yup.string(),
    // todo this does not work, navigationUrl can be anything
    navigationUrl: yup
      .string()
      .matches(
        /\/settings\/blockchain|\/settings|\/|\/dapps|\/settings\/names|\/settings\/gcu|\/dev\/manifest|transactions|\/deploy\/dapps|\/deploy\/file-upload|\/deploy\/rholang|\/accounts/
      )
      .required()
      .strict(true),
    language: yup.string().matches(/en|cn/).required().strict(true),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateUi = (ui: any) =>
  new Promise<true>((resolve, reject) => {
    uiSchema
      .validate(ui)
      .then((a) => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
