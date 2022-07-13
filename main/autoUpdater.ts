const { autoUpdater } = require('electron-updater');

export const initAutoUpdater = () => {
  function log(text: string) {
    console.log(`[auto updater] ${text}`);
  }

  autoUpdater.on('error', (err: Error) => {
    log('Error in auto-updater. ' + err);
  });
  autoUpdater.on('update-available', () => {
    log('Update available.');
  });
  autoUpdater.on('update-not-available', () => {
    log('Update not available.');
  });
  autoUpdater.on('checking-for-update', () => {
    log('Checking for update...');
  });

  autoUpdater.on('download-progress', (progressObj: any) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    log(log_message);
  });
  autoUpdater.on('update-downloaded', () => {
    log('Update downloaded');
  });

  autoUpdater.checkForUpdatesAndNotify();
};
