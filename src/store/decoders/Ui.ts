import * as yup from 'yup';

const navigationPaths = [
  '/',
  '/settings',
  '/settings/blockchain',
  '/settings/gcu',
  '/names',
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
    navigationUrl: yup
      .string()
      .required()
      .test('is-navigation-url', '${path} ${value} is unknown', (currentPath?: string) =>
        navigationPaths.some((path: string) => new RegExp(path).test(`^${currentPath}/?$`))
      ),
    language: yup.string().matches(/en|cn/).required().strict(true),
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
