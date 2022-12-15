import * as yup from 'yup';

/*
  If you ever change this also change logic in
  src/store/ui/reducer.ts NAVIGATE
  src/store/index.ts
*/
const navigationPaths = [
  '/',
  '/settings',
  '/settings/blockchain',
  '/settings/gcu',
  '/names',
  '/whitelist',
  '/accounts',
  '/deploy/file-upload',
  '/dapps',
  '/transactions',
  '/deploy/dapp',
  '/deploy/rholang',
  '/dev/manifest',
];

export const uiSchema = yup
  .object()
  .shape({
    menuCollapsed: yup.boolean().required(),
    tabsListDisplay: yup.number().required(),
    devMode: yup.boolean().required(),
    gcu: yup.string(),
    platform: yup.string(),
    navigationUrl: yup
      .string()
      .required()
      .test('is-navigation-url', '${path} ${value} is unknown', (currentPath?: string) =>
        navigationPaths.some((path: string) => new RegExp(path).test(`^${currentPath}/?$`))
      ),
    language: yup.string().matches(/en|cn/).required().strict(true),
    showAccountCreationAtStartup: yup.bool(),
    isBalancesHidden: yup.bool(),
    whitelist: yup.array().of(
      yup
        .object()
        .shape({
          host: yup.string().required(),
          topLevel: yup.boolean().required(),
          secondLevel: yup.boolean().required(),
        })
        .required()
    ),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateUi = (ui: any) =>
  new Promise<true>((resolve, reject) => {
    uiSchema
      .validate(ui)
      .then(() => {
        resolve(true);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
