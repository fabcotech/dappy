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
var DISPLAY_ONLY_BROWSER_VIEW_X = '[MAIN] Display only browser view x';
var DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED = '[MAIN] Display only browser view x completed';
var SET_BROWSER_VIEW_MUTED = '[MAIN] Set browser view muted';
var initialState = { browserViews: {}, position: undefined };
// todo DO a saga
var reducer = function (state, action) {
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

var WS_PAYLOAD_PAX_SIZE = 512000; // bits
var WS_RECONNECT_PERIOD = 10000;

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
var getDapps = lib_4(getDappsState, function (state) { return state.dapps; });
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
var getActiveResource = lib_4(getFocusedTabId, getTabs, getDapps, getIpApps, getLoadedFiles, function (focusedTabId, tabs, dapps, ipApps, loadedFiles) {
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

/* GENERATED CODE, only edit rholang/*.rho files*/
var deployBoxTerm_1 = (
  payload
) => {
  return `new basket,
  masterEntryCh,
  registerBoxReturnCh,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *masterEntryCh) |

  for (masterEntry <- masterEntryCh) {
    masterEntry!(("PUBLIC_REGISTER_BOX", { "boxId": "${payload.boxId}", "publicKey": "${payload.publicKey}" }, *registerBoxReturnCh)) |
    for (@r <- registerBoxReturnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, box) => {
          @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")!(box) |
          basket!({ "status": "completed", "boxId": "${payload.boxId}" }) |
          stdout!("completed, box registered")
        }
      }
    }
  }
}
`;
};

var deployBoxTerm = {
	deployBoxTerm: deployBoxTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var masterTerm_1 = (payload) => {
    return `new 
  basket,

  entryCh,
  entryUriCh,

  makePurseCh,
  transferToEscrowPurseCh,
  calculateFeeCh,
  initializeOCAPOnBoxCh,

  /*
    vault is the ultimate accessibility unforgeable in
    master contract, every data is stored in channels that
    derives from *vault unforgeable name

    // tree hash map of purses :
    thm <- @(*vault, "purses", "contract03")

    // tree hash map of purses data :
    thm <- @(*vault, "pursesData", "contract03")

    // contract's configs
    config <- @(*vault, "contractConfig", "contract03")

    // box's configs
    config <- @(*vault, "boxConfig", "box01")

    // boxes (rholang Map)
    box <- @(*vault, "boxes", "box01")

    // super keys of a given box
    superKeys <- @(*vault, "boxesSuperKeys", "box01")
  */
  vault,

  /*
    boxesThm and contractsThm only store the list
    of existing contracts / boxes, ex:
    boxesThm:
    { "box1": "exists", "mycoolbox": "exists" }

    Then each box is a Map stored at a unique channel
    (see above) and has the following structure:
    {
      [contractId: string]: Set(purseId: string)
    }

    Each contract has its own tree hash map, and
    have the following structure:
    pursesThm, example of FT purses:
    {
      "1": { quantity: 2, timestamp: 12562173658, type: "0", boxId: "box1", price: Nil},
      "2": { quantity: 12, timestamp: 12562173658, type: "0", boxId: "box1", price: 2},
    }
  */
  boxesReadyCh,
  contractsReadyCh,

  TreeHashMap,

  savePurseInBoxCh,
  removePurseInBoxCh,
  getBoxCh,
  getPurseCh,
  getContractPursesThmCh,
  getContractPursesDataThmCh,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`)
in {

  // reimplementation of TreeHashMap

/*
  Communications between channels have generally been reduced to reduce amount of
  serialization / deserialization

  when you "init" you can choose that the processes are also stored as bytes, instead of storing a map for each node, it stores a map at channel @map, and bytes at channel @(map, "bytes), this will make the "getAllValues" 10x, 20x, 30x faster depending on the process you are storing

  !!! make sure your processes do not contain the string "£$£$", or the bytes c2a324c2a324, those are used as delimiters
*/

new MakeNode, ByteArrayToNybbleList, TreeHashMapSetter, TreeHashMapGetter, HowManyPrefixes, NybbleListForI, RemoveBytesSectionIfExistsCh, keccak256Hash(\`rho:crypto:keccak256Hash\`), powersCh, storeToken, nodeGet in {
  match ([1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,655256], ["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"], 12) {
    (powers, hexas, base) => {
      contract MakeNode(@initVal, @node) = {
        @[node, *storeToken]!(initVal)
      } |

      contract nodeGet(@node, ret) = {
        for (@val <<- @[node, *storeToken]) {
          ret!(val)
        }
      } |

      contract HowManyPrefixes(@map, ret) = {
        for (@depth <<- @(map, "depth")) {
          match depth {
            1 => ret!(base)
            2 => ret!(base * base)
            3 => ret!(base * base * base)
            4 => ret!(base * base * base * base)
          }
        }
      } |

      contract NybbleListForI(@map, @i, @depth, ret) = {
        match depth {
          1 => {
            match hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
          2 => {
            match hexas.nth(i / base) ++ hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
          3 => {
            match hexas.nth(i / base / base) ++ hexas.nth(i / base) ++ hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
          4 => {
            match hexas.nth(i / base / base / base) ++ hexas.nth(i / base / base) ++ hexas.nth(i / base) ++ hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
        }
      } |

      contract ByteArrayToNybbleList(@ba, @n, @len, @acc, ret) = {
        if (n == len) {
          ret!(acc)
        } else {
          ByteArrayToNybbleList!(ba, n+1, len, acc ++ [ ba.nth(n) % base ], *ret)
        }
      } |

      contract TreeHashMap(@"init", @depth, @alsoStoreAsBytes, ret) = {
        new map in {
          MakeNode!(0, (*map, [])) |
          if (alsoStoreAsBytes == true) {
            MakeNode!(0, ((*map, "bytes"), []))
          } |
          @(*map, "depth")!!(depth) |
          @(*map, "alsoStoreAsBytes")!!(alsoStoreAsBytes) |
          ret!(*map)
        }
      } |

      contract TreeHashMapGetter(@map, @nybList, @n, @len, @suffix, ret) = {
        // Look up the value of the node at (map, nybList.slice(0, n + 1))
        for (@val <<- @[(map, nybList.slice(0, n)), *storeToken]) {
          if (n == len) {
            ret!(val.get(suffix))
          } else {
            // Otherwise check if the rest of the path exists.
            // Bit k set means node k exists.
            // nybList.nth(n) is the node number
            // val & powers.nth(nybList.nth(n)) is nonzero if the node exists
            // (val / powers.nth(nybList.nth(n))) % 2 is 1 if the node exists
            if ((val / powers.nth(nybList.nth(n))) % 2 == 0) {
              ret!(Nil)
            } else {
              TreeHashMapGetter!(map, nybList, n + 1, len, suffix, *ret)
            }
          }
        }
      } |

      contract TreeHashMap(@"get", @map, @key, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              // Get the bit list
              ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
              for (@nybList <- nybListCh) {
                TreeHashMapGetter!(map, nybList, 0,  depth, hash.slice(depth, 32), *ret)
              }
            }
          }
        }
      } |
  
      // not used anymore, now getValuesAtIndex is used to get all values
      // this way we avoid iteration
      contract TreeHashMap(@"getAllValues", @map, ret) = {
        new howManyPrefixesCh, iterateOnPrefixesCh, nybListCh in {
          HowManyPrefixes!(map, *howManyPrefixesCh) |
          for (@depth <<- @(map, "depth")) {
            for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
              for (@howManyPrefixes <- howManyPrefixesCh ) {
                contract iterateOnPrefixesCh() = {
                  new itCh, bytesOrMapCh, TreeHashMapGetterValues in {
                    // do not move it up, the goal is reduce the number of serializatin / dezerialization
                    contract TreeHashMapGetterValues(@channel, @nybList, @n, @len, @i) = {
                      // channel is either map or (map, "bytes")
                      // Look up the value of the node at (channel, nybList.slice(0, n + 1))
                      for (@val <<- @[(channel, nybList.slice(0, n)), *storeToken]) {
                        if (n == len) {
                          if (val == Nil) {
                            itCh!(i + 1)
                          } else {
                            if (alsoStoreAsBytes == true) {
                              for (@bytes <- bytesOrMapCh) {
                                itCh!(i + 1) |
                                // store-as-bytes-map
                                bytesOrMapCh!(bytes.union(val))
                                // store-as-bytes-array
                                /* if (bytes == Nil) {
                                  bytesOrMapCh!(bytes)
                                } else {
                                  bytesOrMapCh!(bytes ++ val)
                                } */
                              }
                            } else {
                              for (@map <- bytesOrMapCh) {
                                bytesOrMapCh!(map.union(val)) |
                                itCh!(i + 1)
                              }
                            }
                          }
                        } else {
                          // Otherwise check if the rest of the path exists.
                          // Bit k set means node k exists.
                          // nybList.nth(n) is the node number
                          // val & powers.nth(nybList.nth(n)) is nonzero if the node exists
                          // (val / powers.nth(nybList.nth(n))) % 2 is 1 if the node exists
                          if ((val / powers.nth(nybList.nth(n))) % 2 == 0) {
                            itCh!(i + 1)
                          } else {
                            TreeHashMapGetterValues!(channel, nybList, n + 1, len, i)
                          }
                        }
                      }
                    } |

                    for (@i <= itCh) {
                      match i <= howManyPrefixes - 1 {
                        false => {
                          for (@a <- bytesOrMapCh) {
                            ret!(a)
                          }
                        }
                        true => {
                          NybbleListForI!(map, i, depth, *nybListCh) |
                          for (@nybList <- nybListCh) {
                            if (alsoStoreAsBytes == true) {
                              TreeHashMapGetterValues!((map, "bytes"), nybList, 0, depth, i)
                            } else {
                              TreeHashMapGetterValues!(map, nybList, 0, depth, i)
                            }
                          }
                        }
                      }
                    } |
                    if (alsoStoreAsBytes == true) {
                      // store-as-bytes-map
                       bytesOrMapCh!({})
                      // store-as-bytes-array
                      /* bytesOrMapCh!(Nil) */
                    } else {
                      bytesOrMapCh!({})
                    } |
                    itCh!(0)
                  }
                } |

                iterateOnPrefixesCh!()
              }
            }
          }
        }
      } |

      contract TreeHashMap(@"getValuesAtIndex", @map, @i, ret) = {
        new howManyPrefixesCh, nybListCh in {
          HowManyPrefixes!(map, *howManyPrefixesCh) |
          for (@depth <<- @(map, "depth")) {
            for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
              for (@howManyPrefixes <- howManyPrefixesCh ) {
                new TreeHashMapGetterValues in {
                  // do not move it up, the goal is reduce the number of serializatin / dezerialization
                  contract TreeHashMapGetterValues(@channel, @nybList, @n, @len, @i) = {
                    // channel is either map or (map, "bytes")
                    // Look up the value of the node at (channel, nybList.slice(0, n + 1))
                    for (@val <<- @[(channel, nybList.slice(0, n)), *storeToken]) {
                      if (n == len) {
                        ret!(val)
                      } else {
                        // Otherwise check if the rest of the path exists.
                        // Bit k set means node k exists.
                        // nybList.nth(n) is the node number
                        // val & powers.nth(nybList.nth(n)) is nonzero if the node exists
                        // (val / powers.nth(nybList.nth(n))) % 2 is 1 if the node exists
                        if ((val / powers.nth(nybList.nth(n))) % 2 == 0) {
                          ret!({})
                        } else {
                          TreeHashMapGetterValues!(channel, nybList, n + 1, len, i)
                        }
                      }
                    }
                  } |

                  NybbleListForI!(map, i, depth, *nybListCh) |
                  for (@nybList <- nybListCh) {
                    if (alsoStoreAsBytes == true) {
                      TreeHashMapGetterValues!((map, "bytes"), nybList, 0, depth, i)
                    } else {
                      TreeHashMapGetterValues!(map, nybList, 0, depth, i)
                    }
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMapSetter(@channel, @nybList, @n, @len, @newVal, @suffix, ret) = {
        // channel is either map or (map, "bytes")
        // Look up the value of the node at (channel, nybList.slice(0, n + 1))
        new valCh, restCh in {
          match (channel, nybList.slice(0, n)) {
            node => {
              for (@val <<- @[node, *storeToken]) {
                if (n == len) {
                  // Acquire the lock on this node
                  for (@val <- @[node, *storeToken]) {
                    // If we're at the end of the path, set the node to newVal.
                    if (val == 0) {
                      // Release the lock
                      @[node, *storeToken]!({suffix: newVal}) |
                      // Return
                      ret!(Nil)
                    }
                    else {
                      // Release the lock
                      if (newVal == Nil) {
                        @[node, *storeToken]!(val.delete(suffix)) |
                        // Return
                        ret!(Nil)
                      } else {
                        @[node, *storeToken]!(val.set(suffix, newVal)) |
                        // Return
                        ret!(Nil)
                      }
                    }
                  }
                } else {
                  // Otherwise make the rest of the path exist.
                  // Bit k set means child node k exists.
                  if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                    // Child node missing
                    // Acquire the lock
                    for (@val <- @[node, *storeToken]) {
                      // Re-test value
                      if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                        // Child node still missing
                        // Create node, set node to 0
                        MakeNode!(0, (channel, nybList.slice(0, n + 1))) |
                        // Update current node to val | (1 << nybList.nth(n))
                        match nybList.nth(n) {
                          bit => {
                            // val | (1 << bit)
                            // Bitwise operators would be really nice to have!
                            // Release the lock
                            @[node, *storeToken]!((val % powers.nth(bit)) +
                              (val / powers.nth(bit + 1)) * powers.nth(bit + 1) +
                              powers.nth(bit))
                          }
                        } |
                        // Child node now exists, loop
                        TreeHashMapSetter!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                      } else {
                        // Child node created between reads
                        // Release lock
                        @[node, *storeToken]!(val) |
                        // Loop
                        TreeHashMapSetter!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                      }
                    }
                  } else {
                    // Child node exists, loop
                    TreeHashMapSetter!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMap(@"set", @map, @key, @newVal, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
                ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
                // Get the bit list
                for (@nybList <- nybListCh) {
                  if (alsoStoreAsBytes == true) {
                    new ret1, ret2 in {
                      if (newVal == Nil) {
                        TreeHashMapSetter!((map, "bytes"), nybList, 0,  depth, Nil, hash.slice(depth, 32), *ret2)
                      } else {
                        TreeHashMapSetter!((map, "bytes"), nybList, 0,  depth, newVal.toByteArray(), hash.slice(depth, 32), *ret2)
                      } |
                      TreeHashMapSetter!(map, nybList, 0, depth, newVal, hash.slice(depth, 32), *ret1) |
                      for (_ <- ret1; _ <- ret2) {
                        ret!(Nil)
                      }
                    }
                  } else {
                    TreeHashMapSetter!(map, nybList, 0,  depth, newVal, hash.slice(depth, 32), *ret)
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

  // depth 1 = 12 maps in tree hash map
  // depth 2 = 12 * 12 = 144 maps in tree hash map
  // etc...

  TreeHashMap!("init", ${payload.depth || 3}, true, *boxesReadyCh) |
  TreeHashMap!("init", ${payload.depth || 3}, false, *contractsReadyCh) |

  for (@boxesThm <- boxesReadyCh; @contractsThm <- contractsReadyCh) {

    // returns the box if exists
    for (@(boxId, return) <= getBoxCh) {
      new ch1 in {
        TreeHashMap!("get", boxesThm, boxId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@box <<- @(*vault, "boxes", boxId)) {
              @return!(box)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // returns the purse if exists AND is associated with box
    for (@(box, contractId, purseId, return) <= getPurseCh) {
      new ch1 in {
        if (box.get(contractId) == Nil) {
          @return!(Nil)
        } else {
          if (box.get(contractId).contains(purseId) == true) {
            getContractPursesThmCh!((contractId, *ch1)) |
            for (@pursesThm <- ch1) {
              TreeHashMap!("get", pursesThm, purseId, return)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // returns the tree hash map of the contract's purses if exists
    for (@(contractId, return) <= getContractPursesThmCh) {
      new ch1 in {
        TreeHashMap!("get", contractsThm, contractId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@pursesThm <<- @(*vault, "purses", contractId)) {
              @return!(pursesThm)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // returns the tree hash map of the contract's purses data if exists
    for (@(contractId, return) <= getContractPursesDataThmCh) {
      new ch1 in {
        TreeHashMap!("get", contractsThm, contractId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
              @return!(pursesDataThm)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |
  
    // remove purse in box, if found
    for (@(boxId, contractId, purseId, return) <= removePurseInBoxCh) {
      new ch1 in {
        getBoxCh!((boxId, *ch1)) |
        for (@box <- ch1) {
          if (box == Nil) {
            @return!("error: CRITICAL box not found")
          } else {
            if (box.get(contractId) == Nil) {
              @return!("error: CRITICAL purse not found")
            } else {
              if (box.get(contractId).contains(purseId) == false) {
                @return!("error: CRITICAL purse not found")
              } else {
                for (_ <- @(*vault, "boxes", boxId)) {
                  stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " removed from box") |
                  @(*vault, "boxes", boxId)!(box.set(contractId, box.get(contractId).delete(purseId))) |
                  @return!((true, Nil))
                }
              }
            }
          }
        }
      }
    } |

    // save purse id in box
    for (@(contractId, boxId, purseId, merge, return) <= savePurseInBoxCh) {
      new ch1, ch2, ch3, iterateAndMergePursesCh in {

        getBoxCh!((boxId, *ch1)) |
        getContractPursesThmCh!((contractId, *ch2)) |

        for (@box <- ch1; @pursesThm <- ch2) {
          match (box != Nil, pursesThm != Nil) {
            (true, true) => {
              if (box.get(contractId) == Nil) {
                for (_ <- @(*vault, "boxes", boxId)) {
                  stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " saved to box") |
                  @(*vault, "boxes", boxId)!(box.set(contractId, Set(purseId))) |
                  @return!((true, Nil))
                }
              } else {
                if (box.get(contractId).contains(purseId) == false) {
                  for (@contractConfig <<- @(*vault, "contractConfig", contractId)) {
                    match (contractConfig.get("fungible") == true, merge) {
                      (true, true) => {
                        for (@pursesThm <<- @(*vault, "purses", contractId)) {
                          TreeHashMap!("get", pursesThm, purseId, *ch3) |
                          for (@purse <- ch3) {
                            iterateAndMergePursesCh!((box, purse, pursesThm))
                          }
                        }
                      }
                      _ => {
                        for (_ <- @(*vault, "boxes", boxId)) {
                          stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " saved to box") |
                          @(*vault, "boxes", boxId)!(box.set(
                            contractId,
                            box.get(contractId).union(Set(purseId))
                          )) |
                          @return!((true, Nil))
                        }
                      }
                    }
                  }
                } else {
                  @return!("error: CRITICAL, purse already exists in box")
                }
              }
            }
          }
        } |
        // if contract is fungible, we may find a
        // purse with same .price and .type property
        // if found, then merge and delete current purse
        for (@(box, purse, pursesThm) <- iterateAndMergePursesCh) {
          new tmpCh, itCh in {
            for (ids <= itCh) {
              match *ids {
                Set() => {
                  stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " saved to box") |
                  for (_ <- @(*vault, "boxes", boxId)) {
                     @(*vault, "boxes", boxId)!(box.set(contractId, Set(purseId))) |
                     @return!((true, Nil))
                  }
                }
                Set(last) => {
                  new ch4, ch5, ch6, ch7 in {
                    TreeHashMap!("get", pursesThm, last, *ch4) |
                    for (@purse2 <- ch4) {
                      match (purse2.get("type") == purse.get("type"), purse2.get("price") == purse.get("price")) {
                        (true, true) => {
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            last,
                            purse2.set("quantity", purse2.get("quantity") + purse.get("quantity")),
                            *ch5
                          ) |
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            purse.get("id"),
                            Nil,
                            *ch6
                          ) |
                          for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
                            TreeHashMap!(
                              "set",
                              pursesDataThm,
                              purse.get("id"),
                              Nil,
                              *ch7
                            )
                          } |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " merged into purse " ++ purse2.get("id")) |
                            @return!((true, Nil))
                          }
                        }
                        _ => {
                          stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " saved to box") |
                          for (_ <- @(*vault, "boxes", boxId)) {
                            @(*vault, "boxes", boxId)!(box.set(
                              contractId,
                              box.get(contractId).union(Set(purse.get("id")))
                            )) |
                            @return!((true, Nil))
                          }
                        }
                      }
                    }

                  }
                }
                Set(first ... rest) => {
                  new ch4, ch5, ch6, ch7 in {
                    TreeHashMap!("get", pursesThm, first, *ch4) |
                    for (@purse2 <- ch4) {
                      match (purse2.get("type") == purse.get("type"), purse2.get("price") == purse.get("price")) {
                        (true, true) => {
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            first,
                            purse2.set("quantity", purse2.get("quantity") + purse.get("quantity")),
                            *ch5
                          ) |
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            purse.get("id"),
                            Nil,
                            *ch6
                          ) |
                          for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
                            TreeHashMap!(
                              "set",
                              pursesDataThm,
                              purse.get("id"),
                              Nil,
                              *ch7
                            )
                          } |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " merged into purse " ++ purse2.get("id")) |
                            @return!((true, Nil))
                          }
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
            itCh!(box.get(contractId))
          }
        }
      }
    } |

    /*
      makePurseCh
      only place where new purses are created:
      PURCHASE, WITHDRAW, and CREATE_PURSE may call this channel

      depending on if .fungible is true or false, it decides
      which id to give to the new purse, then it creates the
      purse and saves to box
    */
    for (@(contractId, properties, data, merge, return) <= makePurseCh) {
      new ch1, ch2, ch3, ch4, idAndQuantityCh in {
        for (@contractConfig <<- @(*vault, "contractConfig", contractId)) {
          if (contractConfig.get("fungible") == true) {
            for (_ <- @(*vault, "contractConfig", contractId)) {
              @(*vault, "contractConfig", contractId)!(contractConfig.set("counter", contractConfig.get("counter") + 1))
            } |
            idAndQuantityCh!({ "id": "\${n}" %% { "n": contractConfig.get("counter") }, "quantity": properties.get("quantity") })
          } else {
            for (@pursesThm <<- @(*vault, "purses", contractId)) {
              TreeHashMap!("get", pursesThm, properties.get("id"), *ch1) |
              for (@existingPurse <- ch1) {

                // check that nft does not exist
                if (existingPurse == Nil) {
                  if (properties.get("id") == "0") {
                    idAndQuantityCh!({ "id": properties.get("id"), "quantity": properties.get("quantity") })
                  } else {
                    idAndQuantityCh!({ "id": properties.get("id"), "quantity": 1 })
                  }
                } else {

                  // nft with id: "0" is a special nft from which
                  // anyone can mint a nft that does not exist yet
                  // used by dappy name system for example
                  if (properties.get("id") == "0") {
                    TreeHashMap!("get", pursesThm, properties.get("newId"), *ch2) |
                    for (@purseWithNewId <- ch2) {
                      match (properties.get("newId"), purseWithNewId) {
                        (String, Nil) => {
                          idAndQuantityCh!({ "id": properties.get("newId"), "quantity": 1 })
                        }
                        _ => {
                          @return!("error: no .newId in payload or .newId already exists")
                        }
                      }
                    }
                  } else {
                    @return!("error: purse id already exists")
                  }
                }
              }
            }
          }
        } |
        for (@idAndQuantity <- idAndQuantityCh) {
          match properties
            .set("id", idAndQuantity.get("id"))
            .set("quantity", idAndQuantity.get("quantity"))
            .delete("newId")
          {
            purse => {
              match (purse, purse.get("id").length() > 0, purse.get("id").length() < 25) {
                ({
                  "quantity": Int,
                  "timestamp": Int,
                  "type": String,
                  "boxId": String,
                  "id": String,
                  "price": Nil \\/ Int
                }, true, true) => {
                  for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
                    for (@pursesThm <<- @(*vault, "purses", contractId)) {
                      TreeHashMap!("set", pursesThm, purse.get("id"), purse, *ch3) |
                      TreeHashMap!("set", pursesDataThm, purse.get("id"), data, *ch4)
                    }
                  } |

                  for (_ <- ch3; _ <- ch4) {
                    savePurseInBoxCh!((contractId, purse.get("boxId"), purse.get("id"), merge, return))
                  }
                }
                _ => {
                  @return!("error: invalid purse, one of the following errors: id length must be between length 1 and 24")
                }
              }
            }
          }
        }
      }
    } |

    // ====================================
    // ===== ANY USER / PUBLIC capabilities
    // ====================================

    for (@("PUBLIC_READ_PURSES_AT_INDEX", contractId, i, return) <= entryCh) {
      new ch1 in {
        getContractPursesThmCh!((contractId, *ch1)) |
        for (@pursesThm <- ch1) {
          if (pursesThm == Nil) {
            @return!("error: contract not found")
          } else {
            TreeHashMap!("getValuesAtIndex", pursesThm, i, return)
          }
        }
      }
    } |

    for (@("PUBLIC_READ_CONFIG", contractId, return) <= entryCh) {
      for (@config <<- @(*vault, "contractConfig", contractId)) {
        @return!(config)
      }
    } |

    for (@("PUBLIC_READ_BOX", boxId, return) <= entryCh) {
      new ch1 in {
        getBoxCh!((boxId, *ch1)) |
        for (@box <- ch1) {
          if (box == Nil) {
            @return!("error: box not found")
          } else {
            for (@superKeys <<- @(*vault, "boxesSuperKeys", boxId)) {
              for (@config <<- @(*vault, "boxConfig", boxId)) {
                @return!(config.union({ "superKeys": superKeys, "purses": box, "version": "8.0.0" }))
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_READ_PURSE", payload, return) <= entryCh) {
      new ch1 in {
        getContractPursesThmCh!((payload.get("contractId"), *ch1)) |
        for (@pursesThm <- ch1) {
          if (pursesThm == Nil) {
            @return!("error: contract not found")
          } else {
            match payload.get("purseId") {
              String => {
                TreeHashMap!("get", pursesThm, payload.get("purseId"), return)
              }
              _ => {
                @return!("error: payload.purseId must be a string")
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_READ_PURSE_DATA", payload, return) <= entryCh) {
      new ch1 in {
        getContractPursesDataThmCh!((payload.get("contractId"), *ch1)) |
        for (@pursesDataThm <- ch1) {
          if (pursesDataThm == Nil) {
            @return!("error: contract not found")
          } else {
            match payload.get("purseId") {
              String => {
                TreeHashMap!("get", pursesDataThm, payload.get("purseId"), return)
              }
              _ => {
                @return!("error: payload.purseId must be a string")
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_DELETE_EXPIRED_PURSE", contractId, purseId, return) <= entryCh) {
      for (@config <<- @(*vault, "contractConfig", contractId)) {
        match (config.get("fungible"), purseId == "0", config.get("expires")) {
          (false, false, Int) => {
            new ch1, ch2, ch3, ch4, ch5, ch6, ch7 in {
              getContractPursesThmCh!((contractId, *ch1)) |
              getContractPursesDataThmCh!((contractId, *ch2)) |
              for (@pursesThm <- ch1; @pursesDataThm <- ch2) {
                if (pursesThm == Nil) {
                  @return!("error: contract not found")
                } else {
                  TreeHashMap!("get", pursesThm, purseId, *ch3) |
                  for (@purse <- ch3) {
                    if (purse == Nil) {
                      @return!("error: purse not found")
                    } else {
                      blockData!(*ch4) |
                      for (_, @timestamp, _ <- ch4) {
                        if (timestamp - purse.get("timestamp") > config.get("expires")) {
                          TreeHashMap!("set", pursesThm, purse.get("id"), Nil, *ch5) |
                          TreeHashMap!("set", pursesDataThm, purse.get("id"), Nil, *ch6) |
                          removePurseInBoxCh!((purse.get("boxId"), contractId, purse.get("id"), *ch7)) |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            @return!((true, Nil))
                          }
                        } else {
                          @return!("error: purse has not expired")
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          _ => {
            @return!("error: contract must not be fungible, and must have .expires property")
          }
        }
      }
    } |

    for (@("PUBLIC_REGISTER_BOX", payload, return) <= entryCh) {
      match (payload.get("boxId"), payload.get("publicKey"), payload.get("boxId").length() > 1, payload.get("boxId").length() < 25) {
        (String, String, true, true) => {
          new ch1, ch2, ch3, ch4, ch5, ch6 in {
            registryLookup!(\`rho:rchain:revVault\`, *ch3) |
            for (@(_, RevVault) <- ch3) {
              revAddress!("fromPublicKey", payload.get("publicKey").hexToBytes(), *ch4) |
              for (@a <- ch4) {
                @RevVault!("findOrCreate", a, *ch5) |
                for (@b <- ch5) {
                  match b {
                    (true, vaultFromPublicKey) => {
                      ch6!(true)
                    }
                    _ => {
                      @return!("error: invalid public key, could not get vault")
                    }
                  }
                }
              }
            } |

            TreeHashMap!("get", boxesThm, payload.get("boxId"), *ch1) |
            for (@existingBox <- ch1; _ <- ch6) {
              if (existingBox == Nil) {
                new boxCh in {
                  TreeHashMap!("set", boxesThm, payload.get("boxId"), "exists", *ch2) |
                  for (_ <- ch2) {
                    @(*vault, "boxes", payload.get("boxId"))!({}) |
                    @(*vault, "boxesSuperKeys", payload.get("boxId"))!(Set()) |
                    @(*vault, "boxConfig", payload.get("boxId"))!({ "publicKey": payload.get("publicKey") }) |
                    @return!((true, bundle+{*boxCh})) |
                    initializeOCAPOnBoxCh!((*boxCh, payload.get("boxId")))
                  }
                }
              } else {
                @return!("error: box already exists")
              }
            }
          }
        }
      }
    } |

    for (@(boxCh, boxId) <= initializeOCAPOnBoxCh) {

      for (@("PUBLIC_REGISTER_CONTRACT", payload, return) <= @boxCh) {
        new registerContract, ch1, ch2, ch3, ch4, ch5 in {
          match payload {
            { "contractId": String, "fungible": Bool, "fee": Nil \\/ (String, Int), "expires": Nil \\/ Int } => {
              match (payload.get("contractId").length() > 1, payload.get("contractId").length() < 25) {
                (true, true) => {
                  if (payload.get("expires") == Nil) {
                    registerContract!(Nil)
                  } else {
                    // minimum 2 hours expiration
                    if (payload.get("expires") >= 1000 * 60 * 60 * 2) {
                      registerContract!(Nil)
                    } else {
                      @return!("error: .expires must be at least 2 hours")
                    }
                  }
                }
                _ => {
                  @return!("error: invalid contract id")
                }
              }
            }
            _ => {
              @return!("error: invalid payload")
            }
          } |
          for (_ <- registerContract) {
            TreeHashMap!("get", contractsThm, payload.get("contractId"), *ch1) |
            for (@exists <- ch1) {
              if (exists == Nil) {
                TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch2) |
                TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch4) |
                TreeHashMap!("set", contractsThm, payload.get("contractId"), "exists", *ch3) |
                for (@pursesThm <- ch2; @pursesDataThm <- ch4; _ <- ch3) {

                  for (@superKeys <- @(*vault, "boxesSuperKeys", boxId)) {
                    @(*vault, "boxesSuperKeys", boxId)!(
                      superKeys.union(Set(payload.get("contractId")))
                    )
                  } |

                  // purses tree hash map
                  @(*vault, "purses", payload.get("contractId"))!(pursesThm) |

                  // purses data tree hash map
                  @(*vault, "pursesData", payload.get("contractId"))!(pursesDataThm) |

                  // config
                  @(*vault, "contractConfig", payload.get("contractId"))!(
                    payload.set("locked", false).set("counter", 1).set("version", "8.0.0").set("fee", payload.get("fee"))
                  ) |

                  new superKeyCh in {
                    // return the bundle+ super key
                    @return!((true, bundle+{*superKeyCh})) |

                    for (@("LOCK", return2) <= superKeyCh) {
                      for (@contractConfig <<- @(*vault, "contractConfig", payload.get("contractId"))) {
                        if (contractConfig.get("locked") == true) {
                          @return2!("error: contract is already locked")
                        } else {
                          for (_ <- @(*vault, "contractConfig", payload.get("contractId"))) {
                            @(*vault, "contractConfig", payload.get("contractId"))!(contractConfig.set("locked", true)) |
                            @return2!((true, Nil))
                          }
                        }
                      }
                    } |

                    for (@("CREATE_PURSE", createPursePayload, return2) <= superKeyCh) {
                      for (@contractConfig <<- @(*vault, "contractConfig", payload.get("contractId"))) {
                        if (contractConfig.get("locked") == true) {
                          @return2!("error: contract is locked")
                        } else {
                          new blockDataCh, ch1, ch2 in {
                            blockData!(*blockDataCh) |
                            for (_, @timestamp, _ <- blockDataCh) {
                              match (createPursePayload, createPursePayload.get("price") == 0) {
                                ({
                                  "data": _,
                                  "quantity": Int,
                                  "type": String,
                                  "id": String,
                                  "price": Nil \\/ Int,
                                  "boxId": String
                                }, false) => {
                                  getBoxCh!((createPursePayload.get("boxId"), *ch1)) |
                                  for (@box <- ch1) {
                                    if (box == Nil) {
                                      @return2!("error: box not found " ++ createPursePayload.get("boxId"))
                                    } else {
                                      makePurseCh!((
                                        payload.get("contractId"),
                                        createPursePayload.delete("data").set("timestamp", timestamp),
                                        createPursePayload.get("data"),
                                        true,
                                        *ch2
                                      )) |
                                      for (@r <- ch2) {
                                        match r {
                                          String => {
                                            @return2!(r)
                                          }
                                          _ => {
                                            @return2!(true)
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                _ => {
                                  @return2!("error: invalid purse payload")
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                @return!("error: contract id already exists")
              }
            }
          }
        }
      } |

      for (@("UPDATE_PURSE_PRICE", payload2, return2) <= @boxCh) {
        new ch3, ch4, ch5 in {
          match (payload2, payload2.get("price") == 0) {
            ({ "price": Int \\/ Nil, "contractId": String, "purseId": String }, false) => {
              getBoxCh!((boxId, *ch3)) |
              for (@box <- ch3) {
                if (box != Nil) {
                  getPurseCh!((box, payload2.get("contractId"), payload2.get("purseId"), *ch4)) |
                  for (@purse <- ch4) {
                    if (purse != Nil) {
                      for (@pursesThm <<- @(*vault, "purses", payload2.get("contractId"))) {
                        TreeHashMap!("set", pursesThm, payload2.get("purseId"), purse.set("price", payload2.get("price")), *ch5) |
                        for (_ <- ch5) {
                          @return2!((true, Nil))
                        }
                      }
                    } else {
                      @return2!("error: purse not found")
                    }
                  }
                } else {
                  @return2!("error: CRITICAL box not found")
                }
              }
            }
            _ => {
              @return2!("error: invalid payload for update price")
            }
          }
        }
      } |

      for (@("UPDATE_PURSE_DATA", payload2, return2) <= @boxCh) {
        new ch3, ch4, ch5 in {
          match payload2 {
            { "data": _, "contractId": String, "purseId": String } => {
              getBoxCh!((boxId, *ch3)) |
              for (@box <- ch3) {
                if (box != Nil) {
                  getPurseCh!((box, payload2.get("contractId"), payload2.get("purseId"), *ch4)) |
                  for (@purse <- ch4) {
                    if (box != Nil) {
                      for (@pursesDataThm <<- @(*vault, "pursesData", payload2.get("contractId"))) {
                        TreeHashMap!("set", pursesDataThm, payload2.get("purseId"), payload2.get("data"), *ch5) |
                        for (_ <- ch5) {
                          @return2!((true, Nil))
                        }
                      }
                    } else {
                       @return2!("error: purse not found")
                    }
                  }
                } else {
                  @return2!("error: CRITICAL box not found")
                }
              }
            }
            _ => {
              @return2!("error: invalid payload for update data")
            }
          }
        }
      } |

      for (@("RENEW", payload2, return2) <= @boxCh) {
        new ch1, ch2, ch3, ch4, renewStep2, ch20, renewStep3, ch30, ch31, ch32, ch33, ch34, ch35, ch36 in {
          match payload2 {
            { "contractId": String, "purseId": String, "purseRevAddr": String, "purseAuthKey": _ } => {
              getBoxCh!((boxId, *ch1)) |
              for (@box <- ch1) {
                if (box != Nil) {
                  getContractPursesThmCh!((payload2.get("contractId"), *ch2)) |
                  getPurseCh!((box, payload2.get("contractId"), payload2.get("purseId"), *ch3)) |

                  for (@pursesThm <- ch2) {
                    if (pursesThm == Nil) {
                      @return2!("error: CRITICAL tree hash map not found")
                    } else {
                      TreeHashMap!("get", pursesThm, "0", *ch4)
                    } |
                    for (@purse <- ch3; @purseZero <- ch4) {
                      for (@contractConfig <<- @(*vault, "contractConfig", payload2.get("contractId"))) {
                        match (contractConfig.get("expires"), contractConfig.get("fungible") == false, purse != Nil, purseZero != Nil) {
                          (Int, true, true, true) => {
                            renewStep2!((pursesThm, purseZero, purse, contractConfig.get("expires")))
                          }
                          _ => {
                            @return2!("error: purse 0 not found or contract is fungible=true")
                          }
                        }
                      }
                    }
                  }
                } else {
                  @return2!("error: CRITICAL box not found")
                }
              }
            }
            _ => {
              @return2!("error: invalid payload for renew")
            }
          } |

          for (@(pursesThm, purseZero, purse, expires) <- renewStep2) {
            blockData!(*ch20) |
            for (_, @timestamp, _ <- ch20) {
              match expires / 10 {
                grace => {
                  match purse.get("timestamp") + expires - grace {
                    startOfGracePeriod => {
                      stdout!(("startOfGracePeriod", startOfGracePeriod)) |
                      stdout!(("timestamp", timestamp)) |
                      if (timestamp > startOfGracePeriod) {
                        renewStep3!((pursesThm, purseZero, purse, expires))
                      } else {
                        @return2!("error: to soon to renew")
                      }
                    }
                    _ => {
                      @return2!("error: cannot calculate grace period")
                    }
                  }
                }
                _ => {
                  @return2!("error: cannot calculate grace period")
                }
              }
            }
          } |

          for (@(pursesThm, purseZero, purse, expires) <- renewStep3) {
            for (@boxConfig <<- @(*vault, "boxConfig", purseZero.get("boxId"))) {
              registryLookup!(\`rho:rchain:revVault\`, *ch33) |
              for (@(_, RevVault) <- ch33) {
                @RevVault!("findOrCreate", payload2.get("purseRevAddr"), *ch34) |
                revAddress!("fromPublicKey", boxConfig.get("publicKey").hexToBytes(), *ch32)
              }
            } |

            for (@revAddr <- ch32; @r <- ch34) {
              match r {
                (true, purseVaultEmitter) => {
                  if (purseZero.get("price") == Nil) {
                    @purseVaultEmitter!("transfer", revAddr, 1, payload2.get("purseAuthKey"), *ch35)
                  } else if (purseZero.get("price") == 0) {
                    @purseVaultEmitter!("transfer", revAddr, 1, payload2.get("purseAuthKey"), *ch35)
                  } else {
                    @purseVaultEmitter!("transfer", revAddr, purseZero.get("price"), payload2.get("purseAuthKey"), *ch35)
                  }
                }
                _ => {
                  @return2!("error: could not find vaule from rev address")
                }
              }
            } |

            for (@paymentResult <- ch35) {
              match paymentResult {
                (true, Nil) => {
                  TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("timestamp", purse.get("timestamp") + expires), *ch36) |
                  for (_ <- ch36) {
                    @return2!((true, Nil))
                  }
                }
                _ => {
                  @return2!("error: failed to execute payment")
                }
              }
            }
          }
        }
      } |

      for (@("WITHDRAW", payload2, return2) <= @boxCh) {
        new ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, proceedWithdrawCh, mergeCh, mergeOkCh in {
          match payload2 {
            { "quantity": Int, "contractId": String, "purseId": String, "toBoxId": String, "merge": Bool } => {
              getContractPursesThmCh!((payload2.get("contractId"), *ch4)) |
              getBoxCh!((payload2.get("toBoxId"), *ch6)) |
              getBoxCh!((boxId, *ch10)) |
              for (@pursesThm <- ch4; @toBox <- ch6; @box <- ch10) {
                match (pursesThm != Nil, toBox != Nil, box != Nil) {
                  (true, true, true) => {
                    getPurseCh!((box, payload2.get("contractId"), payload2.get("purseId"), *ch9)) |
                    for (@purse <- ch9) {
                      if (purse == Nil) {
                        @return2!("error: purse does not exist")
                      } else {
                        if (purse.get("id") != "0") {
                          proceedWithdrawCh!((pursesThm, purse))
                        } else {
                          @return2!("error: withdraw from special nft 0 is forbidden")
                        }
                      }
                    }
                  }
                  _ => {
                    @return2!("error: contract or recipient box does not exist")
                  }
                }
              }
            }
            _ => {
              @return2!("error: invalid payload for withdraw")
            }
          } |

          for (@(pursesThm, purse) <- proceedWithdrawCh) {

            // the withdrawer should not be able to choose if
            // tokens in recipient box will or will not be 
            // merged, except if he withdraws to himself
            mergeCh!(payload2.get("merge")) |
            if (payload2.get("toBoxId") != boxId) {
              for (_ <- mergeCh) {
                mergeOkCh!(true)
              }
            } else {
              for (@m <- mergeCh) {
                mergeOkCh!(m)
              }
            } |

            for (@merge <- mergeOkCh) {
              match (
                purse.get("quantity") - payload2.get("quantity") >= 0,
                purse.get("quantity") > 0,
                purse.get("quantity") - payload2.get("quantity") > 0
              ) {

                // ajust quantity in first purse, create a second purse
                // associated with toBoxId
                (true, true, true) => {
                  TreeHashMap!("set", pursesThm, payload2.get("purseId"), purse.set("quantity", purse.get("quantity") - payload2.get("quantity")), *ch5) |
                  for (_ <- ch5) {
                    makePurseCh!((
                      payload2.get("contractId"),
                      purse
                        .set("price", Nil)
                        .set("quantity", payload2.get("quantity"))
                        .set("boxId", payload2.get("toBoxId")),
                      Nil,
                      merge,
                      return2
                    ))
                  }
                }

                // remove first purse, create a second purse
                // associated with toBoxId
                (true, true, false) => {
                  TreeHashMap!("set", pursesThm, payload2.get("purseId"), Nil, *ch5) |
                  for (@pursesDataThm <<- @(*vault, "pursesData", payload2.get("contractId"))) {
                    TreeHashMap!(
                      "get",
                      pursesDataThm,
                      payload2.get("purseId"),
                      *ch7
                    ) |
                    for (_ <- ch5; @data <- ch7) {
                      TreeHashMap!(
                        "set",
                        pursesDataThm,
                        payload2.get("purseId"),
                        Nil,
                        *ch11
                      ) |
                      for (_ <- ch11) {
                        removePurseInBoxCh!((boxId, payload2.get("contractId"), payload2.get("purseId"), *ch8)) |
                        for (@r <- ch8) {
                          match r {
                            String => {
                              @return2!(r)
                            }
                            _ => {
                              makePurseCh!((
                                payload2.get("contractId"),
                                purse
                                  .set("price", Nil)
                                  .set("boxId", payload2.get("toBoxId")),
                                data,
                                merge,
                                return2
                              ))
                            }
                          }
                        }
                      }
                    }
                  }
                }
                _ => {
                  @return2!("error: cannot withdraw, quantity in payload is superior to existing purse quantity")
                }
              }
            }
          }
        }
      } |

      // keep review from here

      for (@(amount, contractConfig, return2) <= calculateFeeCh) {
        if (contractConfig.get("fee") == Nil) {
          @return2!((amount, 0, Nil))
        } else {
          match amount * contractConfig.get("fee").nth(1) / 100000 {
            feeAmount => {
              new ch1 in {
                revAddress!("fromPublicKey", contractConfig.get("fee").nth(0).hexToBytes(), *ch1) |
                for (@revAddr <- ch1) {
                  @return2!((amount - feeAmount, feeAmount, revAddr))
                }
              }
            }
          }
        }
      } |

      // transfers an amount to a temporary escrow purse
      for (@(emitterRevAddress, emitterPurseAuthKey, amount, return) <= transferToEscrowPurseCh) {
        new ch1, ch2, ch3, ch4, ch5, ch6 in {
          registryLookup!(\`rho:rchain:revVault\`, *ch1) |
          for (@(_, RevVault) <- ch1) {
            @RevVault!("findOrCreate", emitterRevAddress, *ch2) |
            for (@a <- ch2) {
              match a {
                (true, purseVaultEmitter) => {
                  new unf in {
                    @RevVault!("unforgeableAuthKey", *unf, *ch3) |
                    revAddress!("fromUnforgeable", *unf, *ch4) |
                    for (@escrowPurseAuthKey <- ch3; @escrowPurseRevAddr <- ch4) {
                      @RevVault!("findOrCreate", escrowPurseRevAddr, *ch5) |
                      for (@(true, escrowPurseVault) <- ch5) {
                        @purseVaultEmitter!("transfer", escrowPurseRevAddr, amount, emitterPurseAuthKey, *ch6) |
                        for (@escrowTransferResult <- ch6) {
                          match escrowTransferResult {
                            (true, Nil) => {
                              @return!((escrowPurseAuthKey, escrowPurseRevAddr))
                            }
                            _ => {
                              stdout!(escrowTransferResult) |
                              @return!("error: escrow transfer went wrong, invalid rev purse")
                            }
                          }
                        }
                      }
                    }
                  }
                }
                _ => {
                  @return!("error: cannot create purse vault")
                }
              }
            }
          }
        }
      } |

      for (@("PURCHASE", payload2, return2) <= @boxCh) {
        match payload2 {
          { "quantity": Int, "contractId": String, "merge": Bool, "purseId": String, "newId": Nil \\/ String, "data": _, "purseRevAddr": String, "purseAuthKey": _ } => {
            new ch3, ch4, ch5, ch6, ch7, step2Ch, ch20, ch21, ch22, ch23, ch24, step3Ch, rollbackCh, ch30, ch31, ch32, ch33, ch34, ch35, ch36, ch37, step4Ch, ch40, ch41, ch42, ch43, ch44, ch45, step5Ch, ch50, ch51, ch52, ch53 in {

              // STEP 1
              // check box, purse
              getBoxCh!((boxId, *ch3)) |
              for (@box <- ch3) {
                if (box != Nil) {
                  getContractPursesThmCh!((payload2.get("contractId"), *ch4)) |
                  getContractPursesDataThmCh!((payload2.get("contractId"), *ch5)) |
                  for (@pursesThm <- ch4; @pursesDataThm <- ch5) {
                    if (pursesThm != Nil) {
                      TreeHashMap!("get", pursesThm, payload2.get("purseId"), *ch6) |
                      TreeHashMap!("get", pursesDataThm, payload2.get("purseId"), *ch7)
                    } else {
                      @return2!("error: contract not found")
                    } |
                    for (@purse <- ch6; @purseData <- ch7) {
                      if (purse != Nil) {
                        step2Ch!((pursesThm, pursesDataThm, purse, purseData))
                      } else {
                        @return2!("error: purse not found")
                      }
                    }
                  }
                } else {
                  @return2!("error: CRITICAL box not found")
                }
              } |

              // STEP 2
              // transfer total amount to temporary escrow purse
              // check that both emitter and recipient vault exist
              for (@(pursesThm, pursesDataThm, purse, purseData) <- step2Ch) {
                match (
                  purse.get("price"),
                  purse.get("quantity") > 0,
                  payload2.get("quantity") > 0,
                  purse.get("quantity") >= payload2.get("quantity")
                ) {
                  (Int, true, true, true) => {
                    registryLookup!(\`rho:rchain:revVault\`, *ch20) |

                    for (@boxConfig <<- @(*vault, "boxConfig", purse.get("boxId"))) {
                      revAddress!("fromPublicKey", boxConfig.get("publicKey").hexToBytes(), *ch21)
                    } |

                    for (@contractConfig <<- @(*vault, "contractConfig", payload2.get("contractId"))) {
                      calculateFeeCh!((payload2.get("quantity") * purse.get("price"), contractConfig, *ch22))
                    } |

                    for (@(_, RevVault) <- ch20; @ownerRevAddress <- ch21; @amountAndFeeAmount <- ch22) {
                      stdout!(amountAndFeeAmount) |
                      match (
                        payload2.get("purseRevAddr"),
                        ownerRevAddress,
                        amountAndFeeAmount.nth(0),
                        amountAndFeeAmount.nth(1),
                        amountAndFeeAmount.nth(2)
                      ) {
                        (emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) => {
                          @RevVault!("findOrCreate", recipientRevAddress, *ch23) |
                          for (@a <- ch23) {
                            match a {
                              (true, purseVaultRecipient) => {
                                transferToEscrowPurseCh!((emitterRevAddress, payload2.get("purseAuthKey"), amount + feeAmount, *ch24)) |
                                for (@b <- ch24) {
                                  match b {
                                    String => {
                                      @return2!(b)
                                    }
                                    (escrowPurseAuthKey, escrowPurseRevAddr) => {
                                      step3Ch!((pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress))
                                    }
                                  }
                                }
                              }
                              _ => {
                                @return2!("error: could not find or create vaults")
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  _ => {
                    @return2!("error: quantity not available or purse not for sale")
                  }
                }
              } |

              // STEP 3
              // listen on rollbackCh and prepare to reset state to original
              // if step 4 or 5 fails
              // 
              for (@(pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) <- step3Ch) {
                for (@message <- rollbackCh) {
                  TreeHashMap!("set", pursesThm, purse.get("id"), purse, *ch30) |
                  TreeHashMap!("set", pursesDataThm, purse.get("id"), purseData, *ch31) |
                  if (purse.get("quantity") - payload2.get("quantity") == 0) {
                    savePurseInBoxCh!((payload2.get("contractId"), purse.get("boxId"), purse.get("id"), true, *ch32))
                  } else {
                    // the purse has not been removed from box
                    ch32!((true, Nil))
                  } |
                  for (_ <- ch30; _ <- ch31; @a <- ch32) {
                    match a {
                      String => {
                        stdout!("error: CRITICAL could not rollback after makePurse error") |
                        @return2!("error: CRITICAL could not rollback after makePurse error")
                      }
                      _ => {
                        @RevVault!("findOrCreate", escrowPurseRevAddr, *ch33) |
                        for (@(true, purseVaultEscrow) <- ch33) {
                          @purseVaultEscrow!("transfer", emitterRevAddress, amount + feeAmount, escrowPurseAuthKey, *ch34) |
                          for (@r <- ch34) {
                            match r {
                              (true, Nil) => {
                                @return2!("error: rollback successful, makePurse error, transaction was rolled backed, emitter purse was reimbursed " ++ message)
                              }
                              _ => {
                                stdout!(r) |
                                stdout!("error: CRITICAL, makePurse error, could rollback but could not reimburse after makePurse error" ++ message) |
                                @return2!("error: CRITICAL, makePurse error, could rollback but could not reimburse after makePurse error" ++ message)
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } |
                step4Ch!((pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress))
              } |

              // STEP 4
              // try to makePurse
              for (@(pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) <- step4Ch) {
                for (@makePurseResult <- ch43) {
                  match makePurseResult {
                    String => {
                      rollbackCh!(makePurseResult)
                    }
                    _ => {
                      step5Ch!((pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress))
                    }
                  }
                } |

                // remove completely purse and create a new one
                // with same id, id may be changed by makePurse
                // depending on fungible or not
                if (purse.get("quantity") - payload2.get("quantity") == 0) {
                  TreeHashMap!("set", pursesThm, purse.get("id"), Nil, *ch40) |
                  TreeHashMap!("set", pursesDataThm, purse.get("id"), Nil, *ch41) |
                  removePurseInBoxCh!((purse.get("boxId"), payload2.get("contractId"), purse.get("id"), *ch42)) |
                  for (_ <- ch40; _ <- ch41; _ <- ch42) {
                    makePurseCh!((
                      payload2.get("contractId"),
                      // keep quantity and type of existing purse
                      purse
                        .set("boxId", boxId)
                        .set("price", Nil)
                        // will only be considered for nft, purchase from purse "0"
                        .set("newId", payload2.get("newId")),
                      payload2.get("data"),
                      payload2.get("merge"),
                      *ch43
                    ))
                  }
                } else {
                  // just update quantity of current purse, and
                  //  create another one with right quantity
                  TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("quantity", purse.get("quantity") - payload2.get("quantity")), *ch40) |

                  // purchase NFT from "0", new timestamp
                  if (purse.get("id") == "0") {
                    blockData!(*ch44) |
                    for (_, @timestamp, _ <- ch44) {
                      ch45!(timestamp)
                    }
                  // purchase ft or NFT not "0"
                  // duplicate timestamp
                  } else {
                    ch45!(purse.get("timestamp"))
                  } |

                  for (@timestamp <- ch45) {
                    for (_ <- ch40) {
                      makePurseCh!((
                        payload2.get("contractId"),
                        purse
                          .set("boxId", boxId)
                          .set("quantity", payload2.get("quantity"))
                          .set("price", Nil)
                          .set("timestamp", timestamp)
                          // will only be considered for nft, purchase from purse "0"
                          .set("newId", payload2.get("newId")),
                        payload2.get("data"),
                        payload2.get("merge"),
                        *ch43
                      ))
                    }
                  }
                }
              } |

              // STEP 5
              // everything went ok, do final payment
              for (@(pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) <- step5Ch) {
                stdout!(("feeAmount", feeAmount)) |
                stdout!(("amount", amount)) |
                @RevVault!("findOrCreate", escrowPurseRevAddr, *ch50) |
                for (@(true, purseVaultEscrow) <- ch50) {
                  @purseVaultEscrow!("transfer", recipientRevAddress, amount, escrowPurseAuthKey, *ch51) |
                  for (@r <- ch51) {
                    match r {
                      (true, Nil) => {
                        if (feeAmount != 0) {
                          @purseVaultEscrow!("transfer", feeRevAddress, feeAmount, escrowPurseAuthKey, *ch53) |
                          for (@transferFeeReturn <- ch53) {
                            match transferFeeReturn {
                              (true, Nil) => {
                                stdout!("fee transfer successful")
                              }
                              _ => {
                                stdout!("error: CRITICAL could not transfer fee")
                              }
                            }
                          }
                        } |
                        @return2!((true, Nil))
                      }
                      _ => {
                        stdout!("error: CRITICAL, makePurse went fine, but could not do final transfer") |
                        rollbackCh!("error: CRITICAL, makePurse went fine, but could not do final transfer")
                      }
                    }
                  }
                }
              }
            }
          }
          _ => {
            @return2!("error: invalid payload")
          }
        }
      }
    } |

    insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

    for (entryUri <- entryUriCh) {
      basket!({
        "status": "completed",
        "registryUri": *entryUri
      }) |
      stdout!(("rchain-token master registered at", *entryUri))
    }
  }
}
`;
};

var masterTerm = {
	masterTerm: masterTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var deployTerm_1 = (payload) => {
    return `new basket,
  masterEntryCh,
  registerContractReturnCh,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *masterEntryCh) |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("PUBLIC_REGISTER_CONTRACT", { "contractId": "${payload.contractId}", "fungible": ${payload.fungible}, "fee": ${payload.fee ? `("${payload.fee[0]}", ${payload.fee[1]})` : "Nil"}, "expires": ${payload.expires ? payload.expires : "Nil"} }, *registerContractReturnCh)) |
    for (@r <- registerContractReturnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, superKey) => {
          @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")!(superKey) |
          basket!({
            "status": "completed",
            "masterRegistryUri": "${payload.masterRegistryUri}",
            "contractId": "${payload.contractId}",
          }) |
          stdout!("completed, contract registered")
        }
      }
    }
  }
}
`;
};

var deployTerm = {
	deployTerm: deployTerm_1
};

var createPursesTerm_1 = (payload) => {
  const ids = Object.keys(payload.purses);
  ids.forEach((id) => {
    payload.purses[id].data = payload.data[id] || null;
  });

  return `new basket,
  returnCh,
  boxCh,
  itCh,
  idsCh,
  resultsCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (superKey <<- @(*deployerId, "rchain-token-contract", "${
    payload.masterRegistryUri
  }", "${payload.contractId}")) {

    for (@ids <- idsCh) {
      for (@i <= itCh) {
        match i {
          ${ids.length} => {
            for (@results <- resultsCh) {
              stdout!("completed, purses created, check results to see errors/successes") |
              basket!({ "status": "completed", "results": results})
            }
          }
          _ => {
            new x in {
              superKey!(("CREATE_PURSE", ${JSON.stringify(
                payload.purses
              ).replace(
                new RegExp(': null|:null', 'g'),
                ': Nil'
              )}.get(ids.nth(i)), *x)) |
              for (@y <- x) {
                for (@results <- resultsCh) {
                  resultsCh!(results.set(ids.nth(i), y)) |
                  itCh!(i + 1)
                }
              }
            }
          }
        }
      }
    } |
    idsCh!([${ids.map((id) => `"${id}"`).join(', ')}]) |
    itCh!(0) |
    resultsCh!({})
  }
}
`;
};

var createPursesTerm = {
	createPursesTerm: createPursesTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var lockTerm_1 = (
  payload
) => {
  return `new basket,
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
    superKey!((
      "LOCK",
      *returnCh
    )) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          stdout!("completed, contract locked") |
          basket!({ "status": "completed" })
        }
      }
    }
  }
}
`;
};

var lockTerm = {
	lockTerm: lockTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var deleteExpiredPurseTerm_1 = (
  payload
) => {
  return `new basket, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_DELETE_EXPIRED_PURSE", "${payload.contractId}", "${payload.purseId}", *x)) |
      for (@r <- x) {
        match r {
          String => {
            basket!({ "status": "failed", "message": r }) |
            stdout!(("failed", r))
          }
          _ => {
            stdout!("completed, expired purses deleted") |
            basket!({ "status": "completed" })
          }
        }
      }
    }
  }
}`;
};

var deleteExpiredPurseTerm = {
	deleteExpiredPurseTerm: deleteExpiredPurseTerm_1
};

var readPursesTerm_1 = (payload) => {
  let rholang = `new ${payload.pursesIds.map((id, i) => 'channel' + i)} in {`;
  payload.pursesIds.forEach((p, i) => {
    rholang +=
      '\n' +
      `entry!(("PUBLIC_READ_PURSE", { "contractId": "${payload.contractId}", "purseId": "${p}" }, *channel${i})) |`;
  });
  rholang += '\n';
  rholang += `for (${payload.pursesIds
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
  rholang += `  return!({}${payload.pursesIds
    .map((p, i) => `.union({ "${p}": value${i} })`)
    .join('')})\n`;
  rholang += `}\n}`;

  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
};

var readPursesTerm = {
	readPursesTerm: readPursesTerm_1
};

var readAllPursesTerm_1 = (payload) => {
  const base = 12;
  let numberOfIndexes = 0;
  if (payload.depth === 1) {
    numberOfIndexes = base;
  } else if (payload.depth === 2) {
    numberOfIndexes = base * base;
  } else if (payload.depth === 3) {
    numberOfIndexes = base * base * base;
  } else if (payload.depth === 4) {
    numberOfIndexes = base * base * base * base;
  } else if (payload.depth === 5) {
    numberOfIndexes = base * base * base * base * base;
  } else {
    throw new error('depth should be > 0 and < 6');
  }

  const indexes = [];
  for (let i = 0; i < numberOfIndexes; i += 1) {
    indexes.push(i);
  }

  let rholang = `new ${indexes.map((i) => 'channel' + i).join(', ')} in {`;
  indexes.forEach((i) => {
    rholang +=
      '\n' +
      `entry!(("PUBLIC_READ_PURSES_AT_INDEX", "${payload.contractId}", ${i}, *channel${i})) |`;
  });
  rholang += '\n';
  rholang += `for (${indexes
    .map((i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
  rholang += `  return!({}${indexes
    .map((i) => `.union(value${i})`)
    .join('')})\n`;
  rholang += `}\n}`;

  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
};

var readAllPursesTerm = {
	readAllPursesTerm: readAllPursesTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var readBoxTerm_1 = (
  payload
) => {
  return `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new a in {
      entry!(("PUBLIC_READ_BOX", "${payload.boxId}", *a)) |
      for (@box <- a) {
        return!(box)
      }
    }
  }
}`;
};

var readBoxTerm = {
	readBoxTerm: readBoxTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var readConfigTerm_1 = (
  payload
) => {
  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_READ_CONFIG", "${payload.contractId}", *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
};

var readConfigTerm = {
	readConfigTerm: readConfigTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var updatePurseDataTerm_1 = (
  payload
) => {
  return `new basket,
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("UPDATE_PURSE_DATA", { "contractId": "${payload.contractId}", "data": "${payload.data}", "purseId": "${payload.purseId}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          basket!({ "status": "completed" }) |
          stdout!("completed, data updated")
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

var readPursesDataTerm_1 = (payload) => {
  let rholang = `new ${payload.pursesIds.map((id, i) => 'channel' + i)} in {`;
  payload.pursesIds.forEach((p, i) => {
    rholang +=
      '\n' +
      `entry!(("PUBLIC_READ_PURSE_DATA", { "contractId": "${payload.contractId}", "purseId": "${p}" }, *channel${i})) |`;
  });
  rholang += '\n';
  rholang += `for (${payload.pursesIds
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
  rholang += `  return!({}${payload.pursesIds
    .map((p, i) => `.union({ "${p}": value${i} })`)
    .join('')})\n`;
  rholang += `}\n}`;

  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
};

var readPursesDataTerm = {
	readPursesDataTerm: readPursesDataTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var updatePursePriceTerm_1 = (
  payload
) => {
  return `new basket,
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("UPDATE_PURSE_PRICE", { "contractId": "${payload.contractId}", "price": ${payload.price || "Nil"}, "purseId": "${payload.purseId}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          basket!({ "status": "completed" }) |
          stdout!("completed, price updated")
        }
      }
    }
  }
}
`;
};

var updatePursePriceTerm = {
	updatePursePriceTerm: updatePursePriceTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var renewTerm_1 = (
  payload
) => {
  return `
new
  basket,
  revVaultCh,
  boxCh,

  returnCh,
  priceCh,
  publicKeyCh,
  purseIdCh,
  contractIdCh,

  revAddressCh,
  contractExistsCh,
  proceed1Ch,
  proceed2Ch,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  purseIdCh!!("${payload.purseId}") |
  publicKeyCh!!("${payload.publicKey}") |
  contractIdCh!!("${payload.contractId}") |
  priceCh!!(${payload.price || "Nil"}) |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {

    registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *contractExistsCh) |
    for (_ <- contractExistsCh) {
      proceed1Ch!(Nil)
    } |

    registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |

    /*
      Create a vault/purse that is just used once (purse)
    */
    for(@(_, *RevVault) <- revVaultCh; _ <- proceed1Ch) {
      new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, deployerRevAddressCh, RevVaultCh, deployerVaultCh, deployerAuthKeyCh in {
        revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
        RevVault!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
        for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

          RevVault!("findOrCreate", purseRevAddr, *purseVaultCh) |

          for (
            @(true, purseVault) <- purseVaultCh;
            @purseId <- purseIdCh;
            @contractId <- contractIdCh;
            @price <- priceCh;
            @publicKey <- publicKeyCh
          ) {

            stdout!({
              "price": price,
              "purseId": purseId,
              "contractId": contractId,
              "publicKey": publicKey
            }) |
            match {
              "price": price,
              "purseId": purseId,
              "contractId": contractId,
              "publicKey": publicKey
            } {
              {
                "price": Int,
                "purseId": String,
                "contractId": String,
                "publicKey": String
              } => {
                proceed2Ch!(Nil)
              }
              _ => {
                basket!({ "status": "failed", "message": "error: invalid payload, cancelled renew and payment" }) |
                stdout!(("failed", "error: invalid payload, cancelled renew and payment"))
              }
            } |

            for (_ <- proceed2Ch) {

              revAddress!("fromPublicKey", publicKey.hexToBytes(), *deployerRevAddressCh) |
              registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
              for (@(_, RevVault) <- RevVaultCh; @deployerRevAddress <- deployerRevAddressCh) {
                
                // send price dust in purse
                @RevVault!("findOrCreate", deployerRevAddress, *deployerVaultCh) |
                @RevVault!("deployerAuthKey", *deployerId, *deployerAuthKeyCh) |
                for (@(true, deployerVault) <- deployerVaultCh; @deployerAuthKey <- deployerAuthKeyCh) {

                  stdout!(("Beginning transfer of ", price, "dust from", deployerRevAddress, "to", purseRevAddr)) |

                  new resultCh, entryCh in {
                    @deployerVault!("transfer", purseRevAddr, price, deployerAuthKey, *resultCh) |
                    for (@result <- resultCh) {

                      stdout!(("Finished transfer of ", price, "dust to", purseRevAddr, "result was:", result)) |
                      match result {
                        (true, Nil) => {
                          boxCh!((
                            "RENEW",
                            {
                              "contractId": contractId,
                              "purseId": purseId,
                              "purseRevAddr": purseRevAddr,
                              "purseAuthKey": purseAuthKey
                            },
                            *returnCh
                          )) |
                          for (@r <- returnCh) {
                            match r {
                              String => {
                                new refundPurseBalanceCh, refundResultCh in {
                                  @purseVault!("balance", *refundPurseBalanceCh) |
                                  for (@balance <- refundPurseBalanceCh) {
                                    if (balance != price) {
                                      stdout!("error: CRITICAL, renew was not successful and balance of purse is now different from price")
                                    } |
                                    @purseVault!("transfer", deployerRevAddress, balance, purseAuthKey, *refundResultCh) |
                                    for (@result <- refundResultCh)  {
                                      match result {
                                        (true, Nil) => {
                                          match "error: renew failed but was able to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                        _ => {
                                          stdout!(result) |
                                          match "error: CRITICAL renew failed and was NOT ABLE to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                basket!({ "status": "completed" }) |
                                stdout!("completed, renew successful")
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
}`;
};

var renewTerm = {
	renewTerm: renewTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var purchaseTerm_1 = (
  payload
) => {
  return `
new
  basket,
  revVaultCh,
  boxCh,

  returnCh,
  quantityCh,
  mergeCh,
  publicKeyCh,
  priceCh,
  newIdCh,
  dataCh,
  purseIdCh,
  contractIdCh,

  revAddressCh,
  contractExistsCh,
  proceed1Ch,
  proceed2Ch,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  purseIdCh!!("${payload.purseId}") |
  contractIdCh!!("${payload.contractId}") |
  newIdCh!!("${payload.newId ? payload.newId : ""}") |
  priceCh!!(${payload.price || "Nil"}) |
  mergeCh!!(${payload.merge}) |
  quantityCh!!(${payload.quantity}) |
  publicKeyCh!!("${payload.publicKey}") |
  dataCh!!("${payload.data}") |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {

    registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *contractExistsCh) |
    for (_ <- contractExistsCh) {
      proceed1Ch!(Nil)
    } |

    registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |

    /*
      Create a vault/purse that is just used once (purse)
    */
    for(@(_, *RevVault) <- revVaultCh; _ <- proceed1Ch) {
      new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, deployerRevAddressCh, RevVaultCh, deployerVaultCh, deployerAuthKeyCh in {
        revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
        RevVault!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
        for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

          RevVault!("findOrCreate", purseRevAddr, *purseVaultCh) |

          for (
            @(true, purseVault) <- purseVaultCh;
            @publicKey <- publicKeyCh;
            @purseId <- purseIdCh;
            @merge <- mergeCh;
            @contractId <- contractIdCh;
            @price <- priceCh;
            @quantity <- quantityCh;
            @newId <- newIdCh;
            @data <- dataCh
          ) {

            stdout!({
              "publicKey": publicKey,
              "price": price,
              "merge": merge,
              "quantity": quantity,
              "purseId": purseId,
              "contractId": contractId,
              "newId": newId,
            }) |
            match {
              "publicKey": publicKey,
              "price": price,
              "merge": merge,
              "quantity": quantity,
              "purseId": purseId,
              "contractId": contractId,
              "newId": newId,
            } {
              {
                "publicKey": String,
                "price": Int,
                "merge": Bool,
                "quantity": Int,
                "purseId": String,
                "contractId": String,
                "newId": String,
              } => {
                proceed2Ch!(Nil)
              }
              _ => {
                basket!({ "status": "failed", "message": "error: invalid payload, cancelled purchase and payment" }) |
                stdout!(("failed", "error: invalid payload, cancelled purchase and payment"))
              }
            } |

            for (_ <- proceed2Ch) {

              revAddress!("fromPublicKey", publicKey.hexToBytes(), *deployerRevAddressCh) |
              registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
              for (@(_, RevVault) <- RevVaultCh; @deployerRevAddress <- deployerRevAddressCh) {
                
                // send price * quantity dust in purse
                @RevVault!("findOrCreate", deployerRevAddress, *deployerVaultCh) |
                @RevVault!("deployerAuthKey", *deployerId, *deployerAuthKeyCh) |
                for (@(true, deployerVault) <- deployerVaultCh; @deployerAuthKey <- deployerAuthKeyCh) {

                  stdout!(("Beginning transfer of ", price * quantity, "dust from", deployerRevAddress, "to", purseRevAddr)) |

                  new resultCh, entryCh in {
                    @deployerVault!("transfer", purseRevAddr, price * quantity, deployerAuthKey, *resultCh) |
                    for (@result <- resultCh) {

                      stdout!(("Finished transfer of ", price * quantity, "dust to", purseRevAddr, "result was:", result)) |
                      match result {
                        (true, Nil) => {
                          boxCh!((
                            "PURCHASE",
                            {
                              "contractId": contractId,
                              "purseId": purseId,
                              "data": data,
                              "quantity": quantity,
                              "merge": merge,
                              "newId": newId,
                              "purseRevAddr": purseRevAddr,
                              "purseAuthKey": purseAuthKey
                            },
                            *returnCh
                          )) |
                          for (@r <- returnCh) {
                            match r {
                              String => {
                                new refundPurseBalanceCh, refundResultCh in {
                                  @purseVault!("balance", *refundPurseBalanceCh) |
                                  for (@balance <- refundPurseBalanceCh) {
                                    if (balance != price * quantity) {
                                      stdout!("error: CRITICAL, purchase was not successful and balance of purse is now different from price * quantity")
                                    } |
                                    @purseVault!("transfer", deployerRevAddress, balance, purseAuthKey, *refundResultCh) |
                                    for (@result <- refundResultCh)  {
                                      match result {
                                        (true, Nil) => {
                                          match "error: purchase failed but was able to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                        _ => {
                                          stdout!(result) |
                                          match "error: CRITICAL purchase failed and was NOT ABLE to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                basket!({ "status": "completed" }) |
                                stdout!("completed, purchase successful")
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
}`;
};

var purchaseTerm = {
	purchaseTerm: purchaseTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var withdrawTerm_1 = (
  payload
) => {
  return `new basket,
  withdrawReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("WITHDRAW", { "contractId": "${payload.contractId}", "quantity": ${payload.withdrawQuantity}, "toBoxId": "${payload.toBoxId}", "purseId": "${payload.purseId}", "merge": ${payload.merge} }, *withdrawReturnCh)) |
    for (@r <- withdrawReturnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          basket!({ "status": "completed" }) |
          stdout!("completed, withdraw successful")
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

// store-as-bytes-map
var decodePurses_1 = (expr, rhoExprToVar, decodePar) => {
  const purses = {};

  Object.keys(expr.ExprMap.data).forEach((k) => {
    const a = expr.ExprMap.data[k];
    if (a && a.ExprBytes && a.ExprBytes.data) {
      const b = Buffer.from(a.ExprBytes.data, 'hex');
      try {
        const valJs = rhoExprToVar(decodePar(b).exprs[0]);
        purses[valJs.id] = valJs;
      } catch (err) {
        throw err;
      }
    }
  });
  return purses;
};

// store-as-bytes-array
/*
const DELIMITER = 'c2a324c2a324c2a324c2a324'; // '£$£$£$£$' represented has hex
const INSIDE_DELIMITER = 'c2a324c2a324'; // '£$£$' represented has hex
module.exports.decodePurses = (expr, rhoExprToVar, decodePar) => {
  const purses = {};
  if (expr && expr.ExprBytes && expr.ExprBytes.data) {
    expr.ExprBytes.data
      .split(DELIMITER)
      // remove empty string at first index
      .filter((section) => !!section)
      .forEach((section) => {
        const b = Buffer.from(section.split(INSIDE_DELIMITER)[1], 'hex');
        try {
          const par = decodePar(b).exprs[0];
          const valJs = rhoExprToVar(par);
          purses[valJs.id] = valJs;
        } catch (err) {
          throw err;
        }
      });
  }
  return purses;
}; */

var decodePurses = {
	decodePurses: decodePurses_1
};

var VERSION = '8.0.0';

var constants = {
	VERSION: VERSION
};

// rholang terms
const { deployBoxTerm: deployBoxTerm$1 } = deployBoxTerm;
const { masterTerm: masterTerm$1 } = masterTerm;
const { deployTerm: deployTerm$1 } = deployTerm;
const { createPursesTerm: createPursesTerm$1 } = createPursesTerm;
const { lockTerm: lockTerm$1 } = lockTerm;
const { deleteExpiredPurseTerm: deleteExpiredPurseTerm$1 } = deleteExpiredPurseTerm;
const { readPursesTerm: readPursesTerm$1 } = readPursesTerm;
const { readAllPursesTerm: readAllPursesTerm$1 } = readAllPursesTerm;
const { readBoxTerm: readBoxTerm$1 } = readBoxTerm;
const { readConfigTerm: readConfigTerm$1 } = readConfigTerm;
const { updatePurseDataTerm: updatePurseDataTerm$1 } = updatePurseDataTerm;
const { readPursesDataTerm: readPursesDataTerm$1 } = readPursesDataTerm;
const { updatePursePriceTerm: updatePursePriceTerm$1 } = updatePursePriceTerm;
const { renewTerm: renewTerm$1 } = renewTerm;
const { purchaseTerm: purchaseTerm$1 } = purchaseTerm;
const { withdrawTerm: withdrawTerm$1 } = withdrawTerm;

// utils
const { decodePurses: decodePurses$1 } = decodePurses;

const { VERSION: VERSION$1 } = constants;

var src = {
  version: VERSION$1,

  masterTerm: masterTerm$1,
  deployBoxTerm: deployBoxTerm$1,
  deployTerm: deployTerm$1,
  createPursesTerm: createPursesTerm$1,
  lockTerm: lockTerm$1,
  deleteExpiredPurseTerm: deleteExpiredPurseTerm$1,
  updatePurseDataTerm: updatePurseDataTerm$1,
  updatePursePriceTerm: updatePursePriceTerm$1,
  purchaseTerm: purchaseTerm$1,
  renewTerm: renewTerm$1,
  withdrawTerm: withdrawTerm$1,

  readPursesTerm: readPursesTerm$1,
  readAllPursesTerm: readAllPursesTerm$1,
  readBoxTerm: readBoxTerm$1,
  readConfigTerm: readConfigTerm$1,
  readPursesDataTerm: readPursesDataTerm$1,

  // utils
  decodePurses: decodePurses$1,
};
var src_16 = src.readConfigTerm;
var src_17 = src.readPursesDataTerm;

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
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

var xstream = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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

var BeesLoadStatus;
(function (BeesLoadStatus) {
    BeesLoadStatus["Loading"] = "loading";
    BeesLoadStatus["Failed"] = "failed";
    BeesLoadStatus["Completed"] = "completed";
})(BeesLoadStatus || (BeesLoadStatus = {}));
var BeesLoadError;
(function (BeesLoadError) {
    // request
    BeesLoadError["IncompleteAddress"] = "The address is incomplete";
    BeesLoadError["ChainNotFound"] = "Blockchain not found";
    BeesLoadError["MissingBlockchainData"] = "Missing data from the blockchain";
    BeesLoadError["RecordNotFound"] = "Record not found";
    // not found
    BeesLoadError["ResourceNotFound"] = "Contract not found";
    // server error
    BeesLoadError["ServerError"] = "Server error";
    // resolver
    BeesLoadError["InsufficientNumberOfNodes"] = "Insufficient number of nodes";
    BeesLoadError["OutOfNodes"] = "Out of nodes";
    BeesLoadError["UnstableState"] = "Unstable state";
    BeesLoadError["UnaccurateState"] = "Unaccurate state";
    // parsing
    BeesLoadError["FailedToParseResponse"] = "Failed to parse response";
    BeesLoadError["InvalidManifest"] = "Invalid manifest";
    BeesLoadError["InvalidSignature"] = "Invalid signature";
    BeesLoadError["InvalidRecords"] = "Invalid records";
    BeesLoadError["InvalidNodes"] = "Invalid nodes";
    BeesLoadError["InvalidServers"] = "Invalid servers";
})(BeesLoadError || (BeesLoadError = {}));
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
            existingData = __assign(__assign({}, existingData), (_a = {}, _a[key] = __assign(__assign({}, existingData[key]), { nodeUrls: existingData[key].nodeUrls.concat(data.nodeUrl) }), _a));
        }
    });
    if (!found) {
        existingData = __assign(__assign({}, existingData), (_a = {}, _a[Object.keys(existingData).length + 1] = {
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
var resolver = function (queryHandler, nodeUrls, resolverMode, resolverAccuracy, resolverAbsolute, comparer) {
    var loadErrors = {};
    var loadState = {};
    var loadPending = [];
    return xs.create({
        start: function (listener) {
            listener.next({
                loadErrors: loadErrors,
                loadState: loadState,
                loadPending: loadPending,
                status: BeesLoadStatus.Loading
            });
            if (resolverMode === "absolute") {
                if (resolverAbsolute > nodeUrls.length) {
                    listener.next({
                        loadErrors: loadErrors,
                        loadState: loadState,
                        loadPending: loadPending,
                        loadError: {
                            error: BeesLoadError.InsufficientNumberOfNodes,
                            args: {
                                expected: resolverAbsolute,
                                got: nodeUrls.length
                            }
                        },
                        status: BeesLoadStatus.Failed
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
                                error: BeesLoadError.OutOfNodes,
                                args: {
                                    alreadyQueried: i - Object.keys(loadErrors).length,
                                    resolverAbsolute: resolverAbsolute
                                }
                            },
                            status: BeesLoadStatus.Failed
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
                        status: BeesLoadStatus.Loading
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
                                    loadErrors = __assign(__assign({}, loadErrors), (_a = {}, _a[data.nodeUrl] = {
                                        nodeUrl: data.nodeUrl,
                                        status: err.message ? parseInt(err.message, 10) : 400
                                    }, _a));
                                }
                            }
                            else {
                                loadErrors = __assign(__assign({}, loadErrors), (_b = {}, _b[data.nodeUrl] = {
                                    nodeUrl: data.nodeUrl,
                                    status: data.status
                                }, _b));
                            }
                            listener.next({
                                loadErrors: loadErrors,
                                loadState: loadState,
                                loadPending: loadPending,
                                status: BeesLoadStatus.Loading
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
                                        error: BeesLoadError.ServerError,
                                        args: {
                                            numberOfLoadErrors: Object.keys(loadErrors).length
                                        }
                                    },
                                    status: BeesLoadStatus.Failed
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
                                        error: BeesLoadError.UnstableState,
                                        args: {
                                            numberOfLoadStates: Object.keys(loadState).length
                                        }
                                    },
                                    status: BeesLoadStatus.Failed
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
                                                    error: BeesLoadError.UnaccurateState,
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
                                                status: BeesLoadStatus.Failed
                                            });
                                            listener.complete();
                                            return;
                                        }
                                        listener.next({
                                            loadErrors: loadErrors,
                                            loadState: loadState,
                                            loadPending: loadPending,
                                            status: BeesLoadStatus.Completed
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
};

var getNodeFromIndex = function (index) {
    return {
        ip: index.split('---')[0],
        host: index.split('---')[1],
    };
};

var dappyNetworkAgents = {};
var httpBrowserToNode = function (data, node, timeout) {
    return new Promise(function (resolve, reject) {
        var s = JSON.stringify(data);
        var l = Buffer.from(s).length;
        if (l > WS_PAYLOAD_PAX_SIZE) {
            reject("bn payload is " + l / 1000 + "kb, max size is " + WS_PAYLOAD_PAX_SIZE / 1000 + "kb");
            return;
        }
        try {
            var ip = node.ip.split(':')[0];
            var host = node.host;
            var port = node.ip.indexOf(':') === -1 ? 443 : node.ip.split(':')[1];
            var cert = node.cert ? decodeURI(node.cert) : node.origin === 'user' ? undefined : 'INVALIDCERT';
            if (!dappyNetworkAgents[ip + "-" + cert]) {
                dappyNetworkAgents[ip + "-" + cert] = new https.Agent({
                    /* no dns */
                    host: ip,
                    rejectUnauthorized: false,
                    cert: cert,
                    minVersion: 'TLSv1.3',
                    ca: [], // we don't want to rely on CA
                });
            }
            var options = {
                agent: dappyNetworkAgents[node.ip + "-" + node.cert],
                method: 'POST',
                port: port,
                host: ip,
                rejectUnauthorized: false,
                path: "/" + data.type,
                headers: {
                    'Content-Type': 'application/json',
                    Host: host,
                },
            };
            var req = https.request(options, function (res) {
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
                        error: BeesLoadError.UnknownError,
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

// ES6 Map
var map;
try {
  map = Map;
} catch (_) { }
var set;

// ES6 Set
try {
  set = Set;
} catch (_) { }

function baseClone (src, circulars, clones) {
  // Null/undefined/functions/etc
  if (!src || typeof src !== 'object' || typeof src === 'function') {
    return src
  }

  // DOM Node
  if (src.nodeType && 'cloneNode' in src) {
    return src.cloneNode(true)
  }

  // Date
  if (src instanceof Date) {
    return new Date(src.getTime())
  }

  // RegExp
  if (src instanceof RegExp) {
    return new RegExp(src)
  }

  // Arrays
  if (Array.isArray(src)) {
    return src.map(clone)
  }

  // ES6 Maps
  if (map && src instanceof map) {
    return new Map(Array.from(src.entries()))
  }

  // ES6 Sets
  if (set && src instanceof set) {
    return new Set(Array.from(src.values()))
  }

  // Object
  if (src instanceof Object) {
    circulars.push(src);
    var obj = Object.create(src);
    clones.push(obj);
    for (var key in src) {
      var idx = circulars.findIndex(function (i) {
        return i === src[key]
      });
      obj[key] = idx > -1 ? clones[idx] : baseClone(src[key], circulars, clones);
    }
    return obj
  }

  // ???
  return src
}

function clone (src) {
  return baseClone(src, [], [])
}

var nanoclone = clone;

const toString = Object.prototype.toString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => '';
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function printNumber(val) {
  if (val != +val) return 'NaN';
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : '' + val;
}

function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false) return '' + val;
  const typeOf = typeof val;
  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
  if (typeOf === 'function') return '[Function ' + (val.name || 'anonymous') + ']';
  if (typeOf === 'symbol') return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  const tag = toString.call(val).slice(8, -1);
  if (tag === 'Date') return isNaN(val.getTime()) ? '' + val : val.toISOString(val);
  if (tag === 'Error' || val instanceof Error) return '[' + errorToString.call(val) + ']';
  if (tag === 'RegExp') return regExpToString.call(val);
  return null;
}

function printValue(value, quoteStrings) {
  let result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;
  return JSON.stringify(value, function (key, value) {
    let result = printSimpleValue(this[key], quoteStrings);
    if (result !== null) return result;
    return value;
  }, 2);
}

let mixed = {
  default: '${path} is invalid',
  required: '${path} is a required field',
  oneOf: '${path} must be one of the following values: ${values}',
  notOneOf: '${path} must not be one of the following values: ${values}',
  notType: ({
    path,
    type,
    value,
    originalValue
  }) => {
    let isCast = originalValue != null && originalValue !== value;
    let msg = `${path} must be a \`${type}\` type, ` + `but the final value was: \`${printValue(value, true)}\`` + (isCast ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : '.');

    if (value === null) {
      msg += `\n If "null" is intended as an empty value be sure to mark the schema as \`.nullable()\``;
    }

    return msg;
  },
  defined: '${path} must be defined'
};
let string = {
  length: '${path} must be exactly ${length} characters',
  min: '${path} must be at least ${min} characters',
  max: '${path} must be at most ${max} characters',
  matches: '${path} must match the following: "${regex}"',
  email: '${path} must be a valid email',
  url: '${path} must be a valid URL',
  uuid: '${path} must be a valid UUID',
  trim: '${path} must be a trimmed string',
  lowercase: '${path} must be a lowercase string',
  uppercase: '${path} must be a upper case string'
};
let number = {
  min: '${path} must be greater than or equal to ${min}',
  max: '${path} must be less than or equal to ${max}',
  lessThan: '${path} must be less than ${less}',
  moreThan: '${path} must be greater than ${more}',
  positive: '${path} must be a positive number',
  negative: '${path} must be a negative number',
  integer: '${path} must be an integer'
};
let date = {
  min: '${path} field must be later than ${min}',
  max: '${path} field must be at earlier than ${max}'
};
let boolean = {
  isValue: '${path} field must be ${value}'
};
let object = {
  noUnknown: '${path} field has unspecified keys: ${unknown}'
};
let array = {
  min: '${path} field must have at least ${min} items',
  max: '${path} field must have less than or equal to ${max} items',
  length: '${path} must be have ${length} items'
};
Object.assign(Object.create(null), {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean
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
var root$1 = _freeGlobal || freeSelf || Function('return this')();

var _root = root$1;

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
    symbolToString$1 = symbolProto ? symbolProto.toString : undefined;

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
    return symbolToString$1 ? symbolToString$1.call(value) : '';
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
function toString$1(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString$1;

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

var isSchema = (obj => obj && obj.__isYupSchema__);

class Condition {
  constructor(refs, options) {
    this.refs = refs;
    this.refs = refs;

    if (typeof options === 'function') {
      this.fn = options;
      return;
    }

    if (!has_1(options, 'is')) throw new TypeError('`is:` is required for `when()` conditions');
    if (!options.then && !options.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions');
    let {
      is,
      then,
      otherwise
    } = options;
    let check = typeof is === 'function' ? is : (...values) => values.every(value => value === is);

    this.fn = function (...args) {
      let options = args.pop();
      let schema = args.pop();
      let branch = check(...args) ? then : otherwise;
      if (!branch) return undefined;
      if (typeof branch === 'function') return branch(schema);
      return schema.concat(branch.resolve(options));
    };
  }

  resolve(base, options) {
    let values = this.refs.map(ref => ref.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context));
    let schema = this.fn.apply(base, values.concat(base, options));
    if (schema === undefined || schema === base) return base;
    if (!isSchema(schema)) throw new TypeError('conditions must return a schema object');
    return schema.resolve(options);
  }

}

function toArray(value) {
  return value == null ? [] : [].concat(value);
}

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
let strReg = /\$\{\s*(\w+)\s*\}/g;
class ValidationError extends Error {
  static formatError(message, params) {
    const path = params.label || params.path || 'this';
    if (path !== params.path) params = _extends({}, params, {
      path
    });
    if (typeof message === 'string') return message.replace(strReg, (_, key) => printValue(params[key]));
    if (typeof message === 'function') return message(params);
    return message;
  }

  static isError(err) {
    return err && err.name === 'ValidationError';
  }

  constructor(errorOrErrors, value, field, type) {
    super();
    this.name = 'ValidationError';
    this.value = value;
    this.path = field;
    this.type = type;
    this.errors = [];
    this.inner = [];
    toArray(errorOrErrors).forEach(err => {
      if (ValidationError.isError(err)) {
        this.errors.push(...err.errors);
        this.inner = this.inner.concat(err.inner.length ? err.inner : err);
      } else {
        this.errors.push(err);
      }
    });
    this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
    if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
  }

}

const once = cb => {
  let fired = false;
  return (...args) => {
    if (fired) return;
    fired = true;
    cb(...args);
  };
};

function runTests(options, cb) {
  let {
    endEarly,
    tests,
    args,
    value,
    errors,
    sort,
    path
  } = options;
  let callback = once(cb);
  let count = tests.length;
  const nestedErrors = [];
  errors = errors ? errors : [];
  if (!count) return errors.length ? callback(new ValidationError(errors, value, path)) : callback(null, value);

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    test(args, function finishTestRun(err) {
      if (err) {
        // always return early for non validation errors
        if (!ValidationError.isError(err)) {
          return callback(err, value);
        }

        if (endEarly) {
          err.value = value;
          return callback(err, value);
        }

        nestedErrors.push(err);
      }

      if (--count <= 0) {
        if (nestedErrors.length) {
          if (sort) nestedErrors.sort(sort); //show parent errors after the nested ones: name.first, name

          if (errors.length) nestedErrors.push(...errors);
          errors = nestedErrors;
        }

        if (errors.length) {
          callback(new ValidationError(errors, value, path), value);
          return;
        }

        callback(null, value);
      }
    });
  }
}

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
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

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
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
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
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

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
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

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
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
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

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

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

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

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
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
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

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

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
var objectProto$a = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable;

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

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

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
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
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
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

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
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

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
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
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
    var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

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
Cache.prototype.clear = function () {
  this._size = 0;
  this._values = Object.create(null);
};
Cache.prototype.get = function (key) {
  return this._values[key]
};
Cache.prototype.set = function (key, value) {
  this._size >= this._maxSize && this.clear();
  if (!(key in this._values)) this._size++;

  return (this._values[key] = value)
};

var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
  DIGIT_REGEX = /^\d+$/,
  LEAD_DIGIT_REGEX = /^\d/,
  SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
  CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
  MAX_CACHE_SIZE = 512;

var pathCache = new Cache(MAX_CACHE_SIZE),
  setCache = new Cache(MAX_CACHE_SIZE),
  getCache = new Cache(MAX_CACHE_SIZE);

var propertyExpr = {
  Cache: Cache,

  split: split,

  normalizePath: normalizePath,

  setter: function (path) {
    var parts = normalizePath(path);

    return (
      setCache.get(path) ||
      setCache.set(path, function setter(obj, value) {
        var index = 0;
        var len = parts.length;
        var data = obj;

        while (index < len - 1) {
          var part = parts[index];
          if (
            part === '__proto__' ||
            part === 'constructor' ||
            part === 'prototype'
          ) {
            return obj
          }

          data = data[parts[index++]];
        }
        data[parts[index]] = value;
      })
    )
  },

  getter: function (path, safe) {
    var parts = normalizePath(path);
    return (
      getCache.get(path) ||
      getCache.set(path, function getter(data) {
        var index = 0,
          len = parts.length;
        while (index < len) {
          if (data != null || !safe) data = data[parts[index++]];
          else return
        }
        return data
      })
    )
  },

  join: function (segments) {
    return segments.reduce(function (path, part) {
      return (
        path +
        (isQuoted(part) || DIGIT_REGEX.test(part)
          ? '[' + part + ']'
          : (path ? '.' : '') + part)
      )
    }, '')
  },

  forEach: function (path, cb, thisArg) {
    forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
  },
};

function normalizePath(path) {
  return (
    pathCache.get(path) ||
    pathCache.set(
      path,
      split(path).map(function (part) {
        return part.replace(CLEAN_QUOTES_REGEX, '$2')
      })
    )
  )
}

function split(path) {
  return path.match(SPLIT_REGEX)
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

function hasLeadingNumber(part) {
  return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX)
}

function hasSpecialChars(part) {
  return SPEC_CHAR_REGEX.test(part)
}

function shouldBeQuoted(part) {
  return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part))
}
var propertyExpr_2 = propertyExpr.split;
var propertyExpr_5 = propertyExpr.getter;
var propertyExpr_7 = propertyExpr.forEach;

const prefixes = {
  context: '$',
  value: '.'
};
class Reference {
  constructor(key, options = {}) {
    if (typeof key !== 'string') throw new TypeError('ref must be a string, got: ' + key);
    this.key = key.trim();
    if (key === '') throw new TypeError('ref must be a non-empty string');
    this.isContext = this.key[0] === prefixes.context;
    this.isValue = this.key[0] === prefixes.value;
    this.isSibling = !this.isContext && !this.isValue;
    let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : '';
    this.path = this.key.slice(prefix.length);
    this.getter = this.path && propertyExpr_5(this.path, true);
    this.map = options.map;
  }

  getValue(value, parent, context) {
    let result = this.isContext ? context : this.isValue ? value : parent;
    if (this.getter) result = this.getter(result || {});
    if (this.map) result = this.map(result);
    return result;
  }
  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {Object=} options.context
   * @param {Object=} options.parent
   */


  cast(value, options) {
    return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
  }

  resolve() {
    return this;
  }

  describe() {
    return {
      type: 'ref',
      key: this.key
    };
  }

  toString() {
    return `Ref(${this.key})`;
  }

  static isRef(value) {
    return value && value.__isYupRef;
  }

} // @ts-ignore

Reference.prototype.__isYupRef = true;

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function createValidation(config) {
  function validate(_ref, cb) {
    let {
      value,
      path = '',
      label,
      options,
      originalValue,
      sync
    } = _ref,
        rest = _objectWithoutPropertiesLoose(_ref, ["value", "path", "label", "options", "originalValue", "sync"]);

    const {
      name,
      test,
      params,
      message
    } = config;
    let {
      parent,
      context
    } = options;

    function resolve(item) {
      return Reference.isRef(item) ? item.getValue(value, parent, context) : item;
    }

    function createError(overrides = {}) {
      const nextParams = mapValues_1(_extends$1({
        value,
        originalValue,
        label,
        path: overrides.path || path
      }, params, overrides.params), resolve);
      const error = new ValidationError(ValidationError.formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name);
      error.params = nextParams;
      return error;
    }

    let ctx = _extends$1({
      path,
      parent,
      type: name,
      createError,
      resolve,
      options,
      originalValue
    }, rest);

    if (!sync) {
      try {
        Promise.resolve(test.call(ctx, value, ctx)).then(validOrError => {
          if (ValidationError.isError(validOrError)) cb(validOrError);else if (!validOrError) cb(createError());else cb(null, validOrError);
        });
      } catch (err) {
        cb(err);
      }

      return;
    }

    let result;

    try {
      var _ref2;

      result = test.call(ctx, value, ctx);

      if (typeof ((_ref2 = result) == null ? void 0 : _ref2.then) === 'function') {
        throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. ` + `This test will finish after the validate call has returned`);
      }
    } catch (err) {
      cb(err);
      return;
    }

    if (ValidationError.isError(result)) cb(result);else if (!result) cb(createError());else cb(null, result);
  }

  validate.OPTIONS = config;
  return validate;
}

let trim = part => part.substr(0, part.length - 1).substr(1);

function getIn(schema, path, value, context = value) {
  let parent, lastPart, lastPartDebug; // root path: ''

  if (!path) return {
    parent,
    parentPath: path,
    schema
  };
  propertyExpr_7(path, (_part, isBracket, isArray) => {
    let part = isBracket ? trim(_part) : _part;
    schema = schema.resolve({
      context,
      parent,
      value
    });

    if (schema.innerType) {
      let idx = isArray ? parseInt(part, 10) : 0;

      if (value && idx >= value.length) {
        throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. ` + `because there is no value at that index. `);
      }

      parent = value;
      value = value && value[idx];
      schema = schema.innerType;
    } // sometimes the array index part of a path doesn't exist: "nested.arr.child"
    // in these cases the current part is the next schema and should be processed
    // in this iteration. For cases where the index signature is included this
    // check will fail and we'll handle the `child` part on the next iteration like normal


    if (!isArray) {
      if (!schema.fields || !schema.fields[part]) throw new Error(`The schema does not contain the path: ${path}. ` + `(failed at: ${lastPartDebug} which is a type: "${schema._type}")`);
      parent = value;
      value = value && value[part];
      schema = schema.fields[part];
    }

    lastPart = part;
    lastPartDebug = isBracket ? '[' + _part + ']' : '.' + _part;
  });
  return {
    schema,
    parent,
    parentPath: lastPart
  };
}

class ReferenceSet {
  constructor() {
    this.list = new Set();
    this.refs = new Map();
  }

  get size() {
    return this.list.size + this.refs.size;
  }

  describe() {
    const description = [];

    for (const item of this.list) description.push(item);

    for (const [, ref] of this.refs) description.push(ref.describe());

    return description;
  }

  toArray() {
    return Array.from(this.list).concat(Array.from(this.refs.values()));
  }

  add(value) {
    Reference.isRef(value) ? this.refs.set(value.key, value) : this.list.add(value);
  }

  delete(value) {
    Reference.isRef(value) ? this.refs.delete(value.key) : this.list.delete(value);
  }

  has(value, resolve) {
    if (this.list.has(value)) return true;
    let item,
        values = this.refs.values();

    while (item = values.next(), !item.done) if (resolve(item.value) === value) return true;

    return false;
  }

  clone() {
    const next = new ReferenceSet();
    next.list = new Set(this.list);
    next.refs = new Map(this.refs);
    return next;
  }

  merge(newItems, removeItems) {
    const next = this.clone();
    newItems.list.forEach(value => next.add(value));
    newItems.refs.forEach(value => next.add(value));
    removeItems.list.forEach(value => next.delete(value));
    removeItems.refs.forEach(value => next.delete(value));
    return next;
  }

}

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
class BaseSchema {
  constructor(options) {
    this.deps = [];
    this.conditions = [];
    this._whitelist = new ReferenceSet();
    this._blacklist = new ReferenceSet();
    this.exclusiveTests = Object.create(null);
    this.tests = [];
    this.transforms = [];
    this.withMutation(() => {
      this.typeError(mixed.notType);
    });
    this.type = (options == null ? void 0 : options.type) || 'mixed';
    this.spec = _extends$2({
      strip: false,
      strict: false,
      abortEarly: true,
      recursive: true,
      nullable: false,
      presence: 'optional'
    }, options == null ? void 0 : options.spec);
  } // TODO: remove


  get _type() {
    return this.type;
  }

  _typeCheck(_value) {
    return true;
  }

  clone(spec) {
    if (this._mutate) {
      if (spec) Object.assign(this.spec, spec);
      return this;
    } // if the nested value is a schema we can skip cloning, since
    // they are already immutable


    const next = Object.create(Object.getPrototypeOf(this)); // @ts-expect-error this is readonly

    next.type = this.type;
    next._typeError = this._typeError;
    next._whitelistError = this._whitelistError;
    next._blacklistError = this._blacklistError;
    next._whitelist = this._whitelist.clone();
    next._blacklist = this._blacklist.clone();
    next.exclusiveTests = _extends$2({}, this.exclusiveTests); // @ts-expect-error this is readonly

    next.deps = [...this.deps];
    next.conditions = [...this.conditions];
    next.tests = [...this.tests];
    next.transforms = [...this.transforms];
    next.spec = nanoclone(_extends$2({}, this.spec, spec));
    return next;
  }

  label(label) {
    var next = this.clone();
    next.spec.label = label;
    return next;
  }

  meta(...args) {
    if (args.length === 0) return this.spec.meta;
    let next = this.clone();
    next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
    return next;
  } // withContext<TContext extends AnyObject>(): BaseSchema<
  //   TCast,
  //   TContext,
  //   TOutput
  // > {
  //   return this as any;
  // }


  withMutation(fn) {
    let before = this._mutate;
    this._mutate = true;
    let result = fn(this);
    this._mutate = before;
    return result;
  }

  concat(schema) {
    if (!schema || schema === this) return this;
    if (schema.type !== this.type && this.type !== 'mixed') throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
    let base = this;
    let combined = schema.clone();

    const mergedSpec = _extends$2({}, base.spec, combined.spec); // if (combined.spec.nullable === UNSET)
    //   mergedSpec.nullable = base.spec.nullable;
    // if (combined.spec.presence === UNSET)
    //   mergedSpec.presence = base.spec.presence;


    combined.spec = mergedSpec;
    combined._typeError || (combined._typeError = base._typeError);
    combined._whitelistError || (combined._whitelistError = base._whitelistError);
    combined._blacklistError || (combined._blacklistError = base._blacklistError); // manually merge the blacklist/whitelist (the other `schema` takes
    // precedence in case of conflicts)

    combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
    combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist); // start with the current tests

    combined.tests = base.tests;
    combined.exclusiveTests = base.exclusiveTests; // manually add the new tests to ensure
    // the deduping logic is consistent

    combined.withMutation(next => {
      schema.tests.forEach(fn => {
        next.test(fn.OPTIONS);
      });
    });
    return combined;
  }

  isType(v) {
    if (this.spec.nullable && v === null) return true;
    return this._typeCheck(v);
  }

  resolve(options) {
    let schema = this;

    if (schema.conditions.length) {
      let conditions = schema.conditions;
      schema = schema.clone();
      schema.conditions = [];
      schema = conditions.reduce((schema, condition) => condition.resolve(schema, options), schema);
      schema = schema.resolve(options);
    }

    return schema;
  }
  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {*=} options.parent
   * @param {*=} options.context
   */


  cast(value, options = {}) {
    let resolvedSchema = this.resolve(_extends$2({
      value
    }, options));

    let result = resolvedSchema._cast(value, options);

    if (value !== undefined && options.assert !== false && resolvedSchema.isType(result) !== true) {
      let formattedValue = printValue(value);
      let formattedResult = printValue(result);
      throw new TypeError(`The value of ${options.path || 'field'} could not be cast to a value ` + `that satisfies the schema type: "${resolvedSchema._type}". \n\n` + `attempted value: ${formattedValue} \n` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ''));
    }

    return result;
  }

  _cast(rawValue, _options) {
    let value = rawValue === undefined ? rawValue : this.transforms.reduce((value, fn) => fn.call(this, value, rawValue, this), rawValue);

    if (value === undefined) {
      value = this.getDefault();
    }

    return value;
  }

  _validate(_value, options = {}, cb) {
    let {
      sync,
      path,
      from = [],
      originalValue = _value,
      strict = this.spec.strict,
      abortEarly = this.spec.abortEarly
    } = options;
    let value = _value;

    if (!strict) {
      // this._validating = true;
      value = this._cast(value, _extends$2({
        assert: false
      }, options)); // this._validating = false;
    } // value is cast, we can check if it meets type requirements


    let args = {
      value,
      path,
      options,
      originalValue,
      schema: this,
      label: this.spec.label,
      sync,
      from
    };
    let initialTests = [];
    if (this._typeError) initialTests.push(this._typeError);
    if (this._whitelistError) initialTests.push(this._whitelistError);
    if (this._blacklistError) initialTests.push(this._blacklistError);
    runTests({
      args,
      value,
      path,
      sync,
      tests: initialTests,
      endEarly: abortEarly
    }, err => {
      if (err) return void cb(err, value);
      runTests({
        tests: this.tests,
        args,
        path,
        sync,
        value,
        endEarly: abortEarly
      }, cb);
    });
  }

  validate(value, options, maybeCb) {
    let schema = this.resolve(_extends$2({}, options, {
      value
    })); // callback case is for nested validations

    return typeof maybeCb === 'function' ? schema._validate(value, options, maybeCb) : new Promise((resolve, reject) => schema._validate(value, options, (err, value) => {
      if (err) reject(err);else resolve(value);
    }));
  }

  validateSync(value, options) {
    let schema = this.resolve(_extends$2({}, options, {
      value
    }));
    let result;

    schema._validate(value, _extends$2({}, options, {
      sync: true
    }), (err, value) => {
      if (err) throw err;
      result = value;
    });

    return result;
  }

  isValid(value, options) {
    return this.validate(value, options).then(() => true, err => {
      if (ValidationError.isError(err)) return false;
      throw err;
    });
  }

  isValidSync(value, options) {
    try {
      this.validateSync(value, options);
      return true;
    } catch (err) {
      if (ValidationError.isError(err)) return false;
      throw err;
    }
  }

  _getDefault() {
    let defaultValue = this.spec.default;

    if (defaultValue == null) {
      return defaultValue;
    }

    return typeof defaultValue === 'function' ? defaultValue.call(this) : nanoclone(defaultValue);
  }

  getDefault(options) {
    let schema = this.resolve(options || {});
    return schema._getDefault();
  }

  default(def) {
    if (arguments.length === 0) {
      return this._getDefault();
    }

    let next = this.clone({
      default: def
    });
    return next;
  }

  strict(isStrict = true) {
    var next = this.clone();
    next.spec.strict = isStrict;
    return next;
  }

  _isPresent(value) {
    return value != null;
  }

  defined(message = mixed.defined) {
    return this.test({
      message,
      name: 'defined',
      exclusive: true,

      test(value) {
        return value !== undefined;
      }

    });
  }

  required(message = mixed.required) {
    return this.clone({
      presence: 'required'
    }).withMutation(s => s.test({
      message,
      name: 'required',
      exclusive: true,

      test(value) {
        return this.schema._isPresent(value);
      }

    }));
  }

  notRequired() {
    var next = this.clone({
      presence: 'optional'
    });
    next.tests = next.tests.filter(test => test.OPTIONS.name !== 'required');
    return next;
  }

  nullable(isNullable = true) {
    var next = this.clone({
      nullable: isNullable !== false
    });
    return next;
  }

  transform(fn) {
    var next = this.clone();
    next.transforms.push(fn);
    return next;
  }
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


  test(...args) {
    let opts;

    if (args.length === 1) {
      if (typeof args[0] === 'function') {
        opts = {
          test: args[0]
        };
      } else {
        opts = args[0];
      }
    } else if (args.length === 2) {
      opts = {
        name: args[0],
        test: args[1]
      };
    } else {
      opts = {
        name: args[0],
        message: args[1],
        test: args[2]
      };
    }

    if (opts.message === undefined) opts.message = mixed.default;
    if (typeof opts.test !== 'function') throw new TypeError('`test` is a required parameters');
    let next = this.clone();
    let validate = createValidation(opts);
    let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;

    if (opts.exclusive) {
      if (!opts.name) throw new TypeError('Exclusive tests must provide a unique `name` identifying the test');
    }

    if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;
    next.tests = next.tests.filter(fn => {
      if (fn.OPTIONS.name === opts.name) {
        if (isExclusive) return false;
        if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
      }

      return true;
    });
    next.tests.push(validate);
    return next;
  }

  when(keys, options) {
    if (!Array.isArray(keys) && typeof keys !== 'string') {
      options = keys;
      keys = '.';
    }

    let next = this.clone();
    let deps = toArray(keys).map(key => new Reference(key));
    deps.forEach(dep => {
      // @ts-ignore
      if (dep.isSibling) next.deps.push(dep.key);
    });
    next.conditions.push(new Condition(deps, options));
    return next;
  }

  typeError(message) {
    var next = this.clone();
    next._typeError = createValidation({
      message,
      name: 'typeError',

      test(value) {
        if (value !== undefined && !this.schema.isType(value)) return this.createError({
          params: {
            type: this.schema._type
          }
        });
        return true;
      }

    });
    return next;
  }

  oneOf(enums, message = mixed.oneOf) {
    var next = this.clone();
    enums.forEach(val => {
      next._whitelist.add(val);

      next._blacklist.delete(val);
    });
    next._whitelistError = createValidation({
      message,
      name: 'oneOf',

      test(value) {
        if (value === undefined) return true;
        let valids = this.schema._whitelist;
        return valids.has(value, this.resolve) ? true : this.createError({
          params: {
            values: valids.toArray().join(', ')
          }
        });
      }

    });
    return next;
  }

  notOneOf(enums, message = mixed.notOneOf) {
    var next = this.clone();
    enums.forEach(val => {
      next._blacklist.add(val);

      next._whitelist.delete(val);
    });
    next._blacklistError = createValidation({
      message,
      name: 'notOneOf',

      test(value) {
        let invalids = this.schema._blacklist;
        if (invalids.has(value, this.resolve)) return this.createError({
          params: {
            values: invalids.toArray().join(', ')
          }
        });
        return true;
      }

    });
    return next;
  }

  strip(strip = true) {
    let next = this.clone();
    next.spec.strip = strip;
    return next;
  }

  describe() {
    const next = this.clone();
    const {
      label,
      meta
    } = next.spec;
    const description = {
      meta,
      label,
      type: next.type,
      oneOf: next._whitelist.describe(),
      notOneOf: next._blacklist.describe(),
      tests: next.tests.map(fn => ({
        name: fn.OPTIONS.name,
        params: fn.OPTIONS.params
      })).filter((n, idx, list) => list.findIndex(c => c.name === n.name) === idx)
    };
    return description;
  }

}
// @ts-expect-error
BaseSchema.prototype.__isYupSchema__ = true;

for (const method of ['validate', 'validateSync']) BaseSchema.prototype[`${method}At`] = function (path, value, options = {}) {
  const {
    parent,
    parentPath,
    schema
  } = getIn(this, path, value, options.context);
  return schema[method](parent && parent[parentPath], _extends$2({}, options, {
    parent,
    path
  }));
};

for (const alias of ['equals', 'is']) BaseSchema.prototype[alias] = BaseSchema.prototype.oneOf;

for (const alias of ['not', 'nope']) BaseSchema.prototype[alias] = BaseSchema.prototype.notOneOf;

BaseSchema.prototype.optional = BaseSchema.prototype.notRequired;

var isAbsent = (value => value == null);

let rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-next-line

let rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; // eslint-disable-next-line

let rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

let isTrimmed = value => isAbsent(value) || value === value.trim();

let objStringTag = {}.toString();
function create() {
  return new StringSchema();
}
class StringSchema extends BaseSchema {
  constructor() {
    super({
      type: 'string'
    });
    this.withMutation(() => {
      this.transform(function (value) {
        if (this.isType(value)) return value;
        if (Array.isArray(value)) return value;
        const strValue = value != null && value.toString ? value.toString() : value;
        if (strValue === objStringTag) return value;
        return strValue;
      });
    });
  }

  _typeCheck(value) {
    if (value instanceof String) value = value.valueOf();
    return typeof value === 'string';
  }

  _isPresent(value) {
    return super._isPresent(value) && !!value.length;
  }

  length(length, message = string.length) {
    return this.test({
      message,
      name: 'length',
      exclusive: true,
      params: {
        length
      },

      test(value) {
        return isAbsent(value) || value.length === this.resolve(length);
      }

    });
  }

  min(min, message = string.min) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        min
      },

      test(value) {
        return isAbsent(value) || value.length >= this.resolve(min);
      }

    });
  }

  max(max, message = string.max) {
    return this.test({
      name: 'max',
      exclusive: true,
      message,
      params: {
        max
      },

      test(value) {
        return isAbsent(value) || value.length <= this.resolve(max);
      }

    });
  }

  matches(regex, options) {
    let excludeEmptyString = false;
    let message;
    let name;

    if (options) {
      if (typeof options === 'object') {
        ({
          excludeEmptyString = false,
          message,
          name
        } = options);
      } else {
        message = options;
      }
    }

    return this.test({
      name: name || 'matches',
      message: message || string.matches,
      params: {
        regex
      },
      test: value => isAbsent(value) || value === '' && excludeEmptyString || value.search(regex) !== -1
    });
  }

  email(message = string.email) {
    return this.matches(rEmail, {
      name: 'email',
      message,
      excludeEmptyString: true
    });
  }

  url(message = string.url) {
    return this.matches(rUrl, {
      name: 'url',
      message,
      excludeEmptyString: true
    });
  }

  uuid(message = string.uuid) {
    return this.matches(rUUID, {
      name: 'uuid',
      message,
      excludeEmptyString: false
    });
  } //-- transforms --


  ensure() {
    return this.default('').transform(val => val === null ? '' : val);
  }

  trim(message = string.trim) {
    return this.transform(val => val != null ? val.trim() : val).test({
      message,
      name: 'trim',
      test: isTrimmed
    });
  }

  lowercase(message = string.lowercase) {
    return this.transform(value => !isAbsent(value) ? value.toLowerCase() : value).test({
      message,
      name: 'string_case',
      exclusive: true,
      test: value => isAbsent(value) || value === value.toLowerCase()
    });
  }

  uppercase(message = string.uppercase) {
    return this.transform(value => !isAbsent(value) ? value.toUpperCase() : value).test({
      message,
      name: 'string_case',
      exclusive: true,
      test: value => isAbsent(value) || value === value.toUpperCase()
    });
  }

}
create.prototype = StringSchema.prototype; //
// String Interfaces
//

let isNaN$1 = value => value != +value;

function create$1() {
  return new NumberSchema();
}
class NumberSchema extends BaseSchema {
  constructor() {
    super({
      type: 'number'
    });
    this.withMutation(() => {
      this.transform(function (value) {
        let parsed = value;

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

  _typeCheck(value) {
    if (value instanceof Number) value = value.valueOf();
    return typeof value === 'number' && !isNaN$1(value);
  }

  min(min, message = number.min) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        min
      },

      test(value) {
        return isAbsent(value) || value >= this.resolve(min);
      }

    });
  }

  max(max, message = number.max) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: {
        max
      },

      test(value) {
        return isAbsent(value) || value <= this.resolve(max);
      }

    });
  }

  lessThan(less, message = number.lessThan) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: {
        less
      },

      test(value) {
        return isAbsent(value) || value < this.resolve(less);
      }

    });
  }

  moreThan(more, message = number.moreThan) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        more
      },

      test(value) {
        return isAbsent(value) || value > this.resolve(more);
      }

    });
  }

  positive(msg = number.positive) {
    return this.moreThan(0, msg);
  }

  negative(msg = number.negative) {
    return this.lessThan(0, msg);
  }

  integer(message = number.integer) {
    return this.test({
      name: 'integer',
      message,
      test: val => isAbsent(val) || Number.isInteger(val)
    });
  }

  truncate() {
    return this.transform(value => !isAbsent(value) ? value | 0 : value);
  }

  round(method) {
    var _method;

    var avail = ['ceil', 'floor', 'round', 'trunc'];
    method = ((_method = method) == null ? void 0 : _method.toLowerCase()) || 'round'; // this exists for symemtry with the new Math.trunc

    if (method === 'trunc') return this.truncate();
    if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
    return this.transform(value => !isAbsent(value) ? Math[method](value) : value);
  }

}
create$1.prototype = NumberSchema.prototype; //
// Number Interfaces
//

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
var rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

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
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo$1 = '[' + rsComboRange$1 + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo$1 + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

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

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$2 = '\\u0300-\\u036f',
    reComboHalfMarksRange$2 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$2 = '\\u20d0-\\u20ff',
    rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ$1 = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ$1 + rsAstralRange$1  + rsComboRange$2 + rsVarRange$1 + ']');

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
var rsAstralRange$2 = '\\ud800-\\udfff',
    rsComboMarksRange$3 = '\\u0300-\\u036f',
    reComboHalfMarksRange$3 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$3 = '\\u20d0-\\u20ff',
    rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3,
    rsVarRange$2 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$2 + ']',
    rsCombo$2 = '[' + rsComboRange$3 + ']',
    rsFitz$1 = '\\ud83c[\\udffb-\\udfff]',
    rsModifier$1 = '(?:' + rsCombo$2 + '|' + rsFitz$1 + ')',
    rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
    rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$2 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod$1 = rsModifier$1 + '?',
    rsOptVar$1 = '[' + rsVarRange$2 + ']?',
    rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
    rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
    rsSymbol = '(?:' + [rsNonAstral$1 + rsCombo$2 + '?', rsCombo$2, rsRegional$1, rsSurrPair$1, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz$1 + '(?=' + rsFitz$1 + ')|' + rsSymbol + rsSeq$1, 'g');

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

var array$1 = toposort;

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
toposort_1.array = array$1;

function sortFields(fields, excludes = []) {
  let edges = [];
  let nodes = [];

  function addNode(depPath, key) {
    var node = propertyExpr_2(depPath)[0];
    if (!~nodes.indexOf(node)) nodes.push(node);
    if (!~excludes.indexOf(`${key}-${node}`)) edges.push([key, node]);
  }

  for (const key in fields) if (has_1(fields, key)) {
    let value = fields[key];
    if (!~nodes.indexOf(key)) nodes.push(key);
    if (Reference.isRef(value) && value.isSibling) addNode(value.path, key);else if (isSchema(value) && 'deps' in value) value.deps.forEach(path => addNode(path, key));
  }

  return toposort_1.array(nodes, edges).reverse();
}

function findIndex(arr, err) {
  let idx = Infinity;
  arr.some((key, ii) => {
    var _err$path;

    if (((_err$path = err.path) == null ? void 0 : _err$path.indexOf(key)) !== -1) {
      idx = ii;
      return true;
    }
  });
  return idx;
}

function sortByKeyOrder(keys) {
  return (a, b) => {
    return findIndex(keys, a) - findIndex(keys, b);
  };
}

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

let isObject$1 = obj => Object.prototype.toString.call(obj) === '[object Object]';

function unknown(ctx, value) {
  let known = Object.keys(ctx.fields);
  return Object.keys(value).filter(key => known.indexOf(key) === -1);
}

const defaultSort = sortByKeyOrder([]);
class ObjectSchema extends BaseSchema {
  constructor(spec) {
    super({
      type: 'object'
    });
    this.fields = Object.create(null);
    this._sortErrors = defaultSort;
    this._nodes = [];
    this._excludedEdges = [];
    this.withMutation(() => {
      this.transform(function coerce(value) {
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
        this.shape(spec);
      }
    });
  }

  _typeCheck(value) {
    return isObject$1(value) || typeof value === 'function';
  }

  _cast(_value, options = {}) {
    var _options$stripUnknown;

    let value = super._cast(_value, options); //should ignore nulls here


    if (value === undefined) return this.getDefault();
    if (!this._typeCheck(value)) return value;
    let fields = this.fields;
    let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;

    let props = this._nodes.concat(Object.keys(value).filter(v => this._nodes.indexOf(v) === -1));

    let intermediateValue = {}; // is filled during the transform below

    let innerOptions = _extends$3({}, options, {
      parent: intermediateValue,
      __validating: options.__validating || false
    });

    let isChanged = false;

    for (const prop of props) {
      let field = fields[prop];
      let exists = has_1(value, prop);

      if (field) {
        let fieldValue;
        let inputValue = value[prop]; // safe to mutate since this is fired in sequence

        innerOptions.path = (options.path ? `${options.path}.` : '') + prop; // innerOptions.value = value[prop];

        field = field.resolve({
          value: inputValue,
          context: options.context,
          parent: intermediateValue
        });
        let fieldSpec = 'spec' in field ? field.spec : undefined;
        let strict = fieldSpec == null ? void 0 : fieldSpec.strict;

        if (fieldSpec == null ? void 0 : fieldSpec.strip) {
          isChanged = isChanged || prop in value;
          continue;
        }

        fieldValue = !options.__validating || !strict ? // TODO: use _cast, this is double resolving
        field.cast(value[prop], innerOptions) : value[prop];

        if (fieldValue !== undefined) {
          intermediateValue[prop] = fieldValue;
        }
      } else if (exists && !strip) {
        intermediateValue[prop] = value[prop];
      }

      if (intermediateValue[prop] !== value[prop]) {
        isChanged = true;
      }
    }

    return isChanged ? intermediateValue : value;
  }

  _validate(_value, opts = {}, callback) {
    let errors = [];
    let {
      sync,
      from = [],
      originalValue = _value,
      abortEarly = this.spec.abortEarly,
      recursive = this.spec.recursive
    } = opts;
    from = [{
      schema: this,
      value: originalValue
    }, ...from]; // this flag is needed for handling `strict` correctly in the context of
    // validation vs just casting. e.g strict() on a field is only used when validating

    opts.__validating = true;
    opts.originalValue = originalValue;
    opts.from = from;

    super._validate(_value, opts, (err, value) => {
      if (err) {
        if (!ValidationError.isError(err) || abortEarly) {
          return void callback(err, value);
        }

        errors.push(err);
      }

      if (!recursive || !isObject$1(value)) {
        callback(errors[0] || null, value);
        return;
      }

      originalValue = originalValue || value;

      let tests = this._nodes.map(key => (_, cb) => {
        let path = key.indexOf('.') === -1 ? (opts.path ? `${opts.path}.` : '') + key : `${opts.path || ''}["${key}"]`;
        let field = this.fields[key];

        if (field && 'validate' in field) {
          field.validate(value[key], _extends$3({}, opts, {
            // @ts-ignore
            path,
            from,
            // inner fields are always strict:
            // 1. this isn't strict so the casting will also have cast inner values
            // 2. this is strict in which case the nested values weren't cast either
            strict: true,
            parent: value,
            originalValue: originalValue[key]
          }), cb);
          return;
        }

        cb(null);
      });

      runTests({
        sync,
        tests,
        value,
        errors,
        endEarly: abortEarly,
        sort: this._sortErrors,
        path: opts.path
      }, callback);
    });
  }

  clone(spec) {
    const next = super.clone(spec);
    next.fields = _extends$3({}, this.fields);
    next._nodes = this._nodes;
    next._excludedEdges = this._excludedEdges;
    next._sortErrors = this._sortErrors;
    return next;
  }

  concat(schema) {
    let next = super.concat(schema);
    let nextFields = next.fields;

    for (let [field, schemaOrRef] of Object.entries(this.fields)) {
      const target = nextFields[field];

      if (target === undefined) {
        nextFields[field] = schemaOrRef;
      } else if (target instanceof BaseSchema && schemaOrRef instanceof BaseSchema) {
        nextFields[field] = schemaOrRef.concat(target);
      }
    }

    return next.withMutation(() => next.shape(nextFields));
  }

  getDefaultFromShape() {
    let dft = {};

    this._nodes.forEach(key => {
      const field = this.fields[key];
      dft[key] = 'default' in field ? field.getDefault() : undefined;
    });

    return dft;
  }

  _getDefault() {
    if ('default' in this.spec) {
      return super._getDefault();
    } // if there is no default set invent one


    if (!this._nodes.length) {
      return undefined;
    }

    return this.getDefaultFromShape();
  }

  shape(additions, excludes = []) {
    let next = this.clone();
    let fields = Object.assign(next.fields, additions);
    next.fields = fields;
    next._sortErrors = sortByKeyOrder(Object.keys(fields));

    if (excludes.length) {
      if (!Array.isArray(excludes[0])) excludes = [excludes];
      let keys = excludes.map(([first, second]) => `${first}-${second}`);
      next._excludedEdges = next._excludedEdges.concat(keys);
    }

    next._nodes = sortFields(fields, next._excludedEdges);
    return next;
  }

  pick(keys) {
    const picked = {};

    for (const key of keys) {
      if (this.fields[key]) picked[key] = this.fields[key];
    }

    return this.clone().withMutation(next => {
      next.fields = {};
      return next.shape(picked);
    });
  }

  omit(keys) {
    const next = this.clone();
    const fields = next.fields;
    next.fields = {};

    for (const key of keys) {
      delete fields[key];
    }

    return next.withMutation(() => next.shape(fields));
  }

  from(from, to, alias) {
    let fromGetter = propertyExpr_5(from, true);
    return this.transform(obj => {
      if (obj == null) return obj;
      let newObj = obj;

      if (has_1(obj, from)) {
        newObj = _extends$3({}, obj);
        if (!alias) delete newObj[from];
        newObj[to] = fromGetter(obj);
      }

      return newObj;
    });
  }

  noUnknown(noAllow = true, message = object.noUnknown) {
    if (typeof noAllow === 'string') {
      message = noAllow;
      noAllow = true;
    }

    let next = this.test({
      name: 'noUnknown',
      exclusive: true,
      message: message,

      test(value) {
        if (value == null) return true;
        const unknownKeys = unknown(this.schema, value);
        return !noAllow || unknownKeys.length === 0 || this.createError({
          params: {
            unknown: unknownKeys.join(', ')
          }
        });
      }

    });
    next.spec.noUnknown = noAllow;
    return next;
  }

  unknown(allow = true, message = object.noUnknown) {
    return this.noUnknown(!allow, message);
  }

  transformKeys(fn) {
    return this.transform(obj => obj && mapKeys_1(obj, (_, key) => fn(key)));
  }

  camelCase() {
    return this.transformKeys(camelCase_1);
  }

  snakeCase() {
    return this.transformKeys(snakeCase_1);
  }

  constantCase() {
    return this.transformKeys(key => snakeCase_1(key).toUpperCase());
  }

  describe() {
    let base = super.describe();
    base.fields = mapValues_1(this.fields, value => value.describe());
    return base;
  }

}
function create$2(spec) {
  return new ObjectSchema(spec);
}
create$2.prototype = ObjectSchema.prototype;

var fileSchema = create$2()
    .shape({
    name: create().required(),
    mimeType: create().required(),
    data: create().required(),
    signature: create(),
})
    .required()
    .noUnknown(true)
    .strict(true);
var validateFile = function (file) {
    return new Promise(function (resolve, reject) {
        fileSchema
            .validate(file)
            .then(function () {
            resolve(true);
        })
            .catch(function (err) {
            reject(err);
        });
    });
};
var dpySchema = create$2()
    .shape({
    name: create().required(),
    mimeType: create()
        .matches(/application\/dappy/)
        .required(),
    data: create().required(),
    signature: create(),
})
    .required()
    .noUnknown(true)
    .strict(true);

var getNodeIndex = function (node) {
    return node.ip + "---" + node.host;
};

var readPursesDataOrContractConfig = function (masterRegistryUri, contractId, purseId) {
    // read purse data if purseId
    if (contractId && purseId) {
        return src_17({ masterRegistryUri: masterRegistryUri, contractId: contractId, pursesIds: [purseId] });
    }
    // read config values { fungible: ..., fee: ...} if no contract id AND purse id
    return src_16({ masterRegistryUri: masterRegistryUri, contractId: contractId });
};
var registerDappyProtocol = function (session, getState) {
    session.protocol.registerBufferProtocol('dappy', function (request, callback) {
        var valid = false;
        var url = request.url;
        if (validateSearchWithProtocol(url)) {
            valid = true;
            // dappy://aaa.bbb.ccc -> dappy://aaa.bbb.ccc,
            if (!url.includes('%2C')) {
                url += "%2C";
            }
        }
        var randomId = '';
        var browserView = undefined;
        try {
            var userAgent = request.headers['User-Agent'];
            var io = userAgent.indexOf('randomId=');
            randomId = userAgent.substring(io + 'randomId='.length);
            var browserViews_1 = getBrowserViewsMain(getState());
            var browserViewId = Object.keys(browserViews_1).find(function (browserViewId) { return browserViews_1[browserViewId].randomId === randomId; });
            if (!browserViewId || !browserViews_1[browserViewId]) {
                console.error('[dappy://] browserView not found, unauthorized request');
                callback();
                return;
            }
            browserView = browserViews_1[browserViewId];
        }
        catch (err) {
            console.error('[dappy://] could not get browserView, unauthorized request');
            console.log(err);
            callback();
            return;
        }
        /*
            Shortcut notation
            change dappy://aaa.bbb?page=123 to dappy://betanetwork/aaa.bbb?page=123
          */
        if (!valid && validateShortcutSearchWithProtocol(url)) {
            try {
                var chainId_1 = browserView.dappyDomain.split('/')[0];
                url = url.replace('dappy://', 'dappy://' + chainId_1 + '/');
                if (!validateSearchWithProtocol(url)) {
                    valid = true;
                }
            }
            catch (e) {
                console.log('[dappy://] could not replace shortcut notation');
                console.log(e);
                callback();
                return;
            }
        }
        // todo if multi, limit to n
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
            console.error('[dappy://] blockchain not found');
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
                console.log('[dappy://] could not parse explore-deploys haders');
                console.log(err);
                callback();
                return;
            }
        }
        else if (multipleResources) {
            // if address is dappy://d/aaa.bbb.ccc,ddd.eee.fff
            // the two
            type = 'explore-deploy-x';
            query = {
                terms: split[1]
                    .split('%2C')
                    // filter in the case of only one unf : dappy://aaa/bbb,
                    .filter(function (a) { return !!a; })
                    .map(function (u) {
                    return readPursesDataOrContractConfig(u.split('.')[0], u.split('.')[1], u.split('.')[2]);
                }),
            };
        }
        else {
            type = 'api/explore-deploy';
            query = {
                term: readPursesDataOrContractConfig(split[1].split('.')[0], split[1].split('.')[1], split[1].split('.')[2]),
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
                                error: BeesLoadError.InvalidManifest,
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
                            error: BeesLoadError.InvalidManifest,
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
                        console.log('[dappy://] error when parsing file as base64(gzip)');
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
                        console.log('[dappy://] error when handling multiCall result');
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
      "set-cookie-parser encountered an error while decoding a cookie with value '" +
        value +
        "'. Set options.decodeValues to false to disable this feature.",
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
        var servers, cookies, cookiesToBeStored;
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
                    cookiesToBeStored = cookies
                        .filter(function (c) { return typeof c.expirationDate === 'number'; })
                        .map(function (cook) { return ({
                        domain: cook.domain,
                        name: cook.name,
                        value: cook.value,
                        expirationDate: cook.expirationDate,
                    }); });
                    if (cookiesToBeStored.length) {
                        dispatchFromMain({
                            action: saveCookiesForDomainAction({
                                dappyDomain: browserView.dappyDomain,
                                cookies: cookiesToBeStored,
                            }),
                        });
                    }
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
                    try {
                        userAgent = request.headers['User-Agent'];
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
                                ca: [], // we don't want to rely on CA
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

var getDapps$1 = function (path) {
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
                var dapps = getDapps$1(electron.app.getAppPath());
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

var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var hasOwnProperty$a = Object.prototype.hasOwnProperty;
function hasOwn(object, property) {
  return is.notUndef(object) && hasOwnProperty$a.call(object, property);
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

  var def = _extends$4({}, props);
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

var _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

  return _extends$5({}, chan, {
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

var _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
        cb(is.array(effects) ? array$2.from(_extends$6({}, results, { length: keys.length })) : results);
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
          cb(is.array(effects) ? [].slice.call(_extends$6({}, response, { length: keys.length })) : response);
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

var TRANSFER_TRANSACTIONS = '[MAIN] Transfer transactions';
var initialState$4 = {};
var reducer$3 = function (state, action) {
    var _a, _b;
    if (state === void 0) { state = initialState$4; }
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
var initialState$5 = {};
var reducer$4 = function (state, action) {
    var _a, _b;
    if (state === void 0) { state = initialState$5; }
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

// SELECTORS
var getUiState = lib_4(function (state) { return state; }, function (state) { return state.ui; });
var getLanguage = lib_4(getUiState, function (state) { return state.language; });
var getMenuCollapsed = lib_4(getUiState, function (state) { return state.menuCollapsed; });
var getDappsListDisplay = lib_4(getUiState, function (state) { return state.dappsListDisplay; });
var getDevMode = lib_4(getUiState, function (state) { return state.devMode; });
var getNavigationUrl = lib_4(getUiState, function (state) { return state.navigationUrl; });
var getGcu = lib_4(getUiState, function (state) { return state.gcu; });
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
var getShouldBrowserViewsBeDisplayed = lib_4(getIsNavigationInDapps, getNavigationSuggestionsDisplayed, getDappModals, getModal, getTabsFocusOrder, getTabs, function (isNavigationInDapps, navigationSuggestionsDisplayed, dappModals, modal, tabsFocusOrder, tabs) {
    // return undefined : no browser views displayed
    // return resourceId: string : the browser view corresponding to this resourceId should be displayed
    if (!!modal) {
        return undefined;
    }
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

var identifyFromSandboxSchema = create$2()
    .shape({
    parameters: create$2()
        .shape({
        publicKey: create(),
    })
        .noUnknown()
        .strict(true)
        .required(),
    callId: create().required(),
    dappId: create().required(),
    randomId: create().required(),
})
    .noUnknown()
    .strict(true)
    .required();
var sendRChainPaymentRequestFromSandboxSchema = create$2()
    .shape({
    parameters: create$2()
        .shape({
        from: create(),
        // .to is required when it comes from dapp
        to: create().required(),
        // .amount is required when it comes from dapp
        amount: create$1().required(),
    })
        .noUnknown()
        .strict(true)
        .required(),
    callId: create().required(),
    dappId: create().required(),
    randomId: create().required(),
})
    .strict(true)
    .noUnknown()
    .required();
var sendRChainTransactionFromSandboxSchema = create$2()
    .shape({
    parameters: create$2()
        .shape({
        term: create().required(),
        signatures: create$2(),
    })
        .noUnknown()
        .required()
        .strict(true),
    callId: create().required(),
    dappId: create().required(),
    randomId: create().required(),
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
                        dappyDomain: browserView.dappyDomain,
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

var searchToAddress = function (search, chainId, path) {
    if (path === void 0) { path = ''; }
    return chainId + "/" + search + path;
};

var development = !!process.defaultApp;
var loadOrReloadBrowserView = function (action) {
    var payload, browserViews, position, sameTabIdBrowserViewId, bv, view, ua, newUserAgent, previewId, currentPathAndParameters, newBrowserViews;
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
                /* reload
                  a browser view with same id (payload.reosurceId) is
                  already running
                */
                if (browserViews[payload.resourceId]) {
                    if (development) {
                        console.log('reload or self navigation, closing browserView with same id');
                    }
                    electron.session.fromPartition("persist:" + payload.dappyDomain).protocol.unregisterProtocol('dappy');
                    if (browserViews[payload.resourceId].browserView.webContents.isDevToolsOpened()) {
                        browserViews[payload.resourceId].browserView.webContents.closeDevTools();
                        browserViews[payload.resourceId].browserView.webContents.forcefullyCrashRenderer();
                    }
                    action.meta.browserWindow.removeBrowserView(browserViews[payload.resourceId].browserView);
                }
                sameTabIdBrowserViewId = Object.keys(browserViews).find(function (id) {
                    return (browserViews[id].resourceId !== payload.resourceId && // already removed line 35
                        browserViews[id].tabId === payload.tabId);
                });
                if (sameTabIdBrowserViewId) {
                    if (development) {
                        console.log('navigation ina tab, closing browserView with same tabId');
                    }
                    bv = browserViews[sameTabIdBrowserViewId];
                    electron.session.fromPartition("persist:" + bv.dappyDomain).protocol.unregisterProtocol('dappy');
                    if (browserViews[sameTabIdBrowserViewId].browserView.webContents.isDevToolsOpened()) {
                        browserViews[sameTabIdBrowserViewId].browserView.webContents.closeDevTools();
                        browserViews[sameTabIdBrowserViewId].browserView.webContents.forcefullyCrashRenderer();
                    }
                    action.meta.browserWindow.removeBrowserView(browserViews[sameTabIdBrowserViewId].browserView);
                }
                if (!position) {
                    console.error('No position, cannot create browserView');
                    return [2 /*return*/, undefined];
                }
                view = new electron.BrowserView({
                    webPreferences: {
                        nodeIntegration: false,
                        sandbox: true,
                        contextIsolation: true,
                        devTools: true,
                        disableDialogs: true,
                        partition: "persist:" + payload.dappyDomain,
                    },
                });
                // cookies to start with (from storage)
                payload.cookies.map(function (c) {
                    view.webContents.session.cookies.set(__assign(__assign({}, c), { url: "https://" + c.domain, secure: true, httpOnly: true }));
                });
                // todo, avoid circular ref to "store" (see logs when "npm run build:main")
                registerDappyProtocol(electron.session.fromPartition("persist:" + payload.dappyDomain), store.getState);
                registerInterProcessDappProtocol(electron.session.fromPartition("persist:" + payload.dappyDomain), store, action.meta.dispatchFromMain);
                overrideHttpProtocols(electron.session.fromPartition("persist:" + payload.dappyDomain), store.getState, development, action.meta.dispatchFromMain, false);
                if (payload.devMode) {
                    view.webContents.openDevTools();
                }
                if (payload.muted) {
                    view.webContents.setAudioMuted(payload.muted);
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
                    previewId = ("" + payload.dappyDomain + currentPathAndParameters).replace(/\W/g, '');
                    action.meta.dispatchFromMain({
                        action: didNavigateInPageAction({
                            previewId: previewId,
                            address: "" + payload.dappyDomain + currentPathAndParameters,
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
                                    ca: [], // we don't want to rely on CA
                                });
                                https.get({
                                    agent: a_1,
                                    host: urlDecomposed_1.host,
                                    path: urlDecomposed_1.path,
                                    method: 'get',
                                }, function (res) {
                                    if (res.statusCode !== 200) {
                                        console.error("Could not get favicon (status !== 200) for " + payload.dappyDomain);
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
                            s = searchToAddress(urlDecomposed.path, payload.dappyDomain.split('/')[0]);
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
                newBrowserViews[payload.resourceId] = __assign(__assign({}, payload), { browserView: view, visible: true });
                /*
                  Hide all other browser views
                */
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
                        console.error('Could not execute javascript and transfer identifications');
                        console.log(e);
                    }
                }
                else {
                    console.error('Did not find browserView, cannot transfer identifications');
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
                        console.error('Could not execute javascript and transfer transactions');
                        console.log(e);
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
    browserViews: reducer,
    transactions: reducer$3,
    identifications: reducer$4,
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
                dappyDomain: browserViews[id].dappyDomain,
                path: browserViews[id].path,
                title: browserViews[id].title,
                dappId: browserViews[id].resourceId,
                randomId: browserViews[id].randomId,
                appPath: path.join(electron.app.getAppPath(), 'dist/'),
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
    return loadResourceWhenReady;
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
    var a = validateAndProcessAddresses(argv);
    if (typeof a === 'string') {
        dispatchFromMain({
            action: loadResourceAction({
                address: a,
            }),
        });
    }
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
            nodeIntegration: false,
            sandbox: true,
            contextIsolation: true,
            partition: partition,
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
