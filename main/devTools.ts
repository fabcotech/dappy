import os from 'os';
import path from 'path';
import { app, session } from 'electron';

export function installDevToolsExtensionsOnlyForDev(partition: string) {
  if ((process.env as any) === 'dev') {
    const reduxDevTools = path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.2_18'
    );

    const reactDevTools = path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.21.0_1'
    );

    app.whenReady().then(() => {
      session.fromPartition(partition).loadExtension(reduxDevTools);
      session.fromPartition(partition).loadExtension(reactDevTools);
    });
  }
}
