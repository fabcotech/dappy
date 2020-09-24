import WSC from 'ws';
import { WS_PAYLOAD_PAX_SIZE } from '../src/CONSTANTS';

export const getWsResponse = (data: { [key: string]: any }, ws: WSC, timeout?: number) => {
  return new Promise((resolve, reject) => {
    const s = JSON.stringify(data);
    const l = Buffer.from(s).length;
    if (l > WS_PAYLOAD_PAX_SIZE) {
      reject(`Websocket payload is ${l / 1000}kb, max size is ${WS_PAYLOAD_PAX_SIZE / 1000}kb`);
      return;
    }
    ws.send(s, err => {
      if (err) {
        console.log(err);
        reject('Error when sending');
      }
    });
    let respReceived = false;
    const listenner = resp => {
      respReceived = true;
      try {
        const json = JSON.parse(resp);
        if (json.requestId === data.requestId) {
          resolve(resp);
          ws.removeEventListener('message', listenner);
          ws.removeEventListener('error', listennerError);
        }
      } catch (err) {
        console.log(err);
        reject('Could not read response');
        ws.removeEventListener('message', listenner);
        ws.removeEventListener('error', listennerError);
      }
    };
    const listennerError = err => {
      console.log(err);
    };
    ws.on('message', listenner);
    ws.on('error', listennerError);
    setTimeout(() => {
      if (!respReceived) {
        reject('Timeout error');
        ws.removeEventListener('message', listenner);
        ws.removeEventListener('error', listennerError);
      }
    }, timeout || 8000);
  });
};
