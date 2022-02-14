import { Session } from 'electron'

export const preventAllPermissionRequests = (session: Session) =>
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    // Permission list available here: https://www.electronjs.org/fr/docs/latest/api/session#sessetpermissionrequesthandlerhandler
    callback(false);
  });
