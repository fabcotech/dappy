import { getDb, openConnection } from './index';
import { ZoneRecord, Zone } from '/models';

import { refreshOrAppendRecord } from '/utils/zone';

export const browserUtils = {
  deleteStorageIndexed: (
    key: 'previews' | 'tabs' | 'transactions' | 'networks' | 'records' | 'accounts' | 'cookies',
    value: string[]
  ) => {
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (
            !['previews', 'tabs', 'networks', 'records', 'accounts', 'transactions', 'cookies'].find(
              (k) => k === key
            )
          ) {
            i = 3;
            reject('Unknown db key ' + key);
          }
          const tx = getDb().transaction(key, 'readwrite');
          const objectStore = tx.objectStore(key);
          value.forEach((i) => {
            objectStore.delete(i);
          });
          resolve();
        } catch (e) {
          console.log(e);
          try {
            openConnection();
          } catch (e2) {
            console.log(e2);
          }
          if (i < 3) {
            i += 1;
            console.log('indexedDB error, will retry in 1 second');
            setTimeout(doOperation as () => void, 1000);
          } else {
            reject(e);
          }
        }
      };
      doOperation();
    });
  },

  saveZone: (
    host: string,
    records: ZoneRecord[],
  ) => {
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          const tx = getDb().transaction('zones', 'readwrite');
          const objectStore = tx.objectStore(host);

          let zone: { host: string; records: ZoneRecord[] } = { host: host, records: [] };
          let found: Zone = objectStore.get(host) as Zone;
        
          if (found) {
            zone = found;
          }

          let newRecords = zone.records;
          records.forEach((r) => {
            newRecords = refreshOrAppendRecord(newRecords, r)
          })

          objectStore.put({
            ...zone,
            records: newRecords
          });
          resolve();
        } catch (e) {
          console.log(e);
          try {
            openConnection();
          } catch (e2) {
            console.log(e2);
          }
          if (i < 3) {
            i += 1;
            console.log('indexedDB error, will retry in 1 second');
            setTimeout(doOperation as () => void, 1000);
          } else {
            reject(e);
          }
        }
      };
      doOperation();
    });
  },
  saveStorageIndexed: (
    key: 'previews' | 'tabs' | 'networks' | 'records' | 'accounts' | 'transactions' | 'cookies',
    value: { [id: string]: any }
  ) => {
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (
            !['previews', 'tabs', 'networks', 'records', 'accounts', 'transactions', 'cookies'].find(
              (k) => k === key
            )
          ) {
            i = 3;
            reject('Unknown db key ' + key);
          }

          const tx = getDb().transaction(key, 'readwrite');
          const objectStore = tx.objectStore(key);
          Object.keys(value).forEach((id) => {
            objectStore.put(value[id]);
          });
          resolve();
        } catch (e) {
          console.log(e);
          try {
            openConnection();
          } catch (e2) {
            console.log(e2);
          }
          if (i < 3) {
            i += 1;
            console.log('indexedDB error, will retry in 1 second');
            setTimeout(doOperation as () => void, 1000);
          } else {
            reject(e);
          }
        }
      };
      doOperation();
    });
  },

  saveStorage: (key: string, value: any, autoIndexed = false) => {
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (!['ui', 'settings', 'rchainInfos'].find((k) => k === key)) {
            i = 3;
            reject('Unknown db key ' + key);
          }
          const tx = getDb().transaction(key, 'readwrite');
          const objectStore = tx.objectStore(key);
          if (autoIndexed) {
            objectStore.put(value);
          } else {
            objectStore.put(value, 0);
          }
          resolve();
        } catch (e) {
          console.log(e);
          try {
            openConnection();
          } catch (e2) {
            console.log(e2);
          }
          if (i < 3) {
            i += 1;
            console.log('indexedDB error, will retry in 1 second');
            setTimeout(doOperation as () => void, 1000);
          } else {
            reject(e);
          }
        }
      };
      doOperation();
    });
  },

  removeInStorage: (key: string, index: string | number) => {
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (
            !['ui', 'settings', 'rchainInfos', 'networks', 'tabs', 'accounts', 'transactions'].find(
              (k) => k === key
            )
          ) {
            i = 3;
            reject('Unknown db key ' + key);
          }
          const tx = getDb().transaction(key, 'readwrite');
          const objectStore = tx.objectStore(key);
          objectStore.delete(index);

          resolve();
        } catch (e) {
          console.log(e);
          try {
            openConnection();
          } catch (e2) {
            console.log(e2);
          }
          if (i < 3) {
            i += 1;
            console.log('indexedDB error, will retry in 1 second');
            setTimeout(doOperation as () => void, 1000);
          } else {
            reject(e);
          }
        }
      };
      doOperation();
    });
  },

  downloadFile: (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
};
