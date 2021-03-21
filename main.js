'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var path = _interopDefault(require('path'));
var zlib = _interopDefault(require('zlib'));
var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var fs = _interopDefault(require('fs'));
var crypto = _interopDefault(require('crypto'));
var dns = _interopDefault(require('dns'));

var DAPP_INITIAL_SETUP = '[Common] dapp initial setup';
var SEND_RCHAIN_TRANSACTION_FROM_SANDBOX = '[Common] Send RChain transaction from sandbox';
var SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX = '[Common] Send RChain payment request from sandbox';
var IDENTIFY_FROM_SANDBOX = '[Common] Identify from sandbox';

var validateSearch = function (search) {
    return /[a-z]*\/(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};
var validateSearchWithProtocol = function (search) {
    return /^dappy:\/\/\w[a-z]*\/(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};
var validateShortcutSearchWithProtocol = function (search) {
    return /^dappy:\/\/(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};

/*! *****************************************************************************
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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;
function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = defaultMemoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);

function createStructuredSelector(selectors) {
  var selectorCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createSelector;

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}
});

unwrapExports(lib);
var lib_1 = lib.defaultMemoize;
var lib_2 = lib.createSelectorCreator;
var lib_3 = lib.createStructuredSelector;
var lib_4 = lib.createSelector;

var LOAD_OR_RELOAD_BROWSER_VIEW = '[MAIN] Load or reload browser view';
var LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED = '[MAIN] Load or reload browser view completed';
var DESTROY_BROWSER_VIEW = '[MAIN] Destroy browser view';
var UPDATE_BROWSER_VIEWS_POSITION = '[MAIN] Update browser views position';
var SAVE_BROWSER_VIEW_COMM_EVENT = '[MAIN] Save browser view comm event';
var DISPLAY_ONLY_BROWSER_VIEW_X = '[MAIN] Display only browser view x';
var DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED = '[MAIN] Display only browser view x completed';
var SET_BROWSER_VIEW_MUTED = '[MAIN] Set browser view muted';
var initialState = { browserViews: {}, position: undefined };
// todo DO a saga
var reducer = function (state, action) {
    var _a;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED: {
            return __assign(__assign({}, state), { browserViews: __assign(__assign({}, state.browserViews), action.payload) });
        }
        case DESTROY_BROWSER_VIEW: {
            var browserView = state.browserViews[action.payload.resourceId];
            if (browserView) {
                if (browserView.browserView.webContents.isDevToolsOpened()) {
                    browserView.browserView.webContents.closeDevTools();
                    browserView.browserView.webContents.forcefullyCrashRenderer();
                }
                action.meta.browserWindow.removeBrowserView(browserView.browserView);
                var newBrowserViews = __assign({}, state.browserViews);
                delete newBrowserViews[action.payload.resourceId];
                return __assign(__assign({}, state), { browserViews: newBrowserViews });
            }
            else {
                return state;
            }
        }
        case UPDATE_BROWSER_VIEWS_POSITION: {
            Object.keys(state.browserViews).forEach(function (k) {
                if (state.browserViews[k].visible) {
                    state.browserViews[k].browserView.setBounds(action.payload);
                }
            });
            return __assign(__assign({}, state), { position: action.payload });
        }
        case SAVE_BROWSER_VIEW_COMM_EVENT: {
            return __assign(__assign({}, state), { browserViews: __assign(__assign({}, state.browserViews), (_a = {}, _a[action.payload.id] = __assign(__assign({}, state.browserViews[action.payload.id]), { commEvent: action.payload.commEvent }), _a)) });
        }
        case DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED: {
            return __assign(__assign({}, state), { browserViews: __assign(__assign({}, state.browserViews), action.payload) });
        }
        default:
            return state;
    }
};
var getBrowserViewsMainState = lib_4(function (state) { return state; }, function (state) { return state.browserViews; });
var getBrowserViewsMain = lib_4(getBrowserViewsMainState, function (state) { return state.browserViews; });
var getBrowserViewsPositionMain = lib_4(getBrowserViewsMainState, function (state) { return state.position; });

var WS_RECONNECT_PERIOD = 10000;
var WS_PAYLOAD_PAX_SIZE = 256000; // bits

var boxTerm_1 = (payload) => {
  return `new 
  mainCh,
  entryCh,
  entryUriCh,
  returnBagsWithoutKeys,
  createKeyInBoxPurseIfNotExistCh,
  superKeysCh,
  readyCh,
  readyCounterCh,
  boxPursesCh,
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  insertArbitrary(\`rho:registry:insertArbitrary\`),
  lookup(\`rho:registry:lookup\`)
in {

  // superKeys
  // { [URI]: key }
  superKeysCh!({}) |

  // keys
  // { [URI]: { [bagId: string]: key } }
  boxPursesCh!({}) |

  // returns { [URI]: Set[BagId] }
  contract returnBagsWithoutKeys(@(registryUris, keys, return)) = {
    new tmpCh, itCh in {
      for (@(tmpCh, registryUris) <= itCh) {
        for (tmp <- @tmpCh) {
          match registryUris {
            Nil => {
              @return!(*tmp)
            }
            Set(last) => {
              @return!(*tmp.set(last, keys.get(last).keys()))
            }
            Set(first ... rest) => {
              @tmpCh!(*tmp.set(first, keys.get(first).keys())) |
              itCh!((tmpCh, rest))
            }
          }
        }
      } |
      tmpCh!({}) |
      itCh!((*tmpCh, registryUris))
    }
  } |

  for (@(uri, return) <= createKeyInBoxPurseIfNotExistCh) {
    match uri {
      URI => {
        for (keys <<- boxPursesCh) {
          match *keys.get(uri) {
            Nil => {
              for (_ <- boxPursesCh) {
                boxPursesCh!(*keys.set(uri, {})) | @return!({})
              }
            }
            _ => {
              @return!(*keys.get(uri))
            }
          }
        }
      }
      _ => {
        @return!("error: unknown type")
      }
    }
  } |

  // PUBLIC capabilities
  /*
    (payload: { registryUri: URI, purse: *purse }) => String | (true, Nil)
    Receives a purse, checks it, find a purse with same type
    if fungible
      SWAP
    if non-fungible
      if a purse in box is found (same type AND price Nil): DEPOSIT
      else: SWAP and save new purse
  */
  // todo, if this operation fails, remove empty key in boxPurses ?
  for (@(payload, return) <= @(*entryCh, "PUBLIC_RECEIVE_PURSE")) {
    new lookupReturnCh, checkReturnCh, readReturnCh, readPropertiesReturnCh, return1Ch,
    itCh, doDepositOrSwapCh, decideToDepositOrSwpaCh in {

      /*
        1: check the purses received by asking
        the contract at payload.get("registryUri")
      */
      lookup!(payload.get("registryUri"), *lookupReturnCh) |
      for (contractEntry <- lookupReturnCh) {
        @(*contractEntry, "PUBLIC_CHECK_PURSES")!(([payload.get("purse")], *checkReturnCh)) |
        @(*contractEntry, "PUBLIC_READ")!((Nil, *readReturnCh)) |
        @(payload.get("purse"), "READ")!((Nil, *readPropertiesReturnCh)) |
        for (checkReturn <- checkReturnCh; current <- readReturnCh; receivedPurseProperties <- readPropertiesReturnCh) {
          match *checkReturn {
            String => {
              @return!(*checkReturn)
            }
            (true, _) => {
              /*
                2: create key for registry URI in boxPurses if it does
                nto exist
              */
              createKeyInBoxPurseIfNotExistCh!((payload.get("registryUri"), *return1Ch)) |

              /*
                3: find a purse to deposit into and
                decide to DEPOSIT or SWAP
                toto: if a purse is found check that it's not a purse
                that already exists in box
              */
              for (@purses <- return1Ch) {
                match purses {
                  String => {
                    @return!(purses)
                  }
                  _ => {
                    match *current.get("fungible") {
                      false => {
                        doDepositOrSwapCh!((
                          payload.get("purse"),
                          payload.get("registryUri"),
                          "swap",
                          Nil
                        ))
                      }
                      true => {
                        new tmpCh, itCh in {
                          for (pursesIds <= itCh) {
                            match *pursesIds {
                              Set() => {
                                doDepositOrSwapCh!((
                                  payload.get("purse"),
                                  payload.get("registryUri"),
                                  "swap",
                                  Nil
                                ))
                              }
                              Set(last) => {
                                new readReturnCh in {
                                  @(purses.get(last), "READ")!((Nil, *readReturnCh)) |
                                  for (properties <- readReturnCh) {
                                    match (
                                      *properties.get("type") == *receivedPurseProperties.get("type"),
                                      *properties.get("price") == Nil
                                    ) {
                                      (true, true) => {
                                        doDepositOrSwapCh!((
                                          payload.get("purse"),
                                          payload.get("registryUri"),
                                          "deposit",
                                          purses.get(last)
                                        ))
                                      }
                                      _ => {
                                        doDepositOrSwapCh!((
                                          payload.get("purse"),
                                          payload.get("registryUri"),
                                          "swap",
                                          Nil
                                        ))
                                      }
                                    }
                                  }
                                }
                              }
                              Set(first ... rest) => {
                                new readReturnCh in {
                                  @(purses.get(first), "READ")!((Nil, *readReturnCh)) |
                                  for (properties <- readReturnCh) {
                                    match (
                                      *properties.get("type") == *receivedPurseProperties.get("type"),
                                      *properties.get("price") == Nil
                                    ) {
                                      (true, true) => {
                                        doDepositOrSwapCh!((
                                          payload.get("purse"),
                                          payload.get("registryUri"),
                                          "deposit",
                                          purses.get(first)
                                        ))
                                      }
                                      _ => {
                                        itCh!(rest)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          } |
                          itCh!(purses.keys())
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } |

      /*
        4: SWAP or DEPOSIT then save to boxPursesCh
      */
      for (@(purse, registryUri, operation, purseToDepositTo) <- doDepositOrSwapCh) {
        match operation {
          "swap" => {
            new returnSwapCh, returnReadMainCh, returnPropertiesCh in {
              for (main <<- mainCh) {
                @(purse, "SWAP")!((*main.get("publicKey"), *returnSwapCh)) |
                for (swappedPurse <- returnSwapCh) {
                  @(*swappedPurse, "READ")!((Nil, *returnPropertiesCh)) |
                  for (properties <- returnPropertiesCh) {
                    for (boxPurses <- boxPursesCh) {
                      boxPursesCh!(
                        *boxPurses.set(
                          registryUri,
                          *boxPurses.get(registryUri).set(
                            *properties.get("id"),
                            *swappedPurse
                          )
                        )
                      ) |
                      @return!((true, Nil))
                    }
                  }
                }
              }
            }
          }
          "deposit" => {
            new returnDepositCh, returnPropertiesCh in {
              @(purseToDepositTo, "DEPOSIT")!((purse, *returnDepositCh)) |
              for (r <- returnDepositCh) {
                match *r {
                  String => {
                    @return!(*r)
                  }
                  (true, Nil) => {
                    @return!((true, Nil))
                  }
                }
              }
            }
          }
        }
      }
    }
  } |

  for (@(Nil, return) <= @(*entryCh, "PUBLIC_READ")) {
    for (main <<- mainCh) {
      @return!(*main)
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_SUPER_KEYS")) {
    for (superKeys <<- superKeysCh) {
      @return!(*superKeys.keys())
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES")) {
    for (purses <<- boxPursesCh) {
      match *purses.keys().size() {
        0 => {
          @return!({})
        }
        _ => {
          returnBagsWithoutKeys!((*purses.keys(), *purses, return))
        }
      }
    }
  } |

  insertArbitrary!(*entryCh, *entryUriCh) |

  for (entryUri <- entryUriCh) {

    // OWNER / PRIVATE capabilities
    for (@(action, return) <= @(*deployerId, "\${n}" %% { "n": *entryUri })) {
      match action.get("type") {
        "READ" => {
          for (main <<- mainCh) {
            @return!(*main)
          }
        }
        "READ_SUPER_KEYS" => {
          for (superKeys <<- superKeysCh) {
            @return!(*superKeys)
          }
        }
        "READ_PURSES" => {
          for (purses <<- boxPursesCh) {
            @return!(*purses)
          }
        }
        "SAVE_PURSE_SEPARATELY" => {
          match (
            action.get("payload").get("registryUri"),
            action.get("payload").get("purse"),
          ) {
            (URI, _) => {
              new createKeyReturnCh, readReturnCh in {
                createKeyInBoxPurseIfNotExistCh!((action.get("payload").get("registryUri"), *createKeyReturnCh)) |
                for (purses <- createKeyReturnCh) {
                  match *purses {
                    String => {
                      @return!("error: invalid payload")
                    }
                    _ => {
                      @(action.get("payload").get("purse"), "READ")!((Nil, *readReturnCh)) |
                      for (@properties <- readReturnCh) {
                        for (boxPurses <- boxPursesCh) {
                          boxPursesCh!(
                            *boxPurses.set(
                              action.get("payload").get("registryUri"),
                              *purses.set(
                                properties.get("id"),
                                action.get("payload").get("purse")
                              )
                            )
                          ) |
                          @return!((true, Nil))
                        }
                      }
                    }
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload")
            }
          }
        }
        "DELETE_PURSE" => {
          for (purses <<- boxPursesCh) {
            match action.get("payload") {
              payload => {
                match (
                  payload.get("registryUri"),
                  payload.get("id"),
                  *purses.get(payload.get("registryUri"))
                ) {
                  (URI, String, Map) => {
                    for (boxPurses <- boxPursesCh) {
                      boxPursesCh!(
                        *boxPurses.set(
                          payload.get("registryUri"),
                          *boxPurses.get(payload.get("registryUri")).delete(payload.get("id"))
                        )
                      ) |
                      @return!((true, Nil))
                    }
                  }
                  _ => {
                    @return!("error: invalid payload")
                  }
                }
              }
              _ => {
                @return!("error: invalid payload")
              }
            }
          }
        }
        "SAVE_SUPER_KEY" => {
          match action.get("payload") {
            { "superKey": _, "registryUri": URI } => {
              for (keys <- superKeysCh) {
                match *keys.keys().contains(action.get("payload").get("registryUri")) {
                  true => {
                    superKeysCh!(*keys) |
                    @return!("error: super key for registryUri already exists in box")
                  }
                  false => {
                    superKeysCh!(*keys.set(action.get("payload").get("registryUri"), action.get("payload").get("superKey"))) |
                    @return!((true, Nil))
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload, structure should be { superKey: _, registryUri: String }")
            }
          }
        }
        _ => {
          @return!("error: unknown action")
        }
      }
    } |

    stdout!("box deployed, private channel is @(*deployerId, '\${n}')" %% { "n": *entryUri }  ) |
    mainCh!({
      "registryUri": *entryUri,
      "publicKey": "${payload.publicKey}",
      "version": "5.0.0",
      "status": "completed"
    })
  }
}
`;
};

var boxTerm = {
	boxTerm: boxTerm_1
};

var mainTerm_1 = (fromBoxRegistryUri, payload) => {
    return `new 
  mainCh,

  entryCh,
  entryUriCh,
  iterateCh,
  makePurseCh,
  superKeyCh,

  /*
    vault stores the id for each purse unforgeable name, you
    must have a purse to receive / peek from *vault:
    // create purse "12"
    @(*vault, *purse)!("12")

    // peek and check purse
    for (id <<- @(*vault, *purse)) {
      out!(*purse) |
      // "12"
      for (purse <- @(*purses, "12")) {
        out!(*purse)
        // { "quantity": 100, "type": "GOLD", "publicKey": "aaa" }
      }
    }
  */
  vault,

  /*
    A purse's properties is a Map {"quantity", "type", "price", "publicKey"}
    stored in the channel *purses. Anyone can read it through
    "READ_PURSES" public channel.

    // create purse "12" (it must not exist)
    @(*purses, "12")!({ "publicKey": "aaa", etc... }) |

    // receive purse "12"
    for (purse <- @(*purses, "12")) {
      out!(*purse)
    }

    // peek purse "12"
    for (purse <<- @(*purses, "12")) {
      out!(*purse)
    }
  */
  purses,

  /*
    pursesIds is a Set with all ids of purses that have amount > 0
    for (ids <- pursesIds) { ... }
  */
  pursesIds,

  /*
    pursesData contains the data associated to purses
    for (data <- @(*pursesData, "12")) { ... }
  */
  pursesData,

  counterCh,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`)
in {

  counterCh!(0) |

  pursesIds!(Set()) |

  /*
    MAKE PURSE
    only place where new purses are created
    "MINT", "SWAP", "CREATE_PURSES" call this channel

    depending on if .fungible is true or false, it decides
    which id to give to the new purse, then it instantiates
    the purse with WITHDRAW, SWAP, BURN "instance channels"
  */
  for (@(properties, data, return) <= makePurseCh) {
    new idAndQuantityCh in {
      for (current <<- mainCh) {
        match *current.get("fungible") {
          true => {
            for (counter <- counterCh) {
              counterCh!(*counter + 1) |
              idAndQuantityCh!({ "id": "\${n}" %% { "n": *counter }, "quantity": properties.get("quantity") })
            }
          }
          false => {
            for (ids <<- pursesIds) {
              match *ids.contains(properties.get("id")) {
                true => {
                  match properties.get("id") {
                    "0" => {
                      match (properties.get("newId"), *ids.contains(properties.get("newId"))) {
                        (String, false) => {
                          idAndQuantityCh!({ "id": properties.get("newId"), "quantity": 1 })
                        }
                        _ => {
                          @return!("error: no .newId in payload or .newId already exists")
                        }
                      }
                    }
                    _ => {
                      @return!("error: purse ID already exists")
                    }
                  }
                }
                false => { idAndQuantityCh!({ "id": properties.get("id"), "quantity": properties.get("quantity") }) }
              }
            }
          }
        }
      } |
      for (idAndQuantity <- idAndQuantityCh) {
        match properties
          .set("id", *idAndQuantity.get("id"))
          .set("quantity", *idAndQuantity.get("quantity"))
          .delete("newId")
        {
          purseProperties => {
            match purseProperties {
              {
                "quantity": Int,
                // not used in main contract or box contract
                // only useful for dumping data
                "publicKey": String,
                "type": String,
                "id": String,
                "price": Nil \\/ Int
              } => {
                for (ids <- pursesIds) {
                  match *ids.contains(purseProperties.get("id")) {
                    false => {
                      pursesIds!(*ids.union(Set(purseProperties.get("id")))) |
                      @(*purses, purseProperties.get("id"))!(purseProperties) |
                      @(*pursesData, purseProperties.get("id"))!(data) |
                      new purse in {
                        @(*vault, *purse)!(purseProperties.get("id")) |
                        @return!(*purse) |

                        /*
                          READ
                          Returns prperties "id", "quantity", "type", "publicKey" and "price"(not implemented)
                          (Nil) => propertie
                        */
                        for (@(Nil, returnRead) <= @(*purse, "READ")) {
                          for (id <<- @(*vault, *purse)) {
                            for (props <<- @(*purses, *id)) {
                              @returnRead!(*props.set("id", *id))
                            }
                          }
                        } |

                        /*
                          SWAP
                          (Nil) => purse
                          Useful when you receive purse from unknown source, swap it
                          to make sure emitter did not keep a copy
                        */
                        for (@(publicKey, returnSwap) <= @(*purse, "SWAP")) {
                          match publicKey {
                            String => {
                              for (id <- @(*vault, *purse)) {
                                for (ids <- pursesIds) {
                                  pursesIds!(*ids.delete(*id)) |
                                  for (data <- @(*pursesData, *id)) {
                                    for (props <- @(*purses, *id)) {
                                      makePurseCh!((
                                        *props.set("publicKey", publicKey), *data, returnSwap
                                      ))
                                    }
                                  }
                                }
                              }
                            }
                            _ => {
                              @returnSwap!("error: public key must be a string")
                            }
                          }
                        } |

                        /*
                          UPDATE_DATA
                          (any) => string | (true, purse[])
                        */
                        for (@(payload, returnUpdateData) <= @(*purse, "UPDATE_DATA")) {
                          new readReturnCh in {
                            @(*purse, "READ")!((Nil, *readReturnCh)) |
                            for (@properties <- readReturnCh) {
                              for (_ <- @(*pursesData, properties.get("id"))) {
                                @(*pursesData, properties.get("id"))!(payload) |
                                @returnUpdateData!((true, Nil))
                              }
                            }
                          }
                        } |

                        /*
                          SET_PRICE
                          (payload: Int or Nil) => string | (true, Nil)
                        */
                        for (@(payload, returnSetPrice) <= @(*purse, "SET_PRICE")) {
                          match payload {
                            Int \\/ Nil => {
                              new boxEntryCh, receivePursesReturnCh, readReturnCh, makePurseReturnCh in {
                                @(*purse, "READ")!((Nil, *readReturnCh)) |
                                for (@properties1 <- readReturnCh) {
                                  for (@properties2 <- @(*purses, properties1.get("id"))) {
                                    @(*purses, properties1.get("id"))!(
                                      properties2.set("price", payload)
                                    ) |
                                    @returnSetPrice!((true, Nil))
                                  }
                                }
                              }
                            }
                            _ => {
                              @returnSetPrice!("error: payload must be an integer or Nil")
                            }
                          }
                        } |

                        /*
                          WITHDRAW
                          (payload: Int) => string | (true, purse)
                        */
                        for (@(payload, returnWithdraw) <= @(*purse, "WITHDRAW")) {
                          match payload {
                            Int => {
                              new boxEntryCh, receivePursesReturnCh, readReturnCh, makePurseReturnCh in {
                                @(*purse, "READ")!((Nil, *readReturnCh)) |
                                for (@properties1 <- readReturnCh) {
                                  match (
                                    /*
                                      The remaining cannot be 0, if you want to send
                                      the whole purse, just hand the *purse object to someone's box
                                    */
                                    properties1.get("quantity") > payload,
                                    payload > 0
                                  ) {
                                    (true, true) => {
                                      /*
                                        change quantity in *purse, and create a new purse
                                        with [payload] quantity
                                      */
                                      for (@properties2 <- @(*purses, properties1.get("id"))) {
                                        @(*purses, properties1.get("id"))!(
                                          properties2.set("quantity", properties2.get("quantity") - payload)
                                        ) |
                                        makePurseCh!((
                                          properties2.set("quantity", payload).set("price", Nil), Nil, *makePurseReturnCh
                                        )) |
                                        for (newPurse <- makePurseReturnCh) {
                                          @returnWithdraw!((true, *newPurse))
                                        }
                                      }
                                    }
                                    _ => {
                                      @returnWithdraw!("error: quantity invalid, remaining cannot be zero")
                                    }
                                  }
                                }
                              }

                            }
                            _ => {
                              @returnWithdraw!("error: payload must be an integer")
                            }
                          }
                        } |

                        /*
                          DEPOSIT
                          (payload: purse) => string | (true, Nil)
                        */
                        for (@(payload, returnDeposit) <= @(*purse, "DEPOSIT")) {
                          new boxEntryCh, receivePursesReturnCh, readReturnCh in {
                            @(*purse, "READ")!((Nil, *readReturnCh)) |
                            for (@properties1 <- readReturnCh) {
                              for (id <<- @(*vault, payload)) {
                                for (@properties2 <<- @(*purses, *id)) {
                                  match (
                                    properties2.get("quantity"),
                                    properties2.get("quantity") > 0,
                                    properties1.get("type") == properties2.get("type"),
                                    properties1.get("price")
                                  ) {
                                    (Int, true, true, Nil) => {
                                      for (_ <- @(*vault, payload)) { Nil } |
                                      for (ids <- pursesIds) {
                                        pursesIds!(*ids.delete(*id))
                                      } |
                                      for (_ <- @(*pursesData, *id)) { Nil } |
                                      for (_ <- @(*purses, *id)) { Nil } |
                                      for (@properties <- @(*purses, properties1.get("id"))) {
                                        @(*purses, properties1.get("id"))!(
                                          properties.set(
                                            "quantity",
                                            properties.get("quantity") + properties2.get("quantity")
                                          )
                                        ) |
                                        @returnDeposit!((true, Nil))
                                      }
                                    }
                                    _ => {
                                      @returnDeposit!("error: cannot deposit to a purse with .price not Nil")
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    true => {
                      pursesIds!(*ids) |
                      @return!("error: purse ID already exists")
                    }
                  }
                }
              }
              _ => {
                @return!("error: invalid purse")
              }
            }
          }
        }
      }
    }
  } |

  // ====================================
  // SUPER / ADMIN / OWNER capabilities (if not locked)
  // You must have the superKeyCh to perform those operations
  // ====================================

  for (@(Nil, return) <= @(*superKeyCh, "LOCK")) {
    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          @return!("error: contract is locked")
        }
        false => {
          for (current <- mainCh) {
            mainCh!(*current.set("locked", true)) |
            @return!((true, Nil))
          }
        }
      }
    }
  } |

  for (@(payload, return) <= @(*superKeyCh, "CREATE_PURSES")) {
    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          @return!("error: contract is locked")
        }
        false => {
          new itCh, createdPursesesCh, saveKeyAndBagCh in {
            createdPursesesCh!([]) |
            itCh!((payload.get("purses").keys(), payload.get("purses"), payload.get("data"))) |
            for(@(set, newPurses, newData) <= itCh) {
              match set {
                Nil => {}
                Set(last) => {
                  new retCh in {
                    makePurseCh!((newPurses.get(last), newData.get(last), *retCh)) |
                    for (purse <- retCh) {
                      match *purse {
                        String => {
                          @return!(*purse)
                        }
                        _ => {
                          for (createdPurses <- createdPursesesCh) {
                            @return!((true, { "purses": *createdPurses ++ [*purse] }))
                          }
                        }
                      }
                    }
                  }
                }
                Set(first ... rest) => {
                  new retCh in {
                    makePurseCh!((newPurses.get(first), newData.get(first), *retCh)) |
                    for (purse <- retCh) {
                      match *purse {
                        String => {
                          @return!(*purse)
                        }
                        _ => {
                          for (createdPurses <- createdPursesesCh) {
                            createdPursesesCh!(*createdPurses ++ [*purse]) |
                            itCh!((rest, newPurses, newData))
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } |

  /*
    Returns values corresponding to ids, "PUBLIC_READ_PURSES"
    and "PUBLIC_PUBLIC_READ_PURSES_DATA" call this channel

    channelToReadFrom: *pursesData or *purses
    ids: Set purse ids (they must all exist)
    example iterateCh!((*pursesData, Set("1", "2", "18"), *return))
  */
  contract iterateCh(@(channelToReadFrom, ids, return)) = {
    new tmpCh, itCh in {
      for (@(tmpCh, ids) <= itCh) {
        for (tmp <- @tmpCh) {
          match ids {
            Nil => {
              @return!(*tmp)
            }
            Set(last) => {
              for (val <<- @(channelToReadFrom, last)) {
                @return!(*tmp.set(last, *val))
              }
            }
            Set(first ... rest) => {
              for (val <<- @(channelToReadFrom, first)) {
                @tmpCh!(*tmp.set(first, *val)) |
                itCh!((tmpCh, rest))
              }
            }
          }
        }
      } |
      tmpCh!({}) |
      itCh!((*tmpCh, ids))
    }
  } |


  // ====================================
  // ===== ANY USER / PUBLIC capabilities
  // ====================================

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES_IDS")) {
    for (ids <<- pursesIds) {
      @return!(*ids)
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES")) {
    match payload.size() < 101 {
      true => {
        iterateCh!((*purses, payload, return))
      }
      _ => {
        @return!("error: payload must be a Set of strings with max size 100")
      }
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES_DATA")) {
    match payload.size() < 101 {
      true => {
        iterateCh!((*pursesData, payload, return))
      }
      _ => {
        @return!("error: payload must be a Set of strings with max size 100")
      }
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ")) {
    for (current <<- mainCh) {
      @return!(*current)
    }
  } |

  /*
    (purse[]) => String | (true, id[])
    receives a list of purse, check that (they exist + no duplicate)
    and returns the corresponding list of ids
  */
  for (@(payload, return) <= @(*entryCh, "PUBLIC_CHECK_PURSES")) {
    new tmpCh, itCh in {
      for (@(tmpCh, keys) <= itCh) {
        for (tmp <- @tmpCh) {
          match keys {
            Nil => {
              @return!(*tmp)
            }
            [last] => {
              for (id <<- @(*vault, last)) {
                match *tmp.union(Set(*id)).size() == payload.length() {
                  true => {
                    @return!((true, *tmp.union(Set(*id))))

                  }
                  false => {
                    @return!("error: duplicates")
                  }
                }
              }
            }
            [first ... rest] => {
              for (id <<- @(*vault, first)) {
                @tmpCh!(*tmp.union(Set(*id))) |
                itCh!((tmpCh, rest))
              }
            }
          }
        }
      } |
      tmpCh!(Set()) |
      itCh!((*tmpCh, payload))
    }
  } |

  /*
    (payload) => String | (true, purse)
    purchase with REV from a purse that has .price
    property not Nil
    see payload below
  */
  // todo limitation total payload size ??
  for (@(payload, return) <= @(*entryCh, "PUBLIC_PURCHASE")) {
    match payload {
      { "quantity": Int, "purseId": String, "publicKey": String,
      "newId": Nil \\/ String, "data": _, "purseRevAddr": _, "purseAuthKey": _ } => {
        for (@properties <<- @(*purses, payload.get("purseId"))) {
          match (
            properties.get("price"),
            properties.get("quantity") > 0,
            payload.get("quantity") > 0,
            properties.get("quantity") >= payload.get("quantity")
          ) {
            (Int, true, true, true) => {
              new revVaultCh, ownerRevAddressCh, purseVaultCh in {

                registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |
                revAddress!("fromPublicKey", properties.get("publicKey").hexToBytes(), *ownerRevAddressCh) |

                for (@(_, RevVault) <- revVaultCh; @ownerRevAddress <- ownerRevAddressCh) {
                  match (
                    payload.get("purseRevAddr"),
                    ownerRevAddress,
                    payload.get("quantity") * properties.get("price")
                  ) {
                    (from, to, amount) => {
                      @RevVault!("findOrCreate", from, *purseVaultCh) |
                      for (@(true, purseVault) <- purseVaultCh) {
                        new makePurseReturnCh, transferReturnCh, performRefundCh in {                        
                          // refund
                          for (@message <- performRefundCh) {
                            new refundPurseBalanceCh, refundRevAddressCh, refundResultCh in {
                              @purseVault!("balance", *refundPurseBalanceCh) |
                              revAddress!("fromPublicKey", payload.get("publicKey").hexToBytes(), *refundRevAddressCh) |
                              for (@balance <- refundPurseBalanceCh; @revAddress <- refundRevAddressCh) {
                                @purseVault!("transfer", revAddress, balance, payload.get("purseAuthKey"), *refundResultCh) |
                                for (@refundResult <- refundResultCh) {
                                  match refundResult {
                                    (true, Nil) => {
                                      stdout!(message ++ ", issuer was refunded") |
                                      @return!(message ++ ", issuer was refunded")
                                    }
                                    _ => {
                                      stdout!(message ++ ", issuer was NOT refunded") |
                                      @return!(message ++ ", issuer was NOT refunded")
                                    }
                                  }
                                }
                              }
                            }
                          } |
                          @purseVault!("transfer", to, amount, payload.get("purseAuthKey"), *transferReturnCh) |
                          for (@result <- transferReturnCh) {
                            match result {
                              (true, Nil) => {
                                for (@properties2 <- @(*purses, payload.get("purseId"))) {
                                  /*
                                    Check if the purse must be removed because quantity 0
                                    if fungible: false, we always match 0
                                  */
                                  match properties2.get("quantity") - payload.get("quantity") {
                                    0 => {
                                      for (ids <- pursesIds) {
                                        pursesIds!(*ids.delete(properties2.get("id"))) |
                                        for (_ <- @(*pursesData, properties2.get("id"))) {
                                          makePurseCh!((
                                            properties2
                                              .set("price", Nil)
                                              .set("newId", payload.get("newId"))
                                              .set("quantity", payload.get("quantity"))
                                              .set("publicKey", payload.get("publicKey")),
                                            payload.get("data"),
                                            *makePurseReturnCh
                                          )) |
                                          for (newPurse <- makePurseReturnCh) {
                                            @return!((true, *newPurse))
                                          }
                                        }
                                      }
                                    }
                                    _ => {
                                      @(*purses, properties2.get("id"))!(
                                        properties2.set("quantity", properties2.get("quantity") - payload.get("quantity"))
                                      ) |
                                      makePurseCh!((
                                        properties2
                                          .set("price", Nil)
                                          .set("newId", payload.get("newId"))
                                          .set("quantity", payload.get("quantity"))
                                          .set("publicKey", payload.get("publicKey")),
                                        payload.get("data"),
                                        *makePurseReturnCh
                                      )) |
                                      for (newPurse <- makePurseReturnCh) {
                                        stdout!(*newPurse) |
                                        @return!((true, *newPurse))
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                performRefundCh!("error: REV transfer went wrong")
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            _=> {
              @return!("error: quantity not available or purse not for sale")
            }
          }
        }
      }
      _ => {
        @return!("error: invalid payloads")
      }
    }
  } |


  // ====================================
  // ===================== INITIALIZATION
  // save superKeyCh to a box
  // ====================================

  /*
    todo: secure with bundle- (*entryCh -> bundle-{*entryCh}) , but we must
    do it after all the listens are active
  */
  insertArbitrary!(*entryCh, *entryUriCh) |

  for (entryUri <- entryUriCh) {
    new boxDataCh, boxReturnCh in {
      @(*deployerId, "rho:id:${fromBoxRegistryUri}")!(({ "type": "READ" }, *boxDataCh)) |
      for (r <- boxDataCh) {
      stdout!(*r) |
        match (*r.get("version")) {
          "5.0.0" => {
            @(*deployerId, "rho:id:${fromBoxRegistryUri}")!((
              {
                "type": "SAVE_SUPER_KEY",
                "payload": { "superKey": *superKeyCh, "registryUri": *entryUri }
              },
              *boxReturnCh
            )) |
            for (resp <- boxReturnCh) {
              match *resp {
                String => {
                  mainCh!({ "status": "failed", "message": *resp }) |
                  stdout!(("failed", *resp))
                }
                _ => {
                  mainCh!({
                    "status": "completed",
                    "registryUri": *entryUri,
                    "locked": false,
                    "fungible": ${payload.fungible},
                    "version": "5.0.0"
                  }) |
                  stdout!({
                    "status": "completed",
                    "registryUri": *entryUri,
                    "locked": false,
                    "fungible": ${payload.fungible},
                    "version": "5.0.0"
                  }) |
                  stdout!("completed, contract deployed")
                }
              }
            }
          }
          _ => {
            mainCh!({
              "status": "failed",
              "message": "box has not the same version number 5.0.0",
            }) |
            stdout!({
              "status": "failed",
              "message": "box has not the same version number 5.0.0",
            })
          }
        }
      }
    }

    /*OUTPUT_CHANNEL*/
  }
}
`;
};

var mainTerm = {
	mainTerm: mainTerm_1
};

var createPursesTerm_1 = (
  registryUri,
  payload
) => {
  return `new basket,
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_SUPER_KEYS" }, *boxCh)) |

  for (superKeys <- boxCh) {
    match *superKeys.get(\`rho:id:${registryUri}\`) {
      ch => {
        @(ch, "CREATE_PURSES")!((
          {
            // example
            // "purses": { "0": { "publicKey": "abc", "type": "gold", "quantity": 3, "data": Nil }}
            "purses": ${JSON.stringify(payload.purses).replace(new RegExp(': null|:null', 'g'), ': Nil')},
            // example
            // "data": { "0": "this bag is mine" }
            "data": ${JSON.stringify(payload.data).replace(new RegExp(': null|:null', 'g'), ': Nil')},
          },
          *returnCh
        ))
      }
    }
  } |

  for (resp <- returnCh) {
    match *resp {
      String => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
      (true, payload) => {
        new entryCh, return2Ch, itCh in {
          registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *entryCh) |
          for (entry <- entryCh) {
            for (purses <= itCh) {
              match *purses {
                Nil => {
                  basket!({ "status": "failed", "message": "no purse" }) |
                  stdout!(("failed", "no purse"))
                }
                [last] => {
                  new readReturnCh, receivePurseReturnCh in {
                    @(last, "READ")!((Nil, *readReturnCh)) |
                    for (properties <- readReturnCh) {
                      @(*entry, "PUBLIC_RECEIVE_PURSE")!(({
                        "registryUri": \`rho:id:${registryUri}\`,
                        "purse": last
                      }, *receivePurseReturnCh))
                    } |
                    for (r <- receivePurseReturnCh) {
                      match *r {
                        String => {
                          basket!({ "status": "failed", "message": *r }) |
                          stdout!(("failed", *r))
                        }
                        _ => {
                          stdout!("completed, purses created and saved to box") |
                          basket!({ "status": "completed" })
                        }
                      }
                    }
                  }
                }
                [first ... rest] => {
                  new readReturnCh, receivePurseReturnCh in {
                    @(first, "READ")!((Nil, *readReturnCh)) |
                    for (properties <- readReturnCh) {
                      @(*entry, "PUBLIC_RECEIVE_PURSE")!(({
                        "registryUri": \`rho:id:${registryUri}\`,
                        "purse": first
                      }, *receivePurseReturnCh))
                    } |
                    for (r <- receivePurseReturnCh) {
                      match *r {
                        String => {
                          basket!({ "status": "failed", "message": *r }) |
                          stdout!(("failed", *r))
                        }
                        _ => { itCh!(rest) }
                      }
                    }
                  }
                }
              }
            } |
            itCh!(payload.get("purses"))
          }
        }
      }
    }
  }
}
`;
};

var createPursesTerm = {
	createPursesTerm: createPursesTerm_1
};

var sendPurseTerm_1 = (
    registryUri,
  payload
) => {
  return `new basket,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  boxEntryCh,
  boxEntry2Ch,
  receivePursesReturnCh,
  receivePursesReturn2Ch,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
        for (boxEntry <- boxEntryCh) {
          @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
            {
              "registryUri": \`rho:id:${registryUri}\`,
              "purse": purse,
            },
            *receivePursesReturnCh
          )) |
          for (r <- receivePursesReturnCh) {
            match *r {
              (true, Nil) => {
                match "rho:id:${payload.toBoxRegistryUri}" == "rho:id:${payload.fromBoxRegistryUri}" {
                  true => {
                    stdout!("completed, purse sent") |
                    basket!({ "status": "completed" })
                  }
                  false => {
                    /*
                      Remove the purse from emitter's box now that it is worthless
                    */
                    @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!((
                      { "type": "DELETE_PURSE", "payload": { "registryUri": \`rho:id:${registryUri}\`, "id": "${payload.purseId}" } },
                      *deletePurseReturnCh
                    )) |
                    for (r2 <- deletePurseReturnCh) {
                      match *r2 {
                        String => {
                          stdout!("WARNING completed, purse sent but could not remove from box") |
                          basket!({ "status": "completed" })
                        }
                        _ => {
                          stdout!("completed, purse sent and removed from box") |
                          basket!({ "status": "completed" })
                        }
                      }
                    }

                  }
                }
              }
              _ => {
                registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *boxEntry2Ch) |
                for (boxEntry2 <- boxEntry2Ch) {
                  @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
                    {
                      "registryUri": \`rho:id:${registryUri}\`,
                      "purse": purse,
                    },
                    *receivePursesReturn2Ch
                  ))
                } |
                for (r2 <- receivePursesReturn2Ch) {
                  match *r2 {
                    String => {
                      stdout!("Failed to send, could not send back to emitter box, purse may be lost " ++ *r2 ++ *r) |
                      basket!({ "status": "failed", "message": "Failed to send, could not send back to emitter box, purse may be lost " ++ *r2 ++ *r})
                    }
                    _ => {
                      stdout!("Failed to send, could send back to emitter box" ++ *r2) |
                      basket!({ "status": "failed", "message": "Failed to send, could send back to emitter box" ++ *r2 })
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
};

var sendPurseTerm = {
	sendPurseTerm: sendPurseTerm_1
};

var readPursesTerm_1 = (
  registryUri,
  payload
) => {
  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ_PURSES")!((Set(${payload.pursesIds
  .map((id) => '"' + id + '"')
  .join(',')}), *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
    };

var readPursesTerm = {
	readPursesTerm: readPursesTerm_1
};

var readPursesIdsTerm_1 = (
  registryUri
) => {
  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ_PURSES_IDS")!((Nil, *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
};

var readPursesIdsTerm = {
	readPursesIdsTerm: readPursesIdsTerm_1
};

var readBoxTerm_1 = (
  boxRegistryUri
) => {
  return `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${boxRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    stdout!(*entry) |
    new a in {
      @(*entry, "PUBLIC_READ")!((Nil, *a)) |
      for (current <- a) {
        new b in {
          @(*entry, "PUBLIC_READ_SUPER_KEYS")!((Nil, *b)) |
          for (superKeys <- b) {
            new c in {
              @(*entry, "PUBLIC_READ_PURSES")!((Nil, *c)) |
              for (purses <- c) {
                return!(
                  *current
                    .set("superKeys", *superKeys)
                    .set("purses", *purses)
                )
              }
            }
          }
        }
      }
    }
  }
}`;
};

var readBoxTerm = {
	readBoxTerm: readBoxTerm_1
};

var readTerm_1 = (
  registryUri
) => {
  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ")!((Nil, *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
};

var readTerm = {
	readTerm: readTerm_1
};

var updatePurseDataTerm_1 = (
    registryUri,
  payload
) => {
  return `new basket,
  returnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "UPDATE_DATA")!(("${payload.data}", *returnCh)) |
        for (r <- returnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            _ => {
              stdout!("completed, purse data updated") |
              basket!({ "status": "completed" })
            }
          }
        }
      }
    }
  }
}
`;
};

var updatePurseDataTerm = {
	updatePurseDataTerm: updatePurseDataTerm_1
};

var readPursesDataTerm_1 = (
  registryUri,
  payload
) => {
  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ_PURSES_DATA")!((Set(${payload.pursesIds
  .map((id) => '"' + id + '"')
  .join(',')}), *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
    };

var readPursesDataTerm = {
	readPursesDataTerm: readPursesDataTerm_1
};

var splitPurseTerm_1 = (
    registryUri,
  payload
) => {
  return `new basket,
  withdrawReturnCh,
  savePurseReturnCh,
  boxCh,
  readReturnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "WITHDRAW")!((${payload.quantityInNewPurse}, *withdrawReturnCh)) |
        for (r <- withdrawReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            (true, newPurse) => {
              @(newPurse, "READ")!((Nil, *readReturnCh)) |
              for (@properties <- readReturnCh) {
                /*
                  Save new purse without joining it (DEPOSIT) to a purse with same type
                */
                @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!((
                  { "type": "SAVE_PURSE_SEPARATELY", "payload": { "registryUri": \`rho:id:${registryUri}\`, "purse": newPurse } },
                  *savePurseReturnCh
                )) |
                for (r2 <- savePurseReturnCh) {
                  match *r2 {
                    String => {
                      stdout!("DANGER completed, purse split but could not save to box") |
                      basket!({ "status": "failed", "message": "DANGER completed, purse split but could not save to box" })
                    }
                    _ => {
                      stdout!("completed, purse split and saved in box") |
                      basket!({ "status": "completed" })
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
};

var splitPurseTerm = {
	splitPurseTerm: splitPurseTerm_1
};

var setPriceTerm_1 = (
  registryUri,
  payload
) => {
  return `new basket,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "SET_PRICE")!((${payload.price || "Nil"}, *sendReturnCh)) |
        for (r <- sendReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            _ => {
              stdout!("completed, price set") |
              basket!({ "status": "completed" })
            }
          }
        }
      }
    }
  }
}
`;
};

var setPriceTerm = {
	setPriceTerm: setPriceTerm_1
};

var purchaseTerm_1 = (
  registryUri,
  payload
) => {
  return `
new
  basket,
  revVaultPurseCh,
  priceCh,
  quantityCh,
  publicKeyCh,
  newIdCh,
  dataCh,
  returnCh,
  purseIdCh,
  registryUriCh,
  revAddressCh,
  registryLookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  /*
    The 5 following values must be filled with proper values
  */
  // Registry URI of the contract
  registryUriCh!!(\`rho:id:${registryUri}\`) |
  // Unique ID of the token you want to purchase
  purseIdCh!!("${payload.purseId}") |
  // New ID only used if fungible = false
  newIdCh!!("${payload.newId ? payload.newId : "Nil"}") |
  // Per token price, make sure it is accurate
  priceCh!!(${payload.price || "Nil"}) |
  // Quantity you want to purchase, make sure enough are available
  quantityCh!!(${payload.quantity}) |
  // Your public key
  // If the transfer fails, refund will go to the corresponding REV address
  publicKeyCh!!("${payload.publicKey}") |
  // data
  dataCh!("${payload.data}") |

  registryLookup!(\`rho:rchain:revVault\`, *revVaultPurseCh) |

  /*
    Create a vault/purse that is just used once (purse)
  */
  for(@(_, *RevVaultPurse) <- revVaultPurseCh) {
    new unf, purseRevAddrCh, purseAuthKeyCh, vaultCh, revAddressCh in {
      revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
      RevVaultPurse!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
      for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

        stdout!({"new purse rev addr": purseRevAddr, "purse authKey": purseAuthKey}) |

        RevVaultPurse!("findOrCreate", purseRevAddr, *vaultCh) |

        for (
          @(true, *vault) <- vaultCh;
          @publicKey <- publicKeyCh;
          @purseId <- purseIdCh;
          @registryUri <- registryUriCh;
          @price <- priceCh;
          @quantity <- quantityCh;
          @newId <- newIdCh;
          @data <- dataCh
        ) {

          revAddress!("fromPublicKey", publicKey.hexToBytes(), *revAddressCh) |

          new RevVaultCh in {

            registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
            for (@(_, RevVault) <- RevVaultCh; deployerRevAddress <- revAddressCh) {

              stdout!(("3.transfer_funds.rho")) |

              /*
                Put price * quantity REV in the purse
              */
              match (
                *deployerRevAddress,
                purseRevAddr,
                price * quantity
              ) {
                (from, to, amount) => {

                  new vaultCh, revVaultkeyCh, deployerId(\`rho:rchain:deployerId\`) in {
                    @RevVault!("findOrCreate", from, *vaultCh) |
                    @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
                    for (@(true, vault) <- vaultCh; key <- revVaultkeyCh) {

                      stdout!(("Beginning transfer of ", amount, "REV from", from, "to", to)) |

                      new resultCh, entryCh in {
                        @vault!("transfer", to, amount, *key, *resultCh) |
                        for (@result <- resultCh) {

                          stdout!(("Finished transfer of ", amount, "REV to", to, "result was:", result)) |
                          match result {
                            (true, Nil) => {
                              stdout!("yes") |
                              registryLookup!(registryUri, *entryCh) |

                              for(entry <- entryCh) {
                                stdout!("PUBLIC_PURCHASE") |
                                stdout!(*entry) |
                                @(*entry, "PUBLIC_PURCHASE")!((
                                  {
                                    "quantity": quantity,
                                    "purseId": purseId,
                                    "newId": newId,
                                    "data": data,
                                    "publicKey": publicKey,
                                    "purseRevAddr": purseRevAddr,
                                    "purseAuthKey": purseAuthKey
                                  },
                                  *returnCh
                                )) |
                                for (resp <- returnCh) {
                                  stdout!(*resp) |
                                  match *resp {
                                    (true, purse) => {
                                      stdout!("yep") |
                                      new readReturnCh, boxEntryCh, receivePursesReturnCh in {
                                        @(*entry, "PUBLIC_READ")!((Nil, *readReturnCh)) |
                                        for (@current <- readReturnCh) {
                                          stdout!(("current", current)) |
                                          registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
                                          for (boxEntry <- boxEntryCh) {
                                            @(*boxEntry, "${payload.actionAfterPurchase || "PUBLIC_RECEIVE_PURSE"}")!((
                                              {
                                                "registryUri": current.get("registryUri"),
                                                "purse": purse,
                                              },
                                              *receivePursesReturnCh
                                            )) |
                                            for (r <- receivePursesReturnCh) {
                                              match *r {
                                                String => {
                                                  basket!({ "status": "failed", "message": *resp }) |
                                                  stdout!(("failed", *resp))
                                                }
                                                _ => {
                                                  basket!({ "status": "completed" }) |
                                                  stdout!("purchase went well")
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                    _ => {
                                      stdout!(*resp) |
                                      basket!({ "status": "failed", "message": *resp }) |
                                      stdout!(("failed", *resp))
                                    }
                                  }
                                }
                              }
                            }
                            _ => {
                              basket!({ "status": "failed", "message": result }) |
                              stdout!(("failed", result))
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;
};

var purchaseTerm = {
	purchaseTerm: purchaseTerm_1
};

var withdrawTerm_1 = (
    registryUri,
  payload
) => {
  return `new basket,
  withdrawReturnCh,
  savePurseReturnCh,
  boxCh,
  readReturnCh,
  receivePursesReturnCh,
  receivePursesReturn2Ch,
  boxEntryCh,
  boxEntry2Ch,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "WITHDRAW")!((${payload.quantityToWithdraw}, *withdrawReturnCh)) |
        for (r <- withdrawReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            (true, newPurse) => {
              registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
              for (boxEntry <- boxEntryCh) {
                @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
                  {
                    "registryUri": \`rho:id:${registryUri}\`,
                    "purse": newPurse,
                  },
                  *receivePursesReturnCh
                ))
              } |
              for (r <- receivePursesReturnCh) {
                match *r {
                  (true, Nil) => {
                    stdout!("Purse withdrawn") |
                    basket!({ "status": "completed", "message": "Purse withdrawn" })
                  }
                  _ => {
                    registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *boxEntry2Ch) |
                    for (boxEntry2 <- boxEntry2Ch) {
                      @(*boxEntry2, "PUBLIC_RECEIVE_PURSE")!((
                        {
                          "registryUri": \`rho:id:${registryUri}\`,
                          "purse": newPurse,
                        },
                        *receivePursesReturnCh
                      ))
                    } |
                    for (r2 <- receivePursesReturn2Ch) {
                      match *r2 {
                        String => {
                          stdout!("Failed to withdraw to recipient box, could not withdrawn back to box " ++ *r2) |
                          basket!({ "status": "failed", "message": "Failed to withdraw to recipient box, could not withdrawn back to box " ++ *r2 })
                        }
                        _ => {
                          stdout!("Failed to withdraw to recipient box, withdrawn back to box") |
                          basket!({ "status": "failed", "message": "Failed to withdraw to recipient box, withdrawn back to box"})
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
};

var withdrawTerm = {
	withdrawTerm: withdrawTerm_1
};

const { boxTerm: boxTerm$1 } = boxTerm;
const { mainTerm: mainTerm$1 } = mainTerm;
const { createPursesTerm: createPursesTerm$1 } = createPursesTerm;
const { sendPurseTerm: sendPurseTerm$1 } = sendPurseTerm;
const { readPursesTerm: readPursesTerm$1 } = readPursesTerm;
const { readPursesIdsTerm: readPursesIdsTerm$1 } = readPursesIdsTerm;
const { readBoxTerm: readBoxTerm$1 } = readBoxTerm;
const { readTerm: readTerm$1 } = readTerm;
const { updatePurseDataTerm: updatePurseDataTerm$1 } = updatePurseDataTerm;
const { readPursesDataTerm: readPursesDataTerm$1 } = readPursesDataTerm;
const { splitPurseTerm: splitPurseTerm$1 } = splitPurseTerm;
const { setPriceTerm: setPriceTerm$1 } = setPriceTerm;
const { purchaseTerm: purchaseTerm$1 } = purchaseTerm;
const { withdrawTerm: withdrawTerm$1 } = withdrawTerm;

var src = {
  version: '5.0.0',
  boxTerm: boxTerm$1,
  mainTerm: mainTerm$1,
  createPursesTerm: createPursesTerm$1,
  sendPurseTerm: sendPurseTerm$1,
  readPursesTerm: readPursesTerm$1,
  readPursesIdsTerm: readPursesIdsTerm$1,
  readBoxTerm: readBoxTerm$1,
  readTerm: readTerm$1,
  updatePurseDataTerm: updatePurseDataTerm$1,
  readPursesDataTerm: readPursesDataTerm$1,
  splitPurseTerm: splitPurseTerm$1,
  setPriceTerm: setPriceTerm$1,
  purchaseTerm: purchaseTerm$1,
  withdrawTerm: withdrawTerm$1,
};
var src_9 = src.readTerm;
var src_11 = src.readPursesDataTerm;

var dist = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
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

var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof commonjsGlobal !== 'undefined') {
  root = commonjsGlobal;
} else {
  root = module;
}

var result = symbolObservablePonyfill(root);

var xstream = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal$1 && commonjsGlobal$1.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });

var NO = {};
exports.NO = NO;
function noop() { }
function cp(a) {
    var l = a.length;
    var b = Array(l);
    for (var i = 0; i < l; ++i)
        b[i] = a[i];
    return b;
}
function and(f1, f2) {
    return function andFn(t) {
        return f1(t) && f2(t);
    };
}
function _try(c, t, u) {
    try {
        return c.f(t);
    }
    catch (e) {
        u._e(e);
        return NO;
    }
}
var NO_IL = {
    _n: noop,
    _e: noop,
    _c: noop,
};
exports.NO_IL = NO_IL;
// mutates the input
function internalizeProducer(producer) {
    producer._start = function _start(il) {
        il.next = il._n;
        il.error = il._e;
        il.complete = il._c;
        this.start(il);
    };
    producer._stop = producer.stop;
}
var StreamSub = /** @class */ (function () {
    function StreamSub(_stream, _listener) {
        this._stream = _stream;
        this._listener = _listener;
    }
    StreamSub.prototype.unsubscribe = function () {
        this._stream._remove(this._listener);
    };
    return StreamSub;
}());
var Observer = /** @class */ (function () {
    function Observer(_listener) {
        this._listener = _listener;
    }
    Observer.prototype.next = function (value) {
        this._listener._n(value);
    };
    Observer.prototype.error = function (err) {
        this._listener._e(err);
    };
    Observer.prototype.complete = function () {
        this._listener._c();
    };
    return Observer;
}());
var FromObservable = /** @class */ (function () {
    function FromObservable(observable) {
        this.type = 'fromObservable';
        this.ins = observable;
        this.active = false;
    }
    FromObservable.prototype._start = function (out) {
        this.out = out;
        this.active = true;
        this._sub = this.ins.subscribe(new Observer(out));
        if (!this.active)
            this._sub.unsubscribe();
    };
    FromObservable.prototype._stop = function () {
        if (this._sub)
            this._sub.unsubscribe();
        this.active = false;
    };
    return FromObservable;
}());
var Merge = /** @class */ (function () {
    function Merge(insArr) {
        this.type = 'merge';
        this.insArr = insArr;
        this.out = NO;
        this.ac = 0;
    }
    Merge.prototype._start = function (out) {
        this.out = out;
        var s = this.insArr;
        var L = s.length;
        this.ac = L;
        for (var i = 0; i < L; i++)
            s[i]._add(this);
    };
    Merge.prototype._stop = function () {
        var s = this.insArr;
        var L = s.length;
        for (var i = 0; i < L; i++)
            s[i]._remove(this);
        this.out = NO;
    };
    Merge.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    Merge.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Merge.prototype._c = function () {
        if (--this.ac <= 0) {
            var u = this.out;
            if (u === NO)
                return;
            u._c();
        }
    };
    return Merge;
}());
var CombineListener = /** @class */ (function () {
    function CombineListener(i, out, p) {
        this.i = i;
        this.out = out;
        this.p = p;
        p.ils.push(this);
    }
    CombineListener.prototype._n = function (t) {
        var p = this.p, out = this.out;
        if (out === NO)
            return;
        if (p.up(t, this.i)) {
            var a = p.vals;
            var l = a.length;
            var b = Array(l);
            for (var i = 0; i < l; ++i)
                b[i] = a[i];
            out._n(b);
        }
    };
    CombineListener.prototype._e = function (err) {
        var out = this.out;
        if (out === NO)
            return;
        out._e(err);
    };
    CombineListener.prototype._c = function () {
        var p = this.p;
        if (p.out === NO)
            return;
        if (--p.Nc === 0)
            p.out._c();
    };
    return CombineListener;
}());
var Combine = /** @class */ (function () {
    function Combine(insArr) {
        this.type = 'combine';
        this.insArr = insArr;
        this.out = NO;
        this.ils = [];
        this.Nc = this.Nn = 0;
        this.vals = [];
    }
    Combine.prototype.up = function (t, i) {
        var v = this.vals[i];
        var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
        this.vals[i] = t;
        return Nn === 0;
    };
    Combine.prototype._start = function (out) {
        this.out = out;
        var s = this.insArr;
        var n = this.Nc = this.Nn = s.length;
        var vals = this.vals = new Array(n);
        if (n === 0) {
            out._n([]);
            out._c();
        }
        else {
            for (var i = 0; i < n; i++) {
                vals[i] = NO;
                s[i]._add(new CombineListener(i, out, this));
            }
        }
    };
    Combine.prototype._stop = function () {
        var s = this.insArr;
        var n = s.length;
        var ils = this.ils;
        for (var i = 0; i < n; i++)
            s[i]._remove(ils[i]);
        this.out = NO;
        this.ils = [];
        this.vals = [];
    };
    return Combine;
}());
var FromArray = /** @class */ (function () {
    function FromArray(a) {
        this.type = 'fromArray';
        this.a = a;
    }
    FromArray.prototype._start = function (out) {
        var a = this.a;
        for (var i = 0, n = a.length; i < n; i++)
            out._n(a[i]);
        out._c();
    };
    FromArray.prototype._stop = function () {
    };
    return FromArray;
}());
var FromPromise = /** @class */ (function () {
    function FromPromise(p) {
        this.type = 'fromPromise';
        this.on = false;
        this.p = p;
    }
    FromPromise.prototype._start = function (out) {
        var prod = this;
        this.on = true;
        this.p.then(function (v) {
            if (prod.on) {
                out._n(v);
                out._c();
            }
        }, function (e) {
            out._e(e);
        }).then(noop, function (err) {
            setTimeout(function () { throw err; });
        });
    };
    FromPromise.prototype._stop = function () {
        this.on = false;
    };
    return FromPromise;
}());
var Periodic = /** @class */ (function () {
    function Periodic(period) {
        this.type = 'periodic';
        this.period = period;
        this.intervalID = -1;
        this.i = 0;
    }
    Periodic.prototype._start = function (out) {
        var self = this;
        function intervalHandler() { out._n(self.i++); }
        this.intervalID = setInterval(intervalHandler, this.period);
    };
    Periodic.prototype._stop = function () {
        if (this.intervalID !== -1)
            clearInterval(this.intervalID);
        this.intervalID = -1;
        this.i = 0;
    };
    return Periodic;
}());
var Debug = /** @class */ (function () {
    function Debug(ins, arg) {
        this.type = 'debug';
        this.ins = ins;
        this.out = NO;
        this.s = noop;
        this.l = '';
        if (typeof arg === 'string')
            this.l = arg;
        else if (typeof arg === 'function')
            this.s = arg;
    }
    Debug.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    Debug.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Debug.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var s = this.s, l = this.l;
        if (s !== noop) {
            try {
                s(t);
            }
            catch (e) {
                u._e(e);
            }
        }
        else if (l)
            console.log(l + ':', t);
        else
            console.log(t);
        u._n(t);
    };
    Debug.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Debug.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Debug;
}());
var Drop = /** @class */ (function () {
    function Drop(max, ins) {
        this.type = 'drop';
        this.ins = ins;
        this.out = NO;
        this.max = max;
        this.dropped = 0;
    }
    Drop.prototype._start = function (out) {
        this.out = out;
        this.dropped = 0;
        this.ins._add(this);
    };
    Drop.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Drop.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        if (this.dropped++ >= this.max)
            u._n(t);
    };
    Drop.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Drop.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Drop;
}());
var EndWhenListener = /** @class */ (function () {
    function EndWhenListener(out, op) {
        this.out = out;
        this.op = op;
    }
    EndWhenListener.prototype._n = function () {
        this.op.end();
    };
    EndWhenListener.prototype._e = function (err) {
        this.out._e(err);
    };
    EndWhenListener.prototype._c = function () {
        this.op.end();
    };
    return EndWhenListener;
}());
var EndWhen = /** @class */ (function () {
    function EndWhen(o, ins) {
        this.type = 'endWhen';
        this.ins = ins;
        this.out = NO;
        this.o = o;
        this.oil = NO_IL;
    }
    EndWhen.prototype._start = function (out) {
        this.out = out;
        this.o._add(this.oil = new EndWhenListener(out, this));
        this.ins._add(this);
    };
    EndWhen.prototype._stop = function () {
        this.ins._remove(this);
        this.o._remove(this.oil);
        this.out = NO;
        this.oil = NO_IL;
    };
    EndWhen.prototype.end = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    EndWhen.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    EndWhen.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    EndWhen.prototype._c = function () {
        this.end();
    };
    return EndWhen;
}());
var Filter = /** @class */ (function () {
    function Filter(passes, ins) {
        this.type = 'filter';
        this.ins = ins;
        this.out = NO;
        this.f = passes;
    }
    Filter.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    Filter.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Filter.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO || !r)
            return;
        u._n(t);
    };
    Filter.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Filter.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Filter;
}());
var FlattenListener = /** @class */ (function () {
    function FlattenListener(out, op) {
        this.out = out;
        this.op = op;
    }
    FlattenListener.prototype._n = function (t) {
        this.out._n(t);
    };
    FlattenListener.prototype._e = function (err) {
        this.out._e(err);
    };
    FlattenListener.prototype._c = function () {
        this.op.inner = NO;
        this.op.less();
    };
    return FlattenListener;
}());
var Flatten = /** @class */ (function () {
    function Flatten(ins) {
        this.type = 'flatten';
        this.ins = ins;
        this.out = NO;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
    }
    Flatten.prototype._start = function (out) {
        this.out = out;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
        this.ins._add(this);
    };
    Flatten.prototype._stop = function () {
        this.ins._remove(this);
        if (this.inner !== NO)
            this.inner._remove(this.il);
        this.out = NO;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
    };
    Flatten.prototype.less = function () {
        var u = this.out;
        if (u === NO)
            return;
        if (!this.open && this.inner === NO)
            u._c();
    };
    Flatten.prototype._n = function (s) {
        var u = this.out;
        if (u === NO)
            return;
        var _a = this, inner = _a.inner, il = _a.il;
        if (inner !== NO && il !== NO_IL)
            inner._remove(il);
        (this.inner = s)._add(this.il = new FlattenListener(u, this));
    };
    Flatten.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Flatten.prototype._c = function () {
        this.open = false;
        this.less();
    };
    return Flatten;
}());
var Fold = /** @class */ (function () {
    function Fold(f, seed, ins) {
        var _this = this;
        this.type = 'fold';
        this.ins = ins;
        this.out = NO;
        this.f = function (t) { return f(_this.acc, t); };
        this.acc = this.seed = seed;
    }
    Fold.prototype._start = function (out) {
        this.out = out;
        this.acc = this.seed;
        out._n(this.acc);
        this.ins._add(this);
    };
    Fold.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
        this.acc = this.seed;
    };
    Fold.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO)
            return;
        u._n(this.acc = r);
    };
    Fold.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Fold.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Fold;
}());
var Last = /** @class */ (function () {
    function Last(ins) {
        this.type = 'last';
        this.ins = ins;
        this.out = NO;
        this.has = false;
        this.val = NO;
    }
    Last.prototype._start = function (out) {
        this.out = out;
        this.has = false;
        this.ins._add(this);
    };
    Last.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
        this.val = NO;
    };
    Last.prototype._n = function (t) {
        this.has = true;
        this.val = t;
    };
    Last.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Last.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        if (this.has) {
            u._n(this.val);
            u._c();
        }
        else
            u._e(new Error('last() failed because input stream completed'));
    };
    return Last;
}());
var MapOp = /** @class */ (function () {
    function MapOp(project, ins) {
        this.type = 'map';
        this.ins = ins;
        this.out = NO;
        this.f = project;
    }
    MapOp.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    MapOp.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    MapOp.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO)
            return;
        u._n(r);
    };
    MapOp.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    MapOp.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return MapOp;
}());
var Remember = /** @class */ (function () {
    function Remember(ins) {
        this.type = 'remember';
        this.ins = ins;
        this.out = NO;
    }
    Remember.prototype._start = function (out) {
        this.out = out;
        this.ins._add(out);
    };
    Remember.prototype._stop = function () {
        this.ins._remove(this.out);
        this.out = NO;
    };
    return Remember;
}());
var ReplaceError = /** @class */ (function () {
    function ReplaceError(replacer, ins) {
        this.type = 'replaceError';
        this.ins = ins;
        this.out = NO;
        this.f = replacer;
    }
    ReplaceError.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    ReplaceError.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    ReplaceError.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    ReplaceError.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        try {
            this.ins._remove(this);
            (this.ins = this.f(err))._add(this);
        }
        catch (e) {
            u._e(e);
        }
    };
    ReplaceError.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return ReplaceError;
}());
var StartWith = /** @class */ (function () {
    function StartWith(ins, val) {
        this.type = 'startWith';
        this.ins = ins;
        this.out = NO;
        this.val = val;
    }
    StartWith.prototype._start = function (out) {
        this.out = out;
        this.out._n(this.val);
        this.ins._add(out);
    };
    StartWith.prototype._stop = function () {
        this.ins._remove(this.out);
        this.out = NO;
    };
    return StartWith;
}());
var Take = /** @class */ (function () {
    function Take(max, ins) {
        this.type = 'take';
        this.ins = ins;
        this.out = NO;
        this.max = max;
        this.taken = 0;
    }
    Take.prototype._start = function (out) {
        this.out = out;
        this.taken = 0;
        if (this.max <= 0)
            out._c();
        else
            this.ins._add(this);
    };
    Take.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Take.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var m = ++this.taken;
        if (m < this.max)
            u._n(t);
        else if (m === this.max) {
            u._n(t);
            u._c();
        }
    };
    Take.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Take.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Take;
}());
var Stream = /** @class */ (function () {
    function Stream(producer) {
        this._prod = producer || NO;
        this._ils = [];
        this._stopID = NO;
        this._dl = NO;
        this._d = false;
        this._target = NO;
        this._err = NO;
    }
    Stream.prototype._n = function (t) {
        var a = this._ils;
        var L = a.length;
        if (this._d)
            this._dl._n(t);
        if (L == 1)
            a[0]._n(t);
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._n(t);
        }
    };
    Stream.prototype._e = function (err) {
        if (this._err !== NO)
            return;
        this._err = err;
        var a = this._ils;
        var L = a.length;
        this._x();
        if (this._d)
            this._dl._e(err);
        if (L == 1)
            a[0]._e(err);
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._e(err);
        }
        if (!this._d && L == 0)
            throw this._err;
    };
    Stream.prototype._c = function () {
        var a = this._ils;
        var L = a.length;
        this._x();
        if (this._d)
            this._dl._c();
        if (L == 1)
            a[0]._c();
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._c();
        }
    };
    Stream.prototype._x = function () {
        if (this._ils.length === 0)
            return;
        if (this._prod !== NO)
            this._prod._stop();
        this._err = NO;
        this._ils = [];
    };
    Stream.prototype._stopNow = function () {
        // WARNING: code that calls this method should
        // first check if this._prod is valid (not `NO`)
        this._prod._stop();
        this._err = NO;
        this._stopID = NO;
    };
    Stream.prototype._add = function (il) {
        var ta = this._target;
        if (ta !== NO)
            return ta._add(il);
        var a = this._ils;
        a.push(il);
        if (a.length > 1)
            return;
        if (this._stopID !== NO) {
            clearTimeout(this._stopID);
            this._stopID = NO;
        }
        else {
            var p = this._prod;
            if (p !== NO)
                p._start(this);
        }
    };
    Stream.prototype._remove = function (il) {
        var _this = this;
        var ta = this._target;
        if (ta !== NO)
            return ta._remove(il);
        var a = this._ils;
        var i = a.indexOf(il);
        if (i > -1) {
            a.splice(i, 1);
            if (this._prod !== NO && a.length <= 0) {
                this._err = NO;
                this._stopID = setTimeout(function () { return _this._stopNow(); });
            }
            else if (a.length === 1) {
                this._pruneCycles();
            }
        }
    };
    // If all paths stemming from `this` stream eventually end at `this`
    // stream, then we remove the single listener of `this` stream, to
    // force it to end its execution and dispose resources. This method
    // assumes as a precondition that this._ils has just one listener.
    Stream.prototype._pruneCycles = function () {
        if (this._hasNoSinks(this, []))
            this._remove(this._ils[0]);
    };
    // Checks whether *there is no* path starting from `x` that leads to an end
    // listener (sink) in the stream graph, following edges A->B where B is a
    // listener of A. This means these paths constitute a cycle somehow. Is given
    // a trace of all visited nodes so far.
    Stream.prototype._hasNoSinks = function (x, trace) {
        if (trace.indexOf(x) !== -1)
            return true;
        else if (x.out === this)
            return true;
        else if (x.out && x.out !== NO)
            return this._hasNoSinks(x.out, trace.concat(x));
        else if (x._ils) {
            for (var i = 0, N = x._ils.length; i < N; i++)
                if (!this._hasNoSinks(x._ils[i], trace.concat(x)))
                    return false;
            return true;
        }
        else
            return false;
    };
    Stream.prototype.ctor = function () {
        return this instanceof MemoryStream ? MemoryStream : Stream;
    };
    /**
     * Adds a Listener to the Stream.
     *
     * @param {Listener} listener
     */
    Stream.prototype.addListener = function (listener) {
        listener._n = listener.next || noop;
        listener._e = listener.error || noop;
        listener._c = listener.complete || noop;
        this._add(listener);
    };
    /**
     * Removes a Listener from the Stream, assuming the Listener was added to it.
     *
     * @param {Listener<T>} listener
     */
    Stream.prototype.removeListener = function (listener) {
        this._remove(listener);
    };
    /**
     * Adds a Listener to the Stream returning a Subscription to remove that
     * listener.
     *
     * @param {Listener} listener
     * @returns {Subscription}
     */
    Stream.prototype.subscribe = function (listener) {
        this.addListener(listener);
        return new StreamSub(this, listener);
    };
    /**
     * Add interop between most.js and RxJS 5
     *
     * @returns {Stream}
     */
    Stream.prototype[result.default] = function () {
        return this;
    };
    /**
     * Creates a new Stream given a Producer.
     *
     * @factory true
     * @param {Producer} producer An optional Producer that dictates how to
     * start, generate events, and stop the Stream.
     * @return {Stream}
     */
    Stream.create = function (producer) {
        if (producer) {
            if (typeof producer.start !== 'function'
                || typeof producer.stop !== 'function')
                throw new Error('producer requires both start and stop functions');
            internalizeProducer(producer); // mutates the input
        }
        return new Stream(producer);
    };
    /**
     * Creates a new MemoryStream given a Producer.
     *
     * @factory true
     * @param {Producer} producer An optional Producer that dictates how to
     * start, generate events, and stop the Stream.
     * @return {MemoryStream}
     */
    Stream.createWithMemory = function (producer) {
        if (producer)
            internalizeProducer(producer); // mutates the input
        return new MemoryStream(producer);
    };
    /**
     * Creates a Stream that does nothing when started. It never emits any event.
     *
     * Marble diagram:
     *
     * ```text
     *          never
     * -----------------------
     * ```
     *
     * @factory true
     * @return {Stream}
     */
    Stream.never = function () {
        return new Stream({ _start: noop, _stop: noop });
    };
    /**
     * Creates a Stream that immediately emits the "complete" notification when
     * started, and that's it.
     *
     * Marble diagram:
     *
     * ```text
     * empty
     * -|
     * ```
     *
     * @factory true
     * @return {Stream}
     */
    Stream.empty = function () {
        return new Stream({
            _start: function (il) { il._c(); },
            _stop: noop,
        });
    };
    /**
     * Creates a Stream that immediately emits an "error" notification with the
     * value you passed as the `error` argument when the stream starts, and that's
     * it.
     *
     * Marble diagram:
     *
     * ```text
     * throw(X)
     * -X
     * ```
     *
     * @factory true
     * @param error The error event to emit on the created stream.
     * @return {Stream}
     */
    Stream.throw = function (error) {
        return new Stream({
            _start: function (il) { il._e(error); },
            _stop: noop,
        });
    };
    /**
     * Creates a stream from an Array, Promise, or an Observable.
     *
     * @factory true
     * @param {Array|PromiseLike|Observable} input The input to make a stream from.
     * @return {Stream}
     */
    Stream.from = function (input) {
        if (typeof input[result.default] === 'function')
            return Stream.fromObservable(input);
        else if (typeof input.then === 'function')
            return Stream.fromPromise(input);
        else if (Array.isArray(input))
            return Stream.fromArray(input);
        throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
    };
    /**
     * Creates a Stream that immediately emits the arguments that you give to
     * *of*, then completes.
     *
     * Marble diagram:
     *
     * ```text
     * of(1,2,3)
     * 123|
     * ```
     *
     * @factory true
     * @param a The first value you want to emit as an event on the stream.
     * @param b The second value you want to emit as an event on the stream. One
     * or more of these values may be given as arguments.
     * @return {Stream}
     */
    Stream.of = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Stream.fromArray(items);
    };
    /**
     * Converts an array to a stream. The returned stream will emit synchronously
     * all the items in the array, and then complete.
     *
     * Marble diagram:
     *
     * ```text
     * fromArray([1,2,3])
     * 123|
     * ```
     *
     * @factory true
     * @param {Array} array The array to be converted as a stream.
     * @return {Stream}
     */
    Stream.fromArray = function (array) {
        return new Stream(new FromArray(array));
    };
    /**
     * Converts a promise to a stream. The returned stream will emit the resolved
     * value of the promise, and then complete. However, if the promise is
     * rejected, the stream will emit the corresponding error.
     *
     * Marble diagram:
     *
     * ```text
     * fromPromise( ----42 )
     * -----------------42|
     * ```
     *
     * @factory true
     * @param {PromiseLike} promise The promise to be converted as a stream.
     * @return {Stream}
     */
    Stream.fromPromise = function (promise) {
        return new Stream(new FromPromise(promise));
    };
    /**
     * Converts an Observable into a Stream.
     *
     * @factory true
     * @param {any} observable The observable to be converted as a stream.
     * @return {Stream}
     */
    Stream.fromObservable = function (obs) {
        if (obs.endWhen)
            return obs;
        var o = typeof obs[result.default] === 'function' ? obs[result.default]() : obs;
        return new Stream(new FromObservable(o));
    };
    /**
     * Creates a stream that periodically emits incremental numbers, every
     * `period` milliseconds.
     *
     * Marble diagram:
     *
     * ```text
     *     periodic(1000)
     * ---0---1---2---3---4---...
     * ```
     *
     * @factory true
     * @param {number} period The interval in milliseconds to use as a rate of
     * emission.
     * @return {Stream}
     */
    Stream.periodic = function (period) {
        return new Stream(new Periodic(period));
    };
    Stream.prototype._map = function (project) {
        return new (this.ctor())(new MapOp(project, this));
    };
    /**
     * Transforms each event from the input Stream through a `project` function,
     * to get a Stream that emits those transformed events.
     *
     * Marble diagram:
     *
     * ```text
     * --1---3--5-----7------
     *    map(i => i * 10)
     * --10--30-50----70-----
     * ```
     *
     * @param {Function} project A function of type `(t: T) => U` that takes event
     * `t` of type `T` from the input Stream and produces an event of type `U`, to
     * be emitted on the output Stream.
     * @return {Stream}
     */
    Stream.prototype.map = function (project) {
        return this._map(project);
    };
    /**
     * It's like `map`, but transforms each input event to always the same
     * constant value on the output Stream.
     *
     * Marble diagram:
     *
     * ```text
     * --1---3--5-----7-----
     *       mapTo(10)
     * --10--10-10----10----
     * ```
     *
     * @param projectedValue A value to emit on the output Stream whenever the
     * input Stream emits any value.
     * @return {Stream}
     */
    Stream.prototype.mapTo = function (projectedValue) {
        var s = this.map(function () { return projectedValue; });
        var op = s._prod;
        op.type = 'mapTo';
        return s;
    };
    /**
     * Only allows events that pass the test given by the `passes` argument.
     *
     * Each event from the input stream is given to the `passes` function. If the
     * function returns `true`, the event is forwarded to the output stream,
     * otherwise it is ignored and not forwarded.
     *
     * Marble diagram:
     *
     * ```text
     * --1---2--3-----4-----5---6--7-8--
     *     filter(i => i % 2 === 0)
     * ------2--------4---------6----8--
     * ```
     *
     * @param {Function} passes A function of type `(t: T) => boolean` that takes
     * an event from the input stream and checks if it passes, by returning a
     * boolean.
     * @return {Stream}
     */
    Stream.prototype.filter = function (passes) {
        var p = this._prod;
        if (p instanceof Filter)
            return new Stream(new Filter(and(p.f, passes), p.ins));
        return new Stream(new Filter(passes, this));
    };
    /**
     * Lets the first `amount` many events from the input stream pass to the
     * output stream, then makes the output stream complete.
     *
     * Marble diagram:
     *
     * ```text
     * --a---b--c----d---e--
     *    take(3)
     * --a---b--c|
     * ```
     *
     * @param {number} amount How many events to allow from the input stream
     * before completing the output stream.
     * @return {Stream}
     */
    Stream.prototype.take = function (amount) {
        return new (this.ctor())(new Take(amount, this));
    };
    /**
     * Ignores the first `amount` many events from the input stream, and then
     * after that starts forwarding events from the input stream to the output
     * stream.
     *
     * Marble diagram:
     *
     * ```text
     * --a---b--c----d---e--
     *       drop(3)
     * --------------d---e--
     * ```
     *
     * @param {number} amount How many events to ignore from the input stream
     * before forwarding all events from the input stream to the output stream.
     * @return {Stream}
     */
    Stream.prototype.drop = function (amount) {
        return new Stream(new Drop(amount, this));
    };
    /**
     * When the input stream completes, the output stream will emit the last event
     * emitted by the input stream, and then will also complete.
     *
     * Marble diagram:
     *
     * ```text
     * --a---b--c--d----|
     *       last()
     * -----------------d|
     * ```
     *
     * @return {Stream}
     */
    Stream.prototype.last = function () {
        return new Stream(new Last(this));
    };
    /**
     * Prepends the given `initial` value to the sequence of events emitted by the
     * input stream. The returned stream is a MemoryStream, which means it is
     * already `remember()`'d.
     *
     * Marble diagram:
     *
     * ```text
     * ---1---2-----3---
     *   startWith(0)
     * 0--1---2-----3---
     * ```
     *
     * @param initial The value or event to prepend.
     * @return {MemoryStream}
     */
    Stream.prototype.startWith = function (initial) {
        return new MemoryStream(new StartWith(this, initial));
    };
    /**
     * Uses another stream to determine when to complete the current stream.
     *
     * When the given `other` stream emits an event or completes, the output
     * stream will complete. Before that happens, the output stream will behaves
     * like the input stream.
     *
     * Marble diagram:
     *
     * ```text
     * ---1---2-----3--4----5----6---
     *   endWhen( --------a--b--| )
     * ---1---2-----3--4--|
     * ```
     *
     * @param other Some other stream that is used to know when should the output
     * stream of this operator complete.
     * @return {Stream}
     */
    Stream.prototype.endWhen = function (other) {
        return new (this.ctor())(new EndWhen(other, this));
    };
    /**
     * "Folds" the stream onto itself.
     *
     * Combines events from the past throughout
     * the entire execution of the input stream, allowing you to accumulate them
     * together. It's essentially like `Array.prototype.reduce`. The returned
     * stream is a MemoryStream, which means it is already `remember()`'d.
     *
     * The output stream starts by emitting the `seed` which you give as argument.
     * Then, when an event happens on the input stream, it is combined with that
     * seed value through the `accumulate` function, and the output value is
     * emitted on the output stream. `fold` remembers that output value as `acc`
     * ("accumulator"), and then when a new input event `t` happens, `acc` will be
     * combined with that to produce the new `acc` and so forth.
     *
     * Marble diagram:
     *
     * ```text
     * ------1-----1--2----1----1------
     *   fold((acc, x) => acc + x, 3)
     * 3-----4-----5--7----8----9------
     * ```
     *
     * @param {Function} accumulate A function of type `(acc: R, t: T) => R` that
     * takes the previous accumulated value `acc` and the incoming event from the
     * input stream and produces the new accumulated value.
     * @param seed The initial accumulated value, of type `R`.
     * @return {MemoryStream}
     */
    Stream.prototype.fold = function (accumulate, seed) {
        return new MemoryStream(new Fold(accumulate, seed, this));
    };
    /**
     * Replaces an error with another stream.
     *
     * When (and if) an error happens on the input stream, instead of forwarding
     * that error to the output stream, *replaceError* will call the `replace`
     * function which returns the stream that the output stream will replicate.
     * And, in case that new stream also emits an error, `replace` will be called
     * again to get another stream to start replicating.
     *
     * Marble diagram:
     *
     * ```text
     * --1---2-----3--4-----X
     *   replaceError( () => --10--| )
     * --1---2-----3--4--------10--|
     * ```
     *
     * @param {Function} replace A function of type `(err) => Stream` that takes
     * the error that occurred on the input stream or on the previous replacement
     * stream and returns a new stream. The output stream will behave like the
     * stream that this function returns.
     * @return {Stream}
     */
    Stream.prototype.replaceError = function (replace) {
        return new (this.ctor())(new ReplaceError(replace, this));
    };
    /**
     * Flattens a "stream of streams", handling only one nested stream at a time
     * (no concurrency).
     *
     * If the input stream is a stream that emits streams, then this operator will
     * return an output stream which is a flat stream: emits regular events. The
     * flattening happens without concurrency. It works like this: when the input
     * stream emits a nested stream, *flatten* will start imitating that nested
     * one. However, as soon as the next nested stream is emitted on the input
     * stream, *flatten* will forget the previous nested one it was imitating, and
     * will start imitating the new nested one.
     *
     * Marble diagram:
     *
     * ```text
     * --+--------+---------------
     *   \        \
     *    \       ----1----2---3--
     *    --a--b----c----d--------
     *           flatten
     * -----a--b------1----2---3--
     * ```
     *
     * @return {Stream}
     */
    Stream.prototype.flatten = function () {
        var p = this._prod;
        return new Stream(new Flatten(this));
    };
    /**
     * Passes the input stream to a custom operator, to produce an output stream.
     *
     * *compose* is a handy way of using an existing function in a chained style.
     * Instead of writing `outStream = f(inStream)` you can write
     * `outStream = inStream.compose(f)`.
     *
     * @param {function} operator A function that takes a stream as input and
     * returns a stream as well.
     * @return {Stream}
     */
    Stream.prototype.compose = function (operator) {
        return operator(this);
    };
    /**
     * Returns an output stream that behaves like the input stream, but also
     * remembers the most recent event that happens on the input stream, so that a
     * newly added listener will immediately receive that memorised event.
     *
     * @return {MemoryStream}
     */
    Stream.prototype.remember = function () {
        return new MemoryStream(new Remember(this));
    };
    /**
     * Returns an output stream that identically behaves like the input stream,
     * but also runs a `spy` function for each event, to help you debug your app.
     *
     * *debug* takes a `spy` function as argument, and runs that for each event
     * happening on the input stream. If you don't provide the `spy` argument,
     * then *debug* will just `console.log` each event. This helps you to
     * understand the flow of events through some operator chain.
     *
     * Please note that if the output stream has no listeners, then it will not
     * start, which means `spy` will never run because no actual event happens in
     * that case.
     *
     * Marble diagram:
     *
     * ```text
     * --1----2-----3-----4--
     *         debug
     * --1----2-----3-----4--
     * ```
     *
     * @param {function} labelOrSpy A string to use as the label when printing
     * debug information on the console, or a 'spy' function that takes an event
     * as argument, and does not need to return anything.
     * @return {Stream}
     */
    Stream.prototype.debug = function (labelOrSpy) {
        return new (this.ctor())(new Debug(this, labelOrSpy));
    };
    /**
     * *imitate* changes this current Stream to emit the same events that the
     * `other` given Stream does. This method returns nothing.
     *
     * This method exists to allow one thing: **circular dependency of streams**.
     * For instance, let's imagine that for some reason you need to create a
     * circular dependency where stream `first$` depends on stream `second$`
     * which in turn depends on `first$`:
     *
     * <!-- skip-example -->
     * ```js
     * import delay from 'xstream/extra/delay'
     *
     * var first$ = second$.map(x => x * 10).take(3);
     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
     * ```
     *
     * However, that is invalid JavaScript, because `second$` is undefined
     * on the first line. This is how *imitate* can help solve it:
     *
     * ```js
     * import delay from 'xstream/extra/delay'
     *
     * var secondProxy$ = xs.create();
     * var first$ = secondProxy$.map(x => x * 10).take(3);
     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
     * secondProxy$.imitate(second$);
     * ```
     *
     * We create `secondProxy$` before the others, so it can be used in the
     * declaration of `first$`. Then, after both `first$` and `second$` are
     * defined, we hook `secondProxy$` with `second$` with `imitate()` to tell
     * that they are "the same". `imitate` will not trigger the start of any
     * stream, it just binds `secondProxy$` and `second$` together.
     *
     * The following is an example where `imitate()` is important in Cycle.js
     * applications. A parent component contains some child components. A child
     * has an action stream which is given to the parent to define its state:
     *
     * <!-- skip-example -->
     * ```js
     * const childActionProxy$ = xs.create();
     * const parent = Parent({...sources, childAction$: childActionProxy$});
     * const childAction$ = parent.state$.map(s => s.child.action$).flatten();
     * childActionProxy$.imitate(childAction$);
     * ```
     *
     * Note, though, that **`imitate()` does not support MemoryStreams**. If we
     * would attempt to imitate a MemoryStream in a circular dependency, we would
     * either get a race condition (where the symptom would be "nothing happens")
     * or an infinite cyclic emission of values. It's useful to think about
     * MemoryStreams as cells in a spreadsheet. It doesn't make any sense to
     * define a spreadsheet cell `A1` with a formula that depends on `B1` and
     * cell `B1` defined with a formula that depends on `A1`.
     *
     * If you find yourself wanting to use `imitate()` with a
     * MemoryStream, you should rework your code around `imitate()` to use a
     * Stream instead. Look for the stream in the circular dependency that
     * represents an event stream, and that would be a candidate for creating a
     * proxy Stream which then imitates the target Stream.
     *
     * @param {Stream} target The other stream to imitate on the current one. Must
     * not be a MemoryStream.
     */
    Stream.prototype.imitate = function (target) {
        if (target instanceof MemoryStream)
            throw new Error('A MemoryStream was given to imitate(), but it only ' +
                'supports a Stream. Read more about this restriction here: ' +
                'https://github.com/staltz/xstream#faq');
        this._target = target;
        for (var ils = this._ils, N = ils.length, i = 0; i < N; i++)
            target._add(ils[i]);
        this._ils = [];
    };
    /**
     * Forces the Stream to emit the given value to its listeners.
     *
     * As the name indicates, if you use this, you are most likely doing something
     * The Wrong Way. Please try to understand the reactive way before using this
     * method. Use it only when you know what you are doing.
     *
     * @param value The "next" value you want to broadcast to all listeners of
     * this Stream.
     */
    Stream.prototype.shamefullySendNext = function (value) {
        this._n(value);
    };
    /**
     * Forces the Stream to emit the given error to its listeners.
     *
     * As the name indicates, if you use this, you are most likely doing something
     * The Wrong Way. Please try to understand the reactive way before using this
     * method. Use it only when you know what you are doing.
     *
     * @param {any} error The error you want to broadcast to all the listeners of
     * this Stream.
     */
    Stream.prototype.shamefullySendError = function (error) {
        this._e(error);
    };
    /**
     * Forces the Stream to emit the "completed" event to its listeners.
     *
     * As the name indicates, if you use this, you are most likely doing something
     * The Wrong Way. Please try to understand the reactive way before using this
     * method. Use it only when you know what you are doing.
     */
    Stream.prototype.shamefullySendComplete = function () {
        this._c();
    };
    /**
     * Adds a "debug" listener to the stream. There can only be one debug
     * listener, that's why this is 'setDebugListener'. To remove the debug
     * listener, just call setDebugListener(null).
     *
     * A debug listener is like any other listener. The only difference is that a
     * debug listener is "stealthy": its presence/absence does not trigger the
     * start/stop of the stream (or the producer inside the stream). This is
     * useful so you can inspect what is going on without changing the behavior
     * of the program. If you have an idle stream and you add a normal listener to
     * it, the stream will start executing. But if you set a debug listener on an
     * idle stream, it won't start executing (not until the first normal listener
     * is added).
     *
     * As the name indicates, we don't recommend using this method to build app
     * logic. In fact, in most cases the debug operator works just fine. Only use
     * this one if you know what you're doing.
     *
     * @param {Listener<T>} listener
     */
    Stream.prototype.setDebugListener = function (listener) {
        if (!listener) {
            this._d = false;
            this._dl = NO;
        }
        else {
            this._d = true;
            listener._n = listener.next || noop;
            listener._e = listener.error || noop;
            listener._c = listener.complete || noop;
            this._dl = listener;
        }
    };
    /**
     * Blends multiple streams together, emitting events from all of them
     * concurrently.
     *
     * *merge* takes multiple streams as arguments, and creates a stream that
     * behaves like each of the argument streams, in parallel.
     *
     * Marble diagram:
     *
     * ```text
     * --1----2-----3--------4---
     * ----a-----b----c---d------
     *            merge
     * --1-a--2--b--3-c---d--4---
     * ```
     *
     * @factory true
     * @param {Stream} stream1 A stream to merge together with other streams.
     * @param {Stream} stream2 A stream to merge together with other streams. Two
     * or more streams may be given as arguments.
     * @return {Stream}
     */
    Stream.merge = function merge() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        return new Stream(new Merge(streams));
    };
    /**
     * Combines multiple input streams together to return a stream whose events
     * are arrays that collect the latest events from each input stream.
     *
     * *combine* internally remembers the most recent event from each of the input
     * streams. When any of the input streams emits an event, that event together
     * with all the other saved events are combined into an array. That array will
     * be emitted on the output stream. It's essentially a way of joining together
     * the events from multiple streams.
     *
     * Marble diagram:
     *
     * ```text
     * --1----2-----3--------4---
     * ----a-----b-----c--d------
     *          combine
     * ----1a-2a-2b-3b-3c-3d-4d--
     * ```
     *
     * @factory true
     * @param {Stream} stream1 A stream to combine together with other streams.
     * @param {Stream} stream2 A stream to combine together with other streams.
     * Multiple streams, not just two, may be given as arguments.
     * @return {Stream}
     */
    Stream.combine = function combine() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        return new Stream(new Combine(streams));
    };
    return Stream;
}());
exports.Stream = Stream;
var MemoryStream = /** @class */ (function (_super) {
    __extends(MemoryStream, _super);
    function MemoryStream(producer) {
        var _this = _super.call(this, producer) || this;
        _this._has = false;
        return _this;
    }
    MemoryStream.prototype._n = function (x) {
        this._v = x;
        this._has = true;
        _super.prototype._n.call(this, x);
    };
    MemoryStream.prototype._add = function (il) {
        var ta = this._target;
        if (ta !== NO)
            return ta._add(il);
        var a = this._ils;
        a.push(il);
        if (a.length > 1) {
            if (this._has)
                il._n(this._v);
            return;
        }
        if (this._stopID !== NO) {
            if (this._has)
                il._n(this._v);
            clearTimeout(this._stopID);
            this._stopID = NO;
        }
        else if (this._has)
            il._n(this._v);
        else {
            var p = this._prod;
            if (p !== NO)
                p._start(this);
        }
    };
    MemoryStream.prototype._stopNow = function () {
        this._has = false;
        _super.prototype._stopNow.call(this);
    };
    MemoryStream.prototype._x = function () {
        this._has = false;
        _super.prototype._x.call(this);
    };
    MemoryStream.prototype.map = function (project) {
        return this._map(project);
    };
    MemoryStream.prototype.mapTo = function (projectedValue) {
        return _super.prototype.mapTo.call(this, projectedValue);
    };
    MemoryStream.prototype.take = function (amount) {
        return _super.prototype.take.call(this, amount);
    };
    MemoryStream.prototype.endWhen = function (other) {
        return _super.prototype.endWhen.call(this, other);
    };
    MemoryStream.prototype.replaceError = function (replace) {
        return _super.prototype.replaceError.call(this, replace);
    };
    MemoryStream.prototype.remember = function () {
        return this;
    };
    MemoryStream.prototype.debug = function (labelOrSpy) {
        return _super.prototype.debug.call(this, labelOrSpy);
    };
    return MemoryStream;
}(Stream));
exports.MemoryStream = MemoryStream;
var xs = Stream;
exports.default = xs;

});

var xs = unwrapExports(xstream);
var xstream_1 = xstream.NO;
var xstream_2 = xstream.NO_IL;
var xstream_3 = xstream.Stream;
var xstream_4 = xstream.MemoryStream;

(function (LoadStatus) {
    LoadStatus["Loading"] = "loading";
    LoadStatus["Failed"] = "failed";
    LoadStatus["Completed"] = "completed";
})(exports.LoadStatus || (exports.LoadStatus = {}));
(function (LoadError) {
    // request
    LoadError["IncompleteAddress"] = "The address is incomplete";
    LoadError["ChainNotFound"] = "Blockchain not found";
    LoadError["MissingBlockchainData"] = "Missing data from the blockchain";
    LoadError["RecordNotFound"] = "Record not found";
    // not found
    LoadError["ResourceNotFound"] = "Contract not found";
    // server error
    LoadError["ServerError"] = "Server error";
    // resolver
    LoadError["InsufficientNumberOfNodes"] = "Insufficient number of nodes";
    LoadError["OutOfNodes"] = "Out of nodes";
    LoadError["UnstableState"] = "Unstable state";
    LoadError["UnaccurateState"] = "Unaccurate state";
    // parsing
    LoadError["FailedToParseResponse"] = "Failed to parse response";
    LoadError["InvalidManifest"] = "Invalid manifest";
    LoadError["InvalidSignature"] = "Invalid signature";
    LoadError["InvalidRecords"] = "Invalid records";
    LoadError["InvalidNodes"] = "Invalid nodes";
    // unknown
    LoadError["UnknownError"] = "Unknown error";
})(exports.LoadError || (exports.LoadError = {}));
var indexData = function (data, existingData, comparer) {
    var _a;
    var found = false;
    var stringToCompare = data.data;
    if (typeof comparer === "function") {
        try {
            stringToCompare = comparer(data.data);
        }
        catch (err) {
            throw err;
        }
    }
    Object.keys(existingData).forEach(function (key) {
        var _a;
        if (stringToCompare === existingData[key].stringToCompare) {
            found = true;
            existingData = __assign({}, existingData, (_a = {}, _a[key] = __assign({}, existingData[key], { nodeUrls: existingData[key].nodeUrls.concat(data.nodeUrl) }), _a));
        }
    });
    if (!found) {
        existingData = __assign({}, existingData, (_a = {}, _a[Object.keys(existingData).length + 1] = {
            nodeUrls: [data.nodeUrl],
            data: data.data,
            stringToCompare: stringToCompare
        }, _a));
    }
    if (!Object.keys(existingData).length) {
        existingData = {
            "1": {
                nodeUrls: [data.nodeUrl],
                data: data.data || "",
                stringToCompare: stringToCompare
            }
        };
    }
    return existingData;
};
var createStream = function (queryHandler, urlsToQuery) {
    var streams = urlsToQuery.map(function (urlToQuery) {
        return xs.fromPromise(queryHandler(urlToQuery));
    });
    return xs.merge.apply(xs, streams);
};
var index = (function (queryHandler, nodeUrls, resolverMode, resolverAccuracy, resolverAbsolute, comparer) {
    var loadErrors = {};
    var loadState = {};
    var loadPending = [];
    return xs.create({
        start: function (listener) {
            listener.next({
                loadErrors: loadErrors,
                loadState: loadState,
                loadPending: loadPending,
                status: exports.LoadStatus.Loading
            });
            if (resolverMode === "absolute") {
                if (resolverAbsolute > nodeUrls.length) {
                    listener.next({
                        loadErrors: loadErrors,
                        loadState: loadState,
                        loadPending: loadPending,
                        loadError: {
                            error: exports.LoadError.InsufficientNumberOfNodes,
                            args: {
                                expected: resolverAbsolute,
                                got: nodeUrls.length
                            }
                        },
                        status: exports.LoadStatus.Failed
                    });
                    listener.complete();
                    return;
                }
                var i = 0;
                var callBatch_1 = function (i) {
                    var urlsToQuery = nodeUrls.slice(i, i + resolverAbsolute);
                    if (urlsToQuery.length === 0) {
                        listener.next({
                            loadErrors: loadErrors,
                            loadState: loadState,
                            loadPending: loadPending,
                            loadError: {
                                error: exports.LoadError.OutOfNodes,
                                args: {
                                    alreadyQueried: i - Object.keys(loadErrors).length,
                                    resolverAbsolute: resolverAbsolute
                                }
                            },
                            status: exports.LoadStatus.Failed
                        });
                        listener.complete();
                        return;
                    }
                    i += urlsToQuery.length;
                    loadPending = loadPending.concat(urlsToQuery);
                    listener.next({
                        loadErrors: loadErrors,
                        loadState: loadState,
                        loadPending: loadPending,
                        status: exports.LoadStatus.Loading
                    });
                    var stream = createStream(queryHandler, urlsToQuery);
                    stream.take(urlsToQuery.length).subscribe({
                        next: function (data) {
                            var _a, _b;
                            loadPending = loadPending.filter(function (url) { return url !== data.nodeUrl; });
                            if (data.type === "SUCCESS") {
                                try {
                                    var newLoadState = indexData(data, loadState, comparer);
                                    loadState = newLoadState;
                                }
                                catch (err) {
                                    loadErrors = __assign({}, loadErrors, (_a = {}, _a[data.nodeUrl] = {
                                        nodeUrl: data.nodeUrl,
                                        status: err.message ? parseInt(err.message, 10) : 400
                                    }, _a));
                                }
                            }
                            else {
                                loadErrors = __assign({}, loadErrors, (_b = {}, _b[data.nodeUrl] = {
                                    nodeUrl: data.nodeUrl,
                                    status: data.status
                                }, _b));
                            }
                            listener.next({
                                loadErrors: loadErrors,
                                loadState: loadState,
                                loadPending: loadPending,
                                status: exports.LoadStatus.Loading
                            });
                        },
                        error: function (e) {
                            console.error(e);
                            listener.error("UnknownError");
                        },
                        complete: function () {
                            // 5 or more load errors
                            if (Object.keys(loadErrors).length > 4) {
                                listener.next({
                                    loadErrors: loadErrors,
                                    loadState: loadState,
                                    loadPending: loadPending,
                                    loadError: {
                                        error: exports.LoadError.ServerError,
                                        args: {
                                            numberOfLoadErrors: Object.keys(loadErrors).length
                                        }
                                    },
                                    status: exports.LoadStatus.Failed
                                });
                                listener.complete();
                                return;
                                // 3 or more different groups
                            }
                            else if (Object.keys(loadState).length > 2) {
                                listener.next({
                                    loadErrors: loadErrors,
                                    loadState: loadState,
                                    loadPending: loadPending,
                                    loadError: {
                                        error: exports.LoadError.UnstableState,
                                        args: {
                                            numberOfLoadStates: Object.keys(loadState).length
                                        }
                                    },
                                    status: exports.LoadStatus.Failed
                                });
                                listener.complete();
                                return;
                            }
                            else {
                                var totalOkResponses_1 = Object.keys(loadState).reduce(function (total, k) {
                                    return total + loadState[k].nodeUrls.length;
                                }, 0);
                                for (var i_1 = 0; i_1 < Object.keys(loadState).length; i_1 += 1) {
                                    var key = Object.keys(loadState)[i_1];
                                    var nodesWithOkResponses = loadState[key].nodeUrls.length;
                                    // at least [resolverAbsolute] responses of the same
                                    // resolver must Complete or Fail
                                    if (nodesWithOkResponses >= resolverAbsolute) {
                                        if (resolverAccuracy / 100 >
                                            loadState[key].nodeUrls.length / totalOkResponses_1) {
                                            listener.next({
                                                loadErrors: loadErrors,
                                                loadState: loadState,
                                                loadPending: loadPending,
                                                loadError: {
                                                    error: exports.LoadError.UnaccurateState,
                                                    args: {
                                                        totalOkResponses: totalOkResponses_1,
                                                        loadStates: Object.keys(loadState).map(function (k) {
                                                            return {
                                                                key: k,
                                                                okResponses: loadState[k].nodeUrls.length,
                                                                percent: Math.round((100 *
                                                                    (100 * loadState[k].nodeUrls.length)) /
                                                                    totalOkResponses_1) / 100
                                                            };
                                                        })
                                                    }
                                                },
                                                status: exports.LoadStatus.Failed
                                            });
                                            listener.complete();
                                            return;
                                        }
                                        listener.next({
                                            loadErrors: loadErrors,
                                            loadState: loadState,
                                            loadPending: loadPending,
                                            status: exports.LoadStatus.Completed
                                        });
                                        listener.complete();
                                        return;
                                    }
                                }
                            }
                            callBatch_1(i);
                        }
                    });
                };
                callBatch_1(i);
            }
        },
        stop: function () { }
    });
});

exports.default = index;
});

var resolver = unwrapExports(dist);
var dist_1 = dist.LoadStatus;
var dist_2 = dist.LoadError;

var getNodeFromIndex = function (index) {
    return {
        ip: index.split('---')[0],
        host: index.split('---')[1],
    };
};

var httpBrowserToNode = function (data, node, timeout) {
    return new Promise(function (resolve, reject) {
        var s = JSON.stringify(data);
        var l = Buffer.from(s).length;
        if (l > WS_PAYLOAD_PAX_SIZE) {
            reject("bn payload is " + l / 1000 + "kb, max size is " + WS_PAYLOAD_PAX_SIZE / 1000 + "kb");
            return;
        }
        try {
            var req = https.request({
                hostname: node.ip.split(':')[0],
                port: node.ip.indexOf(':') === -1 ? 443 : node.ip.split(':')[1],
                path: "/" + data.type,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Host: node.host,
                },
                // cert does not have to be signed by CA (self-signed)
                rejectUnauthorized: false,
                // only origin user can have invalid cert
                cert: node.cert ? decodeURI(node.cert) : node.origin === 'user' ? undefined : 'INVALIDCERT',
                ca: [],
            }, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    resolve(data);
                });
            });
            if (data.body) {
                req.end(JSON.stringify(data.body));
            }
            else {
                req.end();
            }
            req.on('error', function (err) {
                console.log(err);
                reject(err);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

/* browser to network */
var performMultiRequest = function (body, parameters, blockchains) {
    return new Promise(function (resolve, reject) {
        resolver(function (index) {
            var a = getNodeFromIndex(index);
            return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var node, over_1, requestId, newBodyForRequest, resp, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(blockchains[parameters.chainId] &&
                                blockchains[parameters.chainId].nodes.find(function (n) { return n.ip === a.ip && n.host === a.host; }))) return [3 /*break*/, 5];
                            node = blockchains[parameters.chainId].nodes.find(function (n) { return n.ip === a.ip && n.host === a.host; });
                            over_1 = false;
                            setTimeout(function () {
                                if (!over_1) {
                                    resolve({
                                        type: 'ERROR',
                                        status: 500,
                                        nodeUrl: index,
                                    });
                                    over_1 = true;
                                }
                            }, 50000);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            requestId = Math.round(Math.random() * 1000000).toString();
                            newBodyForRequest = __assign(__assign({}, body), { requestId: requestId });
                            return [4 /*yield*/, httpBrowserToNode(newBodyForRequest, node)];
                        case 2:
                            resp = _a.sent();
                            if (!over_1) {
                                resolve({
                                    type: 'SUCCESS',
                                    data: resp,
                                    nodeUrl: index,
                                });
                                over_1 = true;
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            resolve({
                                type: 'ERROR',
                                status: 500,
                                nodeUrl: index,
                            });
                            over_1 = true;
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            // fallback on HTTP
                            if (body.type === 'get-nodes') {
                                http
                                    .get("http://" + index.split('---')[0] + "/get-nodes?network=" + body.body.network, function (resp) {
                                    var data = '';
                                    resp.on('data', function (chunk) {
                                        data += chunk.toString('utf8');
                                    });
                                    resp.on('end', function () {
                                        console.log('[get-nodes] Successfully fell back on HTTP for ' + index);
                                        resolve({
                                            type: 'SUCCESS',
                                            data: data,
                                            nodeUrl: index,
                                        });
                                    });
                                })
                                    .on('error', function (err) {
                                    resolve({
                                        type: 'ERROR',
                                        status: 500,
                                        nodeUrl: index,
                                    });
                                });
                            }
                            else {
                                resolve({
                                    type: 'ERROR',
                                    status: 500,
                                    nodeUrl: index,
                                });
                            }
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        }, parameters.urls, parameters.resolverMode, parameters.resolverAccuracy, parameters.resolverAbsolute, parameters.comparer).subscribe({
            next: function (a) {
                if (a.status === 'failed') {
                    reject({
                        error: a.loadError,
                        loadState: a.loadState,
                    });
                    return;
                }
                else if (a.status === 'loading') ;
                else if (a.status === 'completed') {
                    var data_1 = {
                        data: '',
                        nodeUrlsLength: 0,
                    };
                    Object.keys(a.loadState).forEach(function (key) {
                        if (a.loadState[key].nodeUrls.length > data_1.nodeUrlsLength) {
                            data_1 = {
                                data: a.loadState[key].data,
                                nodeUrlsLength: a.loadState[key].nodeUrls.length,
                            };
                        }
                    });
                    resolve({
                        result: data_1,
                        loadState: a.loadState,
                        loadErrors: a.loadErrors,
                    });
                }
            },
            error: function (e) {
                console.log('Unknwon error in resolver');
                console.log(e);
                reject({
                    error: {
                        error: dist_2.UnknownError,
                        args: {},
                    },
                    loadState: {},
                });
            },
        });
    });
};

var UPDATE_NODE_READY_STATE = '[Settings] Update node ready state';

var initialState$1 = {
    settings: {
        resolver: 'custom',
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: 1,
        devMode: false,
    },
    accounts: {},
    blockchains: {},
    errors: [],
    executingAccountsCronJobs: false,
};
// SELECTORS
var getSettingsState = lib_4(function (state) { return state; }, function (state) { return state.settings; });
var getSettings = lib_4(getSettingsState, function (state) { return state.settings; });
var getBlockchains = lib_4(getSettingsState, function (state) { return state.blockchains; });
var getAccounts = lib_4(getSettingsState, function (state) { return state.accounts; });
var getExecutingAccountsCronJobs = lib_4(getSettingsState, function (state) { return state.executingAccountsCronJobs; });
var getAvailableBlockchains = lib_4(getBlockchains, function (blockchains) {
    var availableBlockchains = {};
    Object.keys(blockchains).forEach(function (chainId) {
        if (blockchains[chainId].nodes.length > 0) {
            availableBlockchains[chainId] = blockchains[chainId];
        }
    });
    return availableBlockchains;
});
var getNamesBlockchain = lib_4(getAvailableBlockchains, function (availableBlockchains) {
    var chainId = Object.keys(availableBlockchains)[0];
    if (chainId) {
        return availableBlockchains[chainId];
    }
    else {
        return undefined;
    }
});
var getAvailableRChainBlockchains = lib_4(getAvailableBlockchains, function (availableBlockchains) {
    var rchainBlockchains = {};
    Object.keys(availableBlockchains).forEach(function (chainId) {
        if (availableBlockchains[chainId].platform === 'rchain') {
            rchainBlockchains[chainId] = availableBlockchains[chainId];
        }
    });
    return rchainBlockchains;
});
// if modified, must be modified in main also
var getOkBlockchains = lib_4(getBlockchains, function (blockchains) {
    var okBlockchains = {};
    Object.keys(blockchains).forEach(function (chainId) {
        var nodes = blockchains[chainId].nodes.filter(function (n) { return n.active && n.readyState === 1; });
        if (!nodes.length) {
            return;
        }
        okBlockchains[chainId] = __assign(__assign({}, blockchains[chainId]), { nodes: nodes.filter(function (n) { return n.readyState === 1; }) });
    });
    return okBlockchains;
});
var getIsLoadReady = lib_4(getBlockchains, getSettings, function (blockchains, settings) {
    var key = Object.keys(blockchains)[0];
    var firstBlockchain = blockchains[key];
    if (!firstBlockchain) {
        return false;
    }
    var nodes = firstBlockchain.nodes.filter(function (n) { return n.active && n.readyState === 1; });
    return nodes.length >= settings.resolverAbsolute;
});

var SYNC_SETTINGS = '[MAIN] Sync settings';
var initialState$2 = initialState$1.settings;
var reducer$1 = function (state, action) {
    if (state === void 0) { state = initialState$2; }
    switch (action.type) {
        case SYNC_SETTINGS: {
            return action.payload;
        }
        default:
            return state;
    }
};
var getSettingsMainState = lib_4(function (state) { return state; }, function (state) { return state.settings; });
var getSettings$1 = lib_4(getSettingsMainState, function (state) { return state; });

var SYNC_BLOCKCHAINS = '[MAIN] Sync blockchains';
var initialState$3 = {};
var reducer$2 = function (state, action) {
    if (state === void 0) { state = initialState$3; }
    switch (action.type) {
        case SYNC_BLOCKCHAINS: {
            return action.payload;
        }
        default:
            return state;
    }
};
var getBlockchainsMainState = lib_4(function (state) { return state; }, function (state) { return state.blockchains; });
var getBlockchains$1 = lib_4(getBlockchainsMainState, function (state) { return state; });
// if modified, must be modified in renderer also
var getOkBlockchainsMain = lib_4(getBlockchainsMainState, function (blockchains) {
    var okBlockchains = {};
    Object.keys(blockchains).forEach(function (chainId) {
        var nodes = blockchains[chainId].nodes.filter(function (n) { return n.active && n.readyState === 1; });
        if (!nodes.length) {
            return;
        }
        okBlockchains[chainId] = __assign(__assign({}, blockchains[chainId]), { nodes: nodes.filter(function (n) { return n.readyState === 1; }) });
    });
    return okBlockchains;
});

var LoadError;
(function (LoadError) {
    // request
    LoadError["IncompleteAddress"] = "The address is incomplete";
    LoadError["ChainNotFound"] = "Blockchain not found";
    LoadError["MissingBlockchainData"] = "Missing data from the blockchain";
    LoadError["RecordNotFound"] = "Record not found";
    // not found
    LoadError["ResourceNotFound"] = "Contract not found";
    // server error
    LoadError["ServerError"] = "Server error";
    // resolver
    LoadError["InsufficientNumberOfNodes"] = "Insufficient number of nodes";
    LoadError["OutOfNodes"] = "Out of nodes";
    LoadError["UnstableState"] = "Unstable state";
    LoadError["UnaccurateState"] = "Unaccurate state";
    // parsing
    LoadError["FailedToParseResponse"] = "Failed to parse response";
    LoadError["InvalidManifest"] = "Invalid manifest";
    LoadError["InvalidSignature"] = "Invalid signature";
    LoadError["InvalidRecords"] = "Invalid records";
    LoadError["InvalidNodes"] = "Invalid nodes";
})(LoadError || (LoadError = {}));

var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["Pending"] = "pending";
    TransactionStatus["Aired"] = "aired";
    TransactionStatus["Failed"] = "failed";
    TransactionStatus["Abandonned"] = "abandonned";
    TransactionStatus["Completed"] = "completed";
})(TransactionStatus || (TransactionStatus = {}));
var CallStatus;
(function (CallStatus) {
    CallStatus["Pending"] = "pending";
    CallStatus["Failed"] = "failed";
    CallStatus["Completed"] = "completed";
})(CallStatus || (CallStatus = {}));

var interopRequireDefault = createCommonjsModule(function (module) {
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

module.exports = _interopRequireDefault;
});

unwrapExports(interopRequireDefault);

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
});

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

var _baseHas = baseHas;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && _hasPath(object, path, _baseHas);
}

var has_1 = has;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = _getNative(_root, 'Set');

var _Set = Set$1;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$1) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$1) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$a.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag$1:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$2] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$2 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn_1 : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * This method is like `_.cloneWith` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the deep cloned value.
 * @see _.cloneWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * }
 *
 * var el = _.cloneDeepWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 20
 */
function cloneDeepWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1, customizer);
}

var cloneDeepWith_1 = cloneDeepWith;

/** `Object#toString` result references. */
var stringTag$3 = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag$3);
}

var isString_1 = isString;

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

var _iteratorToArray = iteratorToArray;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

var _asciiToArray = asciiToArray;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode;

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']',
    rsCombo = '[' + rsComboRange$1 + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange$1 + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange$1 + ']?',
    rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

var _unicodeToArray = unicodeToArray;

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return _hasUnicode(string)
    ? _unicodeToArray(string)
    : _asciiToArray(string);
}

var _stringToArray = stringToArray;

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return _arrayMap(props, function(key) {
    return object[key];
  });
}

var _baseValues = baseValues;

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : _baseValues(object, keys_1(object));
}

var values_1 = values;

/** `Object#toString` result references. */
var mapTag$5 = '[object Map]',
    setTag$5 = '[object Set]';

/** Built-in value references. */
var symIterator = _Symbol ? _Symbol.iterator : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike_1(value)) {
    return isString_1(value) ? _stringToArray(value) : _copyArray(value);
  }
  if (symIterator && value[symIterator]) {
    return _iteratorToArray(value[symIterator]());
  }
  var tag = _getTag(value),
      func = tag == mapTag$5 ? _mapToArray : (tag == setTag$5 ? _setToArray : values_1);

  return func(value);
}

var toArray_1 = toArray;

var printValue_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = printValue;
var toString = Object.prototype.toString;
var errorToString = Error.prototype.toString;
var regExpToString = RegExp.prototype.toString;
var symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : function () {
  return '';
};
var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function printNumber(val) {
  if (val != +val) return 'NaN';
  var isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : '' + val;
}

function printSimpleValue(val, quoteStrings) {
  if (quoteStrings === void 0) {
    quoteStrings = false;
  }

  if (val == null || val === true || val === false) return '' + val;
  var typeOf = typeof val;
  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return quoteStrings ? "\"" + val + "\"" : val;
  if (typeOf === 'function') return '[Function ' + (val.name || 'anonymous') + ']';
  if (typeOf === 'symbol') return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  var tag = toString.call(val).slice(8, -1);
  if (tag === 'Date') return isNaN(val.getTime()) ? '' + val : val.toISOString(val);
  if (tag === 'Error' || val instanceof Error) return '[' + errorToString.call(val) + ']';
  if (tag === 'RegExp') return regExpToString.call(val);
  return null;
}

function printValue(value, quoteStrings) {
  var result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;
  return JSON.stringify(value, function (key, value) {
    var result = printSimpleValue(this[key], quoteStrings);
    if (result !== null) return result;
    return value;
  }, 2);
}

module.exports = exports["default"];
});

unwrapExports(printValue_1);

var locale = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = exports.array = exports.object = exports.boolean = exports.date = exports.number = exports.string = exports.mixed = void 0;

var _printValue = interopRequireDefault(printValue_1);

var mixed = {
  default: '${path} is invalid',
  required: '${path} is a required field',
  oneOf: '${path} must be one of the following values: ${values}',
  notOneOf: '${path} must not be one of the following values: ${values}',
  notType: function notType(_ref) {
    var path = _ref.path,
        type = _ref.type,
        value = _ref.value,
        originalValue = _ref.originalValue;
    var isCast = originalValue != null && originalValue !== value;
    var msg = path + " must be a `" + type + "` type, " + ("but the final value was: `" + (0, _printValue.default)(value, true) + "`") + (isCast ? " (cast from the value `" + (0, _printValue.default)(originalValue, true) + "`)." : '.');

    if (value === null) {
      msg += "\n If \"null\" is intended as an empty value be sure to mark the schema as `.nullable()`";
    }

    return msg;
  }
};
exports.mixed = mixed;
var string = {
  length: '${path} must be exactly ${length} characters',
  min: '${path} must be at least ${min} characters',
  max: '${path} must be at most ${max} characters',
  matches: '${path} must match the following: "${regex}"',
  email: '${path} must be a valid email',
  url: '${path} must be a valid URL',
  trim: '${path} must be a trimmed string',
  lowercase: '${path} must be a lowercase string',
  uppercase: '${path} must be a upper case string'
};
exports.string = string;
var number = {
  min: '${path} must be greater than or equal to ${min}',
  max: '${path} must be less than or equal to ${max}',
  lessThan: '${path} must be less than ${less}',
  moreThan: '${path} must be greater than ${more}',
  notEqual: '${path} must be not equal to ${notEqual}',
  positive: '${path} must be a positive number',
  negative: '${path} must be a negative number',
  integer: '${path} must be an integer'
};
exports.number = number;
var date = {
  min: '${path} field must be later than ${min}',
  max: '${path} field must be at earlier than ${max}'
};
exports.date = date;
var boolean = {};
exports.boolean = boolean;
var object = {
  noUnknown: '${path} field cannot have keys not specified in the object shape'
};
exports.object = object;
var array = {
  min: '${path} field must have at least ${min} items',
  max: '${path} field must have less than or equal to ${max} items'
};
exports.array = array;
var _default = {
  mixed: mixed,
  string: string,
  number: number,
  date: date,
  object: object,
  array: array,
  boolean: boolean
};
exports.default = _default;
});

unwrapExports(locale);
var locale_1 = locale.array;
var locale_2 = locale.object;
var locale_3 = locale.date;
var locale_4 = locale.number;
var locale_5 = locale.string;
var locale_6 = locale.mixed;

var isSchema = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;

var _default = function _default(obj) {
  return obj && obj.__isYupSchema__;
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(isSchema);

var Condition = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _has = interopRequireDefault(has_1);

var _isSchema = interopRequireDefault(isSchema);

function callOrConcat(schema) {
  if (typeof schema === 'function') return schema;
  return function (base) {
    return base.concat(schema);
  };
}

var Conditional =
/*#__PURE__*/
function () {
  function Conditional(refs, options) {
    var is = options.is,
        then = options.then,
        otherwise = options.otherwise;
    this.refs = [].concat(refs);
    then = callOrConcat(then);
    otherwise = callOrConcat(otherwise);
    if (typeof options === 'function') this.fn = options;else {
      if (!(0, _has.default)(options, 'is')) throw new TypeError('`is:` is required for `when()` conditions');
      if (!options.then && !options.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions');
      var isFn = typeof is === 'function' ? is : function () {
        for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
          values[_key] = arguments[_key];
        }

        return values.every(function (value) {
          return value === is;
        });
      };

      this.fn = function () {
        for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          values[_key2] = arguments[_key2];
        }

        var currentSchema = values.pop();
        var option = isFn.apply(void 0, values) ? then : otherwise;
        return option(currentSchema);
      };
    }
  }

  var _proto = Conditional.prototype;

  _proto.getValue = function getValue(parent, context) {
    var values = this.refs.map(function (r) {
      return r.getValue(parent, context);
    });
    return values;
  };

  _proto.resolve = function resolve(ctx, values) {
    var schema = this.fn.apply(ctx, values.concat(ctx));
    if (schema !== undefined && !(0, _isSchema.default)(schema)) throw new TypeError('conditions must return a schema object');
    return schema || ctx;
  };

  return Conditional;
}();

var _default = Conditional;
exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(Condition);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

/* jshint node: true */

function makeArrayFrom(obj) {
  return Array.prototype.slice.apply(obj);
}

var
  PENDING = "pending",
  RESOLVED = "resolved",
  REJECTED = "rejected";

function SynchronousPromise(handler) {
  this.status = PENDING;
  this._continuations = [];
  this._parent = null;
  this._paused = false;
  if (handler) {
    handler.call(
      this,
      this._continueWith.bind(this),
      this._failWith.bind(this)
    );
  }
}

function looksLikeAPromise(obj) {
  return obj && typeof (obj.then) === "function";
}

function passThrough(value) {
  return value;
}

SynchronousPromise.prototype = {
  then: function (nextFn, catchFn) {
    var next = SynchronousPromise.unresolved()._setParent(this);
    if (this._isRejected()) {
      if (this._paused) {
        this._continuations.push({
          promise: next,
          nextFn: nextFn,
          catchFn: catchFn
        });
        return next;
      }
      if (catchFn) {
        try {
          var catchResult = catchFn(this._error);
          if (looksLikeAPromise(catchResult)) {
            this._chainPromiseData(catchResult, next);
            return next;
          } else {
            return SynchronousPromise.resolve(catchResult)._setParent(this);
          }
        } catch (e) {
          return SynchronousPromise.reject(e)._setParent(this);
        }
      }
      return SynchronousPromise.reject(this._error)._setParent(this);
    }
    this._continuations.push({
      promise: next,
      nextFn: nextFn,
      catchFn: catchFn
    });
    this._runResolutions();
    return next;
  },
  catch: function (handler) {
    if (this._isResolved()) {
      return SynchronousPromise.resolve(this._data)._setParent(this);
    }
    var next = SynchronousPromise.unresolved()._setParent(this);
    this._continuations.push({
      promise: next,
      catchFn: handler
    });
    this._runRejections();
    return next;
  },
  finally: function (callback) {
    var ran = false;

    function runFinally(result, err) {
      if (!ran) {
        ran = true;
        if (!callback) {
          callback = passThrough;
        }
        var callbackResult = callback(result);
        if (looksLikeAPromise(callbackResult)) {
          return callbackResult.then(function () {
            if (err) {
              throw err;
            }
            return result;
          });
        } else {
          return result;
        }
      }
    }

    return this
      .then(function (result) {
        return runFinally(result);
      })
      .catch(function (err) {
        return runFinally(null, err);
      });
  },
  pause: function () {
    this._paused = true;
    return this;
  },
  resume: function () {
    var firstPaused = this._findFirstPaused();
    if (firstPaused) {
      firstPaused._paused = false;
      firstPaused._runResolutions();
      firstPaused._runRejections();
    }
    return this;
  },
  _findAncestry: function () {
    return this._continuations.reduce(function (acc, cur) {
      if (cur.promise) {
        var node = {
          promise: cur.promise,
          children: cur.promise._findAncestry()
        };
        acc.push(node);
      }
      return acc;
    }, []);
  },
  _setParent: function (parent) {
    if (this._parent) {
      throw new Error("parent already set");
    }
    this._parent = parent;
    return this;
  },
  _continueWith: function (data) {
    var firstPending = this._findFirstPending();
    if (firstPending) {
      firstPending._data = data;
      firstPending._setResolved();
    }
  },
  _findFirstPending: function () {
    return this._findFirstAncestor(function (test) {
      return test._isPending && test._isPending();
    });
  },
  _findFirstPaused: function () {
    return this._findFirstAncestor(function (test) {
      return test._paused;
    });
  },
  _findFirstAncestor: function (matching) {
    var test = this;
    var result;
    while (test) {
      if (matching(test)) {
        result = test;
      }
      test = test._parent;
    }
    return result;
  },
  _failWith: function (error) {
    var firstRejected = this._findFirstPending();
    if (firstRejected) {
      firstRejected._error = error;
      firstRejected._setRejected();
    }
  },
  _takeContinuations: function () {
    return this._continuations.splice(0, this._continuations.length);
  },
  _runRejections: function () {
    if (this._paused || !this._isRejected()) {
      return;
    }
    var
      error = this._error,
      continuations = this._takeContinuations(),
      self = this;
    continuations.forEach(function (cont) {
      if (cont.catchFn) {
        try {
          var catchResult = cont.catchFn(error);
          self._handleUserFunctionResult(catchResult, cont.promise);
        } catch (e) {
          cont.promise.reject(e);
        }
      } else {
        cont.promise.reject(error);
      }
    });
  },
  _runResolutions: function () {
    if (this._paused || !this._isResolved() || this._isPending()) {
      return;
    }
    var continuations = this._takeContinuations();
    if (looksLikeAPromise(this._data)) {
      return this._handleWhenResolvedDataIsPromise(this._data);
    }
    var data = this._data;
    var self = this;
    continuations.forEach(function (cont) {
      if (cont.nextFn) {
        try {
          var result = cont.nextFn(data);
          self._handleUserFunctionResult(result, cont.promise);
        } catch (e) {
          self._handleResolutionError(e, cont);
        }
      } else if (cont.promise) {
        cont.promise.resolve(data);
      }
    });
  },
  _handleResolutionError: function (e, continuation) {
    this._setRejected();
    if (continuation.catchFn) {
      try {
        continuation.catchFn(e);
        return;
      } catch (e2) {
        e = e2;
      }
    }
    if (continuation.promise) {
      continuation.promise.reject(e);
    }
  },
  _handleWhenResolvedDataIsPromise: function (data) {
    var self = this;
    return data.then(function (result) {
      self._data = result;
      self._runResolutions();
    }).catch(function (error) {
      self._error = error;
      self._setRejected();
      self._runRejections();
    });
  },
  _handleUserFunctionResult: function (data, nextSynchronousPromise) {
    if (looksLikeAPromise(data)) {
      this._chainPromiseData(data, nextSynchronousPromise);
    } else {
      nextSynchronousPromise.resolve(data);
    }
  },
  _chainPromiseData: function (promiseData, nextSynchronousPromise) {
    promiseData.then(function (newData) {
      nextSynchronousPromise.resolve(newData);
    }).catch(function (newError) {
      nextSynchronousPromise.reject(newError);
    });
  },
  _setResolved: function () {
    this.status = RESOLVED;
    if (!this._paused) {
      this._runResolutions();
    }
  },
  _setRejected: function () {
    this.status = REJECTED;
    if (!this._paused) {
      this._runRejections();
    }
  },
  _isPending: function () {
    return this.status === PENDING;
  },
  _isResolved: function () {
    return this.status === RESOLVED;
  },
  _isRejected: function () {
    return this.status === REJECTED;
  }
};

SynchronousPromise.resolve = function (result) {
  return new SynchronousPromise(function (resolve, reject) {
    if (looksLikeAPromise(result)) {
      result.then(function (newResult) {
        resolve(newResult);
      }).catch(function (error) {
        reject(error);
      });
    } else {
      resolve(result);
    }
  });
};

SynchronousPromise.reject = function (result) {
  return new SynchronousPromise(function (resolve, reject) {
    reject(result);
  });
};

SynchronousPromise.unresolved = function () {
  return new SynchronousPromise(function (resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  });
};

SynchronousPromise.all = function () {
  var args = makeArrayFrom(arguments);
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  if (!args.length) {
    return SynchronousPromise.resolve([]);
  }
  return new SynchronousPromise(function (resolve, reject) {
    var
      allData = [],
      numResolved = 0,
      doResolve = function () {
        if (numResolved === args.length) {
          resolve(allData);
        }
      },
      rejected = false,
      doReject = function (err) {
        if (rejected) {
          return;
        }
        rejected = true;
        reject(err);
      };
    args.forEach(function (arg, idx) {
      SynchronousPromise.resolve(arg).then(function (thisResult) {
        allData[idx] = thisResult;
        numResolved += 1;
        doResolve();
      }).catch(function (err) {
        doReject(err);
      });
    });
  });
};

function createAggregateErrorFrom(errors) {
  /* jshint ignore:start */
  if (typeof window !== "undefined" && "AggregateError" in window) {
    return new window.AggregateError(errors);
  }
  /* jshint ignore:end */

  return { errors: errors };
}

SynchronousPromise.any = function () {
  var args = makeArrayFrom(arguments);
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  if (!args.length) {
    return SynchronousPromise.reject(createAggregateErrorFrom([]));
  }
  return new SynchronousPromise(function (resolve, reject) {
    var
      allErrors = [],
      numRejected = 0,
      doReject = function () {
        if (numRejected === args.length) {
          reject(createAggregateErrorFrom(allErrors));
        }
      },
      resolved = false,
      doResolve = function (result) {
        if (resolved) {
          return;
        }
        resolved = true;
        resolve(result);
      };
    args.forEach(function (arg, idx) {
      SynchronousPromise.resolve(arg).then(function (thisResult) {
        doResolve(thisResult);
      }).catch(function (err) {
        allErrors[idx] = err;
        numRejected += 1;
        doReject();
      });
    });
  });
};

SynchronousPromise.allSettled = function () {
  var args = makeArrayFrom(arguments);
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  if (!args.length) {
    return SynchronousPromise.resolve([]);
  }
  return new SynchronousPromise(function (resolve) {
    var
      allData = [],
      numSettled = 0,
      doSettled = function () {
        numSettled += 1;
        if (numSettled === args.length) {
          resolve(allData);
        }
      };
    args.forEach(function (arg, idx) {
      SynchronousPromise.resolve(arg).then(function (thisResult) {
        allData[idx] = {
          status: "fulfilled",
          value: thisResult
        };
        doSettled();
      }).catch(function (err) {
        allData[idx] = {
          status: "rejected",
          reason: err
        };
        doSettled();
      });
    });
  });
};

/* jshint ignore:start */
if (Promise === SynchronousPromise) {
  throw new Error("Please use SynchronousPromise.installGlobally() to install globally");
}
var RealPromise = Promise;
SynchronousPromise.installGlobally = function (__awaiter) {
  if (Promise === SynchronousPromise) {
    return __awaiter;
  }
  var result = patchAwaiterIfRequired(__awaiter);
  Promise = SynchronousPromise;
  return result;
};

SynchronousPromise.uninstallGlobally = function () {
  if (Promise === SynchronousPromise) {
    Promise = RealPromise;
  }
};

function patchAwaiterIfRequired(__awaiter) {
  if (typeof (__awaiter) === "undefined" || __awaiter.__patched) {
    return __awaiter;
  }
  var originalAwaiter = __awaiter;
  __awaiter = function () {
    originalAwaiter.apply(this, makeArrayFrom(arguments));
  };
  __awaiter.__patched = true;
  return __awaiter;
}

/* jshint ignore:end */

var synchronousPromise = {
  SynchronousPromise: SynchronousPromise
};

var ValidationError_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = ValidationError;

var _printValue = interopRequireDefault(printValue_1);

var strReg = /\$\{\s*(\w+)\s*\}/g;

var replace = function replace(str) {
  return function (params) {
    return str.replace(strReg, function (_, key) {
      return (0, _printValue.default)(params[key]);
    });
  };
};

function ValidationError(errors, value, field, type) {
  var _this = this;

  this.name = 'ValidationError';
  this.value = value;
  this.path = field;
  this.type = type;
  this.errors = [];
  this.inner = [];
  if (errors) [].concat(errors).forEach(function (err) {
    _this.errors = _this.errors.concat(err.errors || err);
    if (err.inner) _this.inner = _this.inner.concat(err.inner.length ? err.inner : err);
  });
  this.message = this.errors.length > 1 ? this.errors.length + " errors occurred" : this.errors[0];
  if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

ValidationError.isError = function (err) {
  return err && err.name === 'ValidationError';
};

ValidationError.formatError = function (message, params) {
  if (typeof message === 'string') message = replace(message);

  var fn = function fn(params) {
    params.path = params.label || params.path || 'this';
    return typeof message === 'function' ? message(params) : message;
  };

  return arguments.length === 1 ? fn : fn(params);
};

module.exports = exports["default"];
});

unwrapExports(ValidationError_1);

var runValidations_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.propagateErrors = propagateErrors;
exports.settled = settled;
exports.collectErrors = collectErrors;
exports.default = runValidations;

var _objectWithoutPropertiesLoose2 = interopRequireDefault(objectWithoutPropertiesLoose);



var _ValidationError = interopRequireDefault(ValidationError_1);

var promise = function promise(sync) {
  return sync ? synchronousPromise.SynchronousPromise : Promise;
};

var unwrapError = function unwrapError(errors) {
  if (errors === void 0) {
    errors = [];
  }

  return errors.inner && errors.inner.length ? errors.inner : [].concat(errors);
};

function scopeToValue(promises, value, sync) {
  //console.log('scopeToValue', promises, value)
  var p = promise(sync).all(promises); //console.log('scopeToValue B', p)

  var b = p.catch(function (err) {
    if (err.name === 'ValidationError') err.value = value;
    throw err;
  }); //console.log('scopeToValue c', b)

  var c = b.then(function () {
    return value;
  }); //console.log('scopeToValue d', c)

  return c;
}
/**
 * If not failing on the first error, catch the errors
 * and collect them in an array
 */


function propagateErrors(endEarly, errors) {
  return endEarly ? null : function (err) {
    errors.push(err);
    return err.value;
  };
}

function settled(promises, sync) {
  var Promise = promise(sync);
  return Promise.all(promises.map(function (p) {
    return Promise.resolve(p).then(function (value) {
      return {
        fulfilled: true,
        value: value
      };
    }, function (value) {
      return {
        fulfilled: false,
        value: value
      };
    });
  }));
}

function collectErrors(_ref) {
  var validations = _ref.validations,
      value = _ref.value,
      path = _ref.path,
      sync = _ref.sync,
      errors = _ref.errors,
      sort = _ref.sort;
  errors = unwrapError(errors);
  return settled(validations, sync).then(function (results) {
    var nestedErrors = results.filter(function (r) {
      return !r.fulfilled;
    }).reduce(function (arr, _ref2) {
      var error = _ref2.value;

      // we are only collecting validation errors
      if (!_ValidationError.default.isError(error)) {
        throw error;
      }

      return arr.concat(error);
    }, []);
    if (sort) nestedErrors.sort(sort); //show parent errors after the nested ones: name.first, name

    errors = nestedErrors.concat(errors);
    if (errors.length) throw new _ValidationError.default(errors, value, path);
    return value;
  });
}

function runValidations(_ref3) {
  var endEarly = _ref3.endEarly,
      options = (0, _objectWithoutPropertiesLoose2.default)(_ref3, ["endEarly"]);
  if (endEarly) return scopeToValue(options.validations, options.value, options.sync);
  return collectErrors(options);
}
});

unwrapExports(runValidations_1);
var runValidations_2 = runValidations_1.propagateErrors;
var runValidations_3 = runValidations_1.settled;
var runValidations_4 = runValidations_1.collectErrors;

var merge_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = merge;

var _has = interopRequireDefault(has_1);

var _isSchema = interopRequireDefault(isSchema);

var isObject = function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

function merge(target, source) {
  for (var key in source) {
    if ((0, _has.default)(source, key)) {
      var targetVal = target[key],
          sourceVal = source[key];
      if (sourceVal === undefined) continue;

      if ((0, _isSchema.default)(sourceVal)) {
        target[key] = (0, _isSchema.default)(targetVal) ? targetVal.concat(sourceVal) : sourceVal;
      } else if (isObject(sourceVal)) {
        target[key] = isObject(targetVal) ? merge(targetVal, sourceVal) : sourceVal;
      } else if (Array.isArray(sourceVal)) {
        target[key] = Array.isArray(targetVal) ? targetVal.concat(sourceVal) : sourceVal;
      } else target[key] = source[key];
    }
  }

  return target;
}

module.exports = exports["default"];
});

unwrapExports(merge_1);

var isAbsent = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;

var _default = function _default(value) {
  return value == null;
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(isAbsent);

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    mapTag$6 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$6 = '[object Set]',
    stringTag$4 = '[object String]',
    symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$3:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$2:
      return object.name == other.name && object.message == other.message;

    case regexpTag$3:
    case stringTag$4:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$6:
      var convert = _mapToArray;

    case setTag$6:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$b.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var objectProto$f = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$f.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$2 : _getTag(object),
      othTag = othIsArr ? arrayTag$2 : _getTag(other);

  objTag = objTag == argsTag$3 ? objectTag$3 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$3 : othTag;

  var objIsObj = objTag == objectTag$3,
      othIsObj = othTag == objectTag$3,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$c.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$c.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = _baseIteratee(iteratee);

  _baseForOwn(object, function(value, key, object) {
    _baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

var mapValues_1 = mapValues;

/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */

function Cache(maxSize) {
  this._maxSize = maxSize;
  this.clear();
}
Cache.prototype.clear = function() {
  this._size = 0;
  this._values = {};
};
Cache.prototype.get = function(key) {
  return this._values[key]
};
Cache.prototype.set = function(key, value) {
  this._size >= this._maxSize && this.clear();
  if (!this._values.hasOwnProperty(key)) {
    this._size++;
  }
  return this._values[key] = value
};

var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
  DIGIT_REGEX = /^\d+$/,
  LEAD_DIGIT_REGEX = /^\d/,
  SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
  CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
  MAX_CACHE_SIZE = 512;

var contentSecurityPolicy = false,
  pathCache = new Cache(MAX_CACHE_SIZE),
  setCache = new Cache(MAX_CACHE_SIZE),
  getCache = new Cache(MAX_CACHE_SIZE);

try {
  new Function('');
} catch (error) {
  contentSecurityPolicy = true;
}

var propertyExpr = {
  Cache: Cache,

  expr: expr,

  split: split,

  normalizePath: normalizePath,

  setter: contentSecurityPolicy
    ? function(path) {
      var parts = normalizePath(path);
      return function(data, value) {
        return setterFallback(parts, data, value)
      }
    }
    : function(path) {
      return setCache.get(path) || setCache.set(
        path,
        new Function(
          'data, value',
          expr(path, 'data') + ' = value'
        )
      )
    },

  getter: contentSecurityPolicy
    ? function(path, safe) {
      var parts = normalizePath(path);
      return function(data) {
        return getterFallback(parts, safe, data)
      }
    }
    : function(path, safe) {
      var key = path + '_' + safe;
      return getCache.get(key) || getCache.set(
        key,
        new Function('data', 'return ' + expr(path, safe, 'data'))
      )
    },

  join: function(segments) {
    return segments.reduce(function(path, part) {
      return (
        path +
        (isQuoted(part) || DIGIT_REGEX.test(part)
          ? '[' + part + ']'
          : (path ? '.' : '') + part)
      )
    }, '')
  },

  forEach: function(path, cb, thisArg) {
    forEach(split(path), cb, thisArg);
  }
};

function setterFallback(parts, data, value) {
  var index = 0,
    len = parts.length;
  while (index < len - 1) {
    data = data[parts[index++]];
  }
  data[parts[index]] = value;
}

function getterFallback(parts, safe, data) {
  var index = 0,
    len = parts.length;
  while (index < len) {
    if (data != null || !safe) {
      data = data[parts[index++]];
    } else {
      return
    }
  }
  return data
}

function normalizePath(path) {
  return pathCache.get(path) || pathCache.set(
    path,
    split(path).map(function(part) {
      return part.replace(CLEAN_QUOTES_REGEX, '$2')
    })
  )
}

function split(path) {
  return path.match(SPLIT_REGEX)
}

function expr(expression, safe, param) {
  expression = expression || '';

  if (typeof safe === 'string') {
    param = safe;
    safe = false;
  }

  param = param || 'data';

  if (expression && expression.charAt(0) !== '[') expression = '.' + expression;

  return safe ? makeSafe(expression, param) : param + expression
}

function forEach(parts, iter, thisArg) {
  var len = parts.length,
    part,
    idx,
    isArray,
    isBracket;

  for (idx = 0; idx < len; idx++) {
    part = parts[idx];

    if (part) {
      if (shouldBeQuoted(part)) {
        part = '"' + part + '"';
      }

      isBracket = isQuoted(part);
      isArray = !isBracket && /^\d+$/.test(part);

      iter.call(thisArg, part, isBracket, isArray, idx, parts);
    }
  }
}

function isQuoted(str) {
  return (
    typeof str === 'string' && str && ["'", '"'].indexOf(str.charAt(0)) !== -1
  )
}

function makeSafe(path, param) {
  var result = param,
    parts = split(path),
    isLast;

  forEach(parts, function(part, isBracket, isArray, idx, parts) {
    isLast = idx === parts.length - 1;

    part = isBracket || isArray ? '[' + part + ']' : '.' + part;

    result += part + (!isLast ? ' || {})' : ')');
  });

  return new Array(parts.length + 1).join('(') + result
}

function hasLeadingNumber(part) {
  return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX)
}

function hasSpecialChars(part) {
  return SPEC_CHAR_REGEX.test(part)
}

function shouldBeQuoted(part) {
  return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part))
}

var Reference_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;



var validateName = function validateName(d) {
  if (typeof d !== 'string') throw new TypeError("ref's must be strings, got: " + d);
};

var Reference =
/*#__PURE__*/
function () {
  Reference.isRef = function isRef(value) {
    return !!(value && (value.__isYupRef || value instanceof Reference));
  };

  var _proto = Reference.prototype;

  _proto.toString = function toString() {
    return "Ref(" + this.key + ")";
  };

  function Reference(key, mapFn, options) {
    if (options === void 0) {
      options = {};
    }

    validateName(key);
    var prefix = options.contextPrefix || '$';

    if (typeof key === 'function') {
      key = '.';
    }

    this.key = key.trim();
    this.prefix = prefix;
    this.isContext = this.key.indexOf(prefix) === 0;
    this.isSelf = this.key === '.';
    this.path = this.isContext ? this.key.slice(this.prefix.length) : this.key;
    this._get = (0, propertyExpr.getter)(this.path, true);

    this.map = mapFn || function (value) {
      return value;
    };
  }

  _proto.resolve = function resolve() {
    return this;
  };

  _proto.cast = function cast(value, _ref) {
    var parent = _ref.parent,
        context = _ref.context;
    return this.getValue(parent, context);
  };

  _proto.getValue = function getValue(parent, context) {
    var isContext = this.isContext;

    var value = this._get(isContext ? context : parent || context || {});

    return this.map(value);
  };

  return Reference;
}();

exports.default = Reference;
Reference.prototype.__isYupRef = true;
module.exports = exports["default"];
});

unwrapExports(Reference_1);

var createValidation_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.createErrorFactory = createErrorFactory;
exports.default = createValidation;

var _objectWithoutPropertiesLoose2 = interopRequireDefault(objectWithoutPropertiesLoose);

var _extends2 = interopRequireDefault(_extends_1);

var _mapValues = interopRequireDefault(mapValues_1);

var _ValidationError = interopRequireDefault(ValidationError_1);

var _Reference = interopRequireDefault(Reference_1);



var formatError = _ValidationError.default.formatError;

var thenable = function thenable(p) {
  return p && typeof p.then === 'function' && typeof p.catch === 'function';
};

function runTest(testFn, ctx, value, sync) {
  var result = testFn.call(ctx, value);
  if (!sync) return Promise.resolve(result);

  if (thenable(result)) {
    throw new Error("Validation test of type: \"" + ctx.type + "\" returned a Promise during a synchronous validate. " + "This test will finish after the validate call has returned");
  }

  return synchronousPromise.SynchronousPromise.resolve(result);
}

function resolveParams(oldParams, newParams, resolve) {
  return (0, _mapValues.default)((0, _extends2.default)({}, oldParams, newParams), resolve);
}

function createErrorFactory(_ref) {
  var value = _ref.value,
      label = _ref.label,
      resolve = _ref.resolve,
      originalValue = _ref.originalValue,
      opts = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["value", "label", "resolve", "originalValue"]);
  return function createError(_temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$path = _ref2.path,
        path = _ref2$path === void 0 ? opts.path : _ref2$path,
        _ref2$message = _ref2.message,
        message = _ref2$message === void 0 ? opts.message : _ref2$message,
        _ref2$type = _ref2.type,
        type = _ref2$type === void 0 ? opts.name : _ref2$type,
        params = _ref2.params;

    params = (0, _extends2.default)({
      path: path,
      value: value,
      originalValue: originalValue,
      label: label
    }, resolveParams(opts.params, params, resolve));
    return (0, _extends2.default)(new _ValidationError.default(formatError(message, params), value, path, type), {
      params: params
    });
  };
}

function createValidation(options) {
  var name = options.name,
      message = options.message,
      test = options.test,
      params = options.params;

  function validate(_ref3) {
    var value = _ref3.value,
        path = _ref3.path,
        label = _ref3.label,
        options = _ref3.options,
        originalValue = _ref3.originalValue,
        sync = _ref3.sync,
        rest = (0, _objectWithoutPropertiesLoose2.default)(_ref3, ["value", "path", "label", "options", "originalValue", "sync"]);
    var parent = options.parent;

    var resolve = function resolve(value) {
      return _Reference.default.isRef(value) ? value.getValue(parent, options.context) : value;
    };

    var createError = createErrorFactory({
      message: message,
      path: path,
      value: value,
      originalValue: originalValue,
      params: params,
      label: label,
      resolve: resolve,
      name: name
    });
    var ctx = (0, _extends2.default)({
      path: path,
      parent: parent,
      type: name,
      createError: createError,
      resolve: resolve,
      options: options
    }, rest);
    return runTest(test, ctx, value, sync).then(function (validOrError) {
      if (_ValidationError.default.isError(validOrError)) throw validOrError;else if (!validOrError) throw createError();
    });
  }

  validate.OPTIONS = options;
  return validate;
}
});

unwrapExports(createValidation_1);
var createValidation_2 = createValidation_1.createErrorFactory;

var reach_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.getIn = getIn;
exports.default = void 0;



var _has = interopRequireDefault(has_1);

var trim = function trim(part) {
  return part.substr(0, part.length - 1).substr(1);
};

function getIn(schema, path, value, context) {
  var parent, lastPart, lastPartDebug; // if only one "value" arg then use it for both

  context = context || value;
  if (!path) return {
    parent: parent,
    parentPath: path,
    schema: schema.resolve({
      context: context,
      parent: parent,
      value: value
    })
  };
  (0, propertyExpr.forEach)(path, function (_part, isBracket, isArray) {
    var part = isBracket ? trim(_part) : _part;

    if (isArray || (0, _has.default)(schema, '_subType')) {
      // we skipped an array: foo[].bar
      var idx = isArray ? parseInt(part, 10) : 0;
      schema = schema.resolve({
        context: context,
        parent: parent,
        value: value
      })._subType;

      if (value) {
        if (isArray && idx >= value.length) {
          throw new Error("Yup.reach cannot resolve an array item at index: " + _part + ", in the path: " + path + ". " + "because there is no value at that index. ");
        }

        value = value[idx];
      }
    }

    if (!isArray) {
      schema = schema.resolve({
        context: context,
        parent: parent,
        value: value
      });
      if (!(0, _has.default)(schema, 'fields') || !(0, _has.default)(schema.fields, part)) throw new Error("The schema does not contain the path: " + path + ". " + ("(failed at: " + lastPartDebug + " which is a type: \"" + schema._type + "\") "));
      schema = schema.fields[part];
      parent = value;
      value = value && value[part];
      lastPart = part;
      lastPartDebug = isBracket ? '[' + _part + ']' : '.' + _part;
    }
  });

  if (schema) {
    schema = schema.resolve({
      context: context,
      parent: parent,
      value: value
    });
  }

  return {
    schema: schema,
    parent: parent,
    parentPath: lastPart
  };
}

var reach = function reach(obj, path, value, context) {
  return getIn(obj, path, value, context).schema;
};

var _default = reach;
exports.default = _default;
});

unwrapExports(reach_1);
var reach_2 = reach_1.getIn;

var mixed = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = SchemaType;

var _extends2 = interopRequireDefault(_extends_1);

var _has = interopRequireDefault(has_1);

var _cloneDeepWith = interopRequireDefault(cloneDeepWith_1);

var _toArray2 = interopRequireDefault(toArray_1);



var _Condition = interopRequireDefault(Condition);

var _runValidations = interopRequireDefault(runValidations_1);

var _merge = interopRequireDefault(merge_1);

var _isSchema = interopRequireDefault(isSchema);

var _isAbsent = interopRequireDefault(isAbsent);

var _createValidation = interopRequireDefault(createValidation_1);

var _printValue = interopRequireDefault(printValue_1);

var _Reference = interopRequireDefault(Reference_1);



var notEmpty = function notEmpty(value) {
  return !(0, _isAbsent.default)(value);
};

var RefSet =
/*#__PURE__*/
function () {
  function RefSet() {
    this.list = new Set();
    this.refs = new Map();
  }

  var _proto = RefSet.prototype;

  _proto.toArray = function toArray() {
    return (0, _toArray2.default)(this.list).concat((0, _toArray2.default)(this.refs.values()));
  };

  _proto.add = function add(value) {
    _Reference.default.isRef(value) ? this.refs.set(value.key, value) : this.list.add(value);
  };

  _proto.delete = function _delete(value) {
    _Reference.default.isRef(value) ? this.refs.delete(value.key, value) : this.list.delete(value);
  };

  _proto.has = function has(value, resolve) {
    if (this.list.has(value)) return true;
    var item,
        values = this.refs.values();

    while (item = values.next(), !item.done) {
      if (resolve(item.value) === value) return true;
    }

    return false;
  };

  return RefSet;
}();

function SchemaType(options) {
  var _this = this;

  if (options === void 0) {
    options = {};
  }

  if (!(this instanceof SchemaType)) return new SchemaType();
  this._deps = [];
  this._conditions = [];
  this._options = {
    abortEarly: true,
    recursive: true
  };
  this._exclusive = Object.create(null);
  this._whitelist = new RefSet();
  this._blacklist = new RefSet();
  this.tests = [];
  this.transforms = [];
  this.withMutation(function () {
    _this.typeError(locale.mixed.notType);
  });
  if ((0, _has.default)(options, 'default')) this._defaultDefault = options.default;
  this._type = options.type || 'mixed';
}

var proto = SchemaType.prototype = {
  __isYupSchema__: true,
  constructor: SchemaType,
  clone: function clone() {
    var _this2 = this;

    if (this._mutate) return this; // if the nested value is a schema we can skip cloning, since
    // they are already immutable

    return (0, _cloneDeepWith.default)(this, function (value) {
      if ((0, _isSchema.default)(value) && value !== _this2) return value;
    });
  },
  label: function label(_label) {
    var next = this.clone();
    next._label = _label;
    return next;
  },
  meta: function meta(obj) {
    if (arguments.length === 0) return this._meta;
    var next = this.clone();
    next._meta = (0, _extends2.default)(next._meta || {}, obj);
    return next;
  },
  withMutation: function withMutation(fn) {
    this._mutate = true;
    var result = fn(this);
    this._mutate = false;
    return result;
  },
  concat: function concat(schema) {
    if (!schema) return this;
    if (schema._type !== this._type && this._type !== 'mixed') throw new TypeError("You cannot `concat()` schema's of different types: " + this._type + " and " + schema._type);
    var cloned = this.clone();
    var next = (0, _merge.default)(this.clone(), schema.clone()); // undefined isn't merged over, but is a valid value for default

    if ((0, _has.default)(schema, '_default')) next._default = schema._default;
    next.tests = cloned.tests;
    next._exclusive = cloned._exclusive; // manually add the new tests to ensure
    // the deduping logic is consistent

    schema.tests.forEach(function (fn) {
      next = next.test(fn.OPTIONS);
    });
    next._type = schema._type;
    return next;
  },
  isType: function isType(v) {
    if (this._nullable && v === null) return true;
    return !this._typeCheck || this._typeCheck(v);
  },
  resolve: function resolve(_ref) {
    var context = _ref.context,
        parent = _ref.parent;

    if (this._conditions.length) {
      return this._conditions.reduce(function (schema, match) {
        return match.resolve(schema, match.getValue(parent, context));
      }, this);
    }

    return this;
  },
  cast: function cast(value, options) {
    if (options === void 0) {
      options = {};
    }

    var resolvedSchema = this.resolve(options);

    var result = resolvedSchema._cast(value, options);

    if (value !== undefined && options.assert !== false && resolvedSchema.isType(result) !== true) {
      var formattedValue = (0, _printValue.default)(value);
      var formattedResult = (0, _printValue.default)(result);
      throw new TypeError("The value of " + (options.path || 'field') + " could not be cast to a value " + ("that satisfies the schema type: \"" + resolvedSchema._type + "\". \n\n") + ("attempted value: " + formattedValue + " \n") + (formattedResult !== formattedValue ? "result of cast: " + formattedResult : ''));
    }

    return result;
  },
  _cast: function _cast(rawValue) {
    var _this3 = this;

    var value = rawValue === undefined ? rawValue : this.transforms.reduce(function (value, fn) {
      return fn.call(_this3, value, rawValue);
    }, rawValue);

    if (value === undefined && (0, _has.default)(this, '_default')) {
      value = this.default();
    }

    return value;
  },
  _validate: function _validate(_value, options) {
    var _this4 = this;

    if (options === void 0) {
      options = {};
    }

    var value = _value;
    var originalValue = options.originalValue != null ? options.originalValue : _value;

    var isStrict = this._option('strict', options);

    var endEarly = this._option('abortEarly', options);

    var sync = options.sync;
    var path = options.path;
    var label = this._label;

    if (!isStrict) {
      value = this._cast(value, (0, _extends2.default)({
        assert: false
      }, options));
    } // value is cast, we can check if it meets type requirements


    var validationParams = {
      value: value,
      path: path,
      schema: this,
      options: options,
      label: label,
      originalValue: originalValue,
      sync: sync
    };
    var initialTests = [];
    if (this._typeError) initialTests.push(this._typeError(validationParams));
    if (this._whitelistError) initialTests.push(this._whitelistError(validationParams));
    if (this._blacklistError) initialTests.push(this._blacklistError(validationParams));
    return (0, _runValidations.default)({
      validations: initialTests,
      endEarly: endEarly,
      value: value,
      path: path,
      sync: sync
    }).then(function (value) {
      return (0, _runValidations.default)({
        path: path,
        sync: sync,
        value: value,
        endEarly: endEarly,
        validations: _this4.tests.map(function (fn) {
          return fn(validationParams);
        })
      });
    });
  },
  validate: function validate(value, options) {
    if (options === void 0) {
      options = {};
    }

    var schema = this.resolve(options);
    return schema._validate(value, options);
  },
  validateSync: function validateSync(value, options) {
    if (options === void 0) {
      options = {};
    }

    var schema = this.resolve(options);
    var result, err;

    schema._validate(value, (0, _extends2.default)({}, options, {
      sync: true
    })).then(function (r) {
      return result = r;
    }).catch(function (e) {
      return err = e;
    });

    if (err) throw err;
    return result;
  },
  isValid: function isValid(value, options) {
    return this.validate(value, options).then(function () {
      return true;
    }).catch(function (err) {
      if (err.name === 'ValidationError') return false;
      throw err;
    });
  },
  isValidSync: function isValidSync(value, options) {
    try {
      this.validateSync(value, (0, _extends2.default)({}, options));
      return true;
    } catch (err) {
      if (err.name === 'ValidationError') return false;
      throw err;
    }
  },
  getDefault: function getDefault(options) {
    if (options === void 0) {
      options = {};
    }

    var schema = this.resolve(options);
    return schema.default();
  },
  default: function _default(def) {
    if (arguments.length === 0) {
      var defaultValue = (0, _has.default)(this, '_default') ? this._default : this._defaultDefault;
      return typeof defaultValue === 'function' ? defaultValue.call(this) : (0, _cloneDeepWith.default)(defaultValue);
    }

    var next = this.clone();
    next._default = def;
    return next;
  },
  strict: function strict() {
    var next = this.clone();
    next._options.strict = true;
    return next;
  },
  required: function required(message) {
    if (message === void 0) {
      message = locale.mixed.required;
    }

    return this.test({
      message: message,
      name: 'required',
      test: notEmpty
    });
  },
  notRequired: function notRequired() {
    var next = this.clone();
    next.tests = next.tests.filter(function (test) {
      return test.OPTIONS.name !== 'required';
    });
    return next;
  },
  nullable: function nullable(value) {
    var next = this.clone();
    next._nullable = value === false ? false : true;
    return next;
  },
  transform: function transform(fn) {
    var next = this.clone();
    next.transforms.push(fn);
    return next;
  },

  /**
   * Adds a test function to the schema's queue of tests.
   * tests can be exclusive or non-exclusive.
   *
   * - exclusive tests, will replace any existing tests of the same name.
   * - non-exclusive: can be stacked
   *
   * If a non-exclusive test is added to a schema with an exclusive test of the same name
   * the exclusive test is removed and further tests of the same name will be stacked.
   *
   * If an exclusive test is added to a schema with non-exclusive tests of the same name
   * the previous tests are removed and further tests of the same name will replace each other.
   */
  test: function test() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var opts = args[0];

    if (args.length > 1) {
      var name = args[0],
          message = args[1],
          test = args[2];

      if (test == null) {
        test = message;
        message = locale.mixed.default;
      }

      opts = {
        name: name,
        test: test,
        message: message,
        exclusive: false
      };
    }

    if (typeof opts.test !== 'function') throw new TypeError('`test` is a required parameters');
    var next = this.clone();
    var validate = (0, _createValidation.default)(opts);
    var isExclusive = opts.exclusive || opts.name && next._exclusive[opts.name] === true;

    if (opts.exclusive && !opts.name) {
      throw new TypeError('Exclusive tests must provide a unique `name` identifying the test');
    }

    next._exclusive[opts.name] = !!opts.exclusive;
    next.tests = next.tests.filter(function (fn) {
      if (fn.OPTIONS.name === opts.name) {
        if (isExclusive) return false;
        if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
      }

      return true;
    });
    next.tests.push(validate);
    return next;
  },
  when: function when(keys, options) {
    var next = this.clone(),
        deps = [].concat(keys).map(function (key) {
      return new _Reference.default(key);
    });
    deps.forEach(function (dep) {
      if (!dep.isContext) next._deps.push(dep.key);
    });

    next._conditions.push(new _Condition.default(deps, options));

    return next;
  },
  typeError: function typeError(message) {
    var next = this.clone();
    next._typeError = (0, _createValidation.default)({
      message: message,
      name: 'typeError',
      test: function test(value) {
        if (value !== undefined && !this.schema.isType(value)) return this.createError({
          params: {
            type: this.schema._type
          }
        });
        return true;
      }
    });
    return next;
  },
  oneOf: function oneOf(enums, message) {
    if (message === void 0) {
      message = locale.mixed.oneOf;
    }

    var next = this.clone();
    enums.forEach(function (val) {
      next._whitelist.add(val);

      next._blacklist.delete(val);
    });
    next._whitelistError = (0, _createValidation.default)({
      message: message,
      name: 'oneOf',
      test: function test(value) {
        if (value === undefined) return true;
        var valids = this.schema._whitelist;
        return valids.has(value, this.resolve) ? true : this.createError({
          params: {
            values: valids.toArray().join(', ')
          }
        });
      }
    });
    return next;
  },
  notOneOf: function notOneOf(enums, message) {
    if (message === void 0) {
      message = locale.mixed.notOneOf;
    }

    var next = this.clone();
    enums.forEach(function (val) {
      next._blacklist.add(val);

      next._whitelist.delete(val);
    });
    next._blacklistError = (0, _createValidation.default)({
      message: message,
      name: 'notOneOf',
      test: function test(value) {
        var invalids = this.schema._blacklist;
        if (invalids.has(value, this.resolve)) return this.createError({
          params: {
            values: invalids.toArray().join(', ')
          }
        });
        return true;
      }
    });
    return next;
  },
  strip: function strip(_strip) {
    if (_strip === void 0) {
      _strip = true;
    }

    var next = this.clone();
    next._strip = _strip;
    return next;
  },
  _option: function _option(key, overrides) {
    return (0, _has.default)(overrides, key) ? overrides[key] : this._options[key];
  },
  describe: function describe() {
    var next = this.clone();
    return {
      type: next._type,
      meta: next._meta,
      label: next._label,
      tests: next.tests.map(function (fn) {
        return {
          name: fn.OPTIONS.name,
          params: fn.OPTIONS.params
        };
      }).filter(function (n, idx, list) {
        return list.findIndex(function (c) {
          return c.name === n.name;
        }) === idx;
      })
    };
  }
};
var _arr = ['validate', 'validateSync'];

var _loop = function _loop() {
  var method = _arr[_i];

  proto[method + "At"] = function (path, value, options) {
    if (options === void 0) {
      options = {};
    }

    var _getIn = (0, reach_1.getIn)(this, path, value, options.context),
        parent = _getIn.parent,
        parentPath = _getIn.parentPath,
        schema = _getIn.schema;

    return schema[method](parent && parent[parentPath], (0, _extends2.default)({}, options, {
      parent: parent,
      path: path
    }));
  };
};

for (var _i = 0; _i < _arr.length; _i++) {
  _loop();
}

var _arr2 = ['equals', 'is'];

for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
  var alias = _arr2[_i2];
  proto[alias] = proto.oneOf;
}

var _arr3 = ['not', 'nope'];

for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
  var _alias = _arr3[_i3];
  proto[_alias] = proto.notOneOf;
}

module.exports = exports["default"];
});

unwrapExports(mixed);

var inherits_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = inherits;

var _extends2 = interopRequireDefault(_extends_1);

function inherits(ctor, superCtor, spec) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  (0, _extends2.default)(ctor.prototype, spec);
}

module.exports = exports["default"];
});

unwrapExports(inherits_1);

var boolean_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _inherits = interopRequireDefault(inherits_1);

var _mixed = interopRequireDefault(mixed);

var _default = BooleanSchema;
exports.default = _default;

function BooleanSchema() {
  var _this = this;

  if (!(this instanceof BooleanSchema)) return new BooleanSchema();

  _mixed.default.call(this, {
    type: 'boolean'
  });

  this.withMutation(function () {
    _this.transform(function (value) {
      if (!this.isType(value)) {
        if (/^(true|1)$/i.test(value)) return true;
        if (/^(false|0)$/i.test(value)) return false;
      }

      return value;
    });
  });
}

(0, _inherits.default)(BooleanSchema, _mixed.default, {
  _typeCheck: function _typeCheck(v) {
    if (v instanceof Boolean) v = v.valueOf();
    return typeof v === 'boolean';
  }
});
module.exports = exports["default"];
});

unwrapExports(boolean_1);

var string = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = StringSchema;

var _inherits = interopRequireDefault(inherits_1);

var _mixed = interopRequireDefault(mixed);



var _isAbsent = interopRequireDefault(isAbsent);

// eslint-disable-next-line
var rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-next-line

var rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

var hasLength = function hasLength(value) {
  return (0, _isAbsent.default)(value) || value.length > 0;
};

var isTrimmed = function isTrimmed(value) {
  return (0, _isAbsent.default)(value) || value === value.trim();
};

function StringSchema() {
  var _this = this;

  if (!(this instanceof StringSchema)) return new StringSchema();

  _mixed.default.call(this, {
    type: 'string'
  });

  this.withMutation(function () {
    _this.transform(function (value) {
      if (this.isType(value)) return value;
      return value != null && value.toString ? value.toString() : value;
    });
  });
}

(0, _inherits.default)(StringSchema, _mixed.default, {
  _typeCheck: function _typeCheck(value) {
    if (value instanceof String) value = value.valueOf();
    return typeof value === 'string';
  },
  required: function required(message) {
    if (message === void 0) {
      message = locale.mixed.required;
    }

    var next = _mixed.default.prototype.required.call(this, message);

    return next.test({
      message: message,
      name: 'required',
      test: hasLength
    });
  },
  length: function length(_length, message) {
    if (message === void 0) {
      message = locale.string.length;
    }

    return this.test({
      message: message,
      name: 'length',
      exclusive: true,
      params: {
        length: _length
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value.length === this.resolve(_length);
      }
    });
  },
  min: function min(_min, message) {
    if (message === void 0) {
      message = locale.string.min;
    }

    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        min: _min
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value.length >= this.resolve(_min);
      }
    });
  },
  max: function max(_max, message) {
    if (message === void 0) {
      message = locale.string.max;
    }

    return this.test({
      name: 'max',
      exclusive: true,
      message: message,
      params: {
        max: _max
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value.length <= this.resolve(_max);
      }
    });
  },
  matches: function matches(regex, options) {
    var excludeEmptyString = false;
    var message;

    if (options) {
      if (options.message || options.hasOwnProperty('excludeEmptyString')) {
        excludeEmptyString = options.excludeEmptyString;
        message = options.message;
      } else message = options;
    }

    return this.test({
      message: message || locale.string.matches,
      params: {
        regex: regex
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value === '' && excludeEmptyString || regex.test(value);
      }
    });
  },
  email: function email(message) {
    if (message === void 0) {
      message = locale.string.email;
    }

    return this.matches(rEmail, {
      message: message,
      excludeEmptyString: true
    });
  },
  url: function url(message) {
    if (message === void 0) {
      message = locale.string.url;
    }

    return this.matches(rUrl, {
      message: message,
      excludeEmptyString: true
    });
  },
  //-- transforms --
  ensure: function ensure() {
    return this.default('').transform(function (val) {
      return val === null ? '' : val;
    });
  },
  trim: function trim(message) {
    if (message === void 0) {
      message = locale.string.trim;
    }

    return this.transform(function (val) {
      return val != null ? val.trim() : val;
    }).test({
      message: message,
      name: 'trim',
      test: isTrimmed
    });
  },
  lowercase: function lowercase(message) {
    if (message === void 0) {
      message = locale.string.lowercase;
    }

    return this.transform(function (value) {
      return !(0, _isAbsent.default)(value) ? value.toLowerCase() : value;
    }).test({
      message: message,
      name: 'string_case',
      exclusive: true,
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value === value.toLowerCase();
      }
    });
  },
  uppercase: function uppercase(message) {
    if (message === void 0) {
      message = locale.string.uppercase;
    }

    return this.transform(function (value) {
      return !(0, _isAbsent.default)(value) ? value.toUpperCase() : value;
    }).test({
      message: message,
      name: 'string_case',
      exclusive: true,
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value === value.toUpperCase();
      }
    });
  }
});
module.exports = exports["default"];
});

unwrapExports(string);

var number = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = NumberSchema;

var _inherits = interopRequireDefault(inherits_1);

var _mixed = interopRequireDefault(mixed);



var _isAbsent = interopRequireDefault(isAbsent);

var isNaN = function isNaN(value) {
  return value != +value;
};

var isInteger = function isInteger(val) {
  return (0, _isAbsent.default)(val) || val === (val | 0);
};

function NumberSchema() {
  var _this = this;

  if (!(this instanceof NumberSchema)) return new NumberSchema();

  _mixed.default.call(this, {
    type: 'number'
  });

  this.withMutation(function () {
    _this.transform(function (value) {
      var parsed = value;

      if (typeof parsed === 'string') {
        parsed = parsed.replace(/\s/g, '');
        if (parsed === '') return NaN; // don't use parseFloat to avoid positives on alpha-numeric strings

        parsed = +parsed;
      }

      if (this.isType(parsed)) return parsed;
      return parseFloat(parsed);
    });
  });
}

(0, _inherits.default)(NumberSchema, _mixed.default, {
  _typeCheck: function _typeCheck(value) {
    if (value instanceof Number) value = value.valueOf();
    return typeof value === 'number' && !isNaN(value);
  },
  min: function min(_min, message) {
    if (message === void 0) {
      message = locale.number.min;
    }

    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        min: _min
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value >= this.resolve(_min);
      }
    });
  },
  max: function max(_max, message) {
    if (message === void 0) {
      message = locale.number.max;
    }

    return this.test({
      message: message,
      name: 'max',
      exclusive: true,
      params: {
        max: _max
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value <= this.resolve(_max);
      }
    });
  },
  lessThan: function lessThan(less, message) {
    if (message === void 0) {
      message = locale.number.lessThan;
    }

    return this.test({
      message: message,
      name: 'max',
      exclusive: true,
      params: {
        less: less
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value < this.resolve(less);
      }
    });
  },
  moreThan: function moreThan(more, message) {
    if (message === void 0) {
      message = locale.number.moreThan;
    }

    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        more: more
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value > this.resolve(more);
      }
    });
  },
  positive: function positive(msg) {
    if (msg === void 0) {
      msg = locale.number.positive;
    }

    return this.moreThan(0, msg);
  },
  negative: function negative(msg) {
    if (msg === void 0) {
      msg = locale.number.negative;
    }

    return this.lessThan(0, msg);
  },
  integer: function integer(message) {
    if (message === void 0) {
      message = locale.number.integer;
    }

    return this.test({
      name: 'integer',
      message: message,
      test: isInteger
    });
  },
  truncate: function truncate() {
    return this.transform(function (value) {
      return !(0, _isAbsent.default)(value) ? value | 0 : value;
    });
  },
  round: function round(method) {
    var avail = ['ceil', 'floor', 'round', 'trunc'];
    method = method && method.toLowerCase() || 'round'; // this exists for symemtry with the new Math.trunc

    if (method === 'trunc') return this.truncate();
    if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
    return this.transform(function (value) {
      return !(0, _isAbsent.default)(value) ? Math[method](value) : value;
    });
  }
});
module.exports = exports["default"];
});

unwrapExports(number);

var isodate = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = parseIsoDate;

/* eslint-disable */

/**
 *
 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * NON-CONFORMANT EDITION.
 * © 2011 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
//              1 YYYY                 2 MM        3 DD              4 HH     5 mm        6 ss            7 msec         8 Z 9 ±    10 tzHH    11 tzmm
var isoReg = /^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

function parseIsoDate(date) {
  var numericKeys = [1, 4, 5, 6, 7, 10, 11],
      minutesOffset = 0,
      timestamp,
      struct;

  if (struct = isoReg.exec(date)) {
    // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
    for (var i = 0, k; k = numericKeys[i]; ++i) {
      struct[k] = +struct[k] || 0;
    } // allow undefined days and months


    struct[2] = (+struct[2] || 1) - 1;
    struct[3] = +struct[3] || 1; // allow arbitrary sub-second precision beyond milliseconds

    struct[7] = struct[7] ? String(struct[7]).substr(0, 3) : 0; // timestamps without timezone identifiers should be considered local time

    if ((struct[8] === undefined || struct[8] === '') && (struct[9] === undefined || struct[9] === '')) timestamp = +new Date(struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);else {
      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];
        if (struct[9] === '+') minutesOffset = 0 - minutesOffset;
      }

      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    }
  } else timestamp = Date.parse ? Date.parse(date) : NaN;

  return timestamp;
}

module.exports = exports["default"];
});

unwrapExports(isodate);

var date = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _mixed = interopRequireDefault(mixed);

var _inherits = interopRequireDefault(inherits_1);

var _isodate = interopRequireDefault(isodate);



var _isAbsent = interopRequireDefault(isAbsent);

var _Reference = interopRequireDefault(Reference_1);

var invalidDate = new Date('');

var isDate = function isDate(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]';
};

var _default = DateSchema;
exports.default = _default;

function DateSchema() {
  var _this = this;

  if (!(this instanceof DateSchema)) return new DateSchema();

  _mixed.default.call(this, {
    type: 'date'
  });

  this.withMutation(function () {
    _this.transform(function (value) {
      if (this.isType(value)) return value;
      value = (0, _isodate.default)(value);
      return value ? new Date(value) : invalidDate;
    });
  });
}

(0, _inherits.default)(DateSchema, _mixed.default, {
  _typeCheck: function _typeCheck(v) {
    return isDate(v) && !isNaN(v.getTime());
  },
  min: function min(_min, message) {
    if (message === void 0) {
      message = locale.date.min;
    }

    var limit = _min;

    if (!_Reference.default.isRef(limit)) {
      limit = this.cast(_min);
      if (!this._typeCheck(limit)) throw new TypeError('`min` must be a Date or a value that can be `cast()` to a Date');
    }

    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        min: _min
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value >= this.resolve(limit);
      }
    });
  },
  max: function max(_max, message) {
    if (message === void 0) {
      message = locale.date.max;
    }

    var limit = _max;

    if (!_Reference.default.isRef(limit)) {
      limit = this.cast(_max);
      if (!this._typeCheck(limit)) throw new TypeError('`max` must be a Date or a value that can be `cast()` to a Date');
    }

    return this.test({
      message: message,
      name: 'max',
      exclusive: true,
      params: {
        max: _max
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value <= this.resolve(limit);
      }
    });
  }
});
module.exports = exports["default"];
});

unwrapExports(date);

var interopRequireWildcard = createCommonjsModule(function (module) {
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

module.exports = _interopRequireWildcard;
});

unwrapExports(interopRequireWildcard);

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

var taggedTemplateLiteralLoose = _taggedTemplateLiteralLoose;

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

var _arrayReduce = arrayReduce;

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

var _basePropertyOf = basePropertyOf;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = _basePropertyOf(deburredLetters);

var _deburrLetter = deburrLetter;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange$2 = '\\u0300-\\u036f',
    reComboHalfMarksRange$2 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$2 = '\\u20d0-\\u20ff',
    rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2;

/** Used to compose unicode capture groups. */
var rsCombo$1 = '[' + rsComboRange$2 + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo$1, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString_1(string);
  return string && string.replace(reLatin, _deburrLetter).replace(reComboMark, '');
}

var deburr_1 = deburr;

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

var _asciiWords = asciiWords;

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

var _hasUnicodeWord = hasUnicodeWord;

/** Used to compose unicode character classes. */
var rsAstralRange$2 = '\\ud800-\\udfff',
    rsComboMarksRange$3 = '\\u0300-\\u036f',
    reComboHalfMarksRange$3 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$3 = '\\u20d0-\\u20ff',
    rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange$2 = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo$2 = '[' + rsComboRange$3 + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange$2 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz$1 = '\\ud83c[\\udffb-\\udfff]',
    rsModifier$1 = '(?:' + rsCombo$2 + '|' + rsFitz$1 + ')',
    rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
    rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ$2 = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod$1 = rsModifier$1 + '?',
    rsOptVar$1 = '[' + rsVarRange$2 + ']?',
    rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
    rsEmoji = '(?:' + [rsDingbat, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsSeq$1;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

var _unicodeWords = unicodeWords;

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString_1(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return _hasUnicodeWord(string) ? _unicodeWords(string) : _asciiWords(string);
  }
  return string.match(pattern) || [];
}

var words_1 = words;

/** Used to compose unicode capture groups. */
var rsApos$1 = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos$1, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return _arrayReduce(words_1(deburr_1(string).replace(reApos, '')), callback, '');
  };
}

var _createCompounder = createCompounder;

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = _createCompounder(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

var snakeCase_1 = snakeCase;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : _baseSlice(array, start, end);
}

var _castSlice = castSlice;

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString_1(string);

    var strSymbols = _hasUnicode(string)
      ? _stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? _castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

var _createCaseFirst = createCaseFirst;

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = _createCaseFirst('toUpperCase');

var upperFirst_1 = upperFirst;

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst_1(toString_1(string).toLowerCase());
}

var capitalize_1 = capitalize;

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = _createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize_1(word) : word);
});

var camelCase_1 = camelCase;

/**
 * The opposite of `_.mapValues`; this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapValues
 * @example
 *
 * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value;
 * });
 * // => { 'a1': 1, 'b2': 2 }
 */
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = _baseIteratee(iteratee);

  _baseForOwn(object, function(value, key, object) {
    _baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

var mapKeys_1 = mapKeys;

/**
 * Topological sorting function
 *
 * @param {Array} edges
 * @returns {Array}
 */

var toposort_1 = function(edges) {
  return toposort(uniqueNodes(edges), edges)
};

var array = toposort;

function toposort(nodes, edges) {
  var cursor = nodes.length
    , sorted = new Array(cursor)
    , visited = {}
    , i = cursor
    // Better data structures make algorithm much faster.
    , outgoingEdges = makeOutgoingEdges(edges)
    , nodesHash = makeNodesHash(nodes);

  // check for unknown nodes
  edges.forEach(function(edge) {
    if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
      throw new Error('Unknown node. There is an unknown node in the supplied edges.')
    }
  });

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, new Set());
  }

  return sorted

  function visit(node, i, predecessors) {
    if(predecessors.has(node)) {
      var nodeRep;
      try {
        nodeRep = ", node was:" + JSON.stringify(node);
      } catch(e) {
        nodeRep = "";
      }
      throw new Error('Cyclic dependency' + nodeRep)
    }

    if (!nodesHash.has(node)) {
      throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: '+JSON.stringify(node))
    }

    if (visited[i]) return;
    visited[i] = true;

    var outgoing = outgoingEdges.get(node) || new Set();
    outgoing = Array.from(outgoing);

    if (i = outgoing.length) {
      predecessors.add(node);
      do {
        var child = outgoing[--i];
        visit(child, nodesHash.get(child), predecessors);
      } while (i)
      predecessors.delete(node);
    }

    sorted[--cursor] = node;
  }
}

function uniqueNodes(arr){
  var res = new Set();
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i];
    res.add(edge[0]);
    res.add(edge[1]);
  }
  return Array.from(res)
}

function makeOutgoingEdges(arr){
  var edges = new Map();
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i];
    if (!edges.has(edge[0])) edges.set(edge[0], new Set());
    if (!edges.has(edge[1])) edges.set(edge[1], new Set());
    edges.get(edge[0]).add(edge[1]);
  }
  return edges
}

function makeNodesHash(arr){
  var res = new Map();
  for (var i = 0, len = arr.length; i < len; i++) {
    res.set(arr[i], i);
  }
  return res
}
toposort_1.array = array;

var sortFields_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = sortFields;

var _has = interopRequireDefault(has_1);

var _toposort = interopRequireDefault(toposort_1);



var _Reference = interopRequireDefault(Reference_1);

var _isSchema = interopRequireDefault(isSchema);

function sortFields(fields, excludes) {
  if (excludes === void 0) {
    excludes = [];
  }

  var edges = [],
      nodes = [];

  function addNode(depPath, key) {
    var node = (0, propertyExpr.split)(depPath)[0];
    if (!~nodes.indexOf(node)) nodes.push(node);
    if (!~excludes.indexOf(key + "-" + node)) edges.push([key, node]);
  }

  for (var key in fields) {
    if ((0, _has.default)(fields, key)) {
      var value = fields[key];
      if (!~nodes.indexOf(key)) nodes.push(key);
      if (_Reference.default.isRef(value) && !value.isContext) addNode(value.path, key);else if ((0, _isSchema.default)(value) && value._deps) value._deps.forEach(function (path) {
        return addNode(path, key);
      });
    }
  }

  return _toposort.default.array(nodes, edges).reverse();
}

module.exports = exports["default"];
});

unwrapExports(sortFields_1);

var sortByKeyOrder_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = sortByKeyOrder;

function findIndex(arr, err) {
  var idx = Infinity;
  arr.some(function (key, ii) {
    if (err.path.indexOf(key) !== -1) {
      idx = ii;
      return true;
    }
  });
  return idx;
}

function sortByKeyOrder(fields) {
  var keys = Object.keys(fields);
  return function (a, b) {
    return findIndex(keys, a) - findIndex(keys, b);
  };
}

module.exports = exports["default"];
});

unwrapExports(sortByKeyOrder_1);

var makePath_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = makePath;

function makePath(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var path = strings.reduce(function (str, next) {
    var value = values.shift();
    return str + (value == null ? '' : value) + next;
  });
  return path.replace(/^\./, '');
}

module.exports = exports["default"];
});

unwrapExports(makePath_1);

var object = createCommonjsModule(function (module, exports) {





exports.__esModule = true;
exports.default = ObjectSchema;

var _taggedTemplateLiteralLoose2 = interopRequireDefault(taggedTemplateLiteralLoose);

var _extends2 = interopRequireDefault(_extends_1);

var _has = interopRequireDefault(has_1);

var _snakeCase2 = interopRequireDefault(snakeCase_1);

var _camelCase2 = interopRequireDefault(camelCase_1);

var _mapKeys = interopRequireDefault(mapKeys_1);

var _mapValues = interopRequireDefault(mapValues_1);



var _mixed = interopRequireDefault(mixed);



var _sortFields = interopRequireDefault(sortFields_1);

var _sortByKeyOrder = interopRequireDefault(sortByKeyOrder_1);

var _inherits = interopRequireDefault(inherits_1);

var _makePath = interopRequireDefault(makePath_1);

var _runValidations = interopRequireWildcard(runValidations_1);

function _templateObject2() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["", ".", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["", ".", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var isObject = function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

function unknown(ctx, value) {
  var known = Object.keys(ctx.fields);
  return Object.keys(value).filter(function (key) {
    return known.indexOf(key) === -1;
  });
}

function ObjectSchema(spec) {
  var _this2 = this;

  if (!(this instanceof ObjectSchema)) return new ObjectSchema(spec);

  _mixed.default.call(this, {
    type: 'object',
    default: function _default() {
      var _this = this;

      if (!this._nodes.length) return undefined;
      var dft = {};

      this._nodes.forEach(function (key) {
        dft[key] = _this.fields[key].default ? _this.fields[key].default() : undefined;
      });

      return dft;
    }
  });

  this.fields = Object.create(null);
  this._nodes = [];
  this._excludedEdges = [];
  this.withMutation(function () {
    _this2.transform(function coerce(value) {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch (err) {
          value = null;
        }
      }

      if (this.isType(value)) return value;
      return null;
    });

    if (spec) {
      _this2.shape(spec);
    }
  });
}

(0, _inherits.default)(ObjectSchema, _mixed.default, {
  _typeCheck: function _typeCheck(value) {
    return isObject(value) || typeof value === 'function';
  },
  _cast: function _cast(_value, options) {
    var _this3 = this;

    if (options === void 0) {
      options = {};
    }

    var value = _mixed.default.prototype._cast.call(this, _value, options); //should ignore nulls here


    if (value === undefined) return this.default();
    if (!this._typeCheck(value)) return value;
    var fields = this.fields;
    var strip = this._option('stripUnknown', options) === true;

    var props = this._nodes.concat(Object.keys(value).filter(function (v) {
      return _this3._nodes.indexOf(v) === -1;
    }));

    var intermediateValue = {}; // is filled during the transform below

    var innerOptions = (0, _extends2.default)({}, options, {
      parent: intermediateValue,
      __validating: false
    });
    var isChanged = false;
    props.forEach(function (prop) {
      var field = fields[prop];
      var exists = (0, _has.default)(value, prop);

      if (field) {
        var fieldValue;
        var strict = field._options && field._options.strict; // safe to mutate since this is fired in sequence

        innerOptions.path = (0, _makePath.default)(_templateObject(), options.path, prop);
        innerOptions.value = value[prop];
        field = field.resolve(innerOptions);

        if (field._strip === true) {
          isChanged = isChanged || prop in value;
          return;
        }

        fieldValue = !options.__validating || !strict ? field.cast(value[prop], innerOptions) : value[prop];
        if (fieldValue !== undefined) intermediateValue[prop] = fieldValue;
      } else if (exists && !strip) intermediateValue[prop] = value[prop];

      if (intermediateValue[prop] !== value[prop]) isChanged = true;
    });
    return isChanged ? intermediateValue : value;
  },
  _validate: function _validate(_value, opts) {
    var _this4 = this;

    if (opts === void 0) {
      opts = {};
    }

    var endEarly, recursive;
    var sync = opts.sync;
    var errors = [];
    var originalValue = opts.originalValue != null ? opts.originalValue : _value;
    endEarly = this._option('abortEarly', opts);
    recursive = this._option('recursive', opts);
    opts = (0, _extends2.default)({}, opts, {
      __validating: true,
      originalValue: originalValue
    });
    return _mixed.default.prototype._validate.call(this, _value, opts).catch((0, _runValidations.propagateErrors)(endEarly, errors)).then(function (value) {
      if (!recursive || !isObject(value)) {
        // only iterate though actual objects
        if (errors.length) throw errors[0];
        return value;
      }

      originalValue = originalValue || value;

      var validations = _this4._nodes.map(function (key) {
        var path = (0, _makePath.default)(_templateObject2(), opts.path, key);
        var field = _this4.fields[key];
        var innerOptions = (0, _extends2.default)({}, opts, {
          path: path,
          parent: value,
          originalValue: originalValue[key]
        });

        if (field && field.validate) {
          // inner fields are always strict:
          // 1. this isn't strict so the casting will also have cast inner values
          // 2. this is strict in which case the nested values weren't cast either
          innerOptions.strict = true;
          return field.validate(value[key], innerOptions);
        }

        return Promise.resolve(true);
      });

      return (0, _runValidations.default)({
        sync: sync,
        validations: validations,
        value: value,
        errors: errors,
        endEarly: endEarly,
        path: opts.path,
        sort: (0, _sortByKeyOrder.default)(_this4.fields)
      });
    });
  },
  concat: function concat(schema) {
    var next = _mixed.default.prototype.concat.call(this, schema);

    next._nodes = (0, _sortFields.default)(next.fields, next._excludedEdges);
    return next;
  },
  shape: function shape(schema, excludes) {
    if (excludes === void 0) {
      excludes = [];
    }

    var next = this.clone();
    var fields = (0, _extends2.default)(next.fields, schema);
    next.fields = fields;

    if (excludes.length) {
      if (!Array.isArray(excludes[0])) excludes = [excludes];
      var keys = excludes.map(function (_ref) {
        var first = _ref[0],
            second = _ref[1];
        return first + "-" + second;
      });
      next._excludedEdges = next._excludedEdges.concat(keys);
    }

    next._nodes = (0, _sortFields.default)(fields, next._excludedEdges);
    return next;
  },
  from: function from(_from, to, alias) {
    var fromGetter = (0, propertyExpr.getter)(_from, true);
    return this.transform(function (obj) {
      if (obj == null) return obj;
      var newObj = obj;

      if ((0, _has.default)(obj, _from)) {
        newObj = (0, _extends2.default)({}, obj);
        if (!alias) delete newObj[_from];
        newObj[to] = fromGetter(obj);
      }

      return newObj;
    });
  },
  noUnknown: function noUnknown(noAllow, message) {
    if (noAllow === void 0) {
      noAllow = true;
    }

    if (message === void 0) {
      message = locale.object.noUnknown;
    }

    if (typeof noAllow === 'string') {
      message = noAllow;
      noAllow = true;
    }

    var next = this.test({
      name: 'noUnknown',
      exclusive: true,
      message: message,
      test: function test(value) {
        return value == null || !noAllow || unknown(this.schema, value).length === 0;
      }
    });
    if (noAllow) next._options.stripUnknown = true;
    return next;
  },
  transformKeys: function transformKeys(fn) {
    return this.transform(function (obj) {
      return obj && (0, _mapKeys.default)(obj, function (_, key) {
        return fn(key);
      });
    });
  },
  camelCase: function camelCase() {
    return this.transformKeys(_camelCase2.default);
  },
  snakeCase: function snakeCase() {
    return this.transformKeys(_snakeCase2.default);
  },
  constantCase: function constantCase() {
    return this.transformKeys(function (key) {
      return (0, _snakeCase2.default)(key).toUpperCase();
    });
  },
  describe: function describe() {
    var base = _mixed.default.prototype.describe.call(this);

    base.fields = (0, _mapValues.default)(this.fields, function (value) {
      return value.describe();
    });
    return base;
  }
});
module.exports = exports["default"];
});

unwrapExports(object);

var array$1 = createCommonjsModule(function (module, exports) {





exports.__esModule = true;
exports.default = void 0;

var _extends2 = interopRequireDefault(_extends_1);

var _taggedTemplateLiteralLoose2 = interopRequireDefault(taggedTemplateLiteralLoose);

var _inherits = interopRequireDefault(inherits_1);

var _isAbsent = interopRequireDefault(isAbsent);

var _isSchema = interopRequireDefault(isSchema);

var _makePath = interopRequireDefault(makePath_1);

var _printValue = interopRequireDefault(printValue_1);

var _mixed = interopRequireDefault(mixed);



var _runValidations = interopRequireWildcard(runValidations_1);

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["", "[", "]"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var hasLength = function hasLength(value) {
  return !(0, _isAbsent.default)(value) && value.length > 0;
};

var _default = ArraySchema;
exports.default = _default;

function ArraySchema(type) {
  var _this = this;

  if (!(this instanceof ArraySchema)) return new ArraySchema(type);

  _mixed.default.call(this, {
    type: 'array'
  }); // `undefined` specifically means uninitialized, as opposed to
  // "no subtype"


  this._subType = undefined;
  this.withMutation(function () {
    _this.transform(function (values) {
      if (typeof values === 'string') try {
        values = JSON.parse(values);
      } catch (err) {
        values = null;
      }
      return this.isType(values) ? values : null;
    });

    if (type) _this.of(type);
  });
}

(0, _inherits.default)(ArraySchema, _mixed.default, {
  _typeCheck: function _typeCheck(v) {
    return Array.isArray(v);
  },
  _cast: function _cast(_value, _opts) {
    var _this2 = this;

    var value = _mixed.default.prototype._cast.call(this, _value, _opts); //should ignore nulls here


    if (!this._typeCheck(value) || !this._subType) return value;
    var isChanged = false;
    var castArray = value.map(function (v) {
      var castElement = _this2._subType.cast(v, _opts);

      if (castElement !== v) {
        isChanged = true;
      }

      return castElement;
    });
    return isChanged ? castArray : value;
  },
  _validate: function _validate(_value, options) {
    var _this3 = this;

    if (options === void 0) {
      options = {};
    }

    var errors = [];
    var sync = options.sync;
    var path = options.path;
    var subType = this._subType;

    var endEarly = this._option('abortEarly', options);

    var recursive = this._option('recursive', options);

    var originalValue = options.originalValue != null ? options.originalValue : _value;
    return _mixed.default.prototype._validate.call(this, _value, options).catch((0, _runValidations.propagateErrors)(endEarly, errors)).then(function (value) {
      if (!recursive || !subType || !_this3._typeCheck(value)) {
        if (errors.length) throw errors[0];
        return value;
      }

      originalValue = originalValue || value;
      var validations = value.map(function (item, idx) {
        var path = (0, _makePath.default)(_templateObject(), options.path, idx); // object._validate note for isStrict explanation

        var innerOptions = (0, _extends2.default)({}, options, {
          path: path,
          strict: true,
          parent: value,
          originalValue: originalValue[idx]
        });
        if (subType.validate) return subType.validate(item, innerOptions);
        return true;
      });
      return (0, _runValidations.default)({
        sync: sync,
        path: path,
        value: value,
        errors: errors,
        endEarly: endEarly,
        validations: validations
      });
    });
  },
  of: function of(schema) {
    var next = this.clone();
    if (schema !== false && !(0, _isSchema.default)(schema)) throw new TypeError('`array.of()` sub-schema must be a valid yup schema, or `false` to negate a current sub-schema. ' + 'not: ' + (0, _printValue.default)(schema));
    next._subType = schema;
    return next;
  },
  required: function required(message) {
    if (message === void 0) {
      message = locale.mixed.required;
    }

    var next = _mixed.default.prototype.required.call(this, message);

    return next.test({
      message: message,
      name: 'required',
      test: hasLength
    });
  },
  min: function min(_min, message) {
    message = message || locale.array.min;
    return this.test({
      message: message,
      name: 'min',
      exclusive: true,
      params: {
        min: _min
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value.length >= this.resolve(_min);
      }
    });
  },
  max: function max(_max, message) {
    message = message || locale.array.max;
    return this.test({
      message: message,
      name: 'max',
      exclusive: true,
      params: {
        max: _max
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value.length <= this.resolve(_max);
      }
    });
  },
  ensure: function ensure() {
    var _this4 = this;

    return this.default(function () {
      return [];
    }).transform(function (val) {
      if (_this4.isType(val)) return val;
      return val === null ? [] : [].concat(val);
    });
  },
  compact: function compact(rejector) {
    var reject = !rejector ? function (v) {
      return !!v;
    } : function (v, i, a) {
      return !rejector(v, i, a);
    };
    return this.transform(function (values) {
      return values != null ? values.filter(reject) : values;
    });
  },
  describe: function describe() {
    var base = _mixed.default.prototype.describe.call(this);

    if (this._subType) base.innerType = this._subType.describe();
    return base;
  }
});
module.exports = exports["default"];
});

unwrapExports(array$1);

var Lazy_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _objectWithoutPropertiesLoose2 = interopRequireDefault(objectWithoutPropertiesLoose);

var _isSchema = interopRequireDefault(isSchema);

var Lazy =
/*#__PURE__*/
function () {
  function Lazy(mapFn) {
    this._resolve = function () {
      var schema = mapFn.apply(void 0, arguments);
      if (!(0, _isSchema.default)(schema)) throw new TypeError('lazy() functions must return a valid schema');
      return schema;
    };
  }

  var _proto = Lazy.prototype;

  _proto.resolve = function resolve(_ref) {
    var value = _ref.value,
        rest = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["value"]);
    return this._resolve(value, rest);
  };

  _proto.cast = function cast(value, options) {
    return this._resolve(value, options).cast(value, options);
  };

  _proto.validate = function validate(value, options) {
    return this._resolve(value, options).validate(value, options);
  };

  _proto.validateSync = function validateSync(value, options) {
    return this._resolve(value, options).validateSync(value, options);
  };

  _proto.validateAt = function validateAt(path, value, options) {
    return this._resolve(value, options).validateAt(path, value, options);
  };

  _proto.validateSyncAt = function validateSyncAt(path, value, options) {
    return this._resolve(value, options).validateSyncAt(path, value, options);
  };

  return Lazy;
}();

Lazy.prototype.__isYupSchema__ = true;
var _default = Lazy;
exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(Lazy_1);

var setLocale_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = setLocale;

var _locale = interopRequireDefault(locale);

function setLocale(custom) {
  Object.keys(custom).forEach(function (type) {
    Object.keys(custom[type]).forEach(function (method) {
      _locale.default[type][method] = custom[type][method];
    });
  });
}

module.exports = exports["default"];
});

unwrapExports(setLocale_1);

var lib$1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.addMethod = addMethod;
exports.lazy = exports.ref = exports.boolean = void 0;

var _mixed = interopRequireDefault(mixed);

exports.mixed = _mixed.default;

var _boolean = interopRequireDefault(boolean_1);

exports.bool = _boolean.default;

var _string = interopRequireDefault(string);

exports.string = _string.default;

var _number = interopRequireDefault(number);

exports.number = _number.default;

var _date = interopRequireDefault(date);

exports.date = _date.default;

var _object = interopRequireDefault(object);

exports.object = _object.default;

var _array = interopRequireDefault(array$1);

exports.array = _array.default;

var _Reference = interopRequireDefault(Reference_1);

var _Lazy = interopRequireDefault(Lazy_1);

var _ValidationError = interopRequireDefault(ValidationError_1);

exports.ValidationError = _ValidationError.default;

var _reach = interopRequireDefault(reach_1);

exports.reach = _reach.default;

var _isSchema = interopRequireDefault(isSchema);

exports.isSchema = _isSchema.default;

var _setLocale = interopRequireDefault(setLocale_1);

exports.setLocale = _setLocale.default;
var boolean = _boolean.default;
exports.boolean = boolean;

var ref = function ref(key, options) {
  return new _Reference.default(key, options);
};

exports.ref = ref;

var lazy = function lazy(fn) {
  return new _Lazy.default(fn);
};

exports.lazy = lazy;

function addMethod(schemaType, name, fn) {
  if (!schemaType || !(0, _isSchema.default)(schemaType.prototype)) throw new TypeError('You must provide a yup schema constructor function');
  if (typeof name !== 'string') throw new TypeError('A Method name must be provided');
  if (typeof fn !== 'function') throw new TypeError('Method function must be provided');
  schemaType.prototype[name] = fn;
}
});

unwrapExports(lib$1);
var lib_1$1 = lib$1.addMethod;
var lib_2$1 = lib$1.lazy;
var lib_3$1 = lib$1.ref;
var lib_4$1 = lib$1.mixed;
var lib_5 = lib$1.bool;
var lib_6 = lib$1.string;
var lib_7 = lib$1.number;
var lib_8 = lib$1.date;
var lib_9 = lib$1.object;
var lib_10 = lib$1.array;
var lib_11 = lib$1.ValidationError;
var lib_12 = lib$1.reach;
var lib_13 = lib$1.isSchema;
var lib_14 = lib$1.setLocale;

var fileSchema = lib_9()
    .shape({
    name: lib_6().required(),
    mimeType: lib_6().required(),
    data: lib_6().required(),
    signature: lib_6(),
})
    .required()
    .noUnknown(true)
    .strict(true);
var validateFile = function (file) {
    return new Promise(function (resolve, reject) {
        fileSchema
            .validate(file)
            .then(function () {
            resolve();
        })
            .catch(function (err) {
            reject(err);
        });
    });
};
var dpySchema = lib_9()
    .shape({
    name: lib_6().required(),
    mimeType: lib_6()
        .matches(/application\/dappy/)
        .required(),
    data: lib_6().required(),
    signature: lib_6(),
})
    .required()
    .noUnknown(true)
    .strict(true);

var getNodeIndex = function (node) {
    return node.ip + "---" + node.host;
};

var readDataorBagData = function (registryUri, fileId) {
    // read bag data if fileId
    if (fileId) {
        return src_11(registryUri, { pursesIds: [fileId] });
    }
    // read contract values { registryUri: ..., nonce: ...} if no file ID
    return src_9(registryUri);
};
var registerDappyProtocol = function (session, getState) {
    session.protocol.registerBufferProtocol('dappy', function (request, callback) {
        var valid = false;
        var url = request.url;
        if (validateSearchWithProtocol(url)) {
            valid = true;
        }
        /*
            Shortcut notation
            change dappy://aaa?page=123 to dappy://betanetwork/aaa?page=123
          */
        if (!valid && validateShortcutSearchWithProtocol(url)) {
            try {
                var randomId_1 = '';
                var userAgent = request.headers['User-Agent'];
                var io = userAgent.indexOf('randomId=');
                randomId_1 = userAgent.substring(io + 'randomId='.length);
                var browserViews_1 = getBrowserViewsMain(getState());
                var browserViewId = Object.keys(browserViews_1).find(function (browserViewId) { return browserViews_1[browserViewId].randomId === randomId_1; });
                var chainId_1 = browserViews_1[browserViewId].address.split('/')[0];
                url = url.replace('dappy://', 'dappy://' + chainId_1 + '/');
                if (!validateSearchWithProtocol(url)) {
                    valid = true;
                }
            }
            catch (e) { }
        }
        // todo if multi, limit to n unforgeable names
        var multipleResources = false;
        var exploreDeploys = false;
        if (url.includes('explore-deploys')) {
            valid = true;
            exploreDeploys = true;
        }
        else if (url.includes('%2C')) {
            valid = true;
            multipleResources = true;
        }
        if (!valid) {
            console.error('Wrong dappy url, must be dappy://aaa/bbb or dappy://aaa/bbb.yy,ccc.aa,ddd');
            callback();
            return;
        }
        var split = url.replace('dappy://', '').split('/');
        var chainId = split[0];
        // todo
        // how to return errors ?
        var blockchains = getBlockchains$1(getState());
        var blockchain = blockchains[chainId];
        if (!blockchain) {
            console.error('[dapp] blockchain not found');
            callback();
            return;
        }
        var indexes = blockchain.nodes.filter(function (n) { return n.active && n.readyState === 1; }).map(getNodeIndex);
        var query;
        var type;
        if (exploreDeploys) {
            type = 'explore-deploy-x';
            try {
                query = { terms: JSON.parse(request.headers['Explore-Deploys']).data };
            }
            catch (err) {
                console.error('[dapp] could not parse explore-deploys haders');
                callback();
                return;
            }
        }
        else if (multipleResources) {
            type = 'explore-deploy-x';
            query = {
                terms: split[1]
                    .split('%2C')
                    // filter in the case of only one unf : dappy://aaa/bbb,
                    .filter(function (a) { return !!a; })
                    .map(function (u) { return readDataorBagData(u.split('.')[0], u.split('.')[1]); }),
            };
        }
        else {
            type = 'api/explore-deploy';
            query = {
                term: readDataorBagData(split[1].split('.')[0], split[1].split('.')[1]),
            };
        }
        var settings = getSettings$1(getState());
        performMultiRequest({
            type: type,
            body: query,
        }, {
            chainId: blockchain.chainId,
            urls: indexes,
            resolverMode: settings.resolverMode,
            resolverAccuracy: settings.resolverAccuracy,
            resolverAbsolute: settings.resolverAbsolute,
            multiCallId: 'useless',
            comparer: function (res) {
                return res;
            },
        }, blockchains)
            .then(function (multiCallResult) { return __awaiter(void 0, void 0, void 0, function () {
            var json, dataFromBlockchainParsed, file, dataAtNameBuffer, unzippedBuffer, parsedFile, err_1, err_2, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        json = JSON.parse(multiCallResult.result.data);
                        if (!json.success) {
                            callback(json.error);
                            return [2 /*return*/];
                        }
                        dataFromBlockchainParsed = void 0;
                        if (!multipleResources && !exploreDeploys) {
                            dataFromBlockchainParsed = JSON.parse(json.data);
                        }
                        if (!((multipleResources || exploreDeploys) && request.headers.Accept === 'rholang/term')) return [3 /*break*/, 1];
                        callback({
                            mimeType: 'application/json',
                            data: Buffer.from(JSON.stringify(json.data)),
                        });
                        return [3 /*break*/, 12];
                    case 1:
                        if (!(multipleResources || exploreDeploys)) return [3 /*break*/, 2];
                        // todo
                        callback();
                        return [3 /*break*/, 12];
                    case 2:
                        if (!(request.headers.Accept === 'rholang/term')) return [3 /*break*/, 3];
                        callback({
                            mimeType: 'application/json',
                            data: Buffer.from(json.data),
                        });
                        return [3 /*break*/, 12];
                    case 3:
                        if (!(dataFromBlockchainParsed.expr &&
                            dataFromBlockchainParsed.expr[0] &&
                            dataFromBlockchainParsed.expr[0].ExprString)) return [3 /*break*/, 11];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 9, , 10]);
                        file = void 0;
                        try {
                            dataAtNameBuffer = Buffer.from(dataFromBlockchainParsed.expr[0].ExprString.data, 'base64');
                            unzippedBuffer = zlib.gunzipSync(dataAtNameBuffer);
                            file = unzippedBuffer.toString('utf-8');
                        }
                        catch (err) {
                            throw new Error(JSON.stringify({
                                error: LoadError.InvalidManifest,
                                args: {
                                    message: 'Failed to validate file, string is not valid base64 + gzipped',
                                },
                            }));
                        }
                        parsedFile = void 0;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        parsedFile = JSON.parse(file);
                        return [4 /*yield*/, validateFile(parsedFile)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        throw new Error(JSON.stringify({
                            error: LoadError.InvalidManifest,
                            args: {
                                message: 'Failed to parse file ' + err_1,
                            },
                        }));
                    case 8:
                        callback({
                            mimeType: parsedFile.mimeType,
                            data: Buffer.from(parsedFile.data, 'base64'),
                        });
                        return [3 /*break*/, 10];
                    case 9:
                        err_2 = _a.sent();
                        console.log(err_2);
                        callback();
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        callback();
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        err_3 = _a.sent();
                        console.log(err_3);
                        callback();
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        }); })
            .catch(function (err) {
            callback();
            return;
        });
    });
};

var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
};

function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}

function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValue = parts.shift().split("=");
  var name = nameValue.shift();
  var value = nameValue.join("="); // everything after the first =, joined by a "=" if there was more than one part

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  try {
    value = options.decodeValues ? decodeURIComponent(value) : value; // decode cookie value
  } catch (e) {
    console.error(
      `set-cookie-parser encountered an error while decoding a cookie with value '${value}'. Set options.decodeValues to false to disable this feature.`,
      e
    );
  }

  var cookie = {
    name: name, // grab everything before the first =
    value: value,
  };

  parts.forEach(function (part) {
    var sides = part.split("=");
    var key = sides.shift().trimLeft().toLowerCase();
    var value = sides.join("=");
    if (key === "expires") {
      cookie.expires = new Date(value);
    } else if (key === "max-age") {
      cookie.maxAge = parseInt(value, 10);
    } else if (key === "secure") {
      cookie.secure = true;
    } else if (key === "httponly") {
      cookie.httpOnly = true;
    } else if (key === "samesite") {
      cookie.sameSite = value;
    } else {
      cookie[key] = value;
    }
  });

  return cookie;
}

function parse(input, options) {
  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }

  if (input.headers && input.headers["set-cookie"]) {
    // fast-path for node.js (which automatically normalizes header names to lower-case
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    // slow-path for other environments - see #25
    var sch =
      input.headers[
        Object.keys(input.headers).find(function (key) {
          return key.toLowerCase() === "set-cookie";
        })
      ];
    // warn if called on a request-like object with a cookie header rather than a set-cookie header - see #34, 36
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn(
        "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
      );
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!options.map) {
    return input.filter(isNonEmptyString).map(function (str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function (cookies, str) {
      var cookie = parseString(str, options);
      cookies[cookie.name] = cookie;
      return cookies;
    }, cookies);
  }
}

/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.

  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.

  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }

  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;

  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }

  function notSpecialChar() {
    ch = cookiesString.charAt(pos);

    return ch !== "=" && ch !== ";" && ch !== ",";
  }

  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;

    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        // ',' is a cookie separator if we have later first '=', not ';' or ','
        lastComma = pos;
        pos += 1;

        skipWhitespace();
        nextStart = pos;

        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }

        // currently special character
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          // we found cookies separator
          cookiesSeparatorFound = true;
          // pos is inside the next cookie, so back up and return it.
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          // in param ',' or param separator ';',
          // we continue from that comma
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }

    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }

  return cookiesStrings;
}

var setCookie = parse;
var parse_1 = parse;
var parseString_1 = parseString;
var splitCookiesString_1 = splitCookiesString;
setCookie.parse = parse_1;
setCookie.parseString = parseString_1;
setCookie.splitCookiesString = splitCookiesString_1;

var SAVE_COOKIES_FOR_DOMAIN = '[Cookies] Save cookies for domain';
var saveCookiesForDomainAction = function (values) { return ({
    type: SAVE_COOKIES_FOR_DOMAIN,
    payload: values,
}); };

// SELECTORS
var getCookiesState = lib_4(function (state) { return state; }, function (state) { return state.cookies; });
var getCookies = lib_4(getCookiesState, function (state) { return state.cookies; });
// COMBINED SELECTORS

var httpErrorServerUrl = undefined;
var agents = {};
var overrideHttpProtocols = function (session, getState, development, dispatchFromMain, allowSentry) {
    // debug
    var debug = development;
    if (!httpErrorServerUrl) {
        var httpErrorServer_1 = http.createServer(function (req, res) {
            if (req.url.startsWith('/load-fails')) {
                try {
                    var p = decodeURIComponent(req.url.substr(14));
                    res.statusCode = 520;
                    res.statusMessage = 'Unknown error';
                    res.end(p);
                }
                catch (err) {
                    res.statusCode = 520;
                    res.statusMessage = 'Unknown error';
                    res.end('HTTP/1.1 520 Unknown error');
                }
            }
            else if (req.url.startsWith('/unauthorized-app')) {
                res.statusCode = 401;
                res.statusMessage = 'Unauthorized';
                res.end('HTTP/1.1 401 Unauthorized');
            }
            else if (req.url.startsWith('/unauthorized-host')) {
                res.statusCode = 401;
                res.statusMessage = 'Unauthorized Host';
                res.end('HTTP/1.1 401 Unauthorized Host');
            }
            else if (req.url.startsWith('/unauthorized-http')) {
                res.statusCode = 401;
                res.statusMessage = 'Unauthorized HTTP';
                res.end('HTTP/1.1 401 Unauthorized HTTP');
            }
            else {
                res.statusCode = 520;
                res.statusMessage = 'Unknown error';
                res.end('HTTP/1.1 520 Unknown error');
            }
        });
        httpErrorServer_1.on('listening', function () {
            var addr = httpErrorServer_1.address();
            httpErrorServerUrl = "http://127.0.0.1:" + addr.port;
            console.log("[https] http error server running on " + httpErrorServerUrl);
        });
        httpErrorServer_1.listen(0);
    }
    // Block all HTTP when not development
    if (!development) {
        session.protocol.interceptStreamProtocol('http', function (request, callback) {
            http
                .request(httpErrorServerUrl + "/unauthorized-http", function (resp) {
                callback(resp);
            })
                .end();
            return;
        });
    }
    var browserView = undefined;
    session.cookies.on('changed', function (e, c, ca, re) { return __awaiter(void 0, void 0, void 0, function () {
        var servers, cookies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!browserView) {
                        console.log('no browserView, cannot save cookies');
                        return [2 /*return*/];
                    }
                    servers = browserView.servers.filter(function (s) { return s.host === c.domain; });
                    if (!servers.length) {
                        console.log('no browserView.servers matching cookies domain ' + c.domain);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, browserView.browserView.webContents.session.cookies.get({ url: "https://" + c.domain })];
                case 1:
                    cookies = _a.sent();
                    dispatchFromMain({
                        action: saveCookiesForDomainAction({
                            address: browserView.address,
                            cookies: cookies
                                .filter(function (c) { return typeof c.expirationDate === 'number'; })
                                .map(function (cook) { return ({
                                domain: cook.domain,
                                name: cook.name,
                                value: cook.value,
                                expirationDate: cook.expirationDate,
                            }); }),
                        }),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    session.protocol.interceptStreamProtocol('https', function (request, callback) { return __awaiter(void 0, void 0, void 0, function () {
        var options, randomId, userAgent, io, browserViews, appId, withoutProtocol, pathArray, host, path, serversWithSameHost, cookies, cookieHeader, loadFails, over, i, tryToLoad;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // todo : cleaner sentry.io handling
                    /*
                      todo, forbid third party apps from talking to sentry.io without authorization
                      check the User-Agent to see if it is legit (it should be the User-Agent of main process)
                      */
                    if (allowSentry === true) {
                        if (request.url.startsWith('https://sentry.io')) {
                            try {
                                options = {
                                    method: request.method,
                                    host: 'sentry.io',
                                    port: 443,
                                    rejectUnauthorized: true,
                                    path: request.url.replace('https://sentry.io', '') || '/',
                                    headers: request.headers,
                                };
                                https
                                    .request(options, function (resp) {
                                    callback(resp);
                                })
                                    .on('error', function (er) {
                                    console.log(er);
                                })
                                    .end(request.uploadData[0].bytes.toString('utf8'));
                                return [2 /*return*/];
                            }
                            catch (err) {
                                console.log(err);
                                return [2 /*return*/];
                            }
                        }
                    }
                    randomId = '';
                    userAgent = request.headers['User-Agent'];
                    try {
                        io = userAgent.indexOf('randomId=');
                        randomId = userAgent.substring(io + 'randomId='.length);
                    }
                    catch (err) {
                        console.log('[https] An unauthorized app tried to make an https request');
                        http
                            .request(httpErrorServerUrl + "/unauthorized-app", function (resp) {
                            callback(resp);
                        })
                            .end();
                        return [2 /*return*/];
                    }
                    browserViews = getBrowserViewsMain(getState());
                    appId = Object.keys(browserViews).find(function (appId) { return browserViews[appId].randomId === randomId; });
                    if (!appId) {
                        console.log('[https] An unauthorized app tried to make an https request');
                        http
                            .request(httpErrorServerUrl + "/unauthorized-app", function (resp) {
                            callback(resp);
                        })
                            .end();
                        return [2 /*return*/];
                    }
                    browserView = browserViews[appId];
                    withoutProtocol = request.url.split('//').slice(1);
                    pathArray = withoutProtocol.join('').split('/');
                    host = pathArray.slice(0, 1)[0];
                    path = pathArray.slice(1).join('/');
                    serversWithSameHost = browserView.servers.filter(function (s) { return s.host === host; });
                    if (!serversWithSameHost.length) {
                        console.log("[https] An app (" + browserView.resourceId + ") tried to make an https request to an unknown host (" + host + ")");
                        http
                            .request(httpErrorServerUrl + "/unauthorized-host", function (resp) {
                            callback(resp);
                        })
                            .end();
                        return [2 /*return*/];
                    }
                    cookies = [];
                    return [4 /*yield*/, browserView.browserView.webContents.session.cookies.get({
                            url: "https://" + serversWithSameHost[0].host,
                        })];
                case 1:
                    cookies = _a.sent();
                    cookieHeader = cookies.map(function (c) { return c.name + "=" + c.value; }).join('; ');
                    loadFails = {};
                    over = false;
                    i = 0;
                    tryToLoad = function (i) {
                        if (debug)
                            console.log('[https load]', request.url, i);
                        var s = serversWithSameHost[i];
                        // See https://nodejs.org/docs/latest-v10.x/api/tls.html#tls_tls_createsecurecontext_options
                        if (!agents[s.ip + "-" + s.cert]) {
                            agents[s.ip + "-" + s.cert] = new https.Agent({
                                /* no dns */
                                host: s.ip,
                                rejectUnauthorized: false,
                                cert: decodeURI(s.cert),
                                minVersion: 'TLSv1.2',
                                ca: [],
                            });
                        }
                        var options = {
                            agent: agents[s.ip + "-" + s.cert],
                            method: request.method,
                            path: path ? "/" + path : '/',
                            headers: __assign(__assign({}, request.headers), { 
                                /* no dns */
                                host: s.host, 'User-Agent': request.headers['User-Agent'].substr(0, io), Cookie: cookieHeader }),
                        };
                        try {
                            var req_1 = https
                                .request(options, function (resp) {
                                if (resp.headers && resp.headers['set-cookie']) {
                                    var cookies_1 = setCookie.parse(resp, {
                                        decodeValues: true,
                                    });
                                    cookies_1.forEach(function (c) {
                                        browserViews[appId].browserView.webContents.session.cookies.set({
                                            name: c.name,
                                            value: c.value,
                                            url: "https://" + serversWithSameHost[0].host,
                                            expirationDate: c.expires ? new Date(c.expires).getTime() / 1000 : undefined,
                                            secure: true,
                                            httpOnly: true,
                                        });
                                    });
                                    if (debug && cookies_1.length)
                                        console.log("[https load] set " + cookies_1.length + " cookie(s)");
                                }
                                if (debug)
                                    console.log('[https load] OK', resp.statusCode, request.url, i);
                                if (!over) {
                                    callback(resp);
                                    over = true;
                                }
                            })
                                .on('error', function (err) {
                                if (debug)
                                    console.log('[https load] ERR', request.url, err.message, i);
                                var error;
                                if (err.message.includes('connect ECONNRESET')) {
                                    error = {
                                        errorCode: 523,
                                        errorMessage: 'Origin Is Unreachable',
                                    };
                                }
                                else {
                                    error = {
                                        errorCode: 520,
                                        errorMessage: 'Unknown Error',
                                    };
                                }
                                loadFails[i] = error;
                                if (serversWithSameHost[i + 1]) {
                                    console.log('WILL TRY AGAIN');
                                    i += 1;
                                    tryToLoad(i);
                                }
                                else {
                                    if (debug) {
                                        console.log("[https load] Resource for app (" + browserView.resourceId + ") failed to load (" + path + ")");
                                    }
                                    http
                                        .get(httpErrorServerUrl + "/load-fails?p=" + encodeURIComponent(JSON.stringify(loadFails)), function (resp) {
                                        if (!over) {
                                            callback(resp);
                                            over = true;
                                        }
                                    })
                                        .end();
                                    return;
                                }
                            });
                            if (request.uploadData && request.uploadData[0]) {
                                request.uploadData.forEach(function (ud) {
                                    if (ud.type === 'rawData') {
                                        req_1.write(ud.bytes);
                                    }
                                    else {
                                        // todo is this safe ?
                                        // can a IP app or dapp set filePath to /home/bob/anything ???
                                        var file = fs.readFileSync(ud.filePath);
                                        // todo, test file upload on other platforms than discord (works on discord)
                                        req_1.write(file);
                                    }
                                });
                                req_1.end();
                            }
                            else {
                                req_1.end();
                            }
                        }
                        catch (err) {
                            if (debug)
                                console.log('[https load] ERR', request.url, err.message, i);
                            var error = void 0;
                            if (err.message.includes('SSL')) {
                                error = {
                                    errorCode: 526,
                                    errorMessage: 'Invalid SSL Certificate',
                                };
                            }
                            else {
                                error = {
                                    errorCode: 520,
                                    errorMessage: 'Unknown Error',
                                };
                            }
                            loadFails[i] = error;
                            if (serversWithSameHost[i + 1]) {
                                i += 1;
                                tryToLoad(i);
                            }
                            else {
                                if (debug)
                                    console.log("[https] Resource for app (" + browserView.resourceId + ") failed to load (" + path + ")");
                                http
                                    .get(httpErrorServerUrl + "/load-fails?p=" + encodeURIComponent(JSON.stringify(loadFails)), function (resp) {
                                    if (!over) {
                                        callback(resp);
                                        over = true;
                                    }
                                })
                                    .end();
                                return;
                            }
                        }
                    };
                    tryToLoad(i);
                    return [2 /*return*/];
            }
        });
    }); });
};

var getIpAddressAndCert = function (hostname) {
    return new Promise(function (resolve, reject) {
        dns.lookup(hostname, {}, function (err, ip, ipv6oripv4) {
            if (err) {
                reject(err);
                return;
            }
            if (!ip) {
                reject(new Error('IP address not found'));
            }
            var options = {
                host: hostname,
                port: 443,
                method: 'GET',
            };
            var req = https.request(options, function (res) {
                if (res && res.connection && res.connection.getPeerCertificate) {
                    var cert = res.connection.getPeerCertificate();
                    if (cert.raw && cert.raw.toString('base64')) {
                        resolve({
                            ip: ip,
                            cert: '-----BEGIN CERTIFICATE-----\n' + cert.raw.toString('base64') + '\n-----END CERTIFICATE-----',
                        });
                    }
                }
                else {
                    reject(new Error('Response connection not found'));
                }
            });
            req.on('error', function (err) {
                reject(err);
            });
            req.end();
        });
    });
};

var EXECUTE_RCHAIN_CRON_JOBS = '[Blockchain] Execute RChain cron jobs';
var PERFORM_MANY_BENCHMARKS_COMPLETED = '[Blockchain] Perform many benchmarks completed';
var SAVE_FAILED_RCHAIN_TRANSACTION = '[Blockchain] Save failed RChain transaction';
var saveFailedRChainTransactionAction = function (values) { return ({
    type: SAVE_FAILED_RCHAIN_TRANSACTION,
    payload: values,
}); };

// SELECTORS
var getBlockchainState = lib_4(function (state) { return state; }, function (state) { return state.blockchain; });
var getRChainInfos = lib_4(getBlockchainState, function (state) { return state.rchain.infos; });
var getBenchmarks = lib_4(getBlockchainState, function (state) { return state.benchmarks; });
var getBenchmarkTransitoryStates = lib_4(getBlockchainState, function (state) { return state.benchmarkTransitoryStates; });
var getRecords = lib_4(getBlockchainState, function (state) { return state.records.records; });
var getTransactions = lib_4(getBlockchainState, function (state) { return state.transactions; });
var getLoadRecordsErrors = lib_4(getBlockchainState, function (state) { return state.records.loadErrors; });
var getLoadRecordsSuccesses = lib_4(getBlockchainState, function (state) { return state.records.loadSuccesses; });
var getLoadNodesErrors = lib_4(getBlockchainState, function (state) { return state.loadNodesErrors; });
var getDappTransactions = lib_4(getTransactions, function (transactions) {
    return Object.values(transactions).filter(function (t) { return t.origin.origin === 'dapp'; });
});
var getNamesBlockchainInfos = lib_4(getNamesBlockchain, getRChainInfos, function (namesBlockchain, rchainInfos) {
    if (namesBlockchain && rchainInfos[namesBlockchain.chainId]) {
        return rchainInfos[namesBlockchain.chainId];
    }
    else {
        return undefined;
    }
});
var getRecordNamesInAlphaOrder = lib_4(getRecords, function (records) {
    return Object.keys(records).sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        else {
            return 1;
        }
    });
});
// todo, this is all reprocessed everytime state.records change
// maybe do it another way
var getRecordBadges = lib_4(getRecords, function (records) {
    var recordBadges = {};
    Object.keys(records).forEach(function (name) {
        Object.keys(records[name].badges || {}).forEach(function (n) {
            if (!recordBadges[n]) {
                recordBadges[n] = {};
            }
            recordBadges[n][name] = records[name].badges[n];
        });
    });
    return recordBadges;
});
var getLastFinalizedBlockNumber = lib_4(getRecords, function (records) {
    return Object.keys(records).sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        else {
            return 1;
        }
    });
});

/* browser to node */
var performSingleRequest = function (body, node) {
    return new Promise(function (resolve, reject) {
        var over = false;
        setTimeout(function () {
            if (!over) {
                reject({
                    success: false,
                    error: 'Timeout error',
                });
                over = true;
            }
        }, 20000);
        httpBrowserToNode(body, node)
            .then(function (result) {
            if (!over) {
                over = true;
                resolve(result);
            }
        })
            .catch(function (err) {
            console.log(err);
            reject({
                success: false,
                error: { message: typeof err === 'string' ? err : 'Communication error' },
            });
        });
    });
};

function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < array.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, callback(array[index], index, array)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var ongoingConnectionTrials = {};
var PING_PONG_DELAY = 8000;
// todo handle network initerruption with ping/pong
var ping = function (getState, dispatchFromMain) {
    var blockchains = getBlockchains$1(getState());
    Object.keys(blockchains).forEach(function (chainId) {
        blockchains[chainId].nodes.forEach(function (node) {
            var requestId = Math.round(Math.random() * 1000000).toString();
            httpBrowserToNode({ requestId: requestId, type: 'ping' }, node)
                .then(function (a) {
                var resp = JSON.parse(a);
                if (resp.data !== 'pong') {
                    console.log("[bn] websocket did not get \"pong\" from server under " + PING_PONG_DELAY + " seconds, will close connection ", getNodeIndex(node));
                    dispatchFromMain({
                        action: {
                            type: UPDATE_NODE_READY_STATE,
                            payload: {
                                chainId: chainId,
                                readyState: 3,
                                ip: node.ip,
                                host: node.host,
                                ssl: false,
                            },
                        },
                    });
                }
            })
                .catch(function (err) {
                console.log('[bn] websocket timeout error, will close connection ', getNodeIndex(node));
                console.log(err);
                dispatchFromMain({
                    action: {
                        type: UPDATE_NODE_READY_STATE,
                        payload: {
                            chainId: chainId,
                            readyState: 3,
                            ip: node.ip,
                            ssl: false,
                        },
                    },
                });
            });
        });
    });
};
var pingPongLaunched = false;
var benchmarkCron = function (getState, dispatchFromMain) { return __awaiter(void 0, void 0, void 0, function () {
    var interval, blockchains, chainIds, actions, benchmarks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pingPongLaunched) {
                    pingPongLaunched = true;
                    // First try 2 seconds after launch
                    setTimeout(function () { return ping(getState, dispatchFromMain); }, 2000);
                    interval = setInterval(function () { return ping(getState, dispatchFromMain); }, 60000);
                }
                blockchains = getBlockchains$1(getState());
                chainIds = Object.keys(blockchains).filter(function (chainId) {
                    return blockchains[chainId].platform === 'rchain';
                });
                actions = [];
                benchmarks = [];
                return [4 /*yield*/, asyncForEach(chainIds, function (chainId) { return __awaiter(void 0, void 0, void 0, function () {
                        var blockchain, nodesInactiveAndOpened, nodesActive, nodesActiveAndClosed;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    blockchain = blockchains[chainId];
                                    nodesInactiveAndOpened = blockchain.nodes.filter(function (n) { return !n.active && n.readyState === 1; });
                                    nodesInactiveAndOpened.forEach(function (node) {
                                        actions.push({
                                            type: UPDATE_NODE_READY_STATE,
                                            payload: {
                                                chainId: chainId,
                                                readyState: 3,
                                                ip: node.ip,
                                                host: node.host,
                                                ssl: true,
                                            },
                                        });
                                    });
                                    nodesActive = blockchain.nodes.filter(function (n) { return n.active; });
                                    nodesActiveAndClosed = nodesActive.filter(function (n) { return n.readyState === 3 && !ongoingConnectionTrials[n.ip]; });
                                    return [4 /*yield*/, asyncForEach(nodesActiveAndClosed, function (node) { return __awaiter(void 0, void 0, void 0, function () {
                                            var t, requestId, resp, b, err_1, err_2;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 5, , 6]);
                                                        if (ongoingConnectionTrials[node.ip]) {
                                                            return [2 /*return*/];
                                                        }
                                                        ongoingConnectionTrials[node.ip] = true;
                                                        /*
                                                          cert (SSL connection) is mandatory for nodes retreived from default/blockchain but
                                                          node.cert may be undefined, if node.cert is undefined and node is from default/blockchain
                                                          we volontarily setting an invalid cert "INVALID"
                                                        */
                                                        ongoingConnectionTrials[node.ip] = false;
                                                        t = new Date().getTime();
                                                        requestId = Math.round(Math.random() * 1000000).toString();
                                                        _a.label = 1;
                                                    case 1:
                                                        _a.trys.push([1, 3, , 4]);
                                                        return [4 /*yield*/, httpBrowserToNode({ requestId: requestId, type: 'info' }, node)];
                                                    case 2:
                                                        resp = _a.sent();
                                                        b = {
                                                            id: chainId + '-' + getNodeIndex(node),
                                                            chainId: chainId,
                                                            ip: node.ip,
                                                            responseTime: new Date().getTime() - t,
                                                            date: new Date().toISOString(),
                                                            info: {
                                                                dappyNodeVersion: resp.dappyNodeVersion,
                                                                rnodeVersion: resp.rnodeVersion,
                                                            },
                                                        };
                                                        // todo validate b
                                                        // cannot because of "boolean" exported in yup
                                                        benchmarks.push(b);
                                                        actions.push({
                                                            type: UPDATE_NODE_READY_STATE,
                                                            payload: {
                                                                chainId: chainId,
                                                                readyState: 1,
                                                                ip: node.ip,
                                                                host: node.host,
                                                                ssl: true,
                                                            },
                                                        });
                                                        console.log('[bn] [ssl] connected with ' + node.ip + ' ' + node.host);
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        err_1 = _a.sent();
                                                        console.log('[bn] error when trying to get info ' + node.ip + ' ' + node.host);
                                                        console.log(err_1);
                                                        return [3 /*break*/, 4];
                                                    case 4: return [3 /*break*/, 6];
                                                    case 5:
                                                        err_2 = _a.sent();
                                                        ongoingConnectionTrials[node.ip] = false;
                                                        console.log('[bn] could not connect with ' + node.ip + ' ' + node.host);
                                                        if (err_2) {
                                                            console.log(err_2);
                                                        }
                                                        return [3 /*break*/, 6];
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                actions.push({
                    type: PERFORM_MANY_BENCHMARKS_COMPLETED,
                    payload: {
                        benchmarks: benchmarks,
                    },
                });
                actions.forEach(function (a) {
                    dispatchFromMain({
                        action: a,
                    });
                });
                return [2 /*return*/];
        }
    });
}); };

var getDapps = function (path) {
    var directories = fs.readdirSync(path + '/dapps/');
    var dapps = {};
    directories.forEach(function (d) {
        dapps[d] = {
            js: encodeURI(fs.readFileSync(path + '/dapps/' + d + '/js.js', { encoding: 'utf8' })),
            css: encodeURI(fs.readFileSync(path + '/dapps/' + d + '/css.css', { encoding: 'utf8' })),
            html: encodeURI(fs.readFileSync(path + '/dapps/' + d + '/html.html', { encoding: 'utf8' })),
        };
    });
    return dapps;
};

var benchmarkCronRanOnce = false;
var uniqueEphemeralTokenAskedOnce = false;
var uniqueEphemeralToken = '';
/* browser process - main process */
var registerInterProcessProtocol = function (session, store, getLoadResourceWhenReady, openExternal, browserWindow, dispatchFromMain, getDispatchesFromMainAwaiting) {
    session.protocol.registerBufferProtocol('interprocess', function (request, callback) {
        if (request.url === 'interprocess://ask-unique-ephemeral-token') {
            if (uniqueEphemeralTokenAskedOnce === false) {
                uniqueEphemeralTokenAskedOnce = true;
                return crypto.randomBytes(64, function (err, buf) {
                    uniqueEphemeralToken = buf.toString('hex');
                    callback(Buffer.from(JSON.stringify({
                        uniqueEphemeralToken: uniqueEphemeralToken,
                        loadResourceWhenReady: getLoadResourceWhenReady(),
                    })));
                });
            }
            else {
                callback(Buffer.from(JSON.stringify({
                    uniqueEphemeralToken: uniqueEphemeralToken,
                })));
                return;
            }
        }
        var uniqueEphemeralTokenFromrequest = '';
        try {
            uniqueEphemeralTokenFromrequest = JSON.parse(decodeURI(request.headers['Data'])).uniqueEphemeralToken;
            if (uniqueEphemeralToken !== uniqueEphemeralTokenFromrequest) {
                throw new Error();
            }
        }
        catch (err) {
            console.log(request.url);
            console.log('[https] An unauthorized app tried to make an interprocess request');
            callback(Buffer.from(''));
            return;
        }
        if (request.url === 'interprocess://get-ip-address-and-cert') {
            var host = '';
            try {
                host = JSON.parse(decodeURI(request.headers['Data'])).parameters.host;
            }
            catch (e) { }
            getIpAddressAndCert(host)
                .then(function (response) {
                callback(Buffer.from(JSON.stringify({
                    success: true,
                    data: response,
                })));
                return;
            })
                .catch(function (err) {
                callback(Buffer.from(JSON.stringify({
                    success: false,
                    error: { message: err.message },
                })));
            });
        }
        /* browser to node */
        if (request.url === 'interprocess://multi-dappy-call') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var parameters = data.parameters;
                var body = data.body;
                if (parameters.multiCallId === EXECUTE_RCHAIN_CRON_JOBS) {
                    parameters.comparer = function (res) {
                        var json = JSON.parse(res);
                        // do not include json.rnodeVersion that might differ
                        return json.data.rchainNetwork + "-" + json.data.lastFinalizedBlockNumber + "-" + json.data.rchainNamesRegistryUri;
                    };
                }
                else {
                    parameters.comparer = function (res) { return res; };
                }
                var blockchains = getBlockchains$1(store.getState());
                performMultiRequest(body, parameters, blockchains)
                    .then(function (result) {
                    callback(Buffer.from(JSON.stringify({
                        success: true,
                        data: result,
                    })));
                })
                    .catch(function (err) {
                    callback(Buffer.from(JSON.stringify(err)));
                });
            }
            catch (err) {
                console.log(err);
                callback(Buffer.from(err));
            }
        }
        /* browser to node */
        if (request.url === 'interprocess://single-dappy-call') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var node = data.node;
                var body = data.body;
                performSingleRequest(body, node)
                    .then(function (a) {
                    callback(Buffer.from(a));
                })
                    .catch(function (err) {
                    callback(Buffer.from(JSON.stringify(err)));
                });
            }
            catch (err) {
                console.log(err);
                callback(Buffer.from(err));
            }
        }
        if (request.url === 'interprocess://dispatch-in-main') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var action = data.action;
                if (action.type === LOAD_OR_RELOAD_BROWSER_VIEW) {
                    store.dispatch(__assign(__assign({}, action), { meta: { openExternal: openExternal, browserWindow: browserWindow, dispatchFromMain: dispatchFromMain } }));
                }
                else if (action.type === DESTROY_BROWSER_VIEW) {
                    store.dispatch(__assign(__assign({}, action), { meta: { browserWindow: browserWindow } }));
                }
                else if (action.type === SYNC_BLOCKCHAINS) {
                    store.dispatch(action);
                    /*
                      Do not wait the setInterval to run benchmarkCron
                      do it instantly after dispatch
                    */
                    if (benchmarkCronRanOnce === false) {
                        benchmarkCronRanOnce = true;
                        benchmarkCron(store.getState, dispatchFromMain);
                    }
                }
                else {
                    store.dispatch(action);
                }
            }
            catch (err) {
                console.log(err);
                callback(Buffer.from(err));
            }
        }
        if (request.url === 'interprocess://open-external') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var value = data.value;
                openExternal(value);
            }
            catch (err) {
                console.log(err);
                callback(err);
            }
        }
        if (request.url === 'interprocess://copy-to-clipboard') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var value = data.value;
                electron.clipboard.writeText(value);
            }
            catch (err) {
                console.log(err);
                callback(Buffer.from(err));
            }
        }
        if (request.url === 'interprocess://get-dapps') {
            try {
                var dapps = getDapps(electron.app.getAppPath());
                callback(Buffer.from(JSON.stringify({
                    success: true,
                    data: dapps,
                })));
            }
            catch (err) {
                callback(Buffer.from(JSON.stringify({
                    success: false,
                    error: { message: err.message },
                })));
            }
        }
        if (request.url === 'interprocess://trigger-command') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var command = data.command;
                var payload_1 = data.payload;
                if (command === 'run-ws-cron') {
                    benchmarkCron(store.getState, dispatchFromMain);
                }
                if (command === 'download-file') {
                    electron.dialog
                        .showOpenDialog({
                        title: 'Save file',
                        properties: ['openDirectory', 'createDirectory'],
                    })
                        .then(function (a) {
                        if (!a.canceled) {
                            if (a.filePaths[0]) {
                                fs.writeFile(path.join(a.filePaths[0], payload_1.name || 'file'), payload_1.data, { encoding: 'base64' }, function (b) { });
                            }
                            else {
                                console.error('a.filePaths[0] is not defined ' + a.filePaths[0]);
                            }
                        }
                    })
                        .catch(function (err) {
                        console.log(err);
                    });
                }
            }
            catch (err) {
                console.log(err);
                callback(err);
            }
        }
        if (request.url === 'interprocess://get-dispatches-from-main-awaiting') {
            callback(Buffer.from(JSON.stringify({
                actions: getDispatchesFromMainAwaiting(),
            })));
        }
    });
};

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root$1;

if (typeof self !== 'undefined') {
  root$1 = self;
} else if (typeof window !== 'undefined') {
  root$1 = window;
} else if (typeof global !== 'undefined') {
  root$1 = global;
} else if (typeof module !== 'undefined') {
  root$1 = module;
} else {
  root$1 = Function('return this')();
}

var result = symbolObservablePonyfill(root$1);

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
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
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
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
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
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
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
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
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
      throw new Error('Expected the nextReducer to be a function.');
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
          throw new TypeError('Expected the observer to be an object.');
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
    }, _ref[result] = function () {
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
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var sym = function sym(id) {
  return '@@redux-saga/' + id;
};

var TASK = /*#__PURE__*/sym('TASK');
var HELPER = /*#__PURE__*/sym('HELPER');
var MATCH = /*#__PURE__*/sym('MATCH');
var CANCEL = /*#__PURE__*/sym('CANCEL_PROMISE');
var SAGA_ACTION = /*#__PURE__*/sym('SAGA_ACTION');
var SELF_CANCELLATION = /*#__PURE__*/sym('SELF_CANCELLATION');
var konst = function konst(v) {
  return function () {
    return v;
  };
};
var kTrue = /*#__PURE__*/konst(true);
var noop = function noop() {};
var ident = function ident(v) {
  return v;
};

function check(value, predicate, error) {
  if (!predicate(value)) {
    log('error', 'uncaught at check', error);
    throw new Error(error);
  }
}

var hasOwnProperty$d = Object.prototype.hasOwnProperty;
function hasOwn(object, property) {
  return is.notUndef(object) && hasOwnProperty$d.call(object, property);
}

var is = {
  undef: function undef(v) {
    return v === null || v === undefined;
  },
  notUndef: function notUndef(v) {
    return v !== null && v !== undefined;
  },
  func: function func(f) {
    return typeof f === 'function';
  },
  number: function number(n) {
    return typeof n === 'number';
  },
  string: function string(s) {
    return typeof s === 'string';
  },
  array: Array.isArray,
  object: function object(obj) {
    return obj && !is.array(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  },
  promise: function promise(p) {
    return p && is.func(p.then);
  },
  iterator: function iterator(it) {
    return it && is.func(it.next) && is.func(it.throw);
  },
  iterable: function iterable(it) {
    return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
  },
  task: function task(t) {
    return t && t[TASK];
  },
  observable: function observable(ob) {
    return ob && is.func(ob.subscribe);
  },
  buffer: function buffer(buf) {
    return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
  },
  pattern: function pattern(pat) {
    return pat && (is.string(pat) || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
  },
  channel: function channel(ch) {
    return ch && is.func(ch.take) && is.func(ch.close);
  },
  helper: function helper(it) {
    return it && it[HELPER];
  },
  stringableFunc: function stringableFunc(f) {
    return is.func(f) && hasOwn(f, 'toString');
  }
};

var object$1 = {
  assign: function assign(target, source) {
    for (var i in source) {
      if (hasOwn(source, i)) {
        target[i] = source[i];
      }
    }
  }
};

function remove(array, item) {
  var index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
  }
}

var array$2 = {
  from: function from(obj) {
    var arr = Array(obj.length);
    for (var i in obj) {
      if (hasOwn(obj, i)) {
        arr[i] = obj[i];
      }
    }
    return arr;
  }
};

function deferred() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var def = _extends({}, props);
  var promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  def.promise = promise;
  return def;
}

function autoInc() {
  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return function () {
    return ++seed;
  };
}

var uid = /*#__PURE__*/autoInc();

var kThrow = function kThrow(err) {
  throw err;
};
var kReturn = function kReturn(value) {
  return { value: value, done: true };
};
function makeIterator(next) {
  var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var isHelper = arguments[3];

  var iterator = { name: name, next: next, throw: thro, return: kReturn };

  if (isHelper) {
    iterator[HELPER] = true;
  }
  if (typeof Symbol !== 'undefined') {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }
  return iterator;
}

/**
  Print error in a useful way whether in a browser environment
  (with expandable error stack traces), or in a node.js environment
  (text-only log output)
 **/
function log(level, message) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  /*eslint-disable no-console*/
  if (typeof window === 'undefined') {
    console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
  } else {
    console[level](message, error);
  }
}

function deprecate(fn, deprecationWarning) {
  return function () {
    if (process.env.NODE_ENV === 'development') log('warn', deprecationWarning);
    return fn.apply(undefined, arguments);
  };
}

var updateIncentive = function updateIncentive(deprecated, preferred) {
  return deprecated + ' has been deprecated in favor of ' + preferred + ', please update your code';
};

var internalErr = function internalErr(err) {
  return new Error('\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project\'s github repo.\n  Error: ' + err + '\n');
};

var createSetContextWarning = function createSetContextWarning(ctx, props) {
  return (ctx ? ctx + '.' : '') + 'setContext(props): argument ' + props + ' is not a plain object';
};

var wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
  return function (action) {
    return dispatch(Object.defineProperty(action, SAGA_ACTION, { value: true }));
  };
};

var BUFFER_OVERFLOW = "Channel's Buffer overflow!";

var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_DROP = 2;
var ON_OVERFLOW_SLIDE = 3;
var ON_OVERFLOW_EXPAND = 4;

var zeroBuffer = { isEmpty: kTrue, put: noop, take: noop };

function ringBuffer() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var overflowAction = arguments[1];

  var arr = new Array(limit);
  var length = 0;
  var pushIndex = 0;
  var popIndex = 0;

  var push = function push(it) {
    arr[pushIndex] = it;
    pushIndex = (pushIndex + 1) % limit;
    length++;
  };

  var take = function take() {
    if (length != 0) {
      var it = arr[popIndex];
      arr[popIndex] = null;
      length--;
      popIndex = (popIndex + 1) % limit;
      return it;
    }
  };

  var flush = function flush() {
    var items = [];
    while (length) {
      items.push(take());
    }
    return items;
  };

  return {
    isEmpty: function isEmpty() {
      return length == 0;
    },
    put: function put(it) {
      if (length < limit) {
        push(it);
      } else {
        var doubledLimit = void 0;
        switch (overflowAction) {
          case ON_OVERFLOW_THROW:
            throw new Error(BUFFER_OVERFLOW);
          case ON_OVERFLOW_SLIDE:
            arr[pushIndex] = it;
            pushIndex = (pushIndex + 1) % limit;
            popIndex = pushIndex;
            break;
          case ON_OVERFLOW_EXPAND:
            doubledLimit = 2 * limit;

            arr = flush();

            length = arr.length;
            pushIndex = arr.length;
            popIndex = 0;

            arr.length = doubledLimit;
            limit = doubledLimit;

            push(it);
            break;
          // DROP
        }
      }
    },
    take: take,
    flush: flush
  };
}

var buffers = {
  none: function none() {
    return zeroBuffer;
  },
  fixed: function fixed(limit) {
    return ringBuffer(limit, ON_OVERFLOW_THROW);
  },
  dropping: function dropping(limit) {
    return ringBuffer(limit, ON_OVERFLOW_DROP);
  },
  sliding: function sliding(limit) {
    return ringBuffer(limit, ON_OVERFLOW_SLIDE);
  },
  expanding: function expanding(initialSize) {
    return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
  }
};

var queue = [];
/**
  Variable to hold a counting semaphore
  - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
    already suspended)
  - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
    triggers flushing the queued tasks.
**/
var semaphore = 0;

/**
  Executes a task 'atomically'. Tasks scheduled during this execution will be queued
  and flushed after this task has finished (assuming the scheduler endup in a released
  state).
**/
function exec(task) {
  try {
    suspend();
    task();
  } finally {
    release();
  }
}

/**
  Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
**/
function asap(task) {
  queue.push(task);

  if (!semaphore) {
    suspend();
    flush();
  }
}

/**
  Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
  scheduler is released.
**/
function suspend() {
  semaphore++;
}

/**
  Puts the scheduler in a `released` state.
**/
function release() {
  semaphore--;
}

/**
  Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
**/
function flush() {
  release();

  var task = void 0;
  while (!semaphore && (task = queue.shift()) !== undefined) {
    exec(task);
  }
}

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var CHANNEL_END_TYPE = '@@redux-saga/CHANNEL_END';
var END = { type: CHANNEL_END_TYPE };
var isEnd = function isEnd(a) {
  return a && a.type === CHANNEL_END_TYPE;
};

function emitter() {
  var subscribers = [];

  function subscribe(sub) {
    subscribers.push(sub);
    return function () {
      return remove(subscribers, sub);
    };
  }

  function emit(item) {
    var arr = subscribers.slice();
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i](item);
    }
  }

  return {
    subscribe: subscribe,
    emit: emit
  };
}

var INVALID_BUFFER = 'invalid buffer passed to channel factory function';
var UNDEFINED_INPUT_ERROR = 'Saga was provided with an undefined action';

if (process.env.NODE_ENV !== 'production') {
  UNDEFINED_INPUT_ERROR += '\nHints:\n    - check that your Action Creator returns a non-undefined value\n    - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n  ';
}

function channel() {
  var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : buffers.fixed();

  var closed = false;
  var takers = [];

  check(buffer, is.buffer, INVALID_BUFFER);

  function checkForbiddenStates() {
    if (closed && takers.length) {
      throw internalErr('Cannot have a closed channel with pending takers');
    }
    if (takers.length && !buffer.isEmpty()) {
      throw internalErr('Cannot have pending takers with non empty buffer');
    }
  }

  function put(input) {
    checkForbiddenStates();
    check(input, is.notUndef, UNDEFINED_INPUT_ERROR);
    if (closed) {
      return;
    }
    if (!takers.length) {
      return buffer.put(input);
    }
    for (var i = 0; i < takers.length; i++) {
      var cb = takers[i];
      if (!cb[MATCH] || cb[MATCH](input)) {
        takers.splice(i, 1);
        return cb(input);
      }
    }
  }

  function take(cb) {
    checkForbiddenStates();
    check(cb, is.func, "channel.take's callback must be a function");

    if (closed && buffer.isEmpty()) {
      cb(END);
    } else if (!buffer.isEmpty()) {
      cb(buffer.take());
    } else {
      takers.push(cb);
      cb.cancel = function () {
        return remove(takers, cb);
      };
    }
  }

  function flush(cb) {
    checkForbiddenStates(); // TODO: check if some new state should be forbidden now
    check(cb, is.func, "channel.flush' callback must be a function");
    if (closed && buffer.isEmpty()) {
      cb(END);
      return;
    }
    cb(buffer.flush());
  }

  function close() {
    checkForbiddenStates();
    if (!closed) {
      closed = true;
      if (takers.length) {
        var arr = takers;
        takers = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          arr[i](END);
        }
      }
    }
  }

  return {
    take: take,
    put: put,
    flush: flush,
    close: close,
    get __takers__() {
      return takers;
    },
    get __closed__() {
      return closed;
    }
  };
}

function eventChannel(subscribe) {
  var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : buffers.none();
  var matcher = arguments[2];

  /**
    should be if(typeof matcher !== undefined) instead?
    see PR #273 for a background discussion
  **/
  if (arguments.length > 2) {
    check(matcher, is.func, 'Invalid match function passed to eventChannel');
  }

  var chan = channel(buffer);
  var close = function close() {
    if (!chan.__closed__) {
      if (unsubscribe) {
        unsubscribe();
      }
      chan.close();
    }
  };
  var unsubscribe = subscribe(function (input) {
    if (isEnd(input)) {
      close();
      return;
    }
    if (matcher && !matcher(input)) {
      return;
    }
    chan.put(input);
  });
  if (chan.__closed__) {
    unsubscribe();
  }

  if (!is.func(unsubscribe)) {
    throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
  }

  return {
    take: chan.take,
    flush: chan.flush,
    close: close
  };
}

function stdChannel(subscribe) {
  var chan = eventChannel(function (cb) {
    return subscribe(function (input) {
      if (input[SAGA_ACTION]) {
        cb(input);
        return;
      }
      asap(function () {
        return cb(input);
      });
    });
  });

  return _extends$1({}, chan, {
    take: function take(cb, matcher) {
      if (arguments.length > 1) {
        check(matcher, is.func, "channel.take's matcher argument must be a function");
        cb[MATCH] = matcher;
      }
      chan.take(cb);
    }
  });
}

var IO = /*#__PURE__*/sym('IO');
var TAKE = 'TAKE';
var PUT = 'PUT';
var ALL = 'ALL';
var RACE = 'RACE';
var CALL = 'CALL';
var CPS = 'CPS';
var FORK = 'FORK';
var JOIN = 'JOIN';
var CANCEL$1 = 'CANCEL';
var SELECT = 'SELECT';
var ACTION_CHANNEL = 'ACTION_CHANNEL';
var CANCELLED = 'CANCELLED';
var FLUSH = 'FLUSH';
var GET_CONTEXT = 'GET_CONTEXT';
var SET_CONTEXT = 'SET_CONTEXT';

var effect = function effect(type, payload) {
  var _ref;

  return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
};

function take() {
  var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

  if (arguments.length) {
    check(arguments[0], is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }
  if (is.pattern(patternOrChannel)) {
    return effect(TAKE, { pattern: patternOrChannel });
  }
  if (is.channel(patternOrChannel)) {
    return effect(TAKE, { channel: patternOrChannel });
  }
  throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
}

take.maybe = function () {
  var eff = take.apply(undefined, arguments);
  eff[TAKE].maybe = true;
  return eff;
};

function put(channel, action) {
  if (arguments.length > 1) {
    check(channel, is.notUndef, 'put(channel, action): argument channel is undefined');
    check(channel, is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
    check(action, is.notUndef, 'put(channel, action): argument action is undefined');
  } else {
    check(channel, is.notUndef, 'put(action): argument action is undefined');
    action = channel;
    channel = null;
  }
  return effect(PUT, { channel: channel, action: action });
}

put.resolve = function () {
  var eff = put.apply(undefined, arguments);
  eff[PUT].resolve = true;
  return eff;
};

put.sync = /*#__PURE__*/deprecate(put.resolve, /*#__PURE__*/updateIncentive('put.sync', 'put.resolve'));

function all(effects) {
  return effect(ALL, effects);
}

function getFnCallDesc(meth, fn, args) {
  check(fn, is.notUndef, meth + ': argument fn is undefined');

  var context = null;
  if (is.array(fn)) {
    var _fn = fn;
    context = _fn[0];
    fn = _fn[1];
  } else if (fn.fn) {
    var _fn2 = fn;
    context = _fn2.context;
    fn = _fn2.fn;
  }
  if (context && is.string(fn) && is.func(context[fn])) {
    fn = context[fn];
  }
  check(fn, is.func, meth + ': argument ' + fn + ' is not a function');

  return { context: context, fn: fn, args: args };
}

function fork(fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return effect(FORK, getFnCallDesc('fork', fn, args));
}

function select(selector) {
  for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    args[_key7 - 1] = arguments[_key7];
  }

  if (arguments.length === 0) {
    selector = ident;
  } else {
    check(selector, is.notUndef, 'select(selector,[...]): argument selector is undefined');
    check(selector, is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
  }
  return effect(SELECT, { selector: selector, args: args });
}

var createAsEffectType = function createAsEffectType(type) {
  return function (effect) {
    return effect && effect[IO] && effect[type];
  };
};

var asEffect = {
  take: /*#__PURE__*/createAsEffectType(TAKE),
  put: /*#__PURE__*/createAsEffectType(PUT),
  all: /*#__PURE__*/createAsEffectType(ALL),
  race: /*#__PURE__*/createAsEffectType(RACE),
  call: /*#__PURE__*/createAsEffectType(CALL),
  cps: /*#__PURE__*/createAsEffectType(CPS),
  fork: /*#__PURE__*/createAsEffectType(FORK),
  join: /*#__PURE__*/createAsEffectType(JOIN),
  cancel: /*#__PURE__*/createAsEffectType(CANCEL$1),
  select: /*#__PURE__*/createAsEffectType(SELECT),
  actionChannel: /*#__PURE__*/createAsEffectType(ACTION_CHANNEL),
  cancelled: /*#__PURE__*/createAsEffectType(CANCELLED),
  flush: /*#__PURE__*/createAsEffectType(FLUSH),
  getContext: /*#__PURE__*/createAsEffectType(GET_CONTEXT),
  setContext: /*#__PURE__*/createAsEffectType(SET_CONTEXT)
};

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

var NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';

var CHANNEL_END = {
  toString: function toString() {
    return '@@redux-saga/CHANNEL_END';
  }
};
var TASK_CANCEL = {
  toString: function toString() {
    return '@@redux-saga/TASK_CANCEL';
  }
};

var matchers = {
  wildcard: function wildcard() {
    return kTrue;
  },
  default: function _default(pattern) {
    return (typeof pattern === 'undefined' ? 'undefined' : _typeof$1(pattern)) === 'symbol' ? function (input) {
      return input.type === pattern;
    } : function (input) {
      return input.type === String(pattern);
    };
  },
  array: function array(patterns) {
    return function (input) {
      return patterns.some(function (p) {
        return matcher(p)(input);
      });
    };
  },
  predicate: function predicate(_predicate) {
    return function (input) {
      return _predicate(input);
    };
  }
};

function matcher(pattern) {
  // prettier-ignore
  return (pattern === '*' ? matchers.wildcard : is.array(pattern) ? matchers.array : is.stringableFunc(pattern) ? matchers.default : is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
}

/**
  Used to track a parent task and its forks
  In the new fork model, forked tasks are attached by default to their parent
  We model this using the concept of Parent task && main Task
  main task is the main flow of the current Generator, the parent tasks is the
  aggregation of the main tasks + all its forked tasks.
  Thus the whole model represents an execution tree with multiple branches (vs the
  linear execution tree in sequential (non parallel) programming)

  A parent tasks has the following semantics
  - It completes if all its forks either complete or all cancelled
  - If it's cancelled, all forks are cancelled as well
  - It aborts if any uncaught error bubbles up from forks
  - If it completes, the return value is the one returned by the main task
**/
function forkQueue(name, mainTask, cb) {
  var tasks = [],
      result = void 0,
      completed = false;
  addTask(mainTask);

  function abort(err) {
    cancelAll();
    cb(err, true);
  }

  function addTask(task) {
    tasks.push(task);
    task.cont = function (res, isErr) {
      if (completed) {
        return;
      }

      remove(tasks, task);
      task.cont = noop;
      if (isErr) {
        abort(res);
      } else {
        if (task === mainTask) {
          result = res;
        }
        if (!tasks.length) {
          completed = true;
          cb(result);
        }
      }
    };
    // task.cont.cancel = task.cancel
  }

  function cancelAll() {
    if (completed) {
      return;
    }
    completed = true;
    tasks.forEach(function (t) {
      t.cont = noop;
      t.cancel();
    });
    tasks = [];
  }

  return {
    addTask: addTask,
    cancelAll: cancelAll,
    abort: abort,
    getTasks: function getTasks() {
      return tasks;
    },
    taskNames: function taskNames() {
      return tasks.map(function (t) {
        return t.name;
      });
    }
  };
}

function createTaskIterator(_ref) {
  var context = _ref.context,
      fn = _ref.fn,
      args = _ref.args;

  if (is.iterator(fn)) {
    return fn;
  }

  // catch synchronous failures; see #152 and #441
  var result = void 0,
      error = void 0;
  try {
    result = fn.apply(context, args);
  } catch (err) {
    error = err;
  }

  // i.e. a generator function returns an iterator
  if (is.iterator(result)) {
    return result;
  }

  // do not bubble up synchronous failures for detached forks
  // instead create a failed task. See #152 and #441
  return error ? makeIterator(function () {
    throw error;
  }) : makeIterator(function () {
    var pc = void 0;
    var eff = { done: false, value: result };
    var ret = function ret(value) {
      return { done: true, value: value };
    };
    return function (arg) {
      if (!pc) {
        pc = true;
        return eff;
      } else {
        return ret(arg);
      }
    };
  }());
}

var wrapHelper = function wrapHelper(helper) {
  return { fn: helper };
};

function proc(iterator) {
  var subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return noop;
  };
  var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var getState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  var parentContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var parentEffectId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var name = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'anonymous';
  var cont = arguments[8];

  check(iterator, is.iterator, NOT_ITERATOR_ERROR);

  var effectsString = '[...effects]';
  var runParallelEffect = deprecate(runAllEffect, updateIncentive(effectsString, 'all(' + effectsString + ')'));

  var sagaMonitor = options.sagaMonitor,
      logger = options.logger,
      onError = options.onError;

  var log$1 = logger || log;
  var logError = function logError(err) {
    var message = err.sagaStack;

    if (!message && err.stack) {
      message = err.stack.split('\n')[0].indexOf(err.message) !== -1 ? err.stack : 'Error: ' + err.message + '\n' + err.stack;
    }

    log$1('error', 'uncaught at ' + name, message || err.message || err);
  };
  var stdChannel$1 = stdChannel(subscribe);
  var taskContext = Object.create(parentContext);
  /**
    Tracks the current effect cancellation
    Each time the generator progresses. calling runEffect will set a new value
    on it. It allows propagating cancellation to child effects
  **/
  next.cancel = noop;

  /**
    Creates a new task descriptor for this generator, We'll also create a main task
    to track the main flow (besides other forked tasks)
  **/
  var task = newTask(parentEffectId, name, iterator, cont);
  var mainTask = { name: name, cancel: cancelMain, isRunning: true };
  var taskQueue = forkQueue(name, mainTask, end);

  /**
    cancellation of the main task. We'll simply resume the Generator with a Cancel
  **/
  function cancelMain() {
    if (mainTask.isRunning && !mainTask.isCancelled) {
      mainTask.isCancelled = true;
      next(TASK_CANCEL);
    }
  }

  /**
    This may be called by a parent generator to trigger/propagate cancellation
    cancel all pending tasks (including the main task), then end the current task.
     Cancellation propagates down to the whole execution tree holded by this Parent task
    It's also propagated to all joiners of this task and their execution tree/joiners
     Cancellation is noop for terminated/Cancelled tasks tasks
  **/
  function cancel() {
    /**
      We need to check both Running and Cancelled status
      Tasks can be Cancelled but still Running
    **/
    if (iterator._isRunning && !iterator._isCancelled) {
      iterator._isCancelled = true;
      taskQueue.cancelAll();
      /**
        Ending with a Never result will propagate the Cancellation to all joiners
      **/
      end(TASK_CANCEL);
    }
  }
  /**
    attaches cancellation logic to this task's continuation
    this will permit cancellation to propagate down the call chain
  **/
  cont && (cont.cancel = cancel);

  // tracks the running status
  iterator._isRunning = true;

  // kicks up the generator
  next();

  // then return the task descriptor to the caller
  return task;

  /**
    This is the generator driver
    It's a recursive async/continuation function which calls itself
    until the generator terminates or throws
  **/
  function next(arg, isErr) {
    // Preventive measure. If we end up here, then there is really something wrong
    if (!mainTask.isRunning) {
      throw new Error('Trying to resume an already finished generator');
    }

    try {
      var result = void 0;
      if (isErr) {
        result = iterator.throw(arg);
      } else if (arg === TASK_CANCEL) {
        /**
          getting TASK_CANCEL automatically cancels the main task
          We can get this value here
           - By cancelling the parent task manually
          - By joining a Cancelled task
        **/
        mainTask.isCancelled = true;
        /**
          Cancels the current effect; this will propagate the cancellation down to any called tasks
        **/
        next.cancel();
        /**
          If this Generator has a `return` method then invokes it
          This will jump to the finally block
        **/
        result = is.func(iterator.return) ? iterator.return(TASK_CANCEL) : { done: true, value: TASK_CANCEL };
      } else if (arg === CHANNEL_END) {
        // We get CHANNEL_END by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
        result = is.func(iterator.return) ? iterator.return() : { done: true };
      } else {
        result = iterator.next(arg);
      }

      if (!result.done) {
        runEffect(result.value, parentEffectId, '', next);
      } else {
        /**
          This Generator has ended, terminate the main task and notify the fork queue
        **/
        mainTask.isMainRunning = false;
        mainTask.cont && mainTask.cont(result.value);
      }
    } catch (error) {
      if (mainTask.isCancelled) {
        logError(error);
      }
      mainTask.isMainRunning = false;
      mainTask.cont(error, true);
    }
  }

  function end(result, isErr) {
    iterator._isRunning = false;
    stdChannel$1.close();
    if (!isErr) {
      iterator._result = result;
      iterator._deferredEnd && iterator._deferredEnd.resolve(result);
    } else {
      if (result instanceof Error) {
        Object.defineProperty(result, 'sagaStack', {
          value: 'at ' + name + ' \n ' + (result.sagaStack || result.stack),
          configurable: true
        });
      }
      if (!task.cont) {
        if (result instanceof Error && onError) {
          onError(result);
        } else {
          logError(result);
        }
      }
      iterator._error = result;
      iterator._isAborted = true;
      iterator._deferredEnd && iterator._deferredEnd.reject(result);
    }
    task.cont && task.cont(result, isErr);
    task.joiners.forEach(function (j) {
      return j.cb(result, isErr);
    });
    task.joiners = null;
  }

  function runEffect(effect, parentEffectId) {
    var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var cb = arguments[3];

    var effectId = uid();
    sagaMonitor && sagaMonitor.effectTriggered({ effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect });

    /**
      completion callback and cancel callback are mutually exclusive
      We can't cancel an already completed effect
      And We can't complete an already cancelled effectId
    **/
    var effectSettled = void 0;

    // Completion callback passed to the appropriate effect runner
    function currCb(res, isErr) {
      if (effectSettled) {
        return;
      }

      effectSettled = true;
      cb.cancel = noop; // defensive measure
      if (sagaMonitor) {
        isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
      }
      cb(res, isErr);
    }
    // tracks down the current cancel
    currCb.cancel = noop;

    // setup cancellation logic on the parent cb
    cb.cancel = function () {
      // prevents cancelling an already completed effect
      if (effectSettled) {
        return;
      }

      effectSettled = true;
      /**
        propagates cancel downward
        catch uncaught cancellations errors; since we can no longer call the completion
        callback, log errors raised during cancellations into the console
      **/
      try {
        currCb.cancel();
      } catch (err) {
        logError(err);
      }
      currCb.cancel = noop; // defensive measure

      sagaMonitor && sagaMonitor.effectCancelled(effectId);
    };

    /**
      each effect runner must attach its own logic of cancellation to the provided callback
      it allows this generator to propagate cancellation downward.
       ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
      And the setup must occur before calling the callback
       This is a sort of inversion of control: called async functions are responsible
      for completing the flow by calling the provided continuation; while caller functions
      are responsible for aborting the current flow by calling the attached cancel function
       Library users can attach their own cancellation logic to promises by defining a
      promise[CANCEL] method in their returned promises
      ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
    **/
    var data = void 0;
    // prettier-ignore
    return (
      // Non declarative effect
      is.promise(effect) ? resolvePromise(effect, currCb) : is.helper(effect) ? runForkEffect(wrapHelper(effect), effectId, currCb) : is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb)

      // declarative effects
      : is.array(effect) ? runParallelEffect(effect, effectId, currCb) : (data = asEffect.take(effect)) ? runTakeEffect(data, currCb) : (data = asEffect.put(effect)) ? runPutEffect(data, currCb) : (data = asEffect.all(effect)) ? runAllEffect(data, effectId, currCb) : (data = asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : (data = asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : (data = asEffect.cps(effect)) ? runCPSEffect(data, currCb) : (data = asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : (data = asEffect.join(effect)) ? runJoinEffect(data, currCb) : (data = asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : (data = asEffect.select(effect)) ? runSelectEffect(data, currCb) : (data = asEffect.actionChannel(effect)) ? runChannelEffect(data, currCb) : (data = asEffect.flush(effect)) ? runFlushEffect(data, currCb) : (data = asEffect.cancelled(effect)) ? runCancelledEffect(data, currCb) : (data = asEffect.getContext(effect)) ? runGetContextEffect(data, currCb) : (data = asEffect.setContext(effect)) ? runSetContextEffect(data, currCb) : /* anything else returned as is */currCb(effect)
    );
  }

  function resolvePromise(promise, cb) {
    var cancelPromise = promise[CANCEL];
    if (is.func(cancelPromise)) {
      cb.cancel = cancelPromise;
    } else if (is.func(promise.abort)) {
      cb.cancel = function () {
        return promise.abort();
      };
      // TODO: add support for the fetch API, whenever they get around to
      // adding cancel support
    }
    promise.then(cb, function (error) {
      return cb(error, true);
    });
  }

  function resolveIterator(iterator, effectId, name, cb) {
    proc(iterator, subscribe, dispatch, getState, taskContext, options, effectId, name, cb);
  }

  function runTakeEffect(_ref2, cb) {
    var channel = _ref2.channel,
        pattern = _ref2.pattern,
        maybe = _ref2.maybe;

    channel = channel || stdChannel$1;
    var takeCb = function takeCb(inp) {
      return inp instanceof Error ? cb(inp, true) : isEnd(inp) && !maybe ? cb(CHANNEL_END) : cb(inp);
    };
    try {
      channel.take(takeCb, matcher(pattern));
    } catch (err) {
      return cb(err, true);
    }
    cb.cancel = takeCb.cancel;
  }

  function runPutEffect(_ref3, cb) {
    var channel = _ref3.channel,
        action = _ref3.action,
        resolve = _ref3.resolve;

    /**
      Schedule the put in case another saga is holding a lock.
      The put will be executed atomically. ie nested puts will execute after
      this put has terminated.
    **/
    asap(function () {
      var result = void 0;
      try {
        result = (channel ? channel.put : dispatch)(action);
      } catch (error) {
        // If we have a channel or `put.resolve` was used then bubble up the error.
        if (channel || resolve) return cb(error, true);
        logError(error);
      }

      if (resolve && is.promise(result)) {
        resolvePromise(result, cb);
      } else {
        return cb(result);
      }
    });
    // Put effects are non cancellables
  }

  function runCallEffect(_ref4, effectId, cb) {
    var context = _ref4.context,
        fn = _ref4.fn,
        args = _ref4.args;

    var result = void 0;
    // catch synchronous failures; see #152
    try {
      result = fn.apply(context, args);
    } catch (error) {
      return cb(error, true);
    }
    return is.promise(result) ? resolvePromise(result, cb) : is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(result);
  }

  function runCPSEffect(_ref5, cb) {
    var context = _ref5.context,
        fn = _ref5.fn,
        args = _ref5.args;

    // CPS (ie node style functions) can define their own cancellation logic
    // by setting cancel field on the cb

    // catch synchronous failures; see #152
    try {
      var cpsCb = function cpsCb(err, res) {
        return is.undef(err) ? cb(res) : cb(err, true);
      };
      fn.apply(context, args.concat(cpsCb));
      if (cpsCb.cancel) {
        cb.cancel = function () {
          return cpsCb.cancel();
        };
      }
    } catch (error) {
      return cb(error, true);
    }
  }

  function runForkEffect(_ref6, effectId, cb) {
    var context = _ref6.context,
        fn = _ref6.fn,
        args = _ref6.args,
        detached = _ref6.detached;

    var taskIterator = createTaskIterator({ context: context, fn: fn, args: args });

    try {
      suspend();
      var _task = proc(taskIterator, subscribe, dispatch, getState, taskContext, options, effectId, fn.name, detached ? null : noop);

      if (detached) {
        cb(_task);
      } else {
        if (taskIterator._isRunning) {
          taskQueue.addTask(_task);
          cb(_task);
        } else if (taskIterator._error) {
          taskQueue.abort(taskIterator._error);
        } else {
          cb(_task);
        }
      }
    } finally {
      flush();
    }
    // Fork effects are non cancellables
  }

  function runJoinEffect(t, cb) {
    if (t.isRunning()) {
      var joiner = { task: task, cb: cb };
      cb.cancel = function () {
        return remove(t.joiners, joiner);
      };
      t.joiners.push(joiner);
    } else {
      t.isAborted() ? cb(t.error(), true) : cb(t.result());
    }
  }

  function runCancelEffect(taskToCancel, cb) {
    if (taskToCancel === SELF_CANCELLATION) {
      taskToCancel = task;
    }
    if (taskToCancel.isRunning()) {
      taskToCancel.cancel();
    }
    cb();
    // cancel effects are non cancellables
  }

  function runAllEffect(effects, effectId, cb) {
    var keys = Object.keys(effects);

    if (!keys.length) {
      return cb(is.array(effects) ? [] : {});
    }

    var completedCount = 0;
    var completed = void 0;
    var results = {};
    var childCbs = {};

    function checkEffectEnd() {
      if (completedCount === keys.length) {
        completed = true;
        cb(is.array(effects) ? array$2.from(_extends$2({}, results, { length: keys.length })) : results);
      }
    }

    keys.forEach(function (key) {
      var chCbAtKey = function chCbAtKey(res, isErr) {
        if (completed) {
          return;
        }
        if (isErr || isEnd(res) || res === CHANNEL_END || res === TASK_CANCEL) {
          cb.cancel();
          cb(res, isErr);
        } else {
          results[key] = res;
          completedCount++;
          checkEffectEnd();
        }
      };
      chCbAtKey.cancel = noop;
      childCbs[key] = chCbAtKey;
    });

    cb.cancel = function () {
      if (!completed) {
        completed = true;
        keys.forEach(function (key) {
          return childCbs[key].cancel();
        });
      }
    };

    keys.forEach(function (key) {
      return runEffect(effects[key], effectId, key, childCbs[key]);
    });
  }

  function runRaceEffect(effects, effectId, cb) {
    var completed = void 0;
    var keys = Object.keys(effects);
    var childCbs = {};

    keys.forEach(function (key) {
      var chCbAtKey = function chCbAtKey(res, isErr) {
        if (completed) {
          return;
        }

        if (isErr) {
          // Race Auto cancellation
          cb.cancel();
          cb(res, true);
        } else if (!isEnd(res) && res !== CHANNEL_END && res !== TASK_CANCEL) {
          var _response;

          cb.cancel();
          completed = true;
          var response = (_response = {}, _response[key] = res, _response);
          cb(is.array(effects) ? [].slice.call(_extends$2({}, response, { length: keys.length })) : response);
        }
      };
      chCbAtKey.cancel = noop;
      childCbs[key] = chCbAtKey;
    });

    cb.cancel = function () {
      // prevents unnecessary cancellation
      if (!completed) {
        completed = true;
        keys.forEach(function (key) {
          return childCbs[key].cancel();
        });
      }
    };
    keys.forEach(function (key) {
      if (completed) {
        return;
      }
      runEffect(effects[key], effectId, key, childCbs[key]);
    });
  }

  function runSelectEffect(_ref7, cb) {
    var selector = _ref7.selector,
        args = _ref7.args;

    try {
      var state = selector.apply(undefined, [getState()].concat(args));
      cb(state);
    } catch (error) {
      cb(error, true);
    }
  }

  function runChannelEffect(_ref8, cb) {
    var pattern = _ref8.pattern,
        buffer = _ref8.buffer;

    var match = matcher(pattern);
    match.pattern = pattern;
    cb(eventChannel(subscribe, buffer || buffers.fixed(), match));
  }

  function runCancelledEffect(data, cb) {
    cb(!!mainTask.isCancelled);
  }

  function runFlushEffect(channel, cb) {
    channel.flush(cb);
  }

  function runGetContextEffect(prop, cb) {
    cb(taskContext[prop]);
  }

  function runSetContextEffect(props, cb) {
    object$1.assign(taskContext, props);
    cb();
  }

  function newTask(id, name, iterator, cont) {
    var _done, _ref9, _mutatorMap;

    iterator._deferredEnd = null;
    return _ref9 = {}, _ref9[TASK] = true, _ref9.id = id, _ref9.name = name, _done = 'done', _mutatorMap = {}, _mutatorMap[_done] = _mutatorMap[_done] || {}, _mutatorMap[_done].get = function () {
      if (iterator._deferredEnd) {
        return iterator._deferredEnd.promise;
      } else {
        var def = deferred();
        iterator._deferredEnd = def;
        if (!iterator._isRunning) {
          iterator._error ? def.reject(iterator._error) : def.resolve(iterator._result);
        }
        return def.promise;
      }
    }, _ref9.cont = cont, _ref9.joiners = [], _ref9.cancel = cancel, _ref9.isRunning = function isRunning() {
      return iterator._isRunning;
    }, _ref9.isCancelled = function isCancelled() {
      return iterator._isCancelled;
    }, _ref9.isAborted = function isAborted() {
      return iterator._isAborted;
    }, _ref9.result = function result() {
      return iterator._result;
    }, _ref9.error = function error() {
      return iterator._error;
    }, _ref9.setContext = function setContext(props) {
      check(props, is.object, createSetContextWarning('task', props));
      object$1.assign(taskContext, props);
    }, _defineEnumerableProperties(_ref9, _mutatorMap), _ref9;
  }
}

var RUN_SAGA_SIGNATURE = 'runSaga(storeInterface, saga, ...args)';
var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ': saga argument must be a Generator function!';

function runSaga(storeInterface, saga) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var iterator = void 0;

  if (is.iterator(storeInterface)) {
    if (process.env.NODE_ENV === 'development') {
      log('warn', 'runSaga(iterator, storeInterface) has been deprecated in favor of ' + RUN_SAGA_SIGNATURE);
    }
    iterator = storeInterface;
    storeInterface = saga;
  } else {
    check(saga, is.func, NON_GENERATOR_ERR);
    iterator = saga.apply(undefined, args);
    check(iterator, is.iterator, NON_GENERATOR_ERR);
  }

  var _storeInterface = storeInterface,
      subscribe = _storeInterface.subscribe,
      dispatch = _storeInterface.dispatch,
      getState = _storeInterface.getState,
      context = _storeInterface.context,
      sagaMonitor = _storeInterface.sagaMonitor,
      logger = _storeInterface.logger,
      onError = _storeInterface.onError;


  var effectId = uid();

  if (sagaMonitor) {
    // monitors are expected to have a certain interface, let's fill-in any missing ones
    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop;
    sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop;
    sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop;
    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop;
    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop;

    sagaMonitor.effectTriggered({ effectId: effectId, root: true, parentEffectId: 0, effect: { root: true, saga: saga, args: args } });
  }

  var task = proc(iterator, subscribe, wrapSagaDispatch(dispatch), getState, context, { sagaMonitor: sagaMonitor, logger: logger, onError: onError }, effectId, saga.name);

  if (sagaMonitor) {
    sagaMonitor.effectResolved(effectId, task);
  }

  return task;
}

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function sagaMiddlewareFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref$context = _ref.context,
      context = _ref$context === undefined ? {} : _ref$context,
      options = _objectWithoutProperties(_ref, ['context']);

  var sagaMonitor = options.sagaMonitor,
      logger = options.logger,
      onError = options.onError;


  if (is.func(options)) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Saga middleware no longer accept Generator functions. Use sagaMiddleware.run instead');
    } else {
      throw new Error('You passed a function to the Saga middleware. You are likely trying to start a        Saga by directly passing it to the middleware. This is no longer possible starting from 0.10.0.        To run a Saga, you must do it dynamically AFTER mounting the middleware into the store.\n        Example:\n          import createSagaMiddleware from \'redux-saga\'\n          ... other imports\n\n          const sagaMiddleware = createSagaMiddleware()\n          const store = createStore(reducer, applyMiddleware(sagaMiddleware))\n          sagaMiddleware.run(saga, ...args)\n      ');
    }
  }

  if (logger && !is.func(logger)) {
    throw new Error('`options.logger` passed to the Saga middleware is not a function!');
  }

  if (process.env.NODE_ENV === 'development' && options.onerror) {
    throw new Error('`options.onerror` was removed. Use `options.onError` instead.');
  }

  if (onError && !is.func(onError)) {
    throw new Error('`options.onError` passed to the Saga middleware is not a function!');
  }

  if (options.emitter && !is.func(options.emitter)) {
    throw new Error('`options.emitter` passed to the Saga middleware is not a function!');
  }

  function sagaMiddleware(_ref2) {
    var getState = _ref2.getState,
        dispatch = _ref2.dispatch;

    var sagaEmitter = emitter();
    sagaEmitter.emit = (options.emitter || ident)(sagaEmitter.emit);

    sagaMiddleware.run = runSaga.bind(null, {
      context: context,
      subscribe: sagaEmitter.subscribe,
      dispatch: dispatch,
      getState: getState,
      sagaMonitor: sagaMonitor,
      logger: logger,
      onError: onError
    });

    return function (next) {
      return function (action) {
        if (sagaMonitor && sagaMonitor.actionDispatched) {
          sagaMonitor.actionDispatched(action);
        }
        var result = next(action); // hit reducers
        sagaEmitter.emit(action);
        return result;
      };
    };
  }

  sagaMiddleware.run = function () {
    throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
  };

  sagaMiddleware.setContext = function (props) {
    check(props, is.object, createSetContextWarning('sagaMiddleware', props));
    object$1.assign(context, props);
  };

  return sagaMiddleware;
}

var done = { done: true, value: undefined };
var qEnd = {};

function safeName(patternOrChannel) {
  if (is.channel(patternOrChannel)) {
    return 'channel';
  } else if (Array.isArray(patternOrChannel)) {
    return String(patternOrChannel.map(function (entry) {
      return String(entry);
    }));
  } else {
    return String(patternOrChannel);
  }
}

function fsmIterator(fsm, q0) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iterator';

  var updateState = void 0,
      qNext = q0;

  function next(arg, error) {
    if (qNext === qEnd) {
      return done;
    }

    if (error) {
      qNext = qEnd;
      throw error;
    } else {
      updateState && updateState(arg);

      var _fsm$qNext = fsm[qNext](),
          q = _fsm$qNext[0],
          output = _fsm$qNext[1],
          _updateState = _fsm$qNext[2];

      qNext = q;
      updateState = _updateState;
      return qNext === qEnd ? done : output;
    }
  }

  return makeIterator(next, function (error) {
    return next(null, error);
  }, name, true);
}

function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = { done: false, value: take(patternOrChannel) };
  var yFork = function yFork(ac) {
    return { done: false, value: fork.apply(undefined, [worker].concat(args, [ac])) };
  };

  var action = void 0,
      setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return ['q2', yTake, setAction];
    },
    q2: function q2() {
      return action === END ? [qEnd] : ['q1', yFork(action)];
    }
  }, 'q1', 'takeEvery(' + safeName(patternOrChannel) + ', ' + worker.name + ')');
}

function takeEvery$1(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return fork.apply(undefined, [takeEvery, patternOrChannel, worker].concat(args));
}

var SYNC_IP_APPS = '[MAIN] Sync IP apps';
var initialState$4 = {};
var reducer$3 = function (state, action) {
    if (state === void 0) { state = initialState$4; }
    switch (action.type) {
        case SYNC_IP_APPS: {
            return action.payload;
        }
        default:
            return state;
    }
};

var TRANSFER_TRANSACTIONS = '[MAIN] Transfer transactions';
var initialState$5 = {};
var reducer$4 = function (state, action) {
    var _a, _b;
    if (state === void 0) { state = initialState$5; }
    switch (action.type) {
        case TRANSFER_TRANSACTIONS: {
            var payload = action.payload;
            return __assign(__assign({}, state), (_a = {}, _a[payload.origin.dappId] = __assign(__assign({}, (state[payload.origin.dappId] || {})), (_b = {}, _b[payload.id] = payload, _b)), _a));
        }
        default:
            return state;
    }
};
var getTransactionsMainState = lib_4(function (state) { return state; }, function (state) { return state.transactions; });
var getTransactionsMain = lib_4(getTransactionsMainState, function (state) { return state; });

var TRANSFER_IDENTIFICATIONS = '[MAIN] Transfer identification';
var initialState$6 = {};
var reducer$5 = function (state, action) {
    var _a, _b;
    if (state === void 0) { state = initialState$6; }
    switch (action.type) {
        case TRANSFER_IDENTIFICATIONS: {
            var payload = action.payload;
            return __assign(__assign({}, state), (_a = {}, _a[payload.dappId] = __assign(__assign({}, state[payload.dappId]), (_b = {}, _b[payload.callId] = payload.identification, _b)), _a));
        }
        default:
            return state;
    }
};
var getIdentificationsMainState = lib_4(function (state) { return state; }, function (state) { return state.identifications; });
var getIdentificationsMain = lib_4(getIdentificationsMainState, function (state) { return state; });

var OPEN_DAPP_MODAL = '[Main] Open dapp modal';
var openDappModalAction = function (values) { return ({
    type: OPEN_DAPP_MODAL,
    payload: values,
}); };

var LOAD_RESOURCE = '[Dapps] Load resource';
var UPDATE_TRANSITORY_STATE = '[Dapps] Update transitory state';
var loadResourceAction = function (payload) { return ({
    type: LOAD_RESOURCE,
    payload: payload,
}); };
var updateTransitoryStateAction = function (values) { return ({
    type: UPDATE_TRANSITORY_STATE,
    payload: values,
}); };

// SELECTORS
var getDappsState = lib_4(function (state) { return state; }, function (state) { return state.dapps; });
var getSearch = lib_4(getDappsState, function (state) { return state.search; });
var getSearchError = lib_4(getDappsState, function (state) { return state.searchError; });
var getSearching = lib_4(getDappsState, function (state) { return state.searching; });
var getLastLoadErrors = lib_4(getDappsState, function (state) { return state.lastLoadErrors; });
var getLoadStates = lib_4(getDappsState, function (state) { return state.loadStates; });
var getDapps$1 = lib_4(getDappsState, function (state) { return state.dapps; });
var getTabsFocusOrder = lib_4(getDappsState, function (state) { return state.tabsFocusOrder; });
var getTabs = lib_4(getDappsState, function (state) { return state.tabs; });
var getDappsTransitoryStates = lib_4(getDappsState, function (state) { return state.transitoryStates; });
var getIdentifications = lib_4(getDappsState, function (state) { return state.identifications; });
var getLoadedFiles = lib_4(getDappsState, function (state) { return state.loadedFiles; });
var getIpApps = lib_4(getDappsState, function (state) { return state.ipApps; });
// COMBINED SELECTORS
var getIsSearchFocused = lib_4(getTabsFocusOrder, function (tabsFocusOrder) { return tabsFocusOrder[tabsFocusOrder.length - 1] === 'search'; });
var getTabsFocusOrderWithoutSearch = lib_4(getTabsFocusOrder, function (tabsFocusOrder) {
    return tabsFocusOrder.filter(function (d) { return d !== 'search'; });
});
var getFocusedTabId = lib_4(getTabsFocusOrderWithoutSearch, function (tabsFocusOrder) { return tabsFocusOrder[tabsFocusOrder.length - 1]; });
var getSearchTransitoryState = lib_4(getSearch, getDappsTransitoryStates, function (search, transitoryStates) { return transitoryStates[search]; });
var getSearchLoadStates = lib_4(getSearch, getLoadStates, function (search, loadStates) { return (search ? loadStates[search] : undefined); });
var getActiveTabs = lib_4(getTabs, function (tabs) {
    var activeTabs = {};
    tabs.forEach(function (t) {
        if (t.active) {
            activeTabs[t.id] = t;
        }
    });
    return activeTabs;
});
var getActiveResource = lib_4(getFocusedTabId, getTabs, getDapps$1, getIpApps, getLoadedFiles, function (focusedTabId, tabs, dapps, ipApps, loadedFiles) {
    var tab = tabs.find(function (t) { return t.id === focusedTabId; });
    if (!tab) {
        return undefined;
    }
    if (dapps[tab.resourceId]) {
        return dapps[tab.resourceId];
    }
    else if (ipApps[tab.resourceId]) {
        return ipApps[tab.resourceId];
    }
    else if (loadedFiles[tab.resourceId]) {
        return loadedFiles[tab.resourceId];
    }
    return undefined;
});

// SELECTORS
var getUiState = lib_4(function (state) { return state; }, function (state) { return state.ui; });
var getLanguage = lib_4(getUiState, function (state) { return state.language; });
var getMenuCollapsed = lib_4(getUiState, function (state) { return state.menuCollapsed; });
var getDappsListDisplay = lib_4(getUiState, function (state) { return state.dappsListDisplay; });
var getDevMode = lib_4(getUiState, function (state) { return state.devMode; });
var getNavigationUrl = lib_4(getUiState, function (state) { return state.navigationUrl; });
var getBodyDimensions = lib_4(getUiState, function (state) { return state.windowDimensions; });
var getNavigationSuggestionsDisplayed = lib_4(getUiState, function (state) { return state.navigationSuggestionsDisplayed; });
var getIsMobile = lib_4(getBodyDimensions, function (dimensions) { return !!(dimensions && dimensions[0] <= 769); });
var getIsTablet = lib_4(getBodyDimensions, function (dimensions) { return !!(dimensions && dimensions[0] <= 959); });
var getIsNavigationInSettings = lib_4(getNavigationUrl, function (navigationUrl) {
    return navigationUrl.startsWith('/settings');
});
var getIsNavigationInAccounts = lib_4(getNavigationUrl, function (navigationUrl) {
    return navigationUrl.startsWith('/accounts');
});
var getIsNavigationInDapps = lib_4(getNavigationUrl, function (navigationUrl) { return navigationUrl === '/' || navigationUrl.startsWith('/dapps'); });
var getIsNavigationInDeploy = lib_4(getNavigationUrl, function (navigationUrl) {
    return navigationUrl.startsWith('/deploy');
});
var getIsNavigationInTransactions = lib_4(getNavigationUrl, function (navigationUrl) {
    return navigationUrl.startsWith('/transactions');
});

// SELECTORS
var getMainState = lib_4(function (state) { return state; }, function (state) { return state.main; });
var getErrors = lib_4(getMainState, function (state) { return state.errors; });
var getModal = lib_4(getMainState, function (state) { return state.modals[0]; });
var getDappModals = lib_4(getMainState, function (state) { return state.dappModals; });
var getCurrentVersion = lib_4(getMainState, function (state) { return state.currentVersion; });
var getIsBeta = lib_4(getMainState, function (state) { return state.isBeta; });
var getInitializationOver = lib_4(getMainState, function (state) { return state.initializationOver; });
var getDispatchWhenInitializationOver = lib_4(getMainState, function (state) { return state.dispatchWhenInitializationOver; });
var getLoadResourceWhenReady = lib_4(getMainState, function (state) { return state.loadResourceWhenReady; });
var getShouldBrowserViewsBeDisplayed = lib_4(getIsNavigationInDapps, getNavigationSuggestionsDisplayed, getDappModals, getTabsFocusOrder, getTabs, function (isNavigationInDapps, navigationSuggestionsDisplayed, dappModals, tabsFocusOrder, tabs) {
    if (!navigationSuggestionsDisplayed && isNavigationInDapps && tabsFocusOrder.length > 0) {
        var tab = tabs.find(function (t) { return t.id === tabsFocusOrder[tabsFocusOrder.length - 1]; });
        // should always be true
        if (tab && (!dappModals[tab.resourceId] || dappModals[tab.resourceId].length === 0)) {
            return tab.resourceId;
        }
        return undefined;
    }
    else {
        return undefined;
    }
});

var splitSearch = function (address) {
    var split = address.split('/');
    var chainId = split[0];
    var search = split.slice(1).join('/');
    var path = '';
    var ioSlash = search.indexOf('/');
    var ioInt = search.indexOf('?');
    if (ioSlash !== -1 && (ioInt === -1 || ioInt > ioSlash)) {
        path = search.slice(ioSlash);
        search = search.slice(0, ioSlash);
    }
    else if (ioInt !== -1 && (ioSlash === -1 || ioSlash > ioInt)) {
        path = search.slice(ioInt);
        search = search.slice(0, ioInt);
    }
    return {
        chainId: chainId,
        search: search,
        path: path,
    };
};

var identifyFromSandboxSchema = lib_9()
    .shape({
    parameters: lib_9()
        .shape({
        publicKey: lib_6(),
    })
        .noUnknown()
        .strict(true)
        .required(),
    callId: lib_6().required(),
    dappId: lib_6().required(),
    randomId: lib_6().required(),
})
    .noUnknown()
    .strict(true)
    .required();
var sendRChainPaymentRequestFromSandboxSchema = lib_9()
    .shape({
    parameters: lib_9()
        .shape({
        from: lib_6(),
        // .to is required when it comes from dapp
        to: lib_6().required(),
        // .amount is required when it comes from dapp
        amount: lib_7().required(),
    })
        .noUnknown()
        .strict(true)
        .required(),
    callId: lib_6().required(),
    dappId: lib_6().required(),
    randomId: lib_6().required(),
})
    .strict(true)
    .noUnknown()
    .required();
var sendRChainTransactionFromSandboxSchema = lib_9()
    .shape({
    parameters: lib_9()
        .shape({
        term: lib_6().required(),
        signatures: lib_9(),
    })
        .noUnknown()
        .required()
        .strict(true),
    callId: lib_6().required(),
    dappId: lib_6().required(),
    randomId: lib_6().required(),
})
    .strict(true)
    .noUnknown()
    .required();
/* browser process - main process */
var registerInterProcessDappProtocol = function (session, store, dispatchFromMain) {
    session.protocol.registerBufferProtocol('interprocessdapp', function (request, callback) {
        var id;
        var data;
        var browserViews = getBrowserViewsMain(store.getState());
        try {
            data = JSON.parse(request.headers['Data']);
            id = Object.keys(browserViews).find(function (k) { return browserViews[k].randomId === data.randomId; });
            if (!id) {
                console.error('Could not find browser view from hi-from-dapp-sandboxed message');
                console.log('data.randomId', data.randomId);
                console.log(Object.keys(browserViews).map(function (k) { return browserViews[k].randomId; }));
                callback(Buffer.from(''));
                return;
            }
        }
        catch (e) {
            console.error('Error in hi-from-dapp-sandboxed message');
            console.log(e);
            callback(Buffer.from(''));
            return;
        }
        var browserView = browserViews[id];
        if (request.url === 'interprocessdapp://hi-from-dapp-sandboxed') {
            try {
                callback(Buffer.from(JSON.stringify({
                    type: DAPP_INITIAL_SETUP,
                    payload: {
                        html: browserView.html,
                        address: browserView.address,
                        path: browserView.path,
                        title: browserView.title,
                        dappId: browserView.resourceId,
                        randomId: browserView.randomId,
                        appPath: path.join(electron.app.getAppPath(), 'dist/'),
                    },
                })));
            }
            catch (err) {
                console.error('Could not get randomId from hi-from-dapp-sandboxed message');
                callback(Buffer.from(''));
                return;
            }
        }
        if (request.url === 'interprocessdapp://get-identifications') {
            var identifications = getIdentificationsMain(store.getState());
            callback(Buffer.from(JSON.stringify({ identifications: identifications[browserView.resourceId] })));
        }
        if (request.url === 'interprocessdapp://get-transactions') {
            var transactions = getTransactionsMain(store.getState());
            callback(Buffer.from(JSON.stringify({ transactions: transactions[browserView.resourceId] })));
        }
        if (request.url === 'interprocessdapp://message-from-dapp-sandboxed') {
            try {
                var state = store.getState();
                var payloadBeforeValid_1 = data.action.payload;
                if (!payloadBeforeValid_1 || !payloadBeforeValid_1.randomId || !payloadBeforeValid_1.dappId) {
                    if (payloadBeforeValid_1) {
                        console.error('A dapp dispatched a transaction with an invalid payload');
                    }
                    else {
                        console.error('A dapp dispatched a transaction with an invalid payload, randomId : ' +
                            payloadBeforeValid_1.randomId +
                            ', dappId : ' +
                            payloadBeforeValid_1.dappId);
                    }
                    callback(Buffer.from(''));
                    return;
                }
                var okBlockchains = getOkBlockchainsMain(state);
                var searchSplitted_1 = undefined;
                try {
                    searchSplitted_1 = splitSearch(payloadBeforeValid_1.dappId);
                    if (!okBlockchains[searchSplitted_1.chainId]) {
                        dispatchFromMain({
                            action: saveFailedRChainTransactionAction({
                                blockchainId: searchSplitted_1.chainId,
                                platform: 'rchain',
                                origin: {
                                    origin: 'dapp',
                                    dappId: browserView.resourceId,
                                    dappTitle: browserView.title,
                                    callId: payloadBeforeValid_1.callId,
                                },
                                value: { message: "blockchain " + searchSplitted_1.chainId + " not available" },
                                sentAt: new Date().toISOString(),
                                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
                            }),
                        });
                        console.error("blockchain " + searchSplitted_1.chainId + " not available");
                        callback(Buffer.from(''));
                        return;
                    }
                    if (browserView.resourceId !== payloadBeforeValid_1.dappId) {
                        dispatchFromMain({
                            action: saveFailedRChainTransactionAction({
                                blockchainId: searchSplitted_1.chainId,
                                platform: 'rchain',
                                origin: {
                                    origin: 'dapp',
                                    dappId: browserView.resourceId,
                                    dappTitle: browserView.title,
                                    callId: payloadBeforeValid_1.callId,
                                },
                                value: { message: "Wrong id, identity theft attempt" },
                                sentAt: new Date().toISOString(),
                                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
                            }),
                        });
                        console.error('A dapp dispatched a transaction with randomId and dappId that do not match ' +
                            'dappId from payload: ' +
                            payloadBeforeValid_1.dappId +
                            ', dappId found from randomId: ' +
                            browserView.resourceId);
                        callback(Buffer.from(''));
                        return;
                    }
                }
                catch (err) {
                    console.error('Unknown error');
                    console.error(err);
                    callback(Buffer.from(''));
                    return;
                }
                if (data.action.type === SEND_RCHAIN_TRANSACTION_FROM_SANDBOX) {
                    sendRChainTransactionFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function (valid) {
                        if (payloadBeforeValid_1.parameters.signatures) {
                            Object.keys(payloadBeforeValid_1.parameters.signatures).forEach(function (k) {
                                if (typeof k !== 'string' || typeof payloadBeforeValid_1.parameters.signatures[k] !== 'string') {
                                    throw new Error('payloadBeforeValid.parameters.signatures is not valid');
                                }
                            });
                        }
                        var payload = payloadBeforeValid_1;
                        var id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        var payload2 = {
                            parameters: payload.parameters,
                            origin: {
                                origin: 'dapp',
                                dappId: payload.dappId,
                                dappTitle: browserView.title,
                                callId: payload.callId,
                            },
                            chainId: searchSplitted_1.chainId,
                            dappId: payload.dappId,
                            id: id,
                        };
                        dispatchFromMain({
                            action: openDappModalAction({
                                dappId: payload.dappId,
                                title: 'TRANSACTION_MODAL',
                                text: '',
                                parameters: payload2,
                                buttons: [],
                            }),
                        });
                        callback(Buffer.from(''));
                    })
                        .catch(function (err) {
                        // todo : does the dapp need to have this error returned ?
                        console.error('A dapp tried to send RChain transaction with an invalid schema');
                        console.error(err);
                        return;
                    });
                }
                else if (data.action.type === SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX) {
                    sendRChainPaymentRequestFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function () {
                        var payload = payloadBeforeValid_1;
                        var id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        var payload2 = {
                            parameters: payload.parameters,
                            origin: {
                                origin: 'dapp',
                                dappId: payload.dappId,
                                dappTitle: browserView.title,
                                callId: payload.callId,
                            },
                            chainId: searchSplitted_1.chainId,
                            dappId: payload.dappId,
                            id: id,
                        };
                        dispatchFromMain({
                            action: openDappModalAction({
                                dappId: browserView.resourceId,
                                title: 'PAYMENT_REQUEST_MODAL',
                                text: '',
                                parameters: payload2,
                                buttons: [],
                            }),
                        });
                        callback(Buffer.from(''));
                    })
                        .catch(function (err) {
                        // todo : does the dapp need to have this error returned ?
                        console.error('A dapp tried to send RChain transaction with an invalid schema');
                        console.error(err);
                        return;
                    });
                }
                else if (data.action.type === IDENTIFY_FROM_SANDBOX) {
                    identifyFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function (valid) {
                        dispatchFromMain({
                            action: openDappModalAction({
                                dappId: payloadBeforeValid_1.dappId,
                                title: 'IDENTIFICATION_MODAL',
                                text: '',
                                parameters: payloadBeforeValid_1,
                                buttons: [],
                            }),
                        });
                        callback(Buffer.from(''));
                    })
                        .catch(function (err) {
                        console.error('A dapp tried to trigger an identification with an invalid schema');
                        console.error(err);
                    });
                }
            }
            catch (err) {
                console.error('An error occured when checking message-from-dapp-sandboxed');
                console.error(err);
            }
        }
    });
};

var UPDATE_PREVIEW = '[History] Update preview';
var DID_CHANGE_FAVICON = '[History] Page favicon did update';
var DID_NAVIGATE_IN_PAGE = '[History] Did navigate in page';
var updatePreviewAction = function (values) { return ({
    type: UPDATE_PREVIEW,
    payload: values,
}); };
var didNavigateInPageAction = function (values) { return ({
    type: DID_NAVIGATE_IN_PAGE,
    payload: values,
}); };
var didChangeFaviconAction = function (values) { return ({
    type: DID_CHANGE_FAVICON,
    payload: values,
}); };

// SELECTORS
var getHistoryState = lib_4(function (state) { return state; }, function (state) { return state.history; });
var getSessions = lib_4(getHistoryState, function (state) { return state.sessions; });
var getPreviews = lib_4(getHistoryState, function (state) { return state.previews; });
// COMBINED SELECTORS
var getCanGoForward = lib_4(getSessions, getFocusedTabId, function (sessions, focusedTabId) {
    var session = sessions[focusedTabId];
    if (!session) {
        return false;
    }
    return !!session.items[session.cursor + 1];
});
var getCanGoBackward = lib_4(getSessions, getActiveResource, getFocusedTabId, function (sessions, activeResource, focusedTabId) {
    var session = sessions[focusedTabId];
    if (!session) {
        return false;
    }
    if (!activeResource && session.items[session.cursor]) {
        return true;
    }
    return !!session.items[session.cursor - 1];
});

var decomposeUrl = function (url) {
    if (typeof url !== 'string') {
        throw new Error('Invalid url');
    }
    if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url)) {
        var protocolArray = url.split('//');
        var protocol = protocolArray[0].substr(0, protocolArray[0].length - 1);
        var withoutProtocol = protocolArray.slice(1).join('//');
        var pathArray = withoutProtocol.split('/');
        var host = pathArray.slice(0, 1)[0];
        var path = '/' + pathArray.slice(1).join('/');
        return {
            protocol: protocol,
            host: host,
            path: path,
        };
    }
    else {
        throw new Error('Invalid url');
    }
};

var searchToAddress = function (name, chainId) {
    return chainId + "/" + name;
};

var development = !!process.defaultApp;
var loadOrReloadBrowserView = function (action) {
    var payload, browserViews, position, view, ua, newUserAgent, previewId, currentPathAndParameters, newBrowserViews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 1:
                browserViews = _a.sent();
                return [4 /*yield*/, select(getBrowserViewsPositionMain)];
            case 2:
                position = _a.sent();
                // reload
                if (browserViews[payload.resourceId]) {
                    electron.session.fromPartition("persist:" + payload.address).protocol.unregisterProtocol('dappy');
                    if (browserViews[payload.resourceId].browserView.webContents.isDevToolsOpened()) {
                        browserViews[payload.resourceId].browserView.webContents.closeDevTools();
                        browserViews[payload.resourceId].browserView.webContents.forcefullyCrashRenderer();
                    }
                    action.meta.browserWindow.removeBrowserView(browserViews[payload.resourceId].browserView);
                }
                if (!position) {
                    console.error('No position, cannot create browserView');
                    return [2 /*return*/, undefined];
                }
                view = new electron.BrowserView({
                    webPreferences: {
                        devTools: true,
                        disableDialogs: true,
                        partition: "persist:" + payload.address,
                        // sandbox forbids the navigation
                        //sandbox: true,
                        contextIsolation: true,
                    },
                });
                // cookies to start with (from storage)
                payload.cookies.map(function (c) {
                    view.webContents.session.cookies.set(__assign(__assign({}, c), { url: "https://" + c.domain, secure: true, httpOnly: true }));
                });
                // todo, avoid circular ref to "store" (see logs when "npm run build:main")
                registerDappyProtocol(electron.session.fromPartition("persist:" + payload.address), store.getState);
                registerInterProcessDappProtocol(electron.session.fromPartition("persist:" + payload.address), store, action.meta.dispatchFromMain);
                overrideHttpProtocols(electron.session.fromPartition("persist:" + payload.address), store.getState, development, action.meta.dispatchFromMain, false);
                if (payload.devMode) {
                    view.webContents.openDevTools();
                }
                if (payload.muted) {
                    browserViews[payload.resourceId].browserView.webContents.setAudioMuted(payload.muted);
                }
                ua = view.webContents.getUserAgent();
                newUserAgent = ua + " randomId=" + payload.randomId;
                view.webContents.setUserAgent(newUserAgent);
                action.meta.browserWindow.addBrowserView(view);
                view.setBounds(position);
                /* browser to server */
                // In the case of IP apps, payload.currentUrl is a https://xx address
                view.webContents.loadURL(payload.currentUrl === 'dist/dapp-sandboxed.html'
                    ? path.join('file://', electron.app.getAppPath(), 'dist/dapp-sandboxed.html') + payload.path
                    : payload.currentUrl);
                currentPathAndParameters = '';
                view.webContents.addListener('did-navigate', function (a, currentUrl, httpResponseCode, httpStatusText) {
                    // todo handle httpResponseCode, httpStatusText
                    // if dapp
                    var url = new URL(currentUrl);
                    currentPathAndParameters = url.search;
                    // todo handle path for dapps, and not only IP apps
                    // if IP apps
                    if (!currentUrl.startsWith('file://')) {
                        try {
                            currentPathAndParameters = url.pathname + url.search;
                        }
                        catch (err) {
                            console.error('Could not parse URL ' + currentUrl);
                        }
                    }
                    previewId = ("" + payload.address + currentPathAndParameters).replace(/\W/g, '');
                    action.meta.dispatchFromMain({
                        action: didNavigateInPageAction({
                            previewId: previewId,
                            address: "" + payload.address + currentPathAndParameters,
                            tabId: payload.tabId,
                            title: view.webContents.getTitle(),
                        }),
                    });
                });
                view.webContents.addListener('new-window', function (e) {
                    e.preventDefault();
                });
                // contextMenu.ts
                /*
                  IP app will instantly execute window.initContextMenu();
                  Dapp will wait for DAPP_INITIAL_SETUP and then execute window.initContextMenu();
                */
                view.webContents.executeJavaScript("\n  window.initContextMenu = () => { const paste=[\"Paste\",(e,t,o)=>{navigator.clipboard.readText().then(function(e){const t=o.value,n=o.selectionStart;o.value=t.slice(0,n)+e+t.slice(n)}),e.remove()}],copy=[\"Copy\",(e,t,o)=>{navigator.clipboard.writeText(t),e.remove()}];document.addEventListener(\"contextmenu\",e=>{let t=[];const o=window.getSelection()&&window.getSelection().toString();if(o&&(t=[copy]),\"TEXTAREA\"!==e.target.tagName&&\"INPUT\"!==e.target.tagName||(t=t.concat([paste])),0===t.length)return;const n=document.createElement(\"div\");n.className=\"context-menu\",n.style.width=\"160px\",n.style.color=\"#fff\",n.style.backgroundColor=\"rgba(04, 04, 04, 0.8)\",n.style.top=e.clientY-5+\"px\",n.style.left=e.clientX-5+\"px\",n.style.position=\"absolute\",n.style.zIndex=10,n.style.fontSize=\"16px\",n.style.borderRadius=\"2px\",n.style.fontFamily=\"fira\",n.addEventListener(\"mouseleave\",()=>{n.remove()}),t.forEach(t=>{const l=document.createElement(\"div\");l.style.padding=\"6px\",l.style.cursor=\"pointer\",l.style.borderBottom=\"1px solid #aaa\",l.addEventListener(\"mouseenter\",()=>{console.log(\"onmouseenter\"),l.style.backgroundColor=\"rgba(255, 255, 255, 0.1)\",l.style.color=\"#fff\"}),l.addEventListener(\"mouseleave\",()=>{console.log(\"onmouseleave\"),l.style.backgroundColor=\"transparent\",l.style.color=\"#fff\"}),l.innerText=t[0],l.addEventListener(\"click\",()=>t[1](n,o,e.target)),n.appendChild(l)}),document.body.appendChild(n)}); }; window.initContextMenu();\n  ");
                view.webContents.addListener('page-favicon-updated', function (a, favicons) {
                    if (favicons && favicons[0] && typeof favicons[0] === 'string') {
                        if (favicons[0].startsWith('data:image')) {
                            action.meta.dispatchFromMain({
                                action: didChangeFaviconAction({
                                    tabId: payload.tabId,
                                    img: favicons[0],
                                    previewId: previewId,
                                }),
                            });
                        }
                        else if (favicons[0].startsWith('https://')) {
                            try {
                                var urlDecomposed_1 = decomposeUrl(favicons[0]);
                                var serverAuthorized = payload.servers.find(function (s) { return s.host === urlDecomposed_1.host; });
                                if (!serverAuthorized) {
                                    console.error("Could not get favicon, no servers authorized to reach https address " + favicons[0]);
                                    return;
                                }
                                /* browser to server */
                                var a_1 = new https.Agent({
                                    /* no dns */
                                    host: serverAuthorized.ip,
                                    rejectUnauthorized: false,
                                    cert: decodeURI(serverAuthorized.cert),
                                    minVersion: 'TLSv1.2',
                                    ca: [],
                                });
                                https.get({
                                    agent: a_1,
                                    host: urlDecomposed_1.host,
                                    path: urlDecomposed_1.path,
                                    method: 'get',
                                }, function (res) {
                                    if (res.statusCode !== 200) {
                                        console.error("Could not get favicon (status !== 200) for " + payload.address + currentPath);
                                        console.log(favicons[0]);
                                        return;
                                    }
                                    var s = Buffer.from('');
                                    res.on('data', function (a) {
                                        s = Buffer.concat([s, a]);
                                    });
                                    res.on('end', function () {
                                        var faviconAsBase64 = 'data:' + res.headers['content-type'] + ';base64,' + s.toString('base64');
                                        action.meta.dispatchFromMain({
                                            action: didChangeFaviconAction({
                                                tabId: payload.tabId,
                                                previewId: previewId,
                                                img: faviconAsBase64,
                                            }),
                                        });
                                    });
                                });
                            }
                            catch (err) {
                                console.error('[dapp] Could not get favicon ' + favicons[0]);
                                console.log(err);
                            }
                        }
                    }
                });
                view.webContents.addListener('page-title-updated', function (a, title) {
                    action.meta.dispatchFromMain({
                        action: updatePreviewAction({
                            tabId: payload.tabId,
                            previewId: previewId,
                            title: title,
                        }),
                    });
                });
                view.webContents.addListener('will-navigate', function (a, url) {
                    var urlDecomposed;
                    try {
                        urlDecomposed = decomposeUrl(url);
                    }
                    catch (err) {
                        console.error('[dapp] will-navigate invalid URL ' + url);
                        console.log(err);
                        a.preventDefault();
                        return;
                    }
                    if (urlDecomposed.protocol === 'dappy') {
                        var s = void 0;
                        if (validateSearch("" + urlDecomposed.host + urlDecomposed.path)) {
                            s = "" + urlDecomposed.host + urlDecomposed.path;
                        }
                        else {
                            s = searchToAddress(urlDecomposed.path, payload.address.split('/')[0]);
                        }
                        a.preventDefault();
                        action.meta.dispatchFromMain({
                            action: loadResourceAction({
                                address: s,
                                tabId: payload.tabId,
                            }),
                        });
                    }
                    else {
                        var serverAuthorized = payload.servers.find(function (s) { return s.primary && s.host === urlDecomposed.host; });
                        // If the navigation url is not bound to an authorized server
                        if (!serverAuthorized) {
                            a.preventDefault();
                            action.meta.openExternal(url);
                        }
                    }
                });
                view.webContents.addListener('did-finish-load', function (a) {
                    action.meta.dispatchFromMain({
                        action: updateTransitoryStateAction({
                            resourceId: payload.resourceId,
                            transitoryState: undefined,
                        }),
                    });
                });
                view.webContents.addListener('did-stop-loading', function (a) {
                    action.meta.dispatchFromMain({
                        action: updateTransitoryStateAction({
                            resourceId: payload.resourceId,
                            transitoryState: undefined,
                        }),
                    });
                });
                newBrowserViews = {};
                newBrowserViews[payload.resourceId] = __assign(__assign({}, payload), { browserView: view, commEvent: undefined, visible: true });
                Object.keys(browserViews).forEach(function (id) {
                    var _a;
                    if (id !== payload.resourceId && browserViews[id].visible) {
                        browserViews[id].browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
                        newBrowserViews = __assign(__assign({}, newBrowserViews), (_a = {}, _a[id] = __assign(__assign({}, browserViews[id]), { visible: false }), _a));
                    }
                });
                return [4 /*yield*/, put({
                        type: LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED,
                        payload: newBrowserViews,
                    })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
};
var loadOrReloadBrowserViewSaga = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, takeEvery$1(LOAD_OR_RELOAD_BROWSER_VIEW, loadOrReloadBrowserView)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};

var displayOnlyBrowserViewX = function (action) {
    var payload, browserViews, position, newBrowserViews, modified;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 1:
                browserViews = _a.sent();
                return [4 /*yield*/, select(getBrowserViewsPositionMain)];
            case 2:
                position = _a.sent();
                newBrowserViews = {};
                modified = false;
                Object.keys(browserViews).forEach(function (id) {
                    var _a, _b;
                    if (id !== payload.resourceId && browserViews[id].visible) {
                        modified = true;
                        browserViews[id].browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
                        newBrowserViews = __assign(__assign({}, newBrowserViews), (_a = {}, _a[id] = __assign(__assign({}, browserViews[id]), { visible: false }), _a));
                    }
                    else if (id === payload.resourceId && !browserViews[id].visible) {
                        modified = true;
                        browserViews[id].browserView.setBounds(position);
                        newBrowserViews = __assign(__assign({}, newBrowserViews), (_b = {}, _b[id] = __assign(__assign({}, browserViews[id]), { visible: true }), _b));
                    }
                });
                if (!modified) return [3 /*break*/, 4];
                return [4 /*yield*/, put({
                        type: DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED,
                        payload: newBrowserViews,
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, undefined];
        }
    });
};
var displayOnlyBrowserViewXSaga = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, takeEvery$1(DISPLAY_ONLY_BROWSER_VIEW_X, displayOnlyBrowserViewX)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};

var setBrowserViewMuted = function (action) {
    var payload, browserViews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 1:
                browserViews = _a.sent();
                if (!browserViews[payload.resourceId]) {
                    console.error('Did not find browserView, cannot mute/unmute');
                    return [2 /*return*/];
                }
                browserViews[payload.resourceId].browserView.webContents.setAudioMuted(payload.muted);
                return [2 /*return*/, undefined];
        }
    });
};
var setBrowserViewMutedSaga = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, takeEvery$1(SET_BROWSER_VIEW_MUTED, setBrowserViewMuted)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};

var transferIdentifications = function (action) {
    var payload, browserViews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 1:
                browserViews = _a.sent();
                if (browserViews[payload.dappId] && browserViews[payload.dappId].browserView) {
                    try {
                        browserViews[payload.dappId].browserView.webContents.executeJavaScript("\n      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestIdentifications() };\n      ");
                    }
                    catch (e) {
                        console.error('Could not execute javascript and trasfer identification');
                    }
                }
                else {
                    console.error('Did not find browserView, cannot transfer identification');
                }
                return [2 /*return*/, undefined];
        }
    });
};
var transferIdentificationsSaga = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, takeEvery$1(TRANSFER_IDENTIFICATIONS, transferIdentifications)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};

var transferTransactions = function (action) {
    var payload, dappId, browserViews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                dappId = payload.origin.dappId;
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 1:
                browserViews = _a.sent();
                if (browserViews[dappId] && browserViews[dappId].browserView) {
                    try {
                        browserViews[dappId].browserView.webContents.executeJavaScript("\n      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestTransactions() };\n      ");
                    }
                    catch (e) {
                        console.error('Could not execute javascript and trasfer transactions');
                    }
                }
                else {
                    console.error('Did not find browserView, cannot transfer transactions');
                }
                return [2 /*return*/, undefined];
        }
    });
};
var transferTransactionsSaga = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, takeEvery$1(TRANSFER_TRANSACTIONS, transferTransactions)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};

var sagas = function rootSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, all([
                    loadOrReloadBrowserViewSaga(),
                    displayOnlyBrowserViewXSaga(),
                    setBrowserViewMutedSaga(),
                    transferTransactionsSaga(),
                    transferIdentificationsSaga(),
                ])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};

var rootSagas = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, all([sagas()])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
};
var sagaMiddleware = sagaMiddlewareFactory();
var store = createStore(combineReducers({
    settings: reducer$1,
    blockchains: reducer$2,
    ipApps: reducer$3,
    browserViews: reducer,
    transactions: reducer$4,
    identifications: reducer$5,
}), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSagas);

// Modules to control application life and create native browser window
electron.protocol.registerSchemesAsPrivileged([
    { scheme: 'dappy', privileges: { standard: true, secure: true, bypassCSP: true } },
]);
var development$1 = !!process.defaultApp;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var browserWindow;
/*
  MESSAGE FROM BROWSER VIEWS / TABS (dapps and IP apps)
  first message from dapps to get the initial payload
*/
/* tab process - main process */
electron.ipcMain.on('hi-from-dapp-sandboxed', function (commEvent, userAgent) {
    var browserViews = getBrowserViewsMain(store.getState());
    var randomId = '';
    try {
        var io = userAgent.indexOf('randomId=');
        randomId = userAgent.substring(io + 'randomId='.length);
        var id = Object.keys(browserViews).find(function (k) { return browserViews[k].randomId === randomId; });
        if (!id) {
            console.error('Could find browser view from hi-from-dapp-sandboxed message');
            return;
        }
        commEvent.reply('hi-from-dapp-sandboxed-reply', {
            type: DAPP_INITIAL_SETUP,
            payload: {
                html: browserViews[id].html,
                address: browserViews[id].address,
                path: browserViews[id].path,
                title: browserViews[id].title,
                dappId: browserViews[id].resourceId,
                randomId: browserViews[id].randomId,
                appPath: path.join(electron.app.getAppPath(), 'dist/'),
            },
        });
        store.dispatch({
            type: SAVE_BROWSER_VIEW_COMM_EVENT,
            payload: {
                id: id,
                commEvent: commEvent,
            },
        });
    }
    catch (err) {
        console.error('Could not get randomId from hi-from-dapp-sandboxed message');
        return;
    }
});
var dispatchesFromMainAwaiting = [];
var getDispatchesFromMainAwaiting = function () {
    var t = [].concat(dispatchesFromMainAwaiting);
    dispatchesFromMainAwaiting = [];
    return t;
};
var dispatchFromMain = function (a) {
    dispatchesFromMainAwaiting.push(a.action);
};
/*
  Open external link
*/
var openExternal = function (url) {
    electron.shell.openExternal(url);
};
var loadResourceWhenReady = undefined;
var getLoadResourceWhenReady$1 = function () { return loadResourceWhenReady; };
var validateAndProcessAddresses = function (addresses) {
    var validDappyAddress = addresses.find(function (a) {
        var withoutProtocol = a.replace('dappy://', '');
        return !withoutProtocol.startsWith('/') && validateSearch(withoutProtocol);
    });
    if (validDappyAddress) {
        if (browserWindow) {
            if (browserWindow.isMinimized()) {
                browserWindow.restore();
            }
            browserWindow.focus();
        }
        loadResourceWhenReady = validDappyAddress.replace('dappy://', '');
    }
};
validateAndProcessAddresses(process.argv);
// macOS only
electron.app.on('open-url', function (event, data) {
    validateAndProcessAddresses([data]);
});
electron.app.setAsDefaultProtocolClient('dappy');
var isSingleInstance = electron.app.requestSingleInstanceLock();
if (!isSingleInstance) {
    electron.app.quit();
}
electron.app.on('second-instance', function (event, argv, cwd) {
    validateAndProcessAddresses(argv);
    return;
});
function createWindow() {
    setInterval(function () {
        benchmarkCron(store.getState, dispatchFromMain);
    }, WS_RECONNECT_PERIOD);
    /*
      CAREFUL
      Partition is the cold storage identifier on the OS where dappy is installed,
      changing this will remove everything that is in dappy localStorage
      PRIVATE KEYS LOST, ACCOUNTS LOST, TABS LOST etc.....
    */
    var partition = "persist:dappy0.3.0";
    // Create the browser window.
    browserWindow = new electron.BrowserWindow({
        width: 1200,
        height: 800,
        // frame: false,
        webPreferences: {
            partition: partition,
            sandbox: true,
            contextIsolation: true,
        },
    });
    registerDappyProtocol(electron.session.fromPartition(partition), store.getState);
    overrideHttpProtocols(electron.session.fromPartition(partition), store.getState, development$1, dispatchFromMain, true);
    registerInterProcessProtocol(electron.session.fromPartition(partition), store, getLoadResourceWhenReady$1, openExternal, browserWindow, dispatchFromMain, getDispatchesFromMainAwaiting);
    browserWindow.setMenuBarVisibility(false);
    // and load the index.html of the app.
    if (development$1) {
        browserWindow.loadURL('http://localhost:3033');
    }
    else {
        browserWindow.loadFile('dist/index.html');
    }
    // Open the DevTools.
    // browserWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    browserWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        browserWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', createWindow);
// Quit when all windows are closed.
electron.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        electron.app.quit();
});
electron.app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow === null)
        createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
