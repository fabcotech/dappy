import os from 'os';
import path from 'path';
import { app, session } from 'electron';

export function installDevToolsExtensionsOnlyForDev(partition: string) {
  if (!process.env.PRODUCTION) {
    const reduxDevTools = path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.0.11_5'
    );

    const reactDevTools = path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.25.0_0'
    );

    app.whenReady().then(() => {
      session.fromPartition(partition).loadExtension(reduxDevTools);
      session.fromPartition(partition).loadExtension(reactDevTools);
    });
  }
}
