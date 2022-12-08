function Ethereum() {
  this.listenners = {};
  this.isMetaMask = false;
  this.connected = false;
  this.isConnected = () => this.connected;

  this.on = (method, f) => {
    if (typeof method !== 'string' || typeof f !== 'function') {
      throw new Error('Invalid arguments');
    }
    if (!this.listenners[method]) {
      this.listenners[method] = [];
    }
    this.listenners[method] = this.listenners[method].concat(f);
  };

  this.chainChanged = (chainId) => {
    if (this.listenners['chainChanged']) {
      this.listenners['chainChanged'].forEach((f) => {
        f(chainId);
      });
    }
  };

  this.accountsChanged = (accounts) => {
    if (this.listenners['accountsChanged']) {
      this.listenners['accountsChanged'].forEach((f) => {
        f(accounts);
      });
    }
  };

  this.connect = () => {
    if (this.listenners['connect']) {
      this.listenners['connect'].forEach((f) => {
        f({});
      });
    }
  };

  this.disconnect = (error) => {
    this.connected = false;
    if (this.listenners['disconnect']) {
      this.listenners['disconnect'].forEach((f) => {
        f(error);
      });
    }
  };

  this.request = function (payload: any) {
    console.log(payload.method);
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', `interprocessdapp://${payload.method}`);
      interProcess.setRequestHeader('Data', JSON.stringify(payload));
      interProcess.send();
      interProcess.onload = (a: any) => {
        try {
          const r = JSON.parse(a.target.responseText);
          if (r.success) {
            resolve(r.data);
            if (payload.method === 'eth_requestAccounts' || payload.method === 'eth_accounts') {
              if (!this.connected) {
                this.connected = true;
                this.connect();
              }
              this.accountsChanged(r.data);
            }
          } else {
            reject(r.data);
          }
        } catch (e) {
          console.log(e);
        }
      };
    });
  };
}

window.ethereum = new Ethereum();
