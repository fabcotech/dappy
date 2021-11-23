export const preventAllPermissionRequests = (session) =>
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    // Permission list available here: https://www.electronjs.org/fr/docs/latest/api/session#sessetpermissionrequesthandlerhandler
    callback(false);
  });
