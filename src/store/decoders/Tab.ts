import * as yup from 'yup';
import { Tab } from '/models';

export const TabSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    resourceId: yup.string(),
    title: yup.string(),
    img: yup.string(),
    active: yup.boolean().required(),
    favorite: yup.boolean().required(),
    muted: yup.boolean().required(),
    counter: yup.number(),
    index: yup.number().required(),
    url: yup.string().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateTab = (tab: any) =>
  new Promise<true>((resolve, reject) => {
    TabSchema.validate(tab)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateTabs = (tabs: any): Promise<Tab[]> => {
  return new Promise((resolve, reject) => {
    if (!tabs || !Array.isArray(tabs)) {
      reject();
      return;
    }

    return Promise.all(tabs.map(validateTab))
      .then(() => {
        resolve(tabs as Tab[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
