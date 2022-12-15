(function () {
  'use strict';

  function Ethereum() {
      var _this = this;
      this.listenners = {};
      this.isMetaMask = false;
      this.connected = false;
      this.isConnected = function () { return _this.connected; };
      this.on = function (method, f) {
          if (typeof method !== 'string' || typeof f !== 'function') {
              throw new Error('Invalid arguments');
          }
          if (!_this.listenners[method]) {
              _this.listenners[method] = [];
          }
          _this.listenners[method] = _this.listenners[method].concat(f);
      };
      this.chainChanged = function (chainId) {
          if (_this.listenners['chainChanged']) {
              _this.listenners['chainChanged'].forEach(function (f) {
                  f(chainId);
              });
          }
      };
      this.accountsChanged = function (accounts) {
          if (_this.listenners['accountsChanged']) {
              _this.listenners['accountsChanged'].forEach(function (f) {
                  f(accounts);
              });
          }
      };
      this.connect = function () {
          if (_this.listenners['connect']) {
              _this.listenners['connect'].forEach(function (f) {
                  f({});
              });
          }
      };
      this.disconnect = function (error) {
          _this.connected = false;
          if (_this.listenners['disconnect']) {
              _this.listenners['disconnect'].forEach(function (f) {
                  f(error);
              });
          }
      };
      this.request = function (payload) {
          var _this = this;
          console.log(payload.method);
          return new Promise(function (resolve, reject) {
              var interProcess = new XMLHttpRequest();
              interProcess.open('POST', "interprocessdapp://".concat(payload.method));
              interProcess.setRequestHeader('Data', JSON.stringify(payload));
              interProcess.send();
              interProcess.onload = function (a) {
                  try {
                      var r = JSON.parse(a.target.responseText);
                      if (r.success) {
                          resolve(r.data);
                          if (payload.method === 'eth_requestAccounts' || payload.method === 'eth_accounts') {
                              if (!_this.connected) {
                                  _this.connected = true;
                                  _this.connect();
                              }
                              _this.accountsChanged(r.data);
                          }
                      }
                      else {
                          reject(r.data);
                      }
                  }
                  catch (e) {
                      console.log(e);
                  }
              };
          });
      };
  }
  window.ethereum = new Ethereum();

}());
