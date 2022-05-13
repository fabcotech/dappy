var DappyRChain = (function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
     *
     * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
     * during build.
     * @param {number} code
     */
    function formatProdErrorMessage(code) {
      return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
    }

    // Inlined version of the `symbol-observable` polyfill
    var $$observable = (function () {
      return typeof Symbol === 'function' && Symbol.observable || '@@observable';
    })();

    /**
     * These are private action types reserved by Redux.
     * For any unknown actions, you must return the current state.
     * If the current state is undefined, you must return the initial state.
     * Do not reference these action types directly in your code.
     */
    var randomString = function randomString() {
      return Math.random().toString(36).substring(7).split('').join('.');
    };

    var ActionTypes = {
      INIT: "@@redux/INIT" + randomString(),
      REPLACE: "@@redux/REPLACE" + randomString(),
      PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
        return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
      }
    };

    /**
     * @param {any} obj The object to inspect.
     * @returns {boolean} True if the argument appears to be a plain object.
     */
    function isPlainObject(obj) {
      if (typeof obj !== 'object' || obj === null) return false;
      var proto = obj;

      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }

      return Object.getPrototypeOf(obj) === proto;
    }

    /**
     * Creates a Redux store that holds the state tree.
     * The only way to change the data in the store is to call `dispatch()` on it.
     *
     * There should only be a single store in your app. To specify how different
     * parts of the state tree respond to actions, you may combine several reducers
     * into a single reducer function by using `combineReducers`.
     *
     * @param {Function} reducer A function that returns the next state tree, given
     * the current state tree and the action to handle.
     *
     * @param {any} [preloadedState] The initial state. You may optionally specify it
     * to hydrate the state from the server in universal apps, or to restore a
     * previously serialized user session.
     * If you use `combineReducers` to produce the root reducer function, this must be
     * an object with the same shape as `combineReducers` keys.
     *
     * @param {Function} [enhancer] The store enhancer. You may optionally specify it
     * to enhance the store with third-party capabilities such as middleware,
     * time travel, persistence, etc. The only store enhancer that ships with Redux
     * is `applyMiddleware()`.
     *
     * @returns {Store} A Redux store that lets you read the state, dispatch actions
     * and subscribe to changes.
     */

    function createStore(reducer, preloadedState, enhancer) {
      var _ref2;

      if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
        throw new Error( formatProdErrorMessage(0) );
      }

      if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
      }

      if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
          throw new Error( formatProdErrorMessage(1) );
        }

        return enhancer(createStore)(reducer, preloadedState);
      }

      if (typeof reducer !== 'function') {
        throw new Error( formatProdErrorMessage(2) );
      }

      var currentReducer = reducer;
      var currentState = preloadedState;
      var currentListeners = [];
      var nextListeners = currentListeners;
      var isDispatching = false;
      /**
       * This makes a shallow copy of currentListeners so we can use
       * nextListeners as a temporary list while dispatching.
       *
       * This prevents any bugs around consumers calling
       * subscribe/unsubscribe in the middle of a dispatch.
       */

      function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }
      }
      /**
       * Reads the state tree managed by the store.
       *
       * @returns {any} The current state tree of your application.
       */


      function getState() {
        if (isDispatching) {
          throw new Error( formatProdErrorMessage(3) );
        }

        return currentState;
      }
      /**
       * Adds a change listener. It will be called any time an action is dispatched,
       * and some part of the state tree may potentially have changed. You may then
       * call `getState()` to read the current state tree inside the callback.
       *
       * You may call `dispatch()` from a change listener, with the following
       * caveats:
       *
       * 1. The subscriptions are snapshotted just before every `dispatch()` call.
       * If you subscribe or unsubscribe while the listeners are being invoked, this
       * will not have any effect on the `dispatch()` that is currently in progress.
       * However, the next `dispatch()` call, whether nested or not, will use a more
       * recent snapshot of the subscription list.
       *
       * 2. The listener should not expect to see all state changes, as the state
       * might have been updated multiple times during a nested `dispatch()` before
       * the listener is called. It is, however, guaranteed that all subscribers
       * registered before the `dispatch()` started will be called with the latest
       * state by the time it exits.
       *
       * @param {Function} listener A callback to be invoked on every dispatch.
       * @returns {Function} A function to remove this change listener.
       */


      function subscribe(listener) {
        if (typeof listener !== 'function') {
          throw new Error( formatProdErrorMessage(4) );
        }

        if (isDispatching) {
          throw new Error( formatProdErrorMessage(5) );
        }

        var isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
          if (!isSubscribed) {
            return;
          }

          if (isDispatching) {
            throw new Error( formatProdErrorMessage(6) );
          }

          isSubscribed = false;
          ensureCanMutateNextListeners();
          var index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
          currentListeners = null;
        };
      }
      /**
       * Dispatches an action. It is the only way to trigger a state change.
       *
       * The `reducer` function, used to create the store, will be called with the
       * current state tree and the given `action`. Its return value will
       * be considered the **next** state of the tree, and the change listeners
       * will be notified.
       *
       * The base implementation only supports plain object actions. If you want to
       * dispatch a Promise, an Observable, a thunk, or something else, you need to
       * wrap your store creating function into the corresponding middleware. For
       * example, see the documentation for the `redux-thunk` package. Even the
       * middleware will eventually dispatch plain object actions using this method.
       *
       * @param {Object} action A plain object representing “what changed”. It is
       * a good idea to keep actions serializable so you can record and replay user
       * sessions, or use the time travelling `redux-devtools`. An action must have
       * a `type` property which may not be `undefined`. It is a good idea to use
       * string constants for action types.
       *
       * @returns {Object} For convenience, the same action object you dispatched.
       *
       * Note that, if you use a custom middleware, it may wrap `dispatch()` to
       * return something else (for example, a Promise you can await).
       */


      function dispatch(action) {
        if (!isPlainObject(action)) {
          throw new Error( formatProdErrorMessage(7) );
        }

        if (typeof action.type === 'undefined') {
          throw new Error( formatProdErrorMessage(8) );
        }

        if (isDispatching) {
          throw new Error( formatProdErrorMessage(9) );
        }

        try {
          isDispatching = true;
          currentState = currentReducer(currentState, action);
        } finally {
          isDispatching = false;
        }

        var listeners = currentListeners = nextListeners;

        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener();
        }

        return action;
      }
      /**
       * Replaces the reducer currently used by the store to calculate the state.
       *
       * You might need this if your app implements code splitting and you want to
       * load some of the reducers dynamically. You might also need this if you
       * implement a hot reloading mechanism for Redux.
       *
       * @param {Function} nextReducer The reducer for the store to use instead.
       * @returns {void}
       */


      function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
          throw new Error( formatProdErrorMessage(10) );
        }

        currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
        // Any reducers that existed in both the new and old rootReducer
        // will receive the previous state. This effectively populates
        // the new state tree with any relevant data from the old one.

        dispatch({
          type: ActionTypes.REPLACE
        });
      }
      /**
       * Interoperability point for observable/reactive libraries.
       * @returns {observable} A minimal observable of state changes.
       * For more information, see the observable proposal:
       * https://github.com/tc39/proposal-observable
       */


      function observable() {
        var _ref;

        var outerSubscribe = subscribe;
        return _ref = {
          /**
           * The minimal observable subscription method.
           * @param {Object} observer Any object that can be used as an observer.
           * The observer object should have a `next` method.
           * @returns {subscription} An object with an `unsubscribe` method that can
           * be used to unsubscribe the observable from the store, and prevent further
           * emission of values from the observable.
           */
          subscribe: function subscribe(observer) {
            if (typeof observer !== 'object' || observer === null) {
              throw new Error( formatProdErrorMessage(11) );
            }

            function observeState() {
              if (observer.next) {
                observer.next(getState());
              }
            }

            observeState();
            var unsubscribe = outerSubscribe(observeState);
            return {
              unsubscribe: unsubscribe
            };
          }
        }, _ref[$$observable] = function () {
          return this;
        }, _ref;
      } // When a store is created, an "INIT" action is dispatched so that every
      // reducer returns their initial state. This effectively populates
      // the initial state tree.


      dispatch({
        type: ActionTypes.INIT
      });
      return _ref2 = {
        dispatch: dispatch,
        subscribe: subscribe,
        getState: getState,
        replaceReducer: replaceReducer
      }, _ref2[$$observable] = observable, _ref2;
    }

    var SEND_RCHAIN_TRANSACTION_FROM_SANDBOX = '[Common] Send RChain transaction from sandbox';
    var SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX = '[Common] Send RChain payment request from sandbox';
    var IDENTIFY_FROM_SANDBOX = '[Common] Identify from sandbox';
    var UPDATE_TRANSACTIONS = '[Common] Update transactions';
    var UPDATE_IDENTIFICATIONS = '[Common] Update identifications';
    var sendRChainTransactionFromSandboxAction = function (values) {
        return {
            type: SEND_RCHAIN_TRANSACTION_FROM_SANDBOX,
            payload: values,
        };
    };
    var sendRChainPaymentRequestFromSandboxAction = function (values) {
        return {
            type: SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX,
            payload: values,
        };
    };
    var updateTransactionsAction = function (values) {
        return {
            type: UPDATE_TRANSACTIONS,
            payload: values,
        };
    };
    var identifyFromSandboxAction = function (values) {
        return {
            type: IDENTIFY_FROM_SANDBOX,
            payload: values,
        };
    };
    var updateIdentificationsAction = function (values) {
        return {
            type: UPDATE_IDENTIFICATIONS,
            payload: values,
        };
    };

    var default_1 = /** @class */ (function () {
        function default_1() {
            var _this = this;
            this.identifications = {};
            this.transactions = {};
            this.jobs = {};
            this.getTransactionValueJob = function (id, transaction) {
                console.log('getTransactionValueJob', id);
                try {
                    if (_this.jobs[id]) {
                        return;
                    }
                    if (typeof transaction.value !== 'string') {
                        return;
                    }
                    _this.jobs[id] = true;
                    if (!_this.rchainWeb) {
                        console.warn('Cannot get transaction value, RChainWeb is not in scope');
                        return;
                    }
                    var i_1 = 0;
                    var ongoing_1 = false;
                    var s_1 = setInterval(function () {
                        console.log('setInterval', i_1);
                        if (ongoing_1) {
                            return;
                        }
                        ongoing_1 = true;
                        if (i_1 > 12) {
                            clearInterval(s_1);
                            return;
                        }
                        i_1 += 1;
                        var unforgeableId = transaction.value.slice(transaction.value.indexOf(': ') + 2).replace('"', '');
                        console.log(transaction.value);
                        console.log(unforgeableId);
                        _this.rchainWeb.dataAtName({
                            name: {
                                UnforgDeploy: { data: unforgeableId },
                            },
                            depth: 3,
                        }).then(function (dan) {
                            ongoing_1 = false;
                            console.log('ok');
                            console.log(dan);
                            if (JSON.parse(dan) && JSON.parse(dan).exprs && JSON.parse(dan).exprs.length) {
                                console.log(RChainWeb.utils.rhoValToJs(dan.exprs[0]));
                                clearInterval(s_1);
                            }
                        })
                            .catch(function (err) {
                            ongoing_1 = false;
                            console.log(err);
                        });
                    }, 10000);
                }
                catch (err) {
                    console.warn('failed to get transaction value');
                    console.log(err);
                }
            };
            this.sendMessageToHost = function (m) {
                return new Promise(function (resolve, reject) {
                    var interProcess2 = new XMLHttpRequest();
                    interProcess2.open('POST', 'interprocessdapp://message-from-dapp-sandboxed');
                    interProcess2.setRequestHeader('Data', JSON.stringify({
                        action: m,
                    }));
                    interProcess2.send();
                    interProcess2.onloadend = function () {
                        if (interProcess2.responseText && interProcess2.responseText.length) {
                            reject(interProcess2.responseText);
                        }
                        else {
                            resolve(undefined);
                        }
                    };
                });
            };
            this.initialState = {
                transactions: [],
                identifications: {},
            };
            this.store = createStore(function (state, action) {
                switch (action.type) {
                    case UPDATE_TRANSACTIONS: {
                        var payload = action.payload;
                        return __assign(__assign({}, state), { transactions: payload.transactions });
                    }
                    case UPDATE_IDENTIFICATIONS: {
                        var payload = action.payload;
                        return __assign(__assign({}, state), { identifications: __assign(__assign({}, state.identifications), payload.identifications) });
                    }
                    default: {
                        return state;
                    }
                }
            }, this.initialState);
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
            console.log('RChainWeb', RChainWeb);
            if (typeof RChainWeb !== 'undefined') {
                this.rchainWeb = new RChainWeb.http({
                    readOnlyHost: "dappynetwork://",
                    validatorHost: "dappynetwork://",
                });
                console.log(this.rchainWeb);
            }
        }
        default_1.prototype.fetch = function (url) {
            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (event) {
                    // XMLHttpRequest.DONE === 4
                    if (this.readyState === XMLHttpRequest.DONE) {
                        if (this.status === 200) {
                            resolve(this.responseText);
                        }
                        else {
                            reject(this.status);
                        }
                    }
                };
                req.open('GET', url, true);
                req.setRequestHeader('Accept', 'rholang/term');
                req.send(null);
            });
        };
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
                })).then(function () {
                    _this.identifications[callId] = {
                        resolve: resolve,
                        reject: reject,
                    };
                })
                    .catch(function (err) {
                    reject(err);
                });
            });
            return promise;
        };
        default_1.prototype.sendTransaction = function (parameters) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();
                _this.sendMessageToHost(sendRChainTransactionFromSandboxAction({
                    parameters: parameters,
                    callId: callId,
                })).then(function () {
                    _this.transactions[callId] = {
                        resolve: resolve,
                        reject: reject,
                    };
                })
                    .catch(function (err) {
                    reject(err);
                });
            });
            return promise;
        };
        default_1.prototype.requestPayment = function (parameters) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();
                _this.sendMessageToHost(sendRChainPaymentRequestFromSandboxAction({
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
            Object.keys(transactions).forEach(function (key) {
                _this.getTransactionValueJob(key, transactions[key]);
            });
            Object.keys(this.transactions).forEach(function (key) {
                var callTransaction = Object.values(transactions).find(function (t) { return t.origin.origin === 'dapp' && t.origin.callId === key; });
                if (callTransaction) {
                    if (callTransaction.status === 'aired') {
                        _this.transactions[key].resolve(callTransaction);
                    }
                    else if (callTransaction.status === 'abandonned' || callTransaction.status === 'failed') {
                        _this.transactions[key].reject({
                            error: "transaction ".concat(callTransaction.status),
                            transaction: callTransaction,
                        });
                    }
                }
                _this.store.dispatch(updateTransactionsAction({ transactions: transactions }));
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
                _this.store.dispatch(updateIdentificationsAction({ identifications: identifications }));
            });
        };
        return default_1;
    }());

    return default_1;

}());
