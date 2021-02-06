import { getDb } from './index';

export const browserUtils = {
  sendMessageToTab: (tabId: number, message: any) => {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        return chrome.tabs.sendMessage(tabId, message, {}, () => {
          resolve();
        });
      } else {
        reject('Unsuported browser');
      }
    });
  },

  removeTab: (tabId: number) => {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        return chrome.tabs.remove(tabId, () => {
          resolve();
        });
      } else {
        reject('Unsuported browser');
      }
    });
  },

  deleteStorageIndexed: (
    key: 'previews' | 'tabs' | 'transactions' | 'blockchains' | 'records' | 'accounts',
    value: string[]
  ) => {
    return new Promise((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (!['previews', 'tabs', 'blockchains', 'records', 'accounts', 'transactions'].find((k) => k === key)) {
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
    key: 'previews' | 'tabs' | 'blockchains' | 'records' | 'accounts' | 'transactions' | 'cookies',
    value: { [id: string]: any }
  ) => {
    return new Promise((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (
            !['previews', 'tabs', 'blockchains', 'records', 'accounts', 'transactions', 'cookies'].find(
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
    return new Promise((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (!['ui', 'settings', 'benchmarks', 'rchainInfos'].find((k) => k === key)) {
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
    return new Promise((resolve, reject) => {
      let i = 0;
      const doOperation = () => {
        try {
          if (
            !['ui', 'settings', 'benchmarks', 'rchainInfos', 'blockchains', 'tabs', 'accounts', 'transactions'].find(
              (k) => k === key
            )
          ) {
            i = 3;
            reject('Unknown db key ' + key);
          }
          const tx = getDb().transaction(key, 'readwrite');
          const objectStore = tx.objectStore(key);
          objectStore.delete(index);

          if (key === 'blockchain') {
            getDb().transaction('benchmarks', 'readwrite').objectStore('benchmarks').delete(index);
          }
          resolve();
        } catch (e) {
          console.log(e);
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
