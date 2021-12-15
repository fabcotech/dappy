var DappyEthereum = (function () {
  'use strict';

  var IDENTIFY_FROM_SANDBOX = '[Common] Identify from sandbox';
  var SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX = '[Common] Sign Ethereum transaction from sandbox';
  var SEND_ETHEREUM_PAYMENT_REQUEST_FROM_SANDBOX = '[Common] Send Ethereum payment request from sandbox';
  var signEthereumTransactionFromSandboxAction = function (values) {
      return {
          type: SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX,
          payload: values,
      };
  };
  var sendEthereumPaymentRequestFromSandboxAction = function (values) {
      return {
          type: SEND_ETHEREUM_PAYMENT_REQUEST_FROM_SANDBOX,
          payload: values,
      };
  };
  var identifyFromSandboxAction = function (values) {
      return {
          type: IDENTIFY_FROM_SANDBOX,
          payload: values,
      };
  };

  var default_1 = /** @class */ (function () {
      function default_1() {
          var _this = this;
          this.identifications = {};
          this.transactions = {};
          this.sendMessageToHost = function (m) {
              var interProcess2 = new XMLHttpRequest();
              interProcess2.open('POST', 'interprocessdapp://message-from-dapp-sandboxed');
              interProcess2.setRequestHeader('Data', JSON.stringify({
                  action: m,
              }));
              interProcess2.send();
          };
          this.requestTransactions = function () {
              var interProcess = new XMLHttpRequest();
              interProcess.open('POST', 'interprocessdapp://get-transactions');
              interProcess.send();
              interProcess.onload = function (a) {
                  try {
                      var r = JSON.parse(a.target.responseText);
                      var payload = r;
                      if (payload.transactions) {
                          _this.updateTransactions(payload.transactions);
                      }
                  }
                  catch (e) {
                      console.log(e);
                  }
              };
          };
          this.requestIdentifications = function () {
              var interProcess = new XMLHttpRequest();
              interProcess.open('POST', 'interprocessdapp://get-identifications');
              interProcess.send();
              interProcess.onload = function (a) {
                  try {
                      var r = JSON.parse(a.target.responseText);
                      var payload = r;
                      if (payload.identifications) {
                          _this.updateIdentifications(payload.identifications);
                      }
                  }
                  catch (e) {
                      console.log(e);
                  }
              };
          };
      }
      default_1.prototype.identify = function (parameters) {
          var _this = this;
          var promise = new Promise(function (resolve, reject) {
              var params = parameters;
              if (!params || !params.publicKey) {
                  params = {
                      publicKey: '',
                  };
              }
              var callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();
              _this.sendMessageToHost(identifyFromSandboxAction({
                  parameters: params,
                  callId: callId,
                  resourceId: '',
              }));
              _this.identifications[callId] = {
                  resolve: resolve,
                  reject: reject,
              };
          });
          return promise;
      };
      default_1.prototype.signTransaction = function (parameters) {
          var _this = this;
          var promise = new Promise(function (resolve, reject) {
              var callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();
              _this.sendMessageToHost(signEthereumTransactionFromSandboxAction({
                  parameters: parameters,
                  callId: callId,
              }));
              _this.transactions[callId] = {
                  resolve: resolve,
                  reject: reject,
              };
          });
          return promise;
      };
      default_1.prototype.requestPayment = function (parameters) {
          var _this = this;
          var promise = new Promise(function (resolve, reject) {
              var callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();
              _this.sendMessageToHost(sendEthereumPaymentRequestFromSandboxAction({
                  parameters: parameters,
                  callId: callId,
              }));
              _this.transactions[callId] = {
                  resolve: resolve,
                  reject: reject,
              };
          });
          return promise;
      };
      default_1.prototype.updateTransactions = function (transactions) {
          var _this = this;
          Object.keys(this.transactions).forEach(function (key) {
              var callTransaction = Object.values(transactions).find(function (t) { return t.origin.origin === 'dapp' && t.origin.callId === key; });
              if (callTransaction) {
                  if (callTransaction.status === 'abandonned' || callTransaction.status === 'failed') {
                      _this.transactions[key].reject({
                          error: "transaction ".concat(callTransaction.status),
                          transaction: callTransaction,
                      });
                  }
                  else {
                      _this.transactions[key].resolve(callTransaction);
                  }
              }
          });
      };
      default_1.prototype.updateIdentifications = function (identifications) {
          var _this = this;
          Object.keys(this.identifications).forEach(function (key) {
              var callIdentification = identifications[key];
              if (callIdentification) {
                  if (callIdentification.identified) {
                      _this.identifications[key].resolve(callIdentification);
                  }
                  else {
                      _this.identifications[key].reject(callIdentification);
                  }
              }
          });
      };
      return default_1;
  }());

  return default_1;

}());
