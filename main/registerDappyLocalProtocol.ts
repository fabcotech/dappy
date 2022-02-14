import { Session, app } from 'electron';
import fs from 'fs';
import path from 'path';

const csss = fs.readdirSync(path.join(app.getAppPath(), 'dist/css'))
const jss = fs.readdirSync(path.join(app.getAppPath(), 'dist/js'))
const files = jss.concat(csss);

export const registerDappyLocalProtocol = (
  session: Session
) => {
  return session.protocol.registerBufferProtocol('dappyl', (request, callback) => {
    const filePath = request.url.replace('dappyl://', '')
    if (files.find(a => [`js/${a}`, `css/${a}`].includes(filePath))) {
      if (filePath.endsWith('.js')) {
        const buf = fs.readFileSync(path.join(app.getAppPath(), 'dist/', filePath))
        callback(buf);
      } else if (filePath.endsWith('.css')) {
        const buf = fs.readFileSync(path.join(app.getAppPath(), 'dist/', filePath))
        callback(buf);
      } else {
        callback(Buffer.from(''));
      }
    } else {
      callback(Buffer.from(''));
    }
  });
};
