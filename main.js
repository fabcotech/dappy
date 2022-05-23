'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var https = _interopDefault(require('https'));
var stream = _interopDefault(require('stream'));
var fs = _interopDefault(require('fs'));
var zlib = require('zlib');
var crypto$1 = _interopDefault(require('crypto'));
var util = _interopDefault(require('util'));
var http = _interopDefault(require('http'));
var path = _interopDefault(require('path'));
var net = _interopDefault(require('net'));
var child_process = _interopDefault(require('child_process'));
var dns = _interopDefault(require('dns'));
require('os');

var validateSearch = function (search) {
    return /[a-z]*:(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}#]*)?$/gs.test(search);
};

var LOAD_RESOURCE = '[Dapps] Load resource';
var LOAD_RESOURCE_FAILED = '[Dapps] Load resource failed';
var DID_CHANGE_FAVICON = '[Dapps] Tab favicon did update';
var UPDATE_TRANSITORY_STATE = '[Dapps] Update transitory state';
var UPDATE_TAB_URL_AND_TITLE = '[Dapps] Update tab url and title';
var loadResourceAction = function (payload) { return ({
    type: LOAD_RESOURCE,
    payload: payload,
}); };
var loadResourceFailedAction = function (values) { return ({
    type: LOAD_RESOURCE_FAILED,
    payload: values,
}); };
var didChangeFaviconAction = function (values) { return ({
    type: DID_CHANGE_FAVICON,
    payload: values,
}); };
var updateTransitoryStateAction = function (values) { return ({
    type: UPDATE_TRANSITORY_STATE,
    payload: values,
}); };
var updateTabUrlAndTitleAction = function (values) { return ({
    type: UPDATE_TAB_URL_AND_TITLE,
    payload: values,
}); };

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

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
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

var initialState = {
    search: '',
    searchError: undefined,
    searching: false,
    lastLoadErrors: {},
    loadStates: {},
    tabs: [],
    tabsFocusOrder: [],
    transitoryStates: {},
    identifications: {},
    errors: [],
};
// SELECTORS
var getDappsState = lib_4(function (state) { return state; }, function (state) { return state.dapps; });
var getSearch = lib_4(getDappsState, function (state) { return state.search; });
var getSearchError = lib_4(getDappsState, function (state) { return state.searchError; });
var getSearching = lib_4(getDappsState, function (state) { return state.searching; });
var getLastLoadErrors = lib_4(getDappsState, function (state) { return state.lastLoadErrors; });
var getLoadStates = lib_4(getDappsState, function (state) { return state.loadStates; });
var getTabsFocusOrder = lib_4(getDappsState, function (state) { return state.tabsFocusOrder; });
var getTabs = lib_4(getDappsState, function (state) { return state.tabs; });
var getDappsTransitoryStates = lib_4(getDappsState, function (state) { return state.transitoryStates; });
var getIdentifications = lib_4(getDappsState, function (state) { return state.identifications; });
// COMBINED SELECTORS
var getIsSearchFocused = lib_4(getTabsFocusOrder, function (tabsFocusOrder) { return tabsFocusOrder[tabsFocusOrder.length - 1] === 'search'; });
var getTabsFocusOrderWithoutSearch = lib_4(getTabsFocusOrder, function (tabsFocusOrder) {
    return tabsFocusOrder.filter(function (d) { return d !== 'search'; });
});
var getFocusedTabId = lib_4(getTabsFocusOrderWithoutSearch, function (tabsFocusOrder) { return tabsFocusOrder[tabsFocusOrder.length - 1]; });
var getSearchTransitoryState = lib_4(getSearch, getDappsTransitoryStates, function (search, transitoryStates) { return transitoryStates[search]; });
var getSearchLoadStates = lib_4(getSearch, getLoadStates, function (search, loadStates) {
    return search ? loadStates[search] : undefined;
});
var getActiveTabs = lib_4(getTabs, function (tabs) {
    var activeTabs = {};
    tabs.forEach(function (t) {
        if (t.active) {
            activeTabs[t.id] = t;
        }
    });
    return activeTabs;
});
/*
  Returns tab if it is active, meaning
  no .lastError and no transitory state
*/
var getActiveTab = lib_4(getFocusedTabId, getTabs, getDappsTransitoryStates, function (focusedTabId, tabs, transitoryStates) {
    var tab = tabs.find(function (t) { return t.id === focusedTabId; });
    if (!tab) {
        return undefined;
    }
    if (!transitoryStates[tab.id] && !tab.lastError) {
        return tab;
    }
    return undefined;
});

var overrideHttpProtocol = function (_a) {
    var session = _a.session;
    {
        session.protocol.interceptHttpProtocol;
        return session.protocol.interceptStreamProtocol('http', function (request, callback) {
            console.log("[http] unauthorized");
            callback({});
            return;
        });
    }
};

var SAVE_COOKIES_FOR_DOMAIN = '[Cookies] Save cookies for domain';
var saveCookiesForDomainAction = function (values) { return ({
    type: SAVE_COOKIES_FOR_DOMAIN,
    payload: values,
}); };

// SELECTORS
var getCookiesState = lib_4(function (state) { return state; }, function (state) { return state.cookies; });
var getCookies = lib_4(getCookiesState, function (state) { return state.cookies; });
// COMBINED SELECTORS

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

/* GENERATED CODE, only edit rholang/*.rho files*/
var deployBoxTerm_1 = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  entryCh,
  registerBoxReturnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |

  for (entry <- entryCh) {
    entry!(("PUBLIC_REGISTER_BOX", { "boxId": "${payload.boxId}", "publicKey": "${payload.publicKey}", "revAddress": "${payload.revAddress}" }, *registerBoxReturnCh)) |
    for (@r <- registerBoxReturnCh) {
      stdout!(r) |
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, p) => {
          @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", p.get("boxId"))!(p.get("boxCh")) |
          // OP_PUBLIC_REGISTER_BOX_COMPLETED_BEGIN
          deployId!({ "status": "completed", "boxId": p.get("boxId") }) |
          stdout!("completed, box registered")
          // OP_PUBLIC_REGISTER_BOX_COMPLETED_END
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
  deployId(\`rho:rchain:deployId\`),

  prefixCh,
  entryCh,
  entryUriCh,
  revVaultCh,

  logsCh,
  appendLogCh,

  makePurseCh,
  creditBackCh,
  calculateFeeCh,
  validateStringCh,
  initializeOCAPOnBoxCh,

  initLocksForContractCh,
  initLocksForBoxCh,

  /*
    self is the ultimate local unforgeable in
    master contract, every data is stored in channels that
    derives from *self unforgeable name

    // tree hash map of purses :
    thm <- @(*self, "purses", "contract03")

    // tree hash map of purses data :
    thm <- @(*self, "pursesData", "contract03")

    // contract's configs
    config <- @(*self, "contractConfig", "contract03")

    // box's configs
    config <- @(*self, "boxConfig", "box01")

    // boxes (rholang Map)
    box <- @(*self, "boxes", "box01")

    // super keys of a given box
    superKeys <- @(*self, "boxesSuperKeys", "box01")
  */
  self,

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
      "1": { quantity: 2, timestamp: 12562173658, boxId: "box1", price: Nil},
      "2": { quantity: 12, timestamp: 12562173658, boxId: "box1", price: 2},
    }
  */
  boxesReadyCh,
  contractsReadyCh,

  TreeHashMap,

  savePurseInBoxCh,
  removePurseInBoxCh,
  getBoxCh,
  getPurseWithAtLeastQuantityCh,
  getPurseCh,
  getContractPursesThmCh,
  getContractPursesDataThmCh,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`)
in {

  // This line should be replaced by tree hash map implementation
  // reimplementation of TreeHashMap

/*
  Communications between channels have generally been reduced to reduce amount of
  serialization / deserialization

  when you "init" you can choose that the processes are also stored as bytes, instead of storing a map for each node, it stores a map at channel @map, and bytes at channel @(map, "bytes), this will make the "getAllValues" 10x, 20x, 30x faster depending on the process you are storing

  !!! make sure your processes do not contain the string "£$£$", or the bytes c2a324c2a324, those are used as delimiters
*/

new MakeNode, ByteArrayToNybbleList, TreeHashMapSetter, TreeHashMapGetter, TreeHashMapUpdater, HowManyPrefixes, NybbleListForI, RemoveBytesSectionIfExistsCh, keccak256Hash(\`rho:crypto:keccak256Hash\`), powersCh, storeToken, nodeGet in {
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
      } |

      contract TreeHashMapUpdater(@map, @nybList, @n, @len, update, @suffix, ret) = {
        // Look up the value of the node at [map, nybList.slice(0, n + 1)
        new valCh in {
          match (map, nybList.slice(0, n)) {
            node => {
              for (@val <<- @[node, *storeToken]) {
                if (n == len) {
                  // We're at the end of the path.
                  if (val == 0) {
                    // There's nothing here.
                    // Return
                    ret!(Nil)
                  } else {
                    new resultCh in {
                      // Acquire the lock on this node
                      for (@val <- @[node, *storeToken]) {
                        // Update the current value
                        update!(val.get(suffix), *resultCh) |
                        for (@newVal <- resultCh) {
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
                    }
                  }
                } else {
                  // Otherwise try to reach the end of the path.
                  // Bit k set means child node k exists.
                  if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                    // If the path doesn't exist, there's no value to update.
                    // Return
                    ret!(Nil)
                  } else {
                    // Child node exists, loop
                    TreeHashMapUpdater!(map, nybList, n + 1, len, *update, suffix, *ret)
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMap(@"update", @map, @key, update, ret) = {
        new hashCh, nybListCh, keccak256Hash(\`rho:crypto:keccak256Hash\`) in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
                // Get the bit list
                ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
                for (@nybList <- nybListCh) {
                  if (alsoStoreAsBytes == true) {
                    new ret1, ret2, updateWrapper, retWrapper, updateWrapperBytes in {
                      for (@val, ret <- updateWrapper; _, retBytes <- updateWrapperBytes) {
                          update!(val, *retWrapper) |
                          for (@newVal <- retWrapper) {
                            ret!(newVal) |
                            retBytes!(newVal.toByteArray())
                          }
                      } |
                      TreeHashMapUpdater!((map, "bytes"), nybList, 0, depth, *updateWrapperBytes, hash.slice(depth, 32), *ret1) |
                      TreeHashMapUpdater!(map, nybList, 0, depth, *updateWrapper, hash.slice(depth, 32), *ret2) |
                      for (_ <- ret1; _ <- ret2) {
                        ret!(Nil)
                      }
                    }
                  } else {
                    TreeHashMapUpdater!(map, nybList, 0, depth, *update, hash.slice(depth, 32), *ret)
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

  // Global lock for REGISTER_CONTRACT and REGISTER_BOX
  // do not allow concurrency for those operations
  @(*self, "REGISTER_CONTRACT_LOCK")!(Nil) |
  @(*self, "REGISTER_BOX_LOCK")!(Nil) |

  // Scoped locks for WITHDRAW, SWAP and CREATE_PURSE, they can touch 
  // the same boxes or purses, we cannot allow concurrency because we
  //  want to avoid race conditions
  for (@boxId <= initLocksForBoxCh) {
    @(*self, "BOX_LOCK", boxId)!(Nil)
  } |
  for (@contractId <= initLocksForContractCh) {
    @(*self, "CONTRACT_LOCK", contractId)!(Nil)
  } |

  for (@str <= appendLogCh) {
    new ch1 in {
      blockData!(*ch1) |
      for (_, @timestamp, _ <- ch1) {
        logsCh!("\${ts},\${str}" %% { "ts": timestamp, "str": str }) |
        for (str <- logsCh) { Nil }
      }
    }
  } |

  // those two tree hash maps store the existence of
  // boxes or contracts

  // { "box1": "exists", "box2": "exists" }
  TreeHashMap!("init", ${payload.depth || 3}, true, *boxesReadyCh) |

  // { "contract1": "exists", "contract2": "exists" }
  TreeHashMap!("init", ${payload.depth || 3}, false, *contractsReadyCh) |

  registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |
  for (@boxesThm <- boxesReadyCh; @contractsThm <- contractsReadyCh; @(_, RevVault) <- revVaultCh; @prefix <- prefixCh) {

    // ====================================
    // =================== UTILS / INTERNAL
    // ====================================

    // validate string, used for purse ID, box ID, contract ID
    for (@(str, ret) <= validateStringCh) {
      match (
        str,
        Set("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9")
      ) {
        (String, az09) => {
          match (str.length() > 0,str.length() < 25) {
            (true, true) => {
              new tmpCh, itCh in {
                for (@i <= itCh) {
                  if (i == str.length()) { @ret!(true) }
                  else {
                    if (az09.contains(str.slice(i, i + 1)) == true) { itCh!(i + 1) }
                    else { @ret!(false) }
                  }
                } |
                itCh!(0)
              }
            }
            _ => {
              @ret!(false)
            }
          }
        }
        _ => { @ret!(false) }
      }
    } |

    // returns the box if it exists
    for (@(boxId, return) <= getBoxCh) {
      new ch1 in {
        TreeHashMap!("get", boxesThm, boxId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@box <<- @(*self, "boxes", boxId)) {
              @return!(box)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // return the purse that has at least
    // quantity in box if such exists
    for (@(box, contractId, quantity, return) <= getPurseWithAtLeastQuantityCh) {
      if (box.get(contractId) != Nil) {
        new itCh, ch1, ch2 in {
          getContractPursesThmCh!((contractId, *ch2)) |
          for (@pursesThm <- ch2) {
            for (ids <= itCh) {
              match *ids {
                Set() => { @return!(Nil) }
                Set(last) => {
                  TreeHashMap!("get", pursesThm, last, *ch1) |
                  for (@purse <- ch1) {
                    if (purse.get("quantity") >= quantity) {
                      @return!(purse)
                    } else {
                      @return!(Nil)
                    }
                  }
                }
                Set(first ... rest) => {
                  TreeHashMap!("get", pursesThm, first, *ch1) |
                  for (@purse <- ch1) {
                    if (purse.get("quantity") >= quantity) {
                      @return!(purse)
                    } else {
                      itCh!(rest)
                    }
                  }
                }
              }
            } |
            itCh!(box.get(contractId))
          }
        }
      } else {
        @return!(Nil)
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
            for (@pursesThm <<- @(*self, "purses", contractId)) {
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
            for (@pursesDataThm <<- @(*self, "pursesData", contractId)) {
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
      for (@box <- @(*self, "boxes", boxId)) {
        if (box.get(contractId) == Nil) {
          @return!("error: CRITICAL contract id not found in box") |
          @(*self, "boxes", boxId)!(box)
        } else {
          if (box.get(contractId).contains(purseId) == false) {
            @return!("error: CRITICAL purse does not exists in box") |
            @(*self, "boxes", boxId)!(box)
          } else {
            stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " removed from box") |
            @(*self, "boxes", boxId)!(box.set(contractId, box.get(contractId).delete(purseId))) |
            @return!((true, Nil))
          }
        }
      }
    } |

    // save purse id in box
    for (@(contractId, purse, merge, return) <= savePurseInBoxCh) {
      new ch1, ch3, iterateAndMergePursesCh in {

        for (@box <- @(*self, "boxes", purse.get("boxId"))) {
          getContractPursesThmCh!((contractId, *ch1)) |
          for (@pursesThm <- ch1) {
            if (pursesThm != Nil) {
              if (box.get(contractId) == Nil) {
                stdout!(contractId ++ "/" ++ purse.get("boxId") ++ " purse " ++ purse.get("id") ++ " saved to box") |
                @(*self, "boxes", purse.get("boxId"))!(box.set(contractId, Set(purse.get("id")))) |
                @return!((true, purse))
              } else {
                if (box.get(contractId).contains(purse.get("id")) == false) {
                  for (@contractConfig <<- @(*self, "contractConfig", contractId)) {
                    match (contractConfig.get("fungible") == true, merge) {
                      (true, true) => {
                        for (@pursesThm <<- @(*self, "purses", contractId)) {
                          TreeHashMap!("get", pursesThm, purse.get("id"), *ch3) |
                          for (@purse <- ch3) {
                            iterateAndMergePursesCh!((box, pursesThm))
                          }
                        }
                      }
                      _ => {
                        stdout!(contractId ++ "/" ++ purse.get("boxId") ++ " purse " ++ purse.get("id") ++ " saved to box") |
                        @(*self, "boxes", purse.get("boxId"))!(box.set(
                          contractId,
                          box.get(contractId).union(Set(purse.get("id")))
                        )) |
                        @return!((true, purse))
                      }
                    }
                  }
                } else {
                  @(*self, "boxes", purse.get("boxId"))!(box) |
                  @return!("error: CRITICAL, purse already exists in box")
                }
              }
            } else {
              @(*self, "boxes", purse.get("boxId"))!(box) |
              @return!("error: CRITICAL, pursesThm not found")
            }
          }
        } |

        // if contract is fungible, we may find a
        // purse with same .price property
        // if found, then merge and delete current purse
        for (@(box, pursesThm) <- iterateAndMergePursesCh) {
          new tmpCh, itCh in {
            for (ids <= itCh) {
              match *ids {
                Set() => {
                  stdout!(contractId ++ "/" ++ purse.get("boxId") ++ " purse " ++ purse.get("id") ++ " saved to box") |
                  @(*self, "boxes", purse.get("boxId"))!(box.set(contractId, Set(purse.get("id")))) |
                  @return!((true, purse))
                }
                Set(last) => {
                  new ch4, ch5, ch6, ch7 in {
                    TreeHashMap!("get", pursesThm, last, *ch4) |
                    for (@purse2 <- ch4) {
                      match purse2.get("price") == purse.get("price") {
                        true => {
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
                          for (@pursesDataThm <<- @(*self, "pursesData", contractId)) {
                            TreeHashMap!(
                              "set",
                              pursesDataThm,
                              purse.get("id"),
                              Nil,
                              *ch7
                            )
                          } |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            stdout!(contractId ++ "/" ++ purse.get("boxId") ++ " purse " ++ purse.get("id") ++ " merged into purse " ++ purse2.get("id")) |
                            @return!((true, purse)) |
                            @(*self, "boxes", purse.get("boxId"))!(box)
                          }
                        }
                        _ => {
                          stdout!(contractId ++ "/" ++ purse.get("boxId") ++ " purse " ++ purse.get("id") ++ " saved to box") |
                          @(*self, "boxes", purse.get("boxId"))!(box.set(
                            contractId,
                            box.get(contractId).union(Set(purse.get("id")))
                          )) |
                          @return!((true, purse))
                        }
                      }
                    }

                  }
                }
                Set(first ... rest) => {
                  new ch4, ch5, ch6, ch7 in {
                    TreeHashMap!("get", pursesThm, first, *ch4) |
                    for (@purse2 <- ch4) {
                      match purse2.get("price") == purse.get("price") {
                        true => {
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
                          for (@pursesDataThm <<- @(*self, "pursesData", contractId)) {
                            TreeHashMap!(
                              "set",
                              pursesDataThm,
                              purse.get("id"),
                              Nil,
                              *ch7
                            )
                          } |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            stdout!(contractId ++ "/" ++ purse.get("boxId") ++ " purse " ++ purse.get("id") ++ " merged into purse " ++ purse2.get("id")) |
                            @return!((true, purse)) |
                            @(*self, "boxes", purse.get("boxId"))!(box)
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
      SWAP, WITHDRAW, and CREATE_PURSE may call this channel

      depending on if .fungible is true or false, it decides
      which id to give to the new purse, then it creates the
      purse and saves to box
    */
    for (@(contractId, properties, data, merge, return) <= makePurseCh) {
      new ch1, ch2, ch3, ch4, idAndQuantityCh in {
        for (@contractConfig <<- @(*self, "contractConfig", contractId)) {
          if (contractConfig.get("fungible") == true) {
            for (_ <- @(*self, "contractConfig", contractId)) {
              @(*self, "contractConfig", contractId)!(contractConfig.set("counter", contractConfig.get("counter") + 1))
            } |
            idAndQuantityCh!({ "id": "\${n}" %% { "n": contractConfig.get("counter") }, "quantity": properties.get("quantity") })
          } else {
            for (@pursesThm <<- @(*self, "purses", contractId)) {
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
              match purse {
                {
                  "quantity": Int,
                  "timestamp": Int,
                  "boxId": String,
                  "id": String,
                  "price": (String, Int) \\/ (String, String) \\/ Nil
                } => {
                  for (@pursesDataThm <<- @(*self, "pursesData", contractId)) {
                    for (@pursesThm <<- @(*self, "purses", contractId)) {
                      TreeHashMap!("set", pursesThm, purse.get("id"), purse, *ch3) |
                      TreeHashMap!("set", pursesDataThm, purse.get("id"), data, *ch4)
                    }
                  } |

                  for (_ <- ch3; _ <- ch4) {
                    if (purse.get("boxId") == "_burn") {
                      stdout!(contractId ++ " purse " ++ purse.get("id") ++ " burned") |
                      @return!((true, purse))
                    } else {
                      savePurseInBoxCh!((contractId, purse, merge, return))
                    }
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
      for (@config <<- @(*self, "contractConfig", contractId)) {
        @return!(config)
      }
    } |

    for (@("PUBLIC_READ_MASTER_CONFIG", return) <= entryCh) {
      @return!({
        "logsCh": *logsCh,
        "depth": ${payload.depth || 3},
        "depthContract": ${payload.contractDepth || 2},
        "version": "17.0.6",
      })
    } |

    for (@("PUBLIC_READ_BOX", boxId, return) <= entryCh) {
      new ch1 in {
        getBoxCh!((boxId, *ch1)) |
        for (@box <- ch1) {
          if (box == Nil) {
            @return!("error: box not found")
          } else {
            for (@superKeys <<- @(*self, "boxesSuperKeys", boxId)) {
              for (@config <<- @(*self, "boxConfig", boxId)) {
                @return!(config.union({ "superKeys": superKeys, "purses": box, "version": "17.0.6" }))
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_READ_LOGS", contractId, return) <= entryCh) {
      new ch1 in {
        getContractPursesThmCh!((contractId, *ch1)) |
        for (@pursesThm <- ch1) {
          if (pursesThm == Nil) {
            @return!("error: contract not found")
          } else {
            for (@logs <<- @(*self, "LOGS", contractId)) {
              @return!((true, logs))
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

    for (@("PUBLIC_DELETE_EXPIRED_PURSE", contractId, boxId, purseId, return) <= entryCh) {
      stdout!("PUBLIC_DELETE_EXPIRED_PURSE") |
      new ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, proceeedDeleteCh, unlock in {
        for (@result <- unlock) {
          @(*self, "BOX_LOCK", boxId)!(Nil) |
          @(*self, "CONTRACT_LOCK", contractId)!(Nil) |
          @return!(result)
        } |
        getContractPursesThmCh!((contractId, *ch1)) |
        getBoxCh!((boxId, *ch2)) |
        for (@pursesThm <- ch1; @box <- ch2) {
          stdout!("pursesThm") |
          stdout!(pursesThm) |
          stdout!("box") |
          stdout!(box) |
          if (pursesThm != Nil and box != Nil) {
            for (
              _ <- @(*self, "CONTRACT_LOCK", contractId);
              _ <- @(*self, "BOX_LOCK", boxId)
            ) {
              proceeedDeleteCh!(Nil)
            }
          } else {
            @return!("error: box or contract not found")
          }
        } |

        // RACE SAFE / RESOURCES LOCKED
        // after lock of 1 contract and 1 box
        for (_ <- proceeedDeleteCh) {
          stdout!("proceeedDeleteCh") |
          getContractPursesThmCh!((contractId, *ch3)) |
          getContractPursesDataThmCh!((contractId, *ch4)) |
          for (@pursesThm <- ch3; @pursesDataThm <- ch4) {
            TreeHashMap!("get", pursesThm, purseId, *ch5) |
            for (@purse <- ch5) {
              stdout!("purse") |
              stdout!(purse) |
              if (purse != Nil) {
                if (purse.get("boxId") == boxId) {
                  for (@config <<- @(*self, "contractConfig", contractId)) {
                    match (config.get("fungible"), purseId == "0", config.get("expires")) {
                      (false, false, Int) => {
                        blockData!(*ch6) |
                        for (_, @timestamp, _ <- ch6) {
                          stdout!(("timestamp", timestamp)) |
                          stdout!(("purse.timestamp", purse.get("timestamp"))) |
                          if (timestamp - purse.get("timestamp") > config.get("expires")) {
                            TreeHashMap!("set", pursesThm, purse.get("id"), Nil, *ch7) |
                            TreeHashMap!("set", pursesDataThm, purse.get("id"), Nil, *ch8) |
                            removePurseInBoxCh!((purse.get("boxId"), contractId, purse.get("id"), *ch9)) |
                            for (_ <- ch7; _ <- ch8; _ <- ch9) {
                              unlock!((true, Nil))
                            }
                          } else {
                            unlock!("error: purse has not expired")
                          }
                        }
                      }
                      _ => {
                        unlock!("error: cannot delete")
                      }
                    }
                  }
                } else {
                  unlock!("error: invalid box id")
                }
              } else {
                unlock!("error: purse not found")
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_REGISTER_BOX", payload, return) <= entryCh) {
      stdout!("PUBLIC_REGISTER_BOX") |
      stdout!(payload.get("boxId")) |
      stdout!(payload.get("revAddress")) |
      stdout!(payload.get("publicKey")) |
      match (payload.get("boxId"), payload.get("revAddress"), payload.get("publicKey")) {
        (String, String, String) => {
          new ch1, ch2, ch3, ch4, ch5, ch6, ch7, logsCh, registerBoxUnlock in {
            for (@result <- registerBoxUnlock) {
              @(*self, "REGISTER_BOX_LOCK")!(Nil) |
              @return!(result)
            } |

            // Verify that payload.revAddress is a real one with at
            // least 1 dust
            @RevVault!("findOrCreate", payload.get("revAddress"), *ch4) |
            for (@(true, revVault) <- ch4) {
              @revVault!("balance", *ch5) |
              for (@balance <- ch5) {
                match balance {
                  Int => {
                    if (balance == 0) {
                      @return!("error: REV address must have at least 1 dust")
                    } else {
                      validateStringCh!((payload.get("boxId"), *ch7)) |
                      for (@valid <- ch7) {
                        if (valid == true) {
                          match prefix ++ payload.get("boxId") {
                            boxId => {
                              for (_ <- @(*self, "REGISTER_BOX_LOCK")) {
                                ch6!(boxId) |
                                getBoxCh!((boxId, *ch1))
                              }
                            }
                          }
                        } else {
                          @return!("error: invalid box id")
                        }
                      }
                    }
                  }
                  _ => {
                    @return!("error: REV address must have at least 1 dust")
                  }
                }
              }
            } |
            
            for (@existingBox <- ch1; @boxId <- ch6) {
               if (existingBox == Nil) {
                new boxCh in {
                  TreeHashMap!("set", boxesThm, boxId, "exists", *ch2) |
                  for (_ <- ch2) {
                    @(*self, "boxes", boxId)!({}) |
                    @(*self, "boxesSuperKeys", boxId)!(Set()) |
                    @(*self, "boxConfig", boxId)!({ "publicKey": payload.get("publicKey"), "revAddress": payload.get("revAddress") }) |
                    registerBoxUnlock!((true, { "boxId": boxId, "boxCh": bundle+{*boxCh} })) |
                    initLocksForBoxCh!(boxId) |
                    initializeOCAPOnBoxCh!((*boxCh, boxId))
                  }
                }
              } else {
                registerBoxUnlock!("error: box already exists")
              } 
            }
          }
        }
      }
    } |

    for (@(boxCh, boxId) <= initializeOCAPOnBoxCh) {
      for (@("REGISTER_CONTRACT", payload, return) <= @boxCh) {
        new registerContract, ch1, ch2, ch3, ch4, ch5, ch6, registerUnlock, logsCh in {
          for (@result <- registerUnlock) {
            @(*self, "REGISTER_CONTRACT_LOCK")!(Nil) |
            @return!(result)
          } |
          match payload {
            { "contractId": String, "fungible": Bool, "expires": Nil \\/ Int } => {
              for (_ <- @(*self, "REGISTER_CONTRACT_LOCK")) {
                validateStringCh!((payload.get("contractId"), *ch6)) |
                for (@valid <- ch6) {
                  if (valid == true) {
                    if (payload.get("expires") == Nil) {
                      registerContract!(prefix ++ payload.get("contractId"))
                    } else {
                      // minimum 2 hours expiration
                      if (payload.get("expires") >= 1000 * 60 * 60 * 2) {
                        registerContract!(prefix ++ payload.get("contractId"))
                      } else {
                        registerUnlock!("error: .expires must be at least 2 hours")
                      }
                    }
                  } else {
                    registerUnlock!("error: invalid contract id")
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload")
            }
          } |
          for (@contractId <- registerContract) {
            TreeHashMap!("get", contractsThm, contractId, *ch1) |
            for (@exists <- ch1) {
              if (exists == Nil) {
                TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch2) |
                TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch4) |
                TreeHashMap!("set", contractsThm, contractId, "exists", *ch3) |
                for (@pursesThm <- ch2; @pursesDataThm <- ch4; _ <- ch3) {

                  for (@superKeys <- @(*self, "boxesSuperKeys", boxId)) {
                    @(*self, "boxesSuperKeys", boxId)!(
                      superKeys.union(Set(contractId))
                    )
                  } |

                  // purses tree hash map
                  @(*self, "purses", contractId)!(pursesThm) |

                  // purses data tree hash map
                  @(*self, "pursesData", contractId)!(pursesDataThm) |

                  // config
                  @(*self, "contractConfig", contractId)!(
                    payload
                      .set("contractId", contractId)
                      .set("locked", false)
                      .set("counter", 1)
                      .set("version", "17.0.6")
                      .set("fee", Nil)
                      .set("logsCh", *logsCh)
                  ) |

                  new superKeyCh in {
                    // return the bundle+ super key
                    registerUnlock!((true, { "superKey": bundle+{*superKeyCh}, "contractId": contractId })) |
                    @(*self, "LOGS", contractId)!("") |
                    initLocksForContractCh!(contractId) |

                    for (@("LOCK", return2) <= superKeyCh) {
                      for (_ <- @(*self, "CONTRACT_LOCK", contractId)) {
                        for (@contractConfig <<- @(*self, "contractConfig", contractId)) {
                          if (contractConfig.get("locked") == true) {
                            @return2!("error: contract is already locked") |
                            @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                          } else {
                            for (_ <- @(*self, "contractConfig", contractId)) {
                              @(*self, "contractConfig", contractId)!(contractConfig.set("locked", true)) |
                              @return2!((true, Nil)) |
                              @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                            }
                          }
                        }
                      }
                    } |

                    for (@("UPDATE_FEE", payload2, return2) <= superKeyCh) {
                      for (_ <- @(*self, "CONTRACT_LOCK", contractId)) {
                        for (@contractConfig <<- @(*self, "contractConfig", contractId)) {
                          if (contractConfig.get("locked") == true) {
                            @return2!("error: contract is locked") |
                            @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                          } else {
                            match payload2 {
                              { "fee": Nil } => {
                                @(*self, "CONTRACT_LOCK", contractId)!(Nil) |
                                for (@contractConfig <- @(*self, "contractConfig", contractId)) {
                                  @(*self, "contractConfig", contractId)!(
                                    contractConfig.set("fee", payload2.get("fee"))
                                  ) |
                                  @return2!((true, Nil))
                                }
                              }
                              { "fee": (String, Int) } => {
                                new ch1, ch2, ch3, ch4, ch5, ch6, ch7 in {
                                  getBoxCh!((payload2.get("fee").nth(0), *ch1)) |
                                  for (@box <- ch1) {
                                    if (box == Nil) {
                                      @(*self, "CONTRACT_LOCK", contractId)!(Nil) |
                                      @return2!("error: box not found")
                                    } else {
                                      for (@contractConfig <- @(*self, "contractConfig", contractId)) {
                                        @(*self, "contractConfig", contractId)!(
                                          contractConfig.set("fee", payload2.get("fee"))
                                        ) |
                                        @return2!((true, Nil)) |
                                        @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                @return2!("error: payload.fee should be a Nil or (String, Int)") |
                                @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                              }
                            }
                          }
                        }
                      }
                    } |

                    // todo lock box as well
                    for (@("DELETE_PURSE", payload2, return2) <= superKeyCh) {
                      for (_ <- @(*self, "CONTRACT_LOCK", contractId)) {
                        for (@contractConfig <<- @(*self, "contractConfig", contractId)) {
                          if (contractConfig.get("locked") == true) {
                            @return2!("error: contract is locked") |
                            @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                          } else {
                            match payload2 {
                              { "purseId": String } => {
                                new ch1, ch2, ch3, ch4 in {
                                  for (@pursesThm <<- @(*self, "purses", contractId)) {
                                    TreeHashMap!("get", pursesThm, payload2.get("purseId"), *ch2) |
                                    for (@purseToDelete <- ch2) {
                                      if (purseToDelete == Nil) {
                                        @return2!("error: purse does not exist") |
                                        @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                                      } else {
                                        removePurseInBoxCh!((purseToDelete.get("boxId"), contractId, payload2.get("purseId"), *ch4)) |
                                        TreeHashMap!("set", pursesThm, payload2.get("purseId"), Nil, *ch3) |
                                        for (@a <- ch3; @b <- ch4) {
                                          @(*self, "CONTRACT_LOCK", contractId)!(Nil) |
                                          match (a, b) {
                                            (Nil, (true, Nil)) => {
                                              @return2!((true, Nil))
                                            }
                                            _ => {
                                              stdout!(a) |
                                              stdout!(b) |
                                              @return2!("error: CRITICAL purse removal went wrong")
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                @return2!("error: payload.purseId should be a string") |
                                @(*self, "CONTRACT_LOCK", contractId)!(Nil)
                              }
                            }
                          }
                        }
                      }
                    } |

                    for (@("CREATE_PURSE", payload2, return2) <= superKeyCh) {
                      new blockDataCh, ch1, ch2, ch3, ch4, proceedCreateCh, unlock in {
                        for (@result <- unlock) {
                          @(*self, "CONTRACT_LOCK", contractId)!(Nil) |
                          @(*self, "BOX_LOCK", payload2.get("boxId"))!(Nil) |
                          @return2!(result)
                        } |
                        match payload2 {
                          {
                            "data": _,
                            "quantity": Int,
                            "id": String,
                            "price": Nil,
                            "boxId": String
                          } => {
                            getBoxCh!((payload2.get("boxId"), *ch1)) |
                            validateStringCh!((payload2.get("id"), *ch2)) |
                            for (@box <- ch1; @valid <- ch2) {
                              if (valid == true and box != Nil) {
                                for (
                                  _ <- @(*self, "CONTRACT_LOCK", contractId);
                                  _ <- @(*self, "BOX_LOCK", payload2.get("boxId"))
                                ) {
                                  proceedCreateCh!(Nil)
                                }
                              } else {
                                @return2!("error: invalid id or box not found")
                              }
                            }
                          }
                          _ => {
                            @return2!("error: invalid purse payload")
                          }
                        } |

                        // RACE SAFE / RESOURCES LOCKED
                        // after lock of 1 contract and 1 box
                        for (_ <- proceedCreateCh) {
                          blockData!(*ch3) |
                          for (_, @timestamp, _ <- ch3) {
                            makePurseCh!((
                              contractId,
                              payload2.delete("data").set("timestamp", timestamp),
                              payload2.get("data"),
                              true,
                              *ch4
                            )) |
                            for (@r <- ch4) {
                              match r {
                                String => { unlock!(r) }
                                (true, newPurse) => { unlock!(true) }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                registerUnlock!("error: contract id already exists")
              }
            }
          }
        }
      } |

      for (@("CREDIT", payload, return) <= @boxCh) {
        new ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, proceedCreditCh, unlock in {
          for (@result <- unlock) {
            @(*self, "BOX_LOCK", boxId)!(Nil) |
            @(*self, "CONTRACT_LOCK", prefix ++ "rev")!(Nil) |
            @return!(result)
          } |
          match payload {
            { "purseRevAddr": String, "purseAuthKey": _ } => {
              for (
                _ <- @(*self, "BOX_LOCK", boxId);
                _ <- @(*self, "CONTRACT_LOCK", prefix ++ "rev")
              ) {
                proceedCreditCh!(Nil)
              }
            }
            _ => {
              @return!("error: invalid payload")
            }
          } |
          for (_ <- proceedCreditCh) {
            @RevVault!("findOrCreate", payload.get("purseRevAddr"), *ch2) |
            for (@a <- ch2) {
              match a {
                (true, emitterPurseVault) => {
                  @RevVault!("unforgeableAuthKey", *self, *ch3) |
                  revAddress!("fromUnforgeable", *self, *ch4) |
                  @emitterPurseVault!("balance", *ch6) |
                  for (@balance <- ch6; @escrowPurseAuthKey <- ch3; @escrowPurseRevAddr <- ch4) {
                    if (balance > 0) {
                      @RevVault!("findOrCreate", escrowPurseRevAddr, *ch5) |
                      for (@(true, escrowPurseVault) <- ch5) {
                        @emitterPurseVault!("transfer", escrowPurseRevAddr, balance, payload.get("purseAuthKey"), *ch7) |
                        for (@escrowTransferResult <- ch7) {
                          match escrowTransferResult {
                            (true, Nil) => {
                              blockData!(*ch9) |
                              for (_, @timestamp, _ <- ch9) {
                                makePurseCh!((
                                  prefix ++ "rev",
                                  {
                                    "quantity": balance,
                                    "boxId": boxId,
                                    "price": Nil,
                                    "timestamp": timestamp,
                                    "id": "auto"
                                  },
                                  Nil,
                                  true,
                                  *ch8
                                ))
                              } |
                              for (@r <- ch8) {
                                match r {
                                  String => { unlock!(r) }
                                  (true, newPurse) => { unlock!((true, Nil)) }
                                }
                              }
                            }
                            _ => {
                              unlock!("error: escrow transfer went wrong, invalid rev purse")
                            }
                          }
                        }
                      }
                    } else {
                      unlock!("error: balance is 0, cannot credit")
                    }
                  }
                }
                _ => {
                  unlock!("error: cannot find rev purse")
                }
              }
            }
          }
        }
      } |

      for (@("UPDATE_PURSE_PRICE", payload, return) <= @boxCh) {
        new ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, proceeedUpdateCh, unlock in {
          for (@result <- unlock) {
            @(*self, "BOX_LOCK", boxId)!(Nil) |
            @(*self, "CONTRACT_LOCK", payload.get("contractId"))!(Nil) |
            @return!(result)
          } |
          match payload {
            // FT (String, Int) (contractId, quantity)
            // NFT (String, String) (contractId, purseId)
            { "price": (String, Int) \\/ (String, String) \\/ Nil, "contractId": String, "purseId": String } => {
              for (_ <- ch8) {
                getContractPursesThmCh!((payload.get("contractId"), *ch4)) |
                for (@pursesThm <- ch4) {
                  if (pursesThm != Nil) {
                    for (
                      _ <- @(*self, "BOX_LOCK", boxId);
                      _ <- @(*self, "CONTRACT_LOCK", payload.get("contractId"))
                    ) {
                      proceeedUpdateCh!(Nil)
                    }
                  } else {
                    @return!("error: contract not found")
                  }
                }
              } |
              match payload.get("price") {
                (String, Int) => {
                  if (payload.get("price").nth(1) == 0) {
                    @return!("error: price cannot be zero")
                  } else {
                    ch8!(Nil)
                  }
                }
                _ => { ch8!(Nil) }
              }
            }
            _ => {
              @return!("error: invalid payload for update price")
            }
          } |

          // RACE SAFE / RESOURCES LOCKED
          // after lock of 1 contract and 1 box
          for (_ <- proceeedUpdateCh) {
            getBoxCh!((boxId, *ch7)) |
            for (@box <- ch7) {
              getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch5)) |
              for (@purse <- ch5) {
                if (purse != Nil) {
                  match (purse.get("id"), payload.get("price")) {
                    ("0", (String, String)) => {
                      unlock!("error: purse zero cannot be swapped with NFT")
                    }
                    (_, (String, "0")) => {
                      unlock!("error: you cannot ask for purse zero in exchange of swap")
                    }
                    _ => {
                      getContractPursesThmCh!((payload.get("contractId"), *ch1)) |
                      getContractPursesThmCh!((payload.get("price").nth(0), *ch2)) |
                      for (@pursesThm1 <- ch1; @pursesThm2 <- ch2) {
                        if (pursesThm1 != Nil and pursesThm2 != Nil) {
                          TreeHashMap!("set", pursesThm1, payload.get("purseId"), purse.set("price", payload.get("price")), *ch6) |
                          for (_ <- ch6) {
                            unlock!((true, Nil))
                          }
                        } else {
                          unlock!("error: one of the contracts not found")
                        }
                      }
                    }
                  }
                } else {
                  unlock!("error: purse not found")
                }
              }
            }
          }
        }
      } |

      for (@("UPDATE_PURSE_DATA", payload, return) <= @boxCh) {
        new ch1, ch2, ch3, ch4, proceeedUpdateCh, unlock in {
          for (@result <- unlock) {
            @(*self, "BOX_LOCK", boxId)!(Nil) |
            @(*self, "CONTRACT_LOCK", payload.get("contractId"))!(Nil) |
            @return!(result)
          } |
          match payload {
            { "data": _, "contractId": String, "purseId": String } => {
              getContractPursesThmCh!((payload.get("contractId"), *ch1)) |
              for (@pursesThm <- ch1) {
                if (pursesThm != Nil) {
                  for (
                    _ <- @(*self, "BOX_LOCK", boxId);
                    _ <- @(*self, "CONTRACT_LOCK", payload.get("contractId"))
                  ) {
                    proceeedUpdateCh!(Nil)
                  }
                } else {
                  @return!("error: contract not found")
                }
              }
            }
            _ => {
              @return!("error: invalid payload for update data")
            }
          } |

          // RACE SAFE / RESOURCES LOCKED
          // after lock of 1 contract and 1 box
          for (_ <- proceeedUpdateCh) {
            getBoxCh!((boxId, *ch3)) |
            for (@box <- ch3) {
              getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch4)) |
              for (@purse <- ch4) {
                if (purse != Nil) {
                  for (@pursesDataThm <<- @(*self, "pursesData", payload.get("contractId"))) {
                    TreeHashMap!("set", pursesDataThm, payload.get("purseId"), payload.get("data"), *ch2) |
                    for (_ <- ch2) {
                      unlock!((true, Nil))
                    }
                  }
                } else {
                  unlock!("error: purse not found")
                }
              }
            }
          }
        }
      } |

      for (@("RENEW", payload, return) <= @boxCh) {
        new ch1, ch2, ch3, ch4, renewStep2, ch20, renewStep3, ch33, ch34, ch35, ch36, ch37, ch38, proceeedRenewCh, unlock in {
          for (@result <- unlock) {
            @(*self, "BOX_LOCK", boxId)!(Nil) |
            @(*self, "CONTRACT_LOCK", payload.get("contractId"))!(Nil) |
            @return!(result)
          } |
          match payload {
            { "contractId": String, "purseId": String } => {
              getContractPursesThmCh!((payload.get("contractId"), *ch1)) |
              for (@pursesThm <- ch1) {
                if (pursesThm != Nil) {
                  for (
                    _ <- @(*self, "BOX_LOCK", boxId);
                    _ <- @(*self, "CONTRACT_LOCK", payload.get("contractId"))
                  ) {
                    proceeedRenewCh!(Nil)
                  }
                } else {
                  @return!("error: contract not found")
                }
              }
            }
            _ => {
              @return!("error: invalid payload for renew")
            }
          } |

          // RACE SAFE / RESOURCES LOCKED
          // after lock of 1 contract and 1 box
          for (_ <- proceeedRenewCh) {
            getBoxCh!((boxId, *ch1)) |
            for (@box <- ch1) {
              getContractPursesThmCh!((payload.get("contractId"), *ch2)) |
              getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch3)) |
              for (@pursesThm <- ch2) {
                TreeHashMap!("get", pursesThm, "0", *ch4) |
                for (@purse <- ch3; @purseZero <- ch4) {
                  for (@contractConfig <<- @(*self, "contractConfig", payload.get("contractId"))) {
                    match (contractConfig.get("expires"), contractConfig.get("fungible") == false, purse != Nil, purseZero != Nil, purse.get("boxId") == boxId) {
                      (Int, true, true, true, true) => {
                        renewStep2!((box, pursesThm, purseZero, purse, contractConfig.get("expires")))
                      }
                      _ => {
                        unlock!("error: purse 0 not found or contract is fungible=true")
                      }
                    }
                  }
                }
              }
            }
          } |

          for (@(box, pursesThm, purseZero, purse, expires) <- renewStep2) {
            blockData!(*ch20) |
            for (_, @timestamp, _ <- ch20) {
              match expires / 10 {
                grace => {
                  match purse.get("timestamp") + expires - grace {
                    startOfGracePeriod => {
                      if (timestamp > startOfGracePeriod) {
                        renewStep3!((box, pursesThm, purseZero, purse, expires))
                      } else {
                        unlock!("error: to soon to renew")
                      }
                    }
                    _ => {
                      unlock!("error: cannot calculate grace period")
                    }
                  }
                }
                _ => {
                  unlock!("error: cannot calculate grace period")
                }
              }
            }
          } |

          for (@(box, pursesThm, purseZero, purse, expires) <- renewStep3) {
            match purseZero.get("price") {
              (String, String) => { unlock!("error: purse zero not for sale with ft, cannot renew") }
              // renew is free
              Nil => {
                TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("timestamp", purse.get("timestamp") + expires), *ch38) |
                for (_ <- ch38) { unlock!((true, Nil)) }
              }
              (String, Int) => {
                getPurseWithAtLeastQuantityCh!((box, purseZero.get("price").nth(0), purseZero.get("price").nth(1), *ch33)) |
                for (@purseForRenew <- ch33) {
                  if (purseForRenew != Nil) {
                    getContractPursesThmCh!((purseZero.get("price").nth(0), *ch36)) |
                    for (@feePursesThm <- ch36) {
                      if (purseForRenew.get("quantity") == purseZero.get("price").nth(1)) {
                        TreeHashMap!("set", feePursesThm, purseForRenew.get("id"), Nil, *ch34) |
                        removePurseInBoxCh!((purseForRenew.get("boxId"), purseZero.get("price").nth(0), purseForRenew.get("id"), *ch35))
                      } else {
                        TreeHashMap!("set", feePursesThm, purseForRenew.get("id"), purseForRenew.set("quantity", purseForRenew.get("quantity") - purseZero.get("price").nth(1)), *ch34) |
                        ch35!(Nil)
                      }
                    } |
                    for (_ <- ch34; _ <- ch35) {
                      TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("timestamp", purse.get("timestamp") + expires), *ch38) |
                      for (_ <- ch38) {
                        unlock!((true, Nil)) |
                        // renew reward is here to avoid dead locks issues
                        // it will never wait eternally for same contractId or boxId lock
                        for (
                          _ <- @(*self, "CONTRACT_LOCK", purseZero.get("price").nth(0));
                          _ <- @(*self, "BOX_LOCK", purseZero.get("boxId"))
                        ) {
                          makePurseCh!((
                            purseZero.get("price").nth(0),
                            purseForRenew
                              .set("boxId", purseZero.get("boxId"))
                              .set("price", Nil)
                              .set("quantity", purseZero.get("price").nth(1)),
                            Nil,
                            true,
                            *ch37
                          )) |
                          for (_ <- ch37) {
                            @(*self, "CONTRACT_LOCK", purseZero.get("price").nth(0))!(Nil) |
                            @(*self, "BOX_LOCK", purseZero.get("boxId"))!(Nil)
                          }
                        }
                      }
                    }
                  } else {
                    unlock!("error: did not find purse for renew")
                  }
                }
              }
            }
          }
        }
      } |

      for (@("WITHDRAW", payload, return) <= @boxCh) {
        // todo can we have a lock that is only
        // scoped to fromBox and toBox ?
        new ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12, ch13, ch14, ch15, ch16, proceedChecksCh, proceedWithdrawCh, unlock in {
          for (@result <- unlock) {
            @return!(result) |
            @(*self, "CONTRACT_LOCK", payload.get("contractId"))!(Nil) |
            @(*self, "BOX_LOCK", boxId)!(Nil) |
            if (payload.get("toBoxId") != boxId) {
              @(*self, "BOX_LOCK", payload.get("toBoxId"))!(Nil)
            }
          } |

          // Step 1, make sure that contract exists
          // and box has purse
          // lock 1 contract and 1 (burn) or 2 (not burn) boxes
          match payload {
            { "quantity": Int, "contractId": String, "purseId": String, "toBoxId": String, "merge": Bool } => {

              getContractPursesThmCh!((payload.get("contractId"), *ch4)) |
              getBoxCh!((payload.get("toBoxId"), *ch6)) |

              for (@pursesThm <- ch4; @toBox <- ch6) {
                match (pursesThm != Nil, toBox != Nil) {
                  (true, true) => {
                    for (_ <- @(*self, "CONTRACT_LOCK", payload.get("contractId"))) {
                      for (_ <- @(*self, "BOX_LOCK", boxId)) {
                        if (payload.get("toBoxId") != boxId) {
                          for (_ <- @(*self, "BOX_LOCK", payload.get("toBoxId"))) {
                            proceedWithdrawCh!(Nil)
                          }
                        } else {
                          proceedWithdrawCh!(Nil)
                        }
                      }
                    }
                  }
                  _ => {
                    @return!("error: contract or recipient box does not exist")
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload for withdraw")
            }
          } |

          // RACE SAFE / RESOURCES LOCKED
          // after lock of 1 contract and 1 or 2 boxes
          for (_ <- proceedWithdrawCh) {
            getBoxCh!((boxId, *ch10)) |
            for (@box <- ch10) {
              getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch9)) |
              for (@purse <- ch9) {
                if (purse == Nil) {
                  unlock!("error: purse does not exist")
                } else {
                  if (purse.get("id") == "0") {
                    unlock!("error: withdraw from special nft 0 is forbidden")
                  } else {
                    for (@config <<- @(*self, "contractConfig", payload.get("contractId"))) {
                      if (payload.get("toBoxId") == "_rev" and payload.get("contractId") != prefix ++ "rev") {
                        unlock!("error: withdraw to _rev only allowed for wrapped rev")
                      } else if (payload.get("toBoxId") == "_burn") {
                        match config.get("expires") {
                          Int => { unlock!("error: cannot burn NFT that can expire") }
                          Nil => { ch15!((purse, box)) }
                        }
                      } else {
                        ch15!((purse, box))
                      }
                    }
                  }
                }
              }
            } |

            for (@(purse, box) <- ch15) {
              getContractPursesThmCh!((payload.get("contractId"), *ch16)) |
              for (@pursesThm <- ch16) {
                // the withdrawer should not be able to choose if
                // tokens in recipient box will or will not be 
                // merged, except if he withdraws to himself
                if (payload.get("toBoxId") != boxId) {
                  ch12!(true)
                } else {
                  ch12!(payload.get("merge"))
                } |

                /* appendLogCh!(
                  "w,\${contractId},\${toBox},\${fromBox},\${q}" %% {
                    "contractId": payload.get("contractId"),
                    "fromBox": boxId,
                    "toBox": payload.get("toBoxId"),
                    "q": payload.get("quantity"),
                  }
                ) | */
                for (@merge <- ch12) {
                  match (
                    purse.get("quantity") - payload.get("quantity") >= 0,
                    purse.get("quantity") > 0,
                    purse.get("quantity") - payload.get("quantity") > 0
                  ) {

                    // ajust quantity in first purse, create a second purse
                    // associated with toBoxId
                    (true, true, true) => {
                      TreeHashMap!("set", pursesThm, payload.get("purseId"), purse.set("quantity", purse.get("quantity") - payload.get("quantity")), *ch5) |
                      for (_ <- ch5) {
                        if (payload.get("toBoxId") == "_rev") {
                          for (@boxConfig <<- @(*self, "boxConfig", boxId)) {
                            creditBackCh!((boxConfig.get("revAddress"), payload.get("quantity"), *unlock))
                          }
                        } else {
                          makePurseCh!((
                            payload.get("contractId"),
                            purse
                              .set("price", Nil)
                              .set("quantity", payload.get("quantity"))
                              .set("boxId", payload.get("toBoxId")),
                            Nil,
                            merge,
                            *unlock
                          ))
                        }
                      }
                    }
                    // remove first purse, create a second purse
                    // associated with toBoxId
                    (true, true, false) => {
                      TreeHashMap!("set", pursesThm, payload.get("purseId"), Nil, *ch5) |
                      removePurseInBoxCh!((boxId, payload.get("contractId"), payload.get("purseId"), *ch8)) |
                      if (payload.get("toBoxId") == "_rev") {
                        for (@boxConfig <<- @(*self, "boxConfig", boxId)) {
                          creditBackCh!((boxConfig.get("revAddress"), payload.get("quantity"), *unlock))
                        }
                      } else {
                        for (_ <- ch5; _ <- ch8) {
                          for (@pursesDataThm <<- @(*self, "pursesData", payload.get("contractId"))) {
                            TreeHashMap!(
                              "get",
                              pursesDataThm,
                              payload.get("purseId"),
                              *ch7
                            ) |
                            for (@currentData <- ch7) {
                              TreeHashMap!(
                                "set",
                                pursesDataThm,
                                payload.get("purseId"),
                                Nil,
                                *ch11
                              ) |
                              for (_ <- ch11) {
                                makePurseCh!((
                                  payload.get("contractId"),
                                  purse
                                    .set("price", Nil)
                                    .set("boxId", payload.get("toBoxId")),
                                  currentData,
                                  merge,
                                  *unlock
                                ))
                              }
                            }
                          }
                        }
                      }
                    }
                    _ => {
                      unlock!("error: cannot withdraw, quantity in payload is superior to existing purse quantity")
                    }
                  }
                }
              }
            }
          }
        }
      } |

      for (@(amount, contractConfig, return2) <= calculateFeeCh) {
        if (contractConfig.get("fee") == Nil) {
          @return2!((amount, 0, Nil))
        } else {
          match amount * contractConfig.get("fee").nth(1) / 100000 {
            feeAmount => {
              new ch1 in {
                @return2!((amount - feeAmount, feeAmount, contractConfig.get("fee").nth(0)))
              }
            }
          }
        }
      } |

      for (@("SWAP", payload, return) <= @boxCh) {
        match payload {
          { "contractId": String, "purseId": String, "merge": Bool, "quantity": Int, "newId": Nil \\/ String } => {
            new ch2, ch3, ch4, ch5, ch6, ch7, ch9,
              step2Ch, ch20, ch21, ch22, ch23, ch24, ch25,
              step3aCh, step3bCh, ch30, ch31, ch32, ch33, ch34, ch35, ch36, ch37, ch38, ch39, ch40, ch41, ch42,
              removeOrAjustQuantityCh, unlock, lock in {
              // Lock 2 contracts or 1 (if SWAP is in same contract)
              // Lock 2 boxes or 1 (if SWAP is between same box)
              for (@(purseForSale, ret) <- lock) {
                new lockBoxes in {
                  for (_ <- @(*self, "CONTRACT_LOCK", payload.get("contractId"))) {
                    if (payload.get("contractId") != purseForSale.get("price").nth(0)) {
                      for (_ <- @(*self, "CONTRACT_LOCK", purseForSale.get("price").nth(0))) {
                        lockBoxes!(Nil)
                      }
                    } else {
                      lockBoxes!(Nil)
                    }
                  } |
                  for (_ <- lockBoxes) {
                    for (_ <- @(*self, "BOX_LOCK", boxId)) {
                      if (boxId != purseForSale.get("boxId")) {
                        for (_ <- @(*self, "BOX_LOCK", purseForSale.get("boxId"))) {
                          @ret!(Nil)
                        }
                      } else {
                        @ret!(Nil)
                      }
                    }
                  }
                }
              } |
              for (@(purseForSale, result) <- unlock) {
                @return!(result) |
                @(*self, "CONTRACT_LOCK", payload.get("contractId"))!(Nil) |
                if (payload.get("contractId") != purseForSale.get("price").nth(0)) {
                  @(*self, "CONTRACT_LOCK", purseForSale.get("price").nth(0))!(Nil)
                } |
                @(*self, "BOX_LOCK", boxId)!(Nil) |
                if (boxId != purseForSale.get("boxId")) {
                  @(*self, "BOX_LOCK", purseForSale.get("boxId"))!(Nil)
                }
              } |

              getBoxCh!((boxId, *ch3)) |
              getContractPursesThmCh!((payload.get("contractId"), *ch4)) |
              validateStringCh!((payload.get("newId"), *ch9)) |

              // Step 1, make sure that the two contracts exists
              // (seller purse and buyer purse)
              // lock 2 contracts and 2 boxes
              for (@box <- ch3; @pursesThm <- ch4; @valid <- ch9) {
                if (box != Nil and pursesThm != Nil and valid == true) {
                  TreeHashMap!("get", pursesThm, payload.get("purseId"), *ch6) |
                  for (@purseForSale <- ch6) {
                    if (purseForSale != Nil) {
                      match purseForSale.get("price") {
                        (String, Int) \\/ (String, String) => {
                          lock!((purseForSale, *step2Ch))
                        }
                        _ => {
                          @return!("error: purse not for sale")
                        }
                      }
                    } else {
                      @return!("error: purse not found")
                    }
                  }
                } else {
                  @return!("error: box or contract not found or invalid payload")
                }
              } |

              // RACE SAFE / RESOURCES LOCKED
              // after lock of 2 contracts and 2 boxes
              // Step 2
              // Find out if box can fulfill sell order
              for (_ <- step2Ch) {
                getBoxCh!((boxId, *ch23)) |
                getContractPursesThmCh!((payload.get("contractId"), *ch21)) |
                
                for (@pursesThm <- ch21; @box <- ch23) {
                  TreeHashMap!("get", pursesThm, payload.get("purseId"), *ch22) |
                  for (@purseForSale <- ch22) {
                    match purseForSale.get("price") {
                      Nil => {
                        unlock!((purseForSale, "error: no sell order found"))
                      }
                      _ => {
                        for (@contractConfig <<- @(*self, "contractConfig", purseForSale.get("price").nth(0))) {
                          match (purseForSale.get("price"), contractConfig.get("fungible")) {
                            // purseForSale is FT or NFT
                            // purseForSale asks FT in return
                            // seller's purse   <->   buyer's purse
                            // NFT or FT        <->   FT
                            ((String, Int), true) => {
                              if (payload.get("quantity") > purseForSale.get("quantity")) {
                                unlock!((purseForSale, "error: quantity not available"))
                              } else {
                                getPurseWithAtLeastQuantityCh!((box, purseForSale.get("price").nth(0), purseForSale.get("price").nth(1) * payload.get("quantity"), *ch20)) |
                                for (@purseForTransfer <- ch20) {
                                  if (purseForTransfer != Nil) {
                                    getContractPursesDataThmCh!((payload.get("contractId"), *ch24)) |
                                    for (@pursesDataThm <- ch24) {
                                      TreeHashMap!("get", pursesDataThm, purseForSale.get("id"), *ch25)
                                    } |
                                    for (@purseForSaleData <- ch25) {
                                      step3aCh!((box, pursesThm, purseForSale, purseForSaleData, contractConfig, purseForTransfer))
                                    }
                                  } else {
                                    unlock!((purseForSale, "error: box cannot fulfil order"))
                                  }
                                }
                              }
                            }
                            // purseForSale is FT or NFT
                            // purseForSale asks NFT in return
                            // seller's purse   <->   buyer's purse
                            // NFT or FT        <->   NFT
                            ((String, String), false) => {
                              if (box.get(purseForSale.get("price").nth(0)) != Nil) {
                                if (box.get(purseForSale.get("price").nth(0)).contains(purseForSale.get("price").nth(1)) == true) {
                                  getContractPursesThmCh!((purseForSale.get("price").nth(0), *ch21)) |
                                  for (@purseForTransferThm <- ch21) {
                                    TreeHashMap!("get", purseForTransferThm, purseForSale.get("price").nth(1), *ch20) |
                                    for (@purseForTransfer <- ch20) {
                                      getContractPursesDataThmCh!((payload.get("contractId"), *ch24)) |
                                      for (@pursesDataThm <- ch24) {
                                        TreeHashMap!("get", pursesDataThm, purseForTransfer.get("id"), *ch25)
                                      } |
                                      for (@purseForTransferData <- ch25) {
                                        step3bCh!((box, pursesThm, purseForSale, purseForTransferData, contractConfig, purseForTransfer))
                                      }
                                    }
                                  }
                                } else {
                                  unlock!((purseForSale, "error: box cannot fulfil order"))
                                }
                              } else {
                                unlock!((purseForSale, "error: box cannot fulfil order"))
                              }
                            }
                            _ => {
                              unlock!((purseForSale, "error: no sell order found"))
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } |

              for (@(pursesThm, contractId, purse, quantity, return) <= removeOrAjustQuantityCh) {
                if (purse.get("quantity") == quantity) {
                  new removedFromBoxCh, purseRemovedCh, dataRemovedCh, tmpCh in {
                    TreeHashMap!("set", pursesThm, purse.get("id"), Nil, *purseRemovedCh) |
                    removePurseInBoxCh!((purse.get("boxId"), contractId, purse.get("id"), *removedFromBoxCh)) |
                    getContractPursesDataThmCh!((contractId, *tmpCh)) |
                    for (@pursesDataThm <- tmpCh) {
                      TreeHashMap!("set", pursesDataThm, purse.get("id"), Nil, *dataRemovedCh)
                    } |
                    for (_ <- removedFromBoxCh; _ <- purseRemovedCh; _ <- dataRemovedCh) { @return!(Nil) }
                  }
                } else {
                  TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("quantity", purse.get("quantity") - quantity), return)
                }
              } |

              // Step 3 A
              // do transfer
              // Seller asks for FT
              // seller's purse   <->   buyer's purse
              // NFT or FT        <->   FT
              for (@(box, pursesThm, purseForSale, purseForSaleData, contractConfig, purseForTransfer) <- step3aCh) {

                // remove or ajust quantity in purseForSale
                removeOrAjustQuantityCh!((pursesThm, payload.get("contractId"), purseForSale, payload.get("quantity"), *ch30)) |
                
                // remove or ajust quantity in purseForTransfer
                getContractPursesThmCh!((purseForSale.get("price").nth(0), *ch32)) |
                for (@buyerPurseThm <- ch32) {
                  removeOrAjustQuantityCh!((buyerPurseThm, purseForSale.get("price").nth(0), purseForTransfer, payload.get("quantity") * purseForSale.get("price").nth(1), *ch31))
                } |

                for (@contractConfig <<- @(*self, "contractConfig", payload.get("contractId"))) {
                  calculateFeeCh!((payload.get("quantity") * purseForSale.get("price").nth(1), contractConfig, *ch39))
                } |

                for (_ <- ch30; _ <- ch31; @amountAndFeeAmount <- ch39) {
                  // create new purse for the buyer
                  makePurseCh!((
                    payload.get("contractId"),
                    // keep quantity of existing purse
                    purseForSale
                      .set("boxId", boxId)
                      .set("price", Nil)
                      .set("quantity", payload.get("quantity"))
                      // will only be considered for nft, purchase from purse "0"
                      .set("newId", payload.get("newId")),
                    purseForSaleData,
                    true,
                    *ch36
                  )) |
                  // create new purse for the seller
                  makePurseCh!((
                    purseForSale.get("price").nth(0),
                    purseForTransfer
                      .set("boxId", purseForSale.get("boxId"))
                      .set("quantity", amountAndFeeAmount.nth(0))
                      .set("price", Nil),
                    Nil,
                    true,
                    *ch40
                  )) |
                  for (@makeBuyerPurseResult <- ch36; _ <- ch40) {
                    match makeBuyerPurseResult {
                      String => {
                        unlock!((purseForSale, "error: CRITICAL could not make purse " ++ makeBuyerPurseResult))
                      }
                      (true, newPurse) => {
                        ch41!(Nil) |
                        unlock!((purseForSale, (true, Nil)))
                        
                        /* appendLogCh!(
                          "s,\${contractId},\${toBox},\${fromBox},\${q},\${p1},\${p2},\${p3},\${id},\${newId};" %% {
                            "contractId": payload.get("contractId"),
                            "fromBox": boxId,
                            "toBox": purseForSale.get("boxId"),
                            "q": payload.get("quantity"),
                            "p1": "ft",
                            "p2": purseForSale.get("price").nth(0),
                            "p3": purseForSale.get("price").nth(1),
                            "id": payload.get("purseId"),
                            "newId": newPurse.get("id")
                          }
                        ) */
                      }
                    } |
                    // fee reward is here to avoid dead locks issues
                    // it will never wait eternally for same contractId or boxId lock
                    for (_ <- ch41) {
                      if (amountAndFeeAmount.nth(1) > 0) {
                        for (
                          _ <- @(*self, "CONTRACT_LOCK", purseForSale.get("price").nth(0));
                          _ <- @(*self, "BOX_LOCK", amountAndFeeAmount.nth(2))
                        ) {
                          makePurseCh!((
                            purseForSale.get("price").nth(0),
                            purseForTransfer
                              .set("boxId", amountAndFeeAmount.nth(2))
                              .set("quantity", amountAndFeeAmount.nth(1))
                              .set("price", Nil),
                            Nil,
                            true,
                            *ch42
                          )) |
                          for (_ <- ch42) {
                            @(*self, "CONTRACT_LOCK", purseForSale.get("price").nth(0))!(Nil) |
                            @(*self, "BOX_LOCK", amountAndFeeAmount.nth(2))!(Nil)
                          }
                        }
                      }
                    }
                  }
                }
              } |

              // Step 3 B
              // do transfer
              // Seller asks for NFT
              // seller's purse   <->   buyer's purse
              // NFT or FT        <->   NFT
              for (@(box, pursesThm, purseForSale, purseForTransferData, contractConfig, purseForTransfer) <- step3bCh) {
                // a sell order for NFT is not per token
                // it is a full SWAP
                // remove completely seller's purse
                removeOrAjustQuantityCh!((pursesThm, payload.get("contractId"), purseForSale, purseForSale.get("quantity"), *ch30)) |
                
                // same for buyer's purse
                getContractPursesThmCh!((purseForSale.get("price").nth(0), *ch32)) |
                for (@buyerPurseThm <- ch32) {
                  removeOrAjustQuantityCh!((buyerPurseThm, purseForSale.get("price").nth(0), purseForTransfer, purseForTransfer.get("quantity"), *ch31))
                } |

                for (_ <- ch30; _ <- ch31) {
                  // create new purse for the buyer
                  makePurseCh!((
                    payload.get("contractId"),
                    purseForSale
                      .set("boxId", boxId)
                      .set("price", Nil),
                    Nil,
                    true,
                    *ch36
                  )) |
                  // create new purse for the seller
                  makePurseCh!((
                    purseForSale.get("price").nth(0),
                    purseForTransfer
                      .set("boxId", purseForSale.get("boxId"))
                      .set("price", Nil),
                    purseForTransferData,
                    true,
                    *ch38
                  )) |
                  for (@makeBuyerPurseResult <- ch36; @makeSellerPurseResult <- ch38) {
                    match makeBuyerPurseResult {
                      String => {
                        unlock!((purseForSale, "error: CRITICAL could not make purse " ++ makeBuyerPurseResult))
                      }
                      (true, newPurse) => {
                        unlock!((purseForSale, (true, Nil)))
                        /* appendLogCh!(
                          "s,\${contractId},\${toBox},\${fromBox},\${q},\${p1},\${p2},\${p3},\${id},\${newId};" %% {
                            "contractId": payload.get("contractId"),
                            "fromBox": boxId,
                            "toBox": purseForSale.get("boxId"),
                            "q": payload.get("quantity"),
                            "p1": "nft",
                            "p2": purseForSale.get("price").nth(0),
                            "p3": purseForSale.get("price").nth(1),
                            "newId": newPurse.get("id"),
                            "id": payload.get("purseId")
                          }
                        ) */
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
    } |

    // Register special box _rev
    new ch1 in {
      TreeHashMap!("set", boxesThm, "_rev", "exists", *ch1) |
      for (_ <- ch1) {
        @(*self, "boxes", "_rev")!({}) |
        @(*self, "boxesSuperKeys", "_rev")!(Set()) |
        @(*self, "boxConfig", "_rev")!({ "publicKey": "none", "revAddress": "none" }) |
        initLocksForBoxCh!("_rev") |
        stdout!("special box _rev registered, ready to receive wrapped rev")
      }
    } |

    // after a withdraw to _rev, this channel is called
    // and owner of box credited with true REV
    for (@(boxRevAddress, quantity, return) <= creditBackCh) {
      new ch1, ch2, ch3, ch4, ch5 in {
        @RevVault!("unforgeableAuthKey", *self, *ch3) |
        revAddress!("fromUnforgeable", *self, *ch4) |
        for (@escrowPurseAuthKey <- ch3; @escrowPurseRevAddr <- ch4) {
          @RevVault!("findOrCreate", escrowPurseRevAddr, *ch5) |
          for (@(true, escrowPurseVault) <- ch5) {
            @escrowPurseVault!("transfer", boxRevAddress, quantity, escrowPurseAuthKey, *ch1) |
            for (@escrowTransferResult <- ch1) {
              match escrowTransferResult {
                (true, Nil) => {
                  stdout!("\${quantity} wrapped rev burned and credited back to \${boxRevAddress}" %% { "quantity": quantity, "boxRevAddress": boxRevAddress }) |
                  @return!((true, Nil))
                }
                _ => { @return!("error CRITICAL: credit back went wrong") }
              }
            }
          }
        }
      }
    } |

    // Register special box _burn
    new ch1 in {
      TreeHashMap!("set", boxesThm, "_burn", "exists", *ch1) |
      for (_ <- ch1) {
        @(*self, "boxes", "_burn")!({}) |
        @(*self, "boxesSuperKeys", "_burn")!(Set()) |
        @(*self, "boxConfig", "_burn")!({ "publicKey": "none", "revAddress": "none" }) |
        initLocksForBoxCh!("_burn") |
        stdout!("special box _burn registered")
      }
    } |

    // Register special [prefix]rev fungible token
    new ch1, ch2, ch3, ch4 in {
      TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch2) |
      TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch4) |
      TreeHashMap!("set", contractsThm, prefix ++ "rev", "exists", *ch3) |
      for (@pursesThm <- ch2; @pursesDataThm <- ch4; _ <- ch3) {

        @(*self, "purses", prefix ++ "rev")!(pursesThm) |
        @(*self, "pursesData", prefix ++ "rev")!(pursesDataThm) |
        @(*self, "contractConfig", prefix ++ "rev")!(
          {
            "locked": true,
            "counter": 1,
            "version": "17.0.6",
            "fee": Nil,
            "expires": Nil,
            "contractId": prefix ++ "rev",
            "fungible": true
          }
        ) |
        @(*self, "CONTRACT_LOCK", prefix ++ "rev")!(Nil) |
        stdout!("special FT contract (wrapped rev) " ++ prefix ++ "rev registered")
      }
    }
  } |

  insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

  for (entryUri <- entryUriCh) {
    deployId!({
      "status": "completed",
      "registryUri": *entryUri
    }) |
    /* turn URI into a string so we can slice
    and get prefix for boxes and contracts */
    match "\${uri}" %% { "uri": *entryUri } {
      uri => { prefixCh!(uri.slice(7, 10)) }
    } |
    stdout!("rchain-token master registered at \${uri}" %% { "uri": *entryUri })
  }
}
`;
};

var masterTerm = {
	masterTerm: masterTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var swapTerm_1 = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    stdout!("boxCh") |
    boxCh!(("SWAP", { "contractId": "${payload.contractId}", "purseId": "${payload.purseId}", "merge": ${payload.merge}, "quantity": ${payload.quantity}, "newId": "${payload.newId ? payload.newId : ""}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, Nil) => {
          // OP_SWAP_BEGIN
          deployId!({ "status": "completed" }) |
          stdout!("completed, swap successful")
          // OP_SWAP_END
        }
      }
    }
  }
}
`;
};

var swapTerm = {
	swapTerm: swapTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var creditTerm_1 = (
  payload
) => {
  return `
new
  deployId(\`rho:rchain:deployId\`),
  revVaultCh,
  boxCh,

  returnCh,
  quantityCh,
  revAddressCh,

  contractExistsCh,
  proceed1Ch,
  proceed2Ch,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  quantityCh!(${payload.quantity}) |
  revAddressCh!("${payload.revAddress}") |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {

    registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *contractExistsCh) |
    for (_ <- contractExistsCh) {
      proceed1Ch!(Nil)
    } |

    registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |

    /*
      Create a vault/purse that is just used once (purse)
    */
    for(@(_, *RevVault) <- revVaultCh; _ <- proceed1Ch; @quantity <- quantityCh) {
      new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, deployerRevAddressCh, RevVaultCh, deployerVaultCh, deployerAuthKeyCh in {
        revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
        RevVault!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
        for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

          RevVault!("findOrCreate", purseRevAddr, *purseVaultCh) |

          for (@(true, purseVault) <- purseVaultCh) {
            registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
            for (@(_, RevVault) <- RevVaultCh; @deployerRevAddress <- revAddressCh) {
              
              // send price * quantity dust in purse
              @RevVault!("findOrCreate", deployerRevAddress, *deployerVaultCh) |
              @RevVault!("deployerAuthKey", *deployerId, *deployerAuthKeyCh) |
              for (@(true, deployerVault) <- deployerVaultCh; @deployerAuthKey <- deployerAuthKeyCh) {

                stdout!(("Beginning transfer of ", quantity, "dust from", deployerRevAddress, "to", purseRevAddr)) |

                new resultCh, entryCh in {
                  @deployerVault!("transfer", purseRevAddr, quantity, deployerAuthKey, *resultCh) |
                  for (@result <- resultCh) {

                    stdout!(("Finished transfer of ", quantity, "dust to", purseRevAddr, "result was:", result)) |
                    match result {
                      (true, Nil) => {
                        boxCh!((
                          "CREDIT",
                          {
                            "purseRevAddr": purseRevAddr,
                            "purseAuthKey": purseAuthKey
                          },
                          *returnCh
                        )) |
                        for (@r <- returnCh) {
                          stdout!(r) |
                          match r {
                            String => {
                              new refundPurseBalanceCh, refundResultCh in {
                                @purseVault!("balance", *refundPurseBalanceCh) |
                                for (@balance <- refundPurseBalanceCh) {
                                  if (balance != quantity) {
                                    stdout!("error: CRITICAL, purchase was not successful and balance of purse is now different from price * quantity")
                                  } |
                                  @purseVault!("transfer", deployerRevAddress, balance, purseAuthKey, *refundResultCh) |
                                  for (@result <- refundResultCh)  {
                                    match result {
                                      (true, Nil) => {
                                        match "error: purchase failed but was able to refund \${balance} " %% { "balance": balance } ++ r {
                                          s => {
                                            deployId!({ "status": "failed", "message": s }) |
                                            stdout!(s)
                                          }
                                        }
                                      }
                                      _ => {
                                        stdout!(result) |
                                        match "error: CRITICAL purchase failed and was NOT ABLE to refund \${balance} " %% { "balance": balance } ++ r {
                                          s => {
                                            deployId!({ "status": "failed", "message": s }) |
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
                              // OP_CREDIT_COMPLETED_BEGIN
                              deployId!({ "status": "completed" }) |
                              stdout!("completed, credit successful")
                              // OP_CREDIT_COMPLETED_END
                            }
                          }
                        }
                      }
                      _ => {
                        deployId!({ "status": "failed", "message": result }) |
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
}`;
};

var creditTerm = {
	creditTerm: creditTerm_1
};

// rholang terms
const { creditTerm: creditTerm$1 } = creditTerm;
const { swapTerm: swapTerm$1 } = swapTerm;

var creditAndSwapTerm_1 = (
  payloadCredit,
  payloadSwap
) => {

  const term1 = creditTerm$1(payloadCredit);
  const indexStart = term1.indexOf('// OP_CREDIT_COMPLETED_BEGIN');
  const indexEnd = term1.indexOf('// OP_CREDIT_COMPLETED_END');

  const term2 = term1.slice(0, indexStart) + term1.slice(indexEnd).replace(
    `// OP_CREDIT_COMPLETED_END`,
    `${swapTerm$1(payloadSwap).replace('deployId(`rho:rchain:deployId`),', '')}`
  );

  return term2;
};

var creditAndSwapTerm = {
	creditAndSwapTerm: creditAndSwapTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var deployTerm_1 = (payload) => {
    return `new deployId(\`rho:rchain:deployId\`),
  masterEntryCh,
  registerContractReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *masterEntryCh) |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("REGISTER_CONTRACT", { "contractId": "${payload.contractId}", "fungible": ${payload.fungible}, "expires": ${payload.expires ? payload.expires : "Nil"} }, *registerContractReturnCh)) |
    for (@r <- registerContractReturnCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, p) => {
          @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", p.get("contractId"))!(p.get("superKey")) |
          // OP_REGISTER_CONTRACT_COMPLETED_BEGIN
          deployId!({
            "status": "completed",
            "masterRegistryUri": "${payload.masterRegistryUri}",
            "contractId": p.get("contractId"),
          }) |
          stdout!("completed, contract registered")
          // OP_REGISTER_CONTRACT_COMPLETED_END
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

  let rholang = `new ${ids.map((id, i) => 'channel' + i)} in {`;
  ids.forEach((id, i) => {
    rholang +=
      '\n' +
      `superKey!(("CREATE_PURSE", ${JSON.stringify(payload.purses[id]).replace(
        new RegExp(': null|:null', 'g'),
        ': Nil'
      )}, *channel${i})) |`;
  });
  rholang += '\n';
  rholang += `for (${ids
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
  rholang += `  // OP_CREATE_PURSES_COMPLETED_BEGIN\n   stdout!("purses created, check results to see successes/failures") |
  deployId!({ "status": "completed", "results": {}${ids
    .map((p, i) => `.union({ "${p}": value${i} })`)
    .join('')}}) // OP_CREATE_PURSES_COMPLETED_END\n`;
  rholang += `}\n}`;

  return `new deployId(\`rho:rchain:deployId\`), entryCh, readCh, stdout(\`rho:io:stdout\`), deployerId(\`rho:rchain:deployerId\`), lookup(\`rho:registry:lookup\`) in {
    for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
      ${rholang}
    }
  }`;
};

var createPursesTerm = {
	createPursesTerm: createPursesTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var lockTerm_1 = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
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
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_LOCK_COMPLETED_BEGIN
          stdout!("completed, contract locked") |
          deployId!({ "status": "completed" })
          // OP_LOCK_COMPLETED_END
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
var updateFeeTerm_1 = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
    superKey!((
      "UPDATE_FEE",
      { "fee": ${payload.fee ? `("${payload.fee[0]}", ${payload.fee[1]})` : "Nil"} },
      *returnCh
    )) |
    for (@r <- returnCh) {
      stdout!(r) |
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_UPDATE_FEE_COMPLETED_BEGIN
          stdout!("completed, fee updated") |
          deployId!({ "status": "completed" })
          // OP_UPDATE_FEE_COMPLETED_END
        }
      }
    }
  }
}
`;
};

var updateFeeTerm = {
	updateFeeTerm: updateFeeTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var deleteExpiredPurseTerm_1 = (
  payload
) => {
  return `new
  deployId(\`rho:rchain:deployId\`),
  entryCh,
  returnCh,
  registryLookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {
  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    entry!(("PUBLIC_DELETE_EXPIRED_PURSE", "${payload.contractId}", "${payload.boxId}", "${payload.purseId}", *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_PUBLIC_DELETE_EXPIRED_PURSE_COMPLETED_BEGIN
          stdout!("completed, expired purses deleted") |
          deployId!({ "status": "completed" })
          // OP_PUBLIC_DELETE_EXPIRED_PURSE_COMPLETED_END
        }
      }
    }
  }
}`;
};

var deleteExpiredPurseTerm = {
	deleteExpiredPurseTerm: deleteExpiredPurseTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var deletePurseTerm_1 = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
    superKey!((
      "DELETE_PURSE",
      { "purseId": "${payload.purseId}" },
      *returnCh
    )) |
    for (@r <- returnCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_DELETE_PURSE_COMPLETED_BEGIN
          stdout!("completed, purse deleted") |
          deployId!({ "status": "completed" })
          // OP_DELETE_PURSE_COMPLETED_END
        }
      }
    }
  }
}
`;
};

var deletePurseTerm = {
	deletePurseTerm: deletePurseTerm_1
};

var readPursesTerm_1 = (payload) => {
  if (payload.pursesIds.length === 0) {
    return `new return in { return!({}) }`;
  }
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
  return `new deployId(\`rho:rchain:deployId\`),
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
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_UPDATE_PURSE_DATA_COMPLETED_BEGIN
          deployId!({ "status": "completed" }) |
          stdout!("completed, data updated")
          // OP_UPDATE_PURSE_DATA_COMPLETED_END
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
  if (payload.pursesIds.length === 0) {
    return `new return in { return!({}) }`;
  }
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
  return `new deployId(\`rho:rchain:deployId\`),
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("UPDATE_PURSE_PRICE", { "contractId": "${payload.contractId}", "price": ${payload.price ? "(" + payload.price + ")": "Nil"}, "purseId": "${payload.purseId}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_UPDATE_PURSE_PRICE_COMPLETED_BEGIN
          deployId!({ "status": "completed" }) |
          stdout!("completed, price updated")
          // OP_UPDATE_PURSE_PRICE_COMPLETED_END
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
  deployId(\`rho:rchain:deployId\`),
  boxCh,
  returnCh,
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    stdout!("boxCh") |
    boxCh!((
      "RENEW",
      {
        "contractId": "${payload.contractId}",
        "purseId": "${payload.purseId}"
      },
      *returnCh
    )) |
    for (@r <- returnCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, Nil) => {
          // OP_RENEW_COMPLETED_BEGIN
          deployId!({ "status": "completed" }) |
          stdout!("completed, renew successful")
          // OP_RENEW_COMPLETED_END
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
var readMasterConfigTerm_1 = (
  payload
) => {
  return `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for (entry <- entryCh) {
    entry!(("PUBLIC_READ_MASTER_CONFIG", *return))
  }
}
`;
};

var readMasterConfigTerm = {
	readMasterConfigTerm: readMasterConfigTerm_1
};

/* GENERATED CODE, only edit rholang/*.rho files*/
var withdrawTerm_1 = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
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
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_WITHDRAW_COMPLETED_BEGIN
          deployId!({ "status": "completed" }) |
          stdout!("completed, withdraw successful")
          // OP_WITHDRAW_COMPLETED_END
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

/* GENERATED CODE, only edit rholang/*.rho files*/
var readLogsTerm_1 = (
  payload
) => {
  return `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new a in {
      entry!(("PUBLIC_READ_LOGS", "${payload.contractId}", *a)) |
      for (@logs <- a) {
        match logs {
          String => {
            return!("")
          }
          (true, logss) => {
            return!(logss)
          }
        }
      }
    }
  }
}`;
};

var readLogsTerm = {
	readLogsTerm: readLogsTerm_1
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

var logs_1 = {
  checkLine: (s) => {
    if (s.startsWith('p')) {
      const split = s.split(',');
      const ts = parseInt(split[1], 10);
      if (typeof ts !== 'number' || ts < 100) {
        throw new Error('Incorrect timestamp 2nd value');
      }
      const toBox = split[2];
      if (typeof toBox !== 'string' || toBox.length === 0) {
        throw new Error('Incorrect toBox 3rd value');
      }
      const fromBox = split[3];
      if (typeof fromBox !== 'string' || fromBox.length === 0) {
        throw new Error('Incorrect fromBox 4th value');
      }
      const quantity = parseInt(split[4], 10);
      if (typeof quantity !== 'number' || isNaN(quantity) || quantity < 1) {
        throw new Error('Incorrect quantity 5th value');
      }
      const price = parseInt(split[5], 10);
      if (typeof price !== 'number' || isNaN(price) || price < 1) {
        throw new Error('Incorrect price 6th value');
      }
      const pursePurchasedFrom = split[6];
      if (
        typeof pursePurchasedFrom !== 'string' ||
        pursePurchasedFrom.length === 0
      ) {
        throw new Error('Incorrect newPurse 6th value');
      }
      const newPurseId = split[7];
      if (typeof newPurseId !== 'string' || newPurseId.length === 0) {
        throw new Error('Incorrect newPurse 7th value');
      }
    } else {
      throw new Error('Unknown operation');
    }
  },
  isPurchaseFromZero: (s) => {
    if (s.startsWith('p')) {
      const split = s.split(',');
      return split[6] === '0';
    } else {
      return false;
    }
  },
  isNFTPurchase: (s) => {
    if (s.startsWith('p')) {
      const split = s.split(',');
      const parsed = parseInt(split[6]);
      return (
        split[6] === '0' ||
        isNaN(parsed) ||
        parsed.toString().length !== split[6].length
      );
    } else {
      return false;
    }
  },
  formatLine: (s) => {
    if (s.startsWith('p')) {
      const split = s.split(',');
      const parsed = parseInt(split[6]);
      let ts = parseInt(split[1], 10);
      ts = new Date(ts).toISOString().slice(0, 16);
      if (
        split[6] === '0' ||
        isNaN(parsed) ||
        parsed.toString().length !== split[6].length
      ) {
        if (split[5] === '0') {
          return ` ${ts} box ${split[2]} minted new NFT ${split[7]} at price ${split[5]}`;
        } else {
          return ` ${ts} box ${split[2]} purchased NFT ${split[7]} from box ${split[3]} at price ${split[5]}`;
        }
      } else {
        return ` ${ts} box ${split[2]} purchased ${split[4]} token${
          split[4] === '1' ? '' : 's'
        } from box ${split[3]} at price ${split[5]}`;
      }
    } else {
      throw new Error('Unknown operation');
    }
  },
};

var logs = {
	logs: logs_1
};

var VERSION = '17.0.6';

var constants = {
	VERSION: VERSION
};

// rholang terms
const { deployBoxTerm: deployBoxTerm$1 } = deployBoxTerm;
const { masterTerm: masterTerm$1 } = masterTerm;
const { swapTerm: swapTerm$2 } = swapTerm;
const { creditAndSwapTerm: creditAndSwapTerm$1 } = creditAndSwapTerm;
const { deployTerm: deployTerm$1 } = deployTerm;
const { createPursesTerm: createPursesTerm$1 } = createPursesTerm;
const { lockTerm: lockTerm$1 } = lockTerm;
const { updateFeeTerm: updateFeeTerm$1 } = updateFeeTerm;
const { deleteExpiredPurseTerm: deleteExpiredPurseTerm$1 } = deleteExpiredPurseTerm;
const { deletePurseTerm: deletePurseTerm$1 } = deletePurseTerm;
const { readPursesTerm: readPursesTerm$1 } = readPursesTerm;
const { readAllPursesTerm: readAllPursesTerm$1 } = readAllPursesTerm;
const { readBoxTerm: readBoxTerm$1 } = readBoxTerm;
const { readConfigTerm: readConfigTerm$1 } = readConfigTerm;
const { updatePurseDataTerm: updatePurseDataTerm$1 } = updatePurseDataTerm;
const { readPursesDataTerm: readPursesDataTerm$1 } = readPursesDataTerm;
const { updatePursePriceTerm: updatePursePriceTerm$1 } = updatePursePriceTerm;
const { renewTerm: renewTerm$1 } = renewTerm;
const { creditTerm: creditTerm$2 } = creditTerm;
const { readMasterConfigTerm: readMasterConfigTerm$1 } = readMasterConfigTerm;
const { withdrawTerm: withdrawTerm$1 } = withdrawTerm;
const { readLogsTerm: readLogsTerm$1 } = readLogsTerm;

// utils
const { decodePurses: decodePurses$1 } = decodePurses;
const { logs: logs$1 } = logs;

const { VERSION: VERSION$1 } = constants;

var src = {
  version: VERSION$1,

  masterTerm: masterTerm$1,
  swapTerm: swapTerm$2,
  deployBoxTerm: deployBoxTerm$1,
  deployTerm: deployTerm$1,
  creditAndSwapTerm: creditAndSwapTerm$1,
  createPursesTerm: createPursesTerm$1,
  lockTerm: lockTerm$1,
  updateFeeTerm: updateFeeTerm$1,
  deletePurseTerm: deletePurseTerm$1,
  deleteExpiredPurseTerm: deleteExpiredPurseTerm$1,
  updatePurseDataTerm: updatePurseDataTerm$1,
  updatePursePriceTerm: updatePursePriceTerm$1,
  renewTerm: renewTerm$1,
  creditTerm: creditTerm$2,
  withdrawTerm: withdrawTerm$1,

  readMasterConfigTerm: readMasterConfigTerm$1,
  readPursesTerm: readPursesTerm$1,
  readAllPursesTerm: readAllPursesTerm$1,
  readBoxTerm: readBoxTerm$1,
  readLogsTerm: readLogsTerm$1,
  readConfigTerm: readConfigTerm$1,
  readPursesDataTerm: readPursesDataTerm$1,

  // utils
  decodePurses: decodePurses$1,
  logs: logs$1,
};
var src_23 = src.readPursesDataTerm;

var getHtmlFromFile = function (dappyFile) {
    return atob(dappyFile.data);
};

var getHtmlError = function (title, error) {
    return "\n  <html>\n    <head>\n      <style>\n      .fc {display:flex;justify-content:center;align-items:center;}\n      </style>\n    </head>\n    <body class=\"fc\">\n      <div style=\"border-radius:4px;width: 400px;height:200px;border:2px solid #666;padding: 2rem;\">\n      <h3 style=\"font-size: 2rem;\">".concat(title || 'Error', "</h3>\n      <p style=\"font-size: 1.4rem;\">").concat(error || 'Unknown error', "</p>\n      </div>\n    </body>\n  </html>");
};

var name = "elliptic";
var version = "6.5.4";
var description = "EC cryptography";
var main = "lib/elliptic.js";
var files = [
	"lib"
];
var scripts = {
	lint: "eslint lib test",
	"lint:fix": "npm run lint -- --fix",
	unit: "istanbul test _mocha --reporter=spec test/index.js",
	test: "npm run lint && npm run unit",
	version: "grunt dist && git add dist/"
};
var repository = {
	type: "git",
	url: "git@github.com:indutny/elliptic"
};
var keywords = [
	"EC",
	"Elliptic",
	"curve",
	"Cryptography"
];
var author = "Fedor Indutny <fedor@indutny.com>";
var license = "MIT";
var bugs = {
	url: "https://github.com/indutny/elliptic/issues"
};
var homepage = "https://github.com/indutny/elliptic";
var devDependencies = {
	brfs: "^2.0.2",
	coveralls: "^3.1.0",
	eslint: "^7.6.0",
	grunt: "^1.2.1",
	"grunt-browserify": "^5.3.0",
	"grunt-cli": "^1.3.2",
	"grunt-contrib-connect": "^3.0.0",
	"grunt-contrib-copy": "^1.0.0",
	"grunt-contrib-uglify": "^5.0.0",
	"grunt-mocha-istanbul": "^5.0.2",
	"grunt-saucelabs": "^9.0.1",
	istanbul: "^0.4.5",
	mocha: "^8.0.1"
};
var dependencies = {
	"bn.js": "^4.11.9",
	brorand: "^1.1.0",
	"hash.js": "^1.0.0",
	"hmac-drbg": "^1.0.1",
	inherits: "^2.0.4",
	"minimalistic-assert": "^1.0.1",
	"minimalistic-crypto-utils": "^1.0.1"
};
var _package = {
	name: name,
	version: version,
	description: description,
	main: main,
	files: files,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	dependencies: dependencies
};

var _package$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name,
  version: version,
  description: description,
  main: main,
  files: files,
  scripts: scripts,
  repository: repository,
  keywords: keywords,
  author: author,
  license: license,
  bugs: bugs,
  homepage: homepage,
  devDependencies: devDependencies,
  dependencies: dependencies,
  'default': _package
});

var byteLength_1 = byteLength;
var toByteArray_1 = toByteArray;
var fromByteArray_1 = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens (b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4);

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen;

  var i;
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = (tmp >> 16) & 0xFF;
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    );
  }

  return parts.join('')
}

var base64Js = {
	byteLength: byteLength_1,
	toByteArray: toByteArray_1,
	fromByteArray: fromByteArray_1
};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = (nBytes * 8) - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
};

var write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = (nBytes * 8) - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

var ieee754 = {
	read: read,
	write: write
};

var toString = {}.toString;

var isarray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var buffer = createCommonjsModule(function (module, exports) {





exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = commonjsGlobal.TYPED_ARRAY_SUPPORT !== undefined
  ? commonjsGlobal.TYPED_ARRAY_SUPPORT
  : typedArraySupport();

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength();

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }};
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isarray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
};

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isarray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64Js.fromByteArray(buf)
  } else {
    return base64Js.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64Js.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}
});
var buffer_1 = buffer.Buffer;
var buffer_2 = buffer.SlowBuffer;
var buffer_3 = buffer.INSPECT_MAX_BYTES;
var buffer_4 = buffer.kMaxLength;

var bn = createCommonjsModule(function (module) {
(function (module, exports) {

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {
      Buffer = window.Buffer;
    } else {
      Buffer = buffer.Buffer;
    }
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
      this.negative = 1;
    }

    if (start < number.length) {
      if (base === 16) {
        this._parseHex(number, start, endian);
      } else {
        this._parseBase(number, base, start);
        if (endian === 'le') {
          this._initArray(this.toArray(), base, endian);
        }
      }
    }
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [ 0 ];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this.strip();
  };

  function parseHex4Bits (string, index) {
    var c = string.charCodeAt(index);
    // 'A' - 'F'
    if (c >= 65 && c <= 70) {
      return c - 55;
    // 'a' - 'f'
    } else if (c >= 97 && c <= 102) {
      return c - 87;
    // '0' - '9'
    } else {
      return (c - 48) & 0xf;
    }
  }

  function parseHexByte (string, lowerBound, index) {
    var r = parseHex4Bits(string, index);
    if (index - 1 >= lowerBound) {
      r |= parseHex4Bits(string, index - 1) << 4;
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start, endian) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    // 24-bits chunks
    var off = 0;
    var j = 0;

    var w;
    if (endian === 'be') {
      for (i = number.length - 1; i >= start; i -= 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    } else {
      var parseLength = number.length - start;
      for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    }

    this.strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        r += c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        r += c - 17 + 0xa;

      // '0' - '9'
      } else {
        r += c;
      }
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [ 0 ];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    this.strip();
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype.strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  BN.prototype.inspect = function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16);
  };

  BN.prototype.toBuffer = function toBuffer (endian, length) {
    assert(typeof Buffer !== 'undefined');
    return this.toArrayLike(Buffer, endian, length);
  };

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    this.strip();
    var littleEndian = endian === 'le';
    var res = new ArrayType(reqLength);

    var b, i;
    var q = this.clone();
    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this.strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this.strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this.strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this.strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this.strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this.strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out.strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out.strip();
  }

  function jumboMulTo (self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out.strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this.strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) ; else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this.strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this.strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this.strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this.strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this.strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q.strip();
    }
    a.strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modn = function modn (num) {
    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return acc;
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    return this.strip();
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this.strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      if (r.strip !== undefined) {
        // r is BN v4 instance
        r.strip();
      } else {
        // r is BN v5 instance
        r._strip();
      }
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
    return a.umod(this.m)._forceRed(this);
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})( module, commonjsGlobal);
});

var minimalisticAssert = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};

var utils_1 = createCommonjsModule(function (module, exports) {

var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};
});

var utils_1$1 = createCommonjsModule(function (module, exports) {

var utils = exports;




utils.assert = minimalisticAssert;
utils.toArray = utils_1.toArray;
utils.zero2 = utils_1.zero2;
utils.toHex = utils_1.toHex;
utils.encode = utils_1.encode;

// Represent num in a w-NAF form
function getNAF(num, w, bits) {
  var naf = new Array(Math.max(num.bitLength(), bits) + 1);
  naf.fill(0);

  var ws = 1 << (w + 1);
  var k = num.clone();

  for (var i = 0; i < naf.length; i++) {
    var z;
    var mod = k.andln(ws - 1);
    if (k.isOdd()) {
      if (mod > (ws >> 1) - 1)
        z = (ws >> 1) - mod;
      else
        z = mod;
      k.isubn(z);
    } else {
      z = 0;
    }

    naf[i] = z;
    k.iushrn(1);
  }

  return naf;
}
utils.getNAF = getNAF;

// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
  var jsf = [
    [],
    [],
  ];

  k1 = k1.clone();
  k2 = k2.clone();
  var d1 = 0;
  var d2 = 0;
  var m8;
  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
    // First phase
    var m14 = (k1.andln(3) + d1) & 3;
    var m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3)
      m14 = -1;
    if (m24 === 3)
      m24 = -1;
    var u1;
    if ((m14 & 1) === 0) {
      u1 = 0;
    } else {
      m8 = (k1.andln(7) + d1) & 7;
      if ((m8 === 3 || m8 === 5) && m24 === 2)
        u1 = -m14;
      else
        u1 = m14;
    }
    jsf[0].push(u1);

    var u2;
    if ((m24 & 1) === 0) {
      u2 = 0;
    } else {
      m8 = (k2.andln(7) + d2) & 7;
      if ((m8 === 3 || m8 === 5) && m14 === 2)
        u2 = -m24;
      else
        u2 = m24;
    }
    jsf[1].push(u2);

    // Second phase
    if (2 * d1 === u1 + 1)
      d1 = 1 - d1;
    if (2 * d2 === u2 + 1)
      d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function cachedProperty() {
    return this[key] !== undefined ? this[key] :
      this[key] = computer.call(this);
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
    bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new bn(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;
});

var r;

var brorand = function rand(len) {
  if (!r)
    r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
var Rand_1 = Rand;

Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
  if (this.rand.getBytes)
    return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++)
    res[i] = this.rand.getByte();
  return res;
};

if (typeof self === 'object') {
  if (self.crypto && self.crypto.getRandomValues) {
    // Modern browsers
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    // IE
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };

  // Safari's WebWorkers do not have `crypto`
  } else if (typeof window === 'object') {
    // Old junk
    Rand.prototype._rand = function() {
      throw new Error('Not implemented yet');
    };
  }
} else {
  // Node.js or Web worker with no crypto support
  try {
    var crypto = crypto$1;
    if (typeof crypto.randomBytes !== 'function')
      throw new Error('Not supported');

    Rand.prototype._rand = function _rand(n) {
      return crypto.randomBytes(n);
    };
  } catch (e) {
  }
}
brorand.Rand = Rand_1;

var getNAF = utils_1$1.getNAF;
var getJSF = utils_1$1.getJSF;
var assert$1 = utils_1$1.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new bn(conf.p, 16);

  // Use Montgomery, when there is no fast reduction for the prime
  this.red = conf.prime ? bn.red(conf.prime) : bn.mont(this.p);

  // Useful for many curves
  this.zero = new bn(0).toRed(this.red);
  this.one = new bn(1).toRed(this.red);
  this.two = new bn(2).toRed(this.red);

  // Curve configuration, optional
  this.n = conf.n && new bn(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  // Temporary arrays
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  this._bitLength = this.n ? this.n.bitLength() : 0;

  // Generalized Greg Maxwell's trick
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
var base = BaseCurve;

BaseCurve.prototype.point = function point() {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function validate() {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
  assert$1(p.precomputed);
  var doubles = p._getDoubles();

  var naf = getNAF(k, 1, this._bitLength);
  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
  I /= 3;

  // Translate into more windowed form
  var repr = [];
  var j;
  var nafW;
  for (j = 0; j < naf.length; j += doubles.step) {
    nafW = 0;
    for (var l = j + doubles.step - 1; l >= j; l--)
      nafW = (nafW << 1) + naf[l];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  var b = this.jpoint(null, null, null);
  for (var i = I; i > 0; i--) {
    for (j = 0; j < repr.length; j++) {
      nafW = repr[j];
      if (nafW === i)
        b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i)
        b = b.mixedAdd(doubles.points[j].neg());
    }
    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
  var w = 4;

  // Precompute window
  var nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points;

  // Get NAF form
  var naf = getNAF(k, w, this._bitLength);

  // Add `this`*(N+1) for every w-NAF index
  var acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    // Count zeroes
    for (var l = 0; i >= 0 && naf[i] === 0; i--)
      l++;
    if (i >= 0)
      l++;
    acc = acc.dblp(l);

    if (i < 0)
      break;
    var z = naf[i];
    assert$1(z !== 0);
    if (p.type === 'affine') {
      // J +- P
      if (z > 0)
        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
      else
        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
    } else {
      // J +- J
      if (z > 0)
        acc = acc.add(wnd[(z - 1) >> 1]);
      else
        acc = acc.add(wnd[(-z - 1) >> 1].neg());
    }
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
  points,
  coeffs,
  len,
  jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;

  // Fill all arrays
  var max = 0;
  var i;
  var j;
  var p;
  for (i = 0; i < len; i++) {
    p = points[i];
    var nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  // Comb small window NAFs
  for (i = len - 1; i >= 1; i -= 2) {
    var a = i - 1;
    var b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
      naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [
      points[a], /* 1 */
      null, /* 3 */
      null, /* 5 */
      points[b], /* 7 */
    ];

    // Try to avoid Projective points, if possible
    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [
      -3, /* -1 -1 */
      -1, /* -1 0 */
      -5, /* -1 1 */
      -7, /* 0 -1 */
      0, /* 0 0 */
      7, /* 0 1 */
      5, /* 1 -1 */
      1, /* 1 0 */
      3,  /* 1 1 */
    ];

    var jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0;
      var jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k++;
      i--;
    }
    if (i >= 0)
      k++;
    acc = acc.dblp(k);
    if (i < 0)
      break;

    for (j = 0; j < len; j++) {
      var z = tmp[j];
      if (z === 0)
        continue;
      else if (z > 0)
        p = wnd[j][(z - 1) >> 1];
      else if (z < 0)
        p = wnd[j][(-z - 1) >> 1].neg();

      if (p.type === 'affine')
        acc = acc.mixedAdd(p);
      else
        acc = acc.add(p);
    }
  }
  // Zeroify references
  for (i = 0; i < len; i++)
    wnd[i] = null;

  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function eq(/*other*/) {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function validate() {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils_1$1.toArray(bytes, enc);

  var len = this.p.byteLength();

  // uncompressed, hybrid-odd, hybrid-even
  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 === 2 * len) {
    if (bytes[0] === 0x06)
      assert$1(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 0x07)
      assert$1(bytes[bytes.length - 1] % 2 === 1);

    var res =  this.point(bytes.slice(1, 1 + len),
      bytes.slice(1 + len, 1 + 2 * len));

    return res;
  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
              bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
  }
  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x = this.getX().toArray('be', len);

  if (compact)
    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

  return [ 0x04 ].concat(x, this.getY().toArray('be', len));
};

BasePoint.prototype.encode = function encode(enc, compact) {
  return utils_1$1.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;

  var precomputed = {
    doubles: null,
    naf: null,
    beta: null,
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
  if (!this.precomputed)
    return false;

  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;

  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;

  var doubles = [ this ];
  var acc = this;
  for (var i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step: step,
    points: doubles,
  };
};

BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;

  var res = [ this ];
  var max = (1 << wnd) - 1;
  var dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++)
    res[i] = res[i - 1].add(dbl);
  return {
    wnd: wnd,
    points: res,
  };
};

BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};

BasePoint.prototype.dblp = function dblp(k) {
  var r = this;
  for (var i = 0; i < k; i++)
    r = r.dbl();
  return r;
};

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
});

var inherits = createCommonjsModule(function (module) {
try {
  var util$1 = util;
  /* istanbul ignore next */
  if (typeof util$1.inherits !== 'function') throw '';
  module.exports = util$1.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = inherits_browser;
}
});

var assert$2 = utils_1$1.assert;

function ShortCurve(conf) {
  base.call(this, 'short', conf);

  this.a = new bn(conf.a, 16).toRed(this.red);
  this.b = new bn(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  // If the curve is endomorphic, precalculate beta and lambda
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits(ShortCurve, base);
var short_1 = ShortCurve;

ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  // No efficient endomorphism
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;

  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new bn(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    // Choose the smallest beta
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new bn(conf.lambda, 16);
  } else {
    // Choose the lambda that is matching selected beta
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert$2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  // Get basis vectors, used for balanced length-two representation
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new bn(vec.a, 16),
        b: new bn(vec.b, 16),
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }

  return {
    beta: beta,
    lambda: lambda,
    basis: basis,
  };
};

ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  // Find roots of for x^2 + x + 1 in F
  // Root = (-1 +- Sqrt(-3)) / 2
  //
  var red = num === this.p ? this.red : bn.mont(num);
  var tinv = new bn(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();

  var s = new bn(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  var l1 = ntinv.redAdd(s).fromRed();
  var l2 = ntinv.redSub(s).fromRed();
  return [ l1, l2 ];
};

ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  // aprxSqrt >= sqrt(this.n)
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

  // 3.74
  // Run EGCD, until r(L + 1) < aprxSqrt
  var u = lambda;
  var v = this.n.clone();
  var x1 = new bn(1);
  var y1 = new bn(0);
  var x2 = new bn(0);
  var y2 = new bn(1);

  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
  var a0;
  var b0;
  // First vector
  var a1;
  var b1;
  // Second vector
  var a2;
  var b2;

  var prevR;
  var i = 0;
  var r;
  var x;
  while (u.cmpn(0) !== 0) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i === 2) {
      break;
    }
    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a2.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  // Normalize signs
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 },
  ];
};

ShortCurve.prototype._endoSplit = function _endoSplit(k) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v2 = basis[1];

  var c1 = v2.b.mul(k).divRound(this.n);
  var c2 = v1.b.neg().mul(k).divRound(this.n);

  var p1 = c1.mul(v1.a);
  var p2 = c2.mul(v2.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v2.b);

  // Calculate answer
  var k1 = k.sub(p1).sub(p2);
  var k2 = q1.add(q2).neg();
  return { k1: k1, k2: k2 };
};

ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new bn(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  // XXX Is there any way to tell if the number is odd without converting it
  // to non-red form?
  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function validate(point) {
  if (point.inf)
    return true;

  var x = point.x;
  var y = point.y;

  var ax = this.a.redMul(x);
  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd =
    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
      var npoints = this._endoWnafT1;
      var ncoeffs = this._endoWnafT2;
      for (var i = 0; i < points.length; i++) {
        var split = this._endoSplit(coeffs[i]);
        var p = points[i];
        var beta = p._getBeta();

        if (split.k1.negative) {
          split.k1.ineg();
          p = p.neg(true);
        }
        if (split.k2.negative) {
          split.k2.ineg();
          beta = beta.neg(true);
        }

        npoints[i * 2] = p;
        npoints[i * 2 + 1] = beta;
        ncoeffs[i * 2] = split.k1;
        ncoeffs[i * 2 + 1] = split.k2;
      }
      var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

      // Clean-up references to points and coefficients
      for (var j = 0; j < i * 2; j++) {
        npoints[j] = null;
        ncoeffs[j] = null;
      }
      return res;
    };

function Point(curve, x, y, isRed) {
  base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new bn(x, 16);
    this.y = new bn(y, 16);
    // Force redgomery representation when loading from JSON
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits(Point, base.BasePoint);

ShortCurve.prototype.point = function point(x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function _getBeta() {
  if (!this.curve.endo)
    return;

  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function(p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul),
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul),
      },
    };
  }
  return beta;
};

Point.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [ this.x, this.y ];

  return [ this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1),
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1),
    },
  } ];
};

Point.fromJSON = function fromJSON(curve, obj, red) {
  if (typeof obj === 'string')
    obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [ res ].concat(pre.doubles.points.map(obj2point)),
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [ res ].concat(pre.naf.points.map(obj2point)),
    },
  };
  return res;
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  return this.inf;
};

Point.prototype.add = function add(p) {
  // O + P = P
  if (this.inf)
    return p;

  // P + O = P
  if (p.inf)
    return this;

  // P + P = 2P
  if (this.eq(p))
    return this.dbl();

  // P + (-P) = O
  if (this.neg().eq(p))
    return this.curve.point(null, null);

  // P + Q = O
  if (this.x.cmp(p.x) === 0)
    return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0)
    c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x);
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function dbl() {
  if (this.inf)
    return this;

  // 2P = O
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);

  var a = this.curve.a;

  var x2 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function getX() {
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  return this.y.fromRed();
};

Point.prototype.mul = function mul(k) {
  k = new bn(k, 16);
  if (this.isInfinity())
    return this;
  else if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([ this ], [ k ]);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function eq(p) {
  return this === p ||
         this.inf === p.inf &&
             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
};

Point.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate),
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate),
      },
    };
  }
  return res;
};

Point.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);

  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};

function JPoint(curve, x, y, z) {
  base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new bn(0);
  } else {
    this.x = new bn(x, 16);
    this.y = new bn(y, 16);
    this.z = new bn(z, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);

  this.zOne = this.z === this.curve.one;
}
inherits(JPoint, base.BasePoint);

ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);

  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function neg() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function add(p) {
  // O + P = P
  if (this.isInfinity())
    return p;

  // P + O = P
  if (p.isInfinity())
    return this;

  // 12M + 4S + 7A
  var pz2 = p.z.redSqr();
  var z2 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u2 = p.x.redMul(z2);
  var s1 = this.y.redMul(pz2.redMul(p.z));
  var s2 = p.y.redMul(z2.redMul(this.z));

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function mixedAdd(p) {
  // O + P = P
  if (this.isInfinity())
    return p.toJ();

  // P + O = P
  if (p.isInfinity())
    return this;

  // 8M + 3S + 7A
  var z2 = this.z.redSqr();
  var u1 = this.x;
  var u2 = p.x.redMul(z2);
  var s1 = this.y;
  var s2 = p.y.redMul(z2).redMul(this.z);

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function dblp(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();

  var i;
  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (i = 0; i < pow; i++)
      r = r.dbl();
    return r;
  }

  // 1M + 2S + 1A + N * (4S + 5M + 8A)
  // N = 1 => 6M + 6S + 9A
  var a = this.curve.a;
  var tinv = this.curve.tinv;

  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  // Reuse results
  var jyd = jy.redAdd(jy);
  for (i = 0; i < pow; i++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var t1 = jx.redMul(jyd2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow)
      jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};

JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 14A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s);

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);

    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-dbl-2009-l
    // 2M + 5S + 13A

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = B^2
    var c = b.redSqr();
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a);
    // F = E^2
    var f = e.redSqr();

    // 8 * C
    var c8 = c.redIAdd(c);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d);
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 15A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    // T = M^2 - 2 * S
    var t = m.redSqr().redISub(s).redISub(s);
    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2 * Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
    // 3M + 5S

    // delta = Z1^2
    var delta = this.z.redSqr();
    // gamma = Y1^2
    var gamma = this.y.redSqr();
    // beta = X1 * gamma
    var beta = this.x.redMul(gamma);
    // alpha = 3 * (X1 - delta) * (X1 + delta)
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    // X3 = alpha^2 - 8 * beta
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    // Z3 = (Y1 + Z1)^2 - gamma - delta
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function _dbl() {
  var a = this.curve.a;

  // 4M + 6S + 10A
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();

  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);

  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);

  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
  // 5M + 10S + ...

  // XX = X1^2
  var xx = this.x.redSqr();
  // YY = Y1^2
  var yy = this.y.redSqr();
  // ZZ = Z1^2
  var zz = this.z.redSqr();
  // YYYY = YY^2
  var yyyy = yy.redSqr();
  // M = 3 * XX + a * ZZ2; a = 0
  var m = xx.redAdd(xx).redIAdd(xx);
  // MM = M^2
  var mm = m.redSqr();
  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  // EE = E^2
  var ee = e.redSqr();
  // T = 16*YYYY
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  // U = (M + E)^2 - MM - EE - T
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
  // X3 = 4 * (X1 * EE - 4 * YY * U)
  var yyu4 = yy.redMul(u);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  // Z3 = (Z1 + E)^2 - ZZ - EE
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function mul(k, kbase) {
  k = new bn(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function eq(p) {
  if (p.type === 'affine')
    return this.eq(p.toJ());

  if (this === p)
    return true;

  // x1 * z2^2 == x2 * z1^2
  var z2 = this.z.redSqr();
  var pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
    return false;

  // y1 * z2^3 == y2 * z1^3
  var z3 = z2.redMul(this.z);
  var pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function eqXToP(x) {
  var zs = this.z.redSqr();
  var rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(zs);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};

JPoint.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC JPoint Infinity>';
  return '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

function MontCurve(conf) {
  base.call(this, 'mont', conf);

  this.a = new bn(conf.a, 16).toRed(this.red);
  this.b = new bn(conf.b, 16).toRed(this.red);
  this.i4 = new bn(4).toRed(this.red).redInvm();
  this.two = new bn(2).toRed(this.red);
  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
inherits(MontCurve, base);
var mont = MontCurve;

MontCurve.prototype.validate = function validate(point) {
  var x = point.normalize().x;
  var x2 = x.redSqr();
  var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
  var y = rhs.redSqrt();

  return y.redSqr().cmp(rhs) === 0;
};

function Point$1(curve, x, z) {
  base.BasePoint.call(this, curve, 'projective');
  if (x === null && z === null) {
    this.x = this.curve.one;
    this.z = this.curve.zero;
  } else {
    this.x = new bn(x, 16);
    this.z = new bn(z, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
  }
}
inherits(Point$1, base.BasePoint);

MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  return this.point(utils_1$1.toArray(bytes, enc), 1);
};

MontCurve.prototype.point = function point(x, z) {
  return new Point$1(this, x, z);
};

MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point$1.fromJSON(this, obj);
};

Point$1.prototype.precompute = function precompute() {
  // No-op
};

Point$1.prototype._encode = function _encode() {
  return this.getX().toArray('be', this.curve.p.byteLength());
};

Point$1.fromJSON = function fromJSON(curve, obj) {
  return new Point$1(curve, obj[0], obj[1] || curve.one);
};

Point$1.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point$1.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

Point$1.prototype.dbl = function dbl() {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
  // 2M + 2S + 4A

  // A = X1 + Z1
  var a = this.x.redAdd(this.z);
  // AA = A^2
  var aa = a.redSqr();
  // B = X1 - Z1
  var b = this.x.redSub(this.z);
  // BB = B^2
  var bb = b.redSqr();
  // C = AA - BB
  var c = aa.redSub(bb);
  // X3 = AA * BB
  var nx = aa.redMul(bb);
  // Z3 = C * (BB + A24 * C)
  var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
  return this.curve.point(nx, nz);
};

Point$1.prototype.add = function add() {
  throw new Error('Not supported on Montgomery curve');
};

Point$1.prototype.diffAdd = function diffAdd(p, diff) {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
  // 4M + 2S + 6A

  // A = X2 + Z2
  var a = this.x.redAdd(this.z);
  // B = X2 - Z2
  var b = this.x.redSub(this.z);
  // C = X3 + Z3
  var c = p.x.redAdd(p.z);
  // D = X3 - Z3
  var d = p.x.redSub(p.z);
  // DA = D * A
  var da = d.redMul(a);
  // CB = C * B
  var cb = c.redMul(b);
  // X5 = Z1 * (DA + CB)^2
  var nx = diff.z.redMul(da.redAdd(cb).redSqr());
  // Z5 = X1 * (DA - CB)^2
  var nz = diff.x.redMul(da.redISub(cb).redSqr());
  return this.curve.point(nx, nz);
};

Point$1.prototype.mul = function mul(k) {
  var t = k.clone();
  var a = this; // (N / 2) * Q + Q
  var b = this.curve.point(null, null); // (N / 2) * Q
  var c = this; // Q

  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
    bits.push(t.andln(1));

  for (var i = bits.length - 1; i >= 0; i--) {
    if (bits[i] === 0) {
      // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
      a = a.diffAdd(b, c);
      // N * Q = 2 * ((N / 2) * Q + Q))
      b = b.dbl();
    } else {
      // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
      b = a.diffAdd(b, c);
      // N * Q + Q = 2 * ((N / 2) * Q + Q)
      a = a.dbl();
    }
  }
  return b;
};

Point$1.prototype.mulAdd = function mulAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point$1.prototype.jumlAdd = function jumlAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point$1.prototype.eq = function eq(other) {
  return this.getX().cmp(other.getX()) === 0;
};

Point$1.prototype.normalize = function normalize() {
  this.x = this.x.redMul(this.z.redInvm());
  this.z = this.curve.one;
  return this;
};

Point$1.prototype.getX = function getX() {
  // Normalize coordinates
  this.normalize();

  return this.x.fromRed();
};

var assert$3 = utils_1$1.assert;

function EdwardsCurve(conf) {
  // NOTE: Important as we are creating point in Base.call()
  this.twisted = (conf.a | 0) !== 1;
  this.mOneA = this.twisted && (conf.a | 0) === -1;
  this.extended = this.mOneA;

  base.call(this, 'edwards', conf);

  this.a = new bn(conf.a, 16).umod(this.red.m);
  this.a = this.a.toRed(this.red);
  this.c = new bn(conf.c, 16).toRed(this.red);
  this.c2 = this.c.redSqr();
  this.d = new bn(conf.d, 16).toRed(this.red);
  this.dd = this.d.redAdd(this.d);

  assert$3(!this.twisted || this.c.fromRed().cmpn(1) === 0);
  this.oneC = (conf.c | 0) === 1;
}
inherits(EdwardsCurve, base);
var edwards = EdwardsCurve;

EdwardsCurve.prototype._mulA = function _mulA(num) {
  if (this.mOneA)
    return num.redNeg();
  else
    return this.a.redMul(num);
};

EdwardsCurve.prototype._mulC = function _mulC(num) {
  if (this.oneC)
    return num;
  else
    return this.c.redMul(num);
};

// Just for compatibility with Short curve
EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
  return this.point(x, y, z, t);
};

EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new bn(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var x2 = x.redSqr();
  var rhs = this.c2.redSub(this.a.redMul(x2));
  var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

  var y2 = rhs.redMul(lhs.redInvm());
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
  y = new bn(y, 16);
  if (!y.red)
    y = y.toRed(this.red);

  // x^2 = (y^2 - c^2) / (c^2 d y^2 - a)
  var y2 = y.redSqr();
  var lhs = y2.redSub(this.c2);
  var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
  var x2 = lhs.redMul(rhs.redInvm());

  if (x2.cmp(this.zero) === 0) {
    if (odd)
      throw new Error('invalid point');
    else
      return this.point(this.zero, y);
  }

  var x = x2.redSqrt();
  if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  if (x.fromRed().isOdd() !== odd)
    x = x.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.validate = function validate(point) {
  if (point.isInfinity())
    return true;

  // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
  point.normalize();

  var x2 = point.x.redSqr();
  var y2 = point.y.redSqr();
  var lhs = x2.redMul(this.a).redAdd(y2);
  var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

  return lhs.cmp(rhs) === 0;
};

function Point$2(curve, x, y, z, t) {
  base.BasePoint.call(this, curve, 'projective');
  if (x === null && y === null && z === null) {
    this.x = this.curve.zero;
    this.y = this.curve.one;
    this.z = this.curve.one;
    this.t = this.curve.zero;
    this.zOne = true;
  } else {
    this.x = new bn(x, 16);
    this.y = new bn(y, 16);
    this.z = z ? new bn(z, 16) : this.curve.one;
    this.t = t && new bn(t, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
    if (this.t && !this.t.red)
      this.t = this.t.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;

    // Use extended coordinates
    if (this.curve.extended && !this.t) {
      this.t = this.x.redMul(this.y);
      if (!this.zOne)
        this.t = this.t.redMul(this.z.redInvm());
    }
  }
}
inherits(Point$2, base.BasePoint);

EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point$2.fromJSON(this, obj);
};

EdwardsCurve.prototype.point = function point(x, y, z, t) {
  return new Point$2(this, x, y, z, t);
};

Point$2.fromJSON = function fromJSON(curve, obj) {
  return new Point$2(curve, obj[0], obj[1], obj[2]);
};

Point$2.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point$2.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.x.cmpn(0) === 0 &&
    (this.y.cmp(this.z) === 0 ||
    (this.zOne && this.y.cmp(this.curve.c) === 0));
};

Point$2.prototype._extDbl = function _extDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #doubling-dbl-2008-hwcd
  // 4M + 4S

  // A = X1^2
  var a = this.x.redSqr();
  // B = Y1^2
  var b = this.y.redSqr();
  // C = 2 * Z1^2
  var c = this.z.redSqr();
  c = c.redIAdd(c);
  // D = a * A
  var d = this.curve._mulA(a);
  // E = (X1 + Y1)^2 - A - B
  var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
  // G = D + B
  var g = d.redAdd(b);
  // F = G - C
  var f = g.redSub(c);
  // H = D - B
  var h = d.redSub(b);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point$2.prototype._projDbl = function _projDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #doubling-dbl-2008-bbjlp
  //     #doubling-dbl-2007-bl
  // and others
  // Generally 3M + 4S or 2M + 4S

  // B = (X1 + Y1)^2
  var b = this.x.redAdd(this.y).redSqr();
  // C = X1^2
  var c = this.x.redSqr();
  // D = Y1^2
  var d = this.y.redSqr();

  var nx;
  var ny;
  var nz;
  var e;
  var h;
  var j;
  if (this.curve.twisted) {
    // E = a * C
    e = this.curve._mulA(c);
    // F = E + D
    var f = e.redAdd(d);
    if (this.zOne) {
      // X3 = (B - C - D) * (F - 2)
      nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F^2 - 2 * F
      nz = f.redSqr().redSub(f).redSub(f);
    } else {
      // H = Z1^2
      h = this.z.redSqr();
      // J = F - 2 * H
      j = f.redSub(h).redISub(h);
      // X3 = (B-C-D)*J
      nx = b.redSub(c).redISub(d).redMul(j);
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F * J
      nz = f.redMul(j);
    }
  } else {
    // E = C + D
    e = c.redAdd(d);
    // H = (c * Z1)^2
    h = this.curve._mulC(this.z).redSqr();
    // J = E - 2 * H
    j = e.redSub(h).redSub(h);
    // X3 = c * (B - E) * J
    nx = this.curve._mulC(b.redISub(e)).redMul(j);
    // Y3 = c * E * (C - D)
    ny = this.curve._mulC(e).redMul(c.redISub(d));
    // Z3 = E * J
    nz = e.redMul(j);
  }
  return this.curve.point(nx, ny, nz);
};

Point$2.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  // Double in extended coordinates
  if (this.curve.extended)
    return this._extDbl();
  else
    return this._projDbl();
};

Point$2.prototype._extAdd = function _extAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #addition-add-2008-hwcd-3
  // 8M

  // A = (Y1 - X1) * (Y2 - X2)
  var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
  // B = (Y1 + X1) * (Y2 + X2)
  var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
  // C = T1 * k * T2
  var c = this.t.redMul(this.curve.dd).redMul(p.t);
  // D = Z1 * 2 * Z2
  var d = this.z.redMul(p.z.redAdd(p.z));
  // E = B - A
  var e = b.redSub(a);
  // F = D - C
  var f = d.redSub(c);
  // G = D + C
  var g = d.redAdd(c);
  // H = B + A
  var h = b.redAdd(a);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point$2.prototype._projAdd = function _projAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #addition-add-2008-bbjlp
  //     #addition-add-2007-bl
  // 10M + 1S

  // A = Z1 * Z2
  var a = this.z.redMul(p.z);
  // B = A^2
  var b = a.redSqr();
  // C = X1 * X2
  var c = this.x.redMul(p.x);
  // D = Y1 * Y2
  var d = this.y.redMul(p.y);
  // E = d * C * D
  var e = this.curve.d.redMul(c).redMul(d);
  // F = B - E
  var f = b.redSub(e);
  // G = B + E
  var g = b.redAdd(e);
  // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
  var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
  var nx = a.redMul(f).redMul(tmp);
  var ny;
  var nz;
  if (this.curve.twisted) {
    // Y3 = A * G * (D - a * C)
    ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
    // Z3 = F * G
    nz = f.redMul(g);
  } else {
    // Y3 = A * G * (D - C)
    ny = a.redMul(g).redMul(d.redSub(c));
    // Z3 = c * F * G
    nz = this.curve._mulC(f).redMul(g);
  }
  return this.curve.point(nx, ny, nz);
};

Point$2.prototype.add = function add(p) {
  if (this.isInfinity())
    return p;
  if (p.isInfinity())
    return this;

  if (this.curve.extended)
    return this._extAdd(p);
  else
    return this._projAdd(p);
};

Point$2.prototype.mul = function mul(k) {
  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else
    return this.curve._wnafMul(this, k);
};

Point$2.prototype.mulAdd = function mulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
};

Point$2.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
};

Point$2.prototype.normalize = function normalize() {
  if (this.zOne)
    return this;

  // Normalize coordinates
  var zi = this.z.redInvm();
  this.x = this.x.redMul(zi);
  this.y = this.y.redMul(zi);
  if (this.t)
    this.t = this.t.redMul(zi);
  this.z = this.curve.one;
  this.zOne = true;
  return this;
};

Point$2.prototype.neg = function neg() {
  return this.curve.point(this.x.redNeg(),
    this.y,
    this.z,
    this.t && this.t.redNeg());
};

Point$2.prototype.getX = function getX() {
  this.normalize();
  return this.x.fromRed();
};

Point$2.prototype.getY = function getY() {
  this.normalize();
  return this.y.fromRed();
};

Point$2.prototype.eq = function eq(other) {
  return this === other ||
         this.getX().cmp(other.getX()) === 0 &&
         this.getY().cmp(other.getY()) === 0;
};

Point$2.prototype.eqXToP = function eqXToP(x) {
  var rx = x.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(this.z);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};

// Compatibility with BaseCurve
Point$2.prototype.toP = Point$2.prototype.normalize;
Point$2.prototype.mixedAdd = Point$2.prototype.add;

var curve_1 = createCommonjsModule(function (module, exports) {

var curve = exports;

curve.base = base;
curve.short = short_1;
curve.mont = mont;
curve.edwards = edwards;
});

var inherits_1 = inherits;

function isSurrogatePair(msg, i) {
  if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
    return false;
  }
  if (i < 0 || i + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      // Inspired by stringToUtf8ByteArray() in closure-library by Google
      // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
      // Apache License 2.0
      // https://github.com/google/closure-library/blob/master/LICENSE
      var p = 0;
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) {
          res[p++] = c;
        } else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
var toArray_1 = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
var toHex_1 = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
var htonl_1 = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
var toHex32_1 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
var zero2_1 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
var zero8_1 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  minimalisticAssert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
var join32_1 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
var split32_1 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
var rotr32_1 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
var rotl32_1 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
var sum32_1 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
var sum32_3_1 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
var sum32_4_1 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
var sum32_5_1 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
var sum64_1 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
var sum64_hi_1 = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
var sum64_lo_1 = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
var sum64_4_hi_1 = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
var sum64_4_lo_1 = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
var sum64_5_hi_1 = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
var sum64_5_lo_1 = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
var rotr64_hi_1 = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
var rotr64_lo_1 = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
var shr64_hi_1 = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
var shr64_lo_1 = shr64_lo;

var utils = {
	inherits: inherits_1,
	toArray: toArray_1,
	toHex: toHex_1,
	htonl: htonl_1,
	toHex32: toHex32_1,
	zero2: zero2_1,
	zero8: zero8_1,
	join32: join32_1,
	split32: split32_1,
	rotr32: rotr32_1,
	rotl32: rotl32_1,
	sum32: sum32_1,
	sum32_3: sum32_3_1,
	sum32_4: sum32_4_1,
	sum32_5: sum32_5_1,
	sum64: sum64_1,
	sum64_hi: sum64_hi_1,
	sum64_lo: sum64_lo_1,
	sum64_4_hi: sum64_4_hi_1,
	sum64_4_lo: sum64_4_lo_1,
	sum64_5_hi: sum64_5_hi_1,
	sum64_5_lo: sum64_5_lo_1,
	rotr64_hi: rotr64_hi_1,
	rotr64_lo: rotr64_lo_1,
	shr64_hi: shr64_hi_1,
	shr64_lo: shr64_lo_1
};

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
var BlockHash_1 = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  minimalisticAssert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};

var common = {
	BlockHash: BlockHash_1
};

var rotr32$1 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
var ft_1_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
var ch32_1 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
var maj32_1 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
var p32_1 = p32;

function s0_256(x) {
  return rotr32$1(x, 2) ^ rotr32$1(x, 13) ^ rotr32$1(x, 22);
}
var s0_256_1 = s0_256;

function s1_256(x) {
  return rotr32$1(x, 6) ^ rotr32$1(x, 11) ^ rotr32$1(x, 25);
}
var s1_256_1 = s1_256;

function g0_256(x) {
  return rotr32$1(x, 7) ^ rotr32$1(x, 18) ^ (x >>> 3);
}
var g0_256_1 = g0_256;

function g1_256(x) {
  return rotr32$1(x, 17) ^ rotr32$1(x, 19) ^ (x >>> 10);
}
var g1_256_1 = g1_256;

var common$1 = {
	ft_1: ft_1_1,
	ch32: ch32_1,
	maj32: maj32_1,
	p32: p32_1,
	s0_256: s0_256_1,
	s1_256: s1_256_1,
	g0_256: g0_256_1,
	g1_256: g1_256_1
};

var rotl32$1 = utils.rotl32;
var sum32$1 = utils.sum32;
var sum32_5$1 = utils.sum32_5;
var ft_1$1 = common$1.ft_1;
var BlockHash$1 = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash$1.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash$1);
var _1 = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32$1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5$1(rotl32$1(a, 5), ft_1$1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32$1(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32$1(this.h[0], a);
  this.h[1] = sum32$1(this.h[1], b);
  this.h[2] = sum32$1(this.h[2], c);
  this.h[3] = sum32$1(this.h[3], d);
  this.h[4] = sum32$1(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

var sum32$2 = utils.sum32;
var sum32_4$1 = utils.sum32_4;
var sum32_5$2 = utils.sum32_5;
var ch32$1 = common$1.ch32;
var maj32$1 = common$1.maj32;
var s0_256$1 = common$1.s0_256;
var s1_256$1 = common$1.s1_256;
var g0_256$1 = common$1.g0_256;
var g1_256$1 = common$1.g1_256;

var BlockHash$2 = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash$2.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash$2);
var _256 = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4$1(g1_256$1(W[i - 2]), W[i - 7], g0_256$1(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  minimalisticAssert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5$2(h, s1_256$1(e), ch32$1(e, f, g), this.k[i], W[i]);
    var T2 = sum32$2(s0_256$1(a), maj32$1(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32$2(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32$2(T1, T2);
  }

  this.h[0] = sum32$2(this.h[0], a);
  this.h[1] = sum32$2(this.h[1], b);
  this.h[2] = sum32$2(this.h[2], c);
  this.h[3] = sum32$2(this.h[3], d);
  this.h[4] = sum32$2(this.h[4], e);
  this.h[5] = sum32$2(this.h[5], f);
  this.h[6] = sum32$2(this.h[6], g);
  this.h[7] = sum32$2(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  _256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, _256);
var _224 = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};

var rotr64_hi$1 = utils.rotr64_hi;
var rotr64_lo$1 = utils.rotr64_lo;
var shr64_hi$1 = utils.shr64_hi;
var shr64_lo$1 = utils.shr64_lo;
var sum64$1 = utils.sum64;
var sum64_hi$1 = utils.sum64_hi;
var sum64_lo$1 = utils.sum64_lo;
var sum64_4_hi$1 = utils.sum64_4_hi;
var sum64_4_lo$1 = utils.sum64_4_lo;
var sum64_5_hi$1 = utils.sum64_5_hi;
var sum64_5_lo$1 = utils.sum64_5_lo;

var BlockHash$3 = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash$3.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash$3);
var _512 = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi$1(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo$1(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  minimalisticAssert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi$1(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo$1(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi$1(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo$1(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi$1(dh, dl, T1_hi, T1_lo);
    el = sum64_lo$1(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi$1(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo$1(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64$1(this.h, 0, ah, al);
  sum64$1(this.h, 2, bh, bl);
  sum64$1(this.h, 4, ch, cl);
  sum64$1(this.h, 6, dh, dl);
  sum64$1(this.h, 8, eh, el);
  sum64$1(this.h, 10, fh, fl);
  sum64$1(this.h, 12, gh, gl);
  sum64$1(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi$1(xh, xl, 28);
  var c1_hi = rotr64_hi$1(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi$1(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo$1(xh, xl, 28);
  var c1_lo = rotr64_lo$1(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo$1(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi$1(xh, xl, 14);
  var c1_hi = rotr64_hi$1(xh, xl, 18);
  var c2_hi = rotr64_hi$1(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo$1(xh, xl, 14);
  var c1_lo = rotr64_lo$1(xh, xl, 18);
  var c2_lo = rotr64_lo$1(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi$1(xh, xl, 1);
  var c1_hi = rotr64_hi$1(xh, xl, 8);
  var c2_hi = shr64_hi$1(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo$1(xh, xl, 1);
  var c1_lo = rotr64_lo$1(xh, xl, 8);
  var c2_lo = shr64_lo$1(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi$1(xh, xl, 19);
  var c1_hi = rotr64_hi$1(xl, xh, 29);  // 61
  var c2_hi = shr64_hi$1(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo$1(xh, xl, 19);
  var c1_lo = rotr64_lo$1(xl, xh, 29);  // 61
  var c2_lo = shr64_lo$1(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  _512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, _512);
var _384 = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};

var sha1 = _1;
var sha224 = _224;
var sha256 = _256;
var sha384 = _384;
var sha512 = _512;

var sha = {
	sha1: sha1,
	sha224: sha224,
	sha256: sha256,
	sha384: sha384,
	sha512: sha512
};

var rotl32$2 = utils.rotl32;
var sum32$3 = utils.sum32;
var sum32_3$1 = utils.sum32_3;
var sum32_4$2 = utils.sum32_4;
var BlockHash$4 = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash$4.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash$4);
var ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32$3(
      rotl32$2(
        sum32_4$2(A, f(j, B, C, D), msg[r$1[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32$2(C, 10);
    C = B;
    B = T;
    T = sum32$3(
      rotl32$2(
        sum32_4$2(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32$2(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3$1(this.h[1], C, Dh);
  this.h[1] = sum32_3$1(this.h[2], D, Eh);
  this.h[2] = sum32_3$1(this.h[3], E, Ah);
  this.h[3] = sum32_3$1(this.h[4], A, Bh);
  this.h[4] = sum32_3$1(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r$1 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];

var ripemd = {
	ripemd160: ripemd160
};

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
var hmac = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  minimalisticAssert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};

var hash_1 = createCommonjsModule(function (module, exports) {
var hash = exports;

hash.utils = utils;
hash.common = common;
hash.sha = sha;
hash.ripemd = ripemd;
hash.hmac = hmac;

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;
});

var secp256k1 = {
  doubles: {
    step: 4,
    points: [
      [
        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821',
      ],
      [
        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf',
      ],
      [
        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695',
      ],
      [
        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9',
      ],
      [
        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36',
      ],
      [
        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f',
      ],
      [
        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999',
      ],
      [
        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09',
      ],
      [
        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d',
      ],
      [
        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088',
      ],
      [
        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d',
      ],
      [
        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8',
      ],
      [
        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a',
      ],
      [
        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453',
      ],
      [
        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160',
      ],
      [
        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0',
      ],
      [
        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6',
      ],
      [
        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589',
      ],
      [
        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17',
      ],
      [
        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda',
      ],
      [
        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd',
      ],
      [
        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2',
      ],
      [
        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6',
      ],
      [
        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f',
      ],
      [
        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01',
      ],
      [
        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3',
      ],
      [
        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f',
      ],
      [
        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7',
      ],
      [
        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78',
      ],
      [
        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1',
      ],
      [
        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150',
      ],
      [
        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82',
      ],
      [
        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc',
      ],
      [
        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b',
      ],
      [
        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51',
      ],
      [
        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45',
      ],
      [
        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120',
      ],
      [
        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84',
      ],
      [
        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d',
      ],
      [
        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d',
      ],
      [
        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8',
      ],
      [
        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8',
      ],
      [
        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac',
      ],
      [
        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f',
      ],
      [
        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962',
      ],
      [
        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907',
      ],
      [
        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec',
      ],
      [
        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d',
      ],
      [
        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414',
      ],
      [
        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd',
      ],
      [
        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0',
      ],
      [
        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811',
      ],
      [
        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1',
      ],
      [
        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c',
      ],
      [
        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73',
      ],
      [
        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd',
      ],
      [
        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405',
      ],
      [
        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589',
      ],
      [
        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e',
      ],
      [
        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27',
      ],
      [
        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1',
      ],
      [
        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482',
      ],
      [
        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945',
      ],
      [
        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573',
      ],
      [
        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82',
      ],
    ],
  },
  naf: {
    wnd: 7,
    points: [
      [
        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672',
      ],
      [
        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6',
      ],
      [
        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da',
      ],
      [
        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37',
      ],
      [
        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b',
      ],
      [
        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81',
      ],
      [
        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58',
      ],
      [
        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77',
      ],
      [
        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a',
      ],
      [
        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c',
      ],
      [
        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67',
      ],
      [
        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402',
      ],
      [
        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55',
      ],
      [
        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482',
      ],
      [
        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82',
      ],
      [
        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396',
      ],
      [
        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49',
      ],
      [
        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf',
      ],
      [
        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a',
      ],
      [
        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7',
      ],
      [
        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933',
      ],
      [
        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a',
      ],
      [
        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6',
      ],
      [
        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37',
      ],
      [
        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e',
      ],
      [
        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6',
      ],
      [
        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476',
      ],
      [
        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40',
      ],
      [
        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61',
      ],
      [
        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683',
      ],
      [
        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5',
      ],
      [
        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b',
      ],
      [
        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417',
      ],
      [
        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868',
      ],
      [
        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a',
      ],
      [
        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6',
      ],
      [
        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996',
      ],
      [
        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e',
      ],
      [
        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d',
      ],
      [
        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2',
      ],
      [
        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e',
      ],
      [
        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437',
      ],
      [
        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311',
      ],
      [
        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4',
      ],
      [
        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575',
      ],
      [
        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d',
      ],
      [
        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d',
      ],
      [
        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629',
      ],
      [
        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06',
      ],
      [
        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374',
      ],
      [
        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee',
      ],
      [
        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1',
      ],
      [
        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b',
      ],
      [
        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661',
      ],
      [
        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6',
      ],
      [
        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e',
      ],
      [
        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d',
      ],
      [
        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc',
      ],
      [
        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4',
      ],
      [
        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c',
      ],
      [
        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b',
      ],
      [
        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913',
      ],
      [
        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154',
      ],
      [
        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865',
      ],
      [
        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc',
      ],
      [
        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224',
      ],
      [
        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e',
      ],
      [
        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6',
      ],
      [
        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511',
      ],
      [
        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b',
      ],
      [
        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2',
      ],
      [
        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c',
      ],
      [
        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3',
      ],
      [
        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d',
      ],
      [
        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700',
      ],
      [
        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4',
      ],
      [
        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196',
      ],
      [
        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4',
      ],
      [
        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257',
      ],
      [
        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13',
      ],
      [
        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096',
      ],
      [
        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38',
      ],
      [
        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f',
      ],
      [
        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448',
      ],
      [
        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a',
      ],
      [
        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4',
      ],
      [
        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437',
      ],
      [
        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7',
      ],
      [
        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d',
      ],
      [
        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a',
      ],
      [
        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54',
      ],
      [
        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77',
      ],
      [
        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517',
      ],
      [
        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10',
      ],
      [
        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125',
      ],
      [
        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e',
      ],
      [
        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1',
      ],
      [
        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2',
      ],
      [
        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423',
      ],
      [
        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8',
      ],
      [
        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758',
      ],
      [
        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375',
      ],
      [
        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d',
      ],
      [
        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec',
      ],
      [
        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0',
      ],
      [
        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c',
      ],
      [
        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4',
      ],
      [
        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f',
      ],
      [
        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649',
      ],
      [
        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826',
      ],
      [
        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5',
      ],
      [
        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87',
      ],
      [
        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b',
      ],
      [
        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc',
      ],
      [
        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c',
      ],
      [
        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f',
      ],
      [
        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a',
      ],
      [
        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46',
      ],
      [
        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f',
      ],
      [
        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03',
      ],
      [
        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08',
      ],
      [
        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8',
      ],
      [
        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373',
      ],
      [
        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3',
      ],
      [
        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8',
      ],
      [
        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1',
      ],
      [
        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9',
      ],
    ],
  },
};

var curves_1 = createCommonjsModule(function (module, exports) {

var curves = exports;





var assert = utils_1$1.assert;

function PresetCurve(options) {
  if (options.type === 'short')
    this.curve = new curve_1.short(options);
  else if (options.type === 'edwards')
    this.curve = new curve_1.edwards(options);
  else
    this.curve = new curve_1.mont(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function() {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve,
      });
      return curve;
    },
  });
}

defineCurve('p192', {
  type: 'short',
  prime: 'p192',
  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
  hash: hash_1.sha256,
  gRed: false,
  g: [
    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811',
  ],
});

defineCurve('p224', {
  type: 'short',
  prime: 'p224',
  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
  hash: hash_1.sha256,
  gRed: false,
  g: [
    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34',
  ],
});

defineCurve('p256', {
  type: 'short',
  prime: null,
  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
  hash: hash_1.sha256,
  gRed: false,
  g: [
    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5',
  ],
});

defineCurve('p384', {
  type: 'short',
  prime: null,
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 ffffffff',
  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 fffffffc',
  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
  hash: hash_1.sha384,
  gRed: false,
  g: [
    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
    '5502f25d bf55296c 3a545e38 72760ab7',
    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f',
  ],
});

defineCurve('p521', {
  type: 'short',
  prime: null,
  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff',
  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff fffffffc',
  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
  hash: hash_1.sha512,
  gRed: false,
  g: [
    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
    '3fad0761 353c7086 a272c240 88be9476 9fd16650',
  ],
});

defineCurve('curve25519', {
  type: 'mont',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '76d06',
  b: '1',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash_1.sha256,
  gRed: false,
  g: [
    '9',
  ],
});

defineCurve('ed25519', {
  type: 'edwards',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '-1',
  c: '1',
  // -121665 * (121666^(-1)) (mod P)
  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash_1.sha256,
  gRed: false,
  g: [
    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

    // 4/5
    '6666666666666666666666666666666666666666666666666666666666666658',
  ],
});

var pre;
try {
  pre = secp256k1;
} catch (e) {
  pre = undefined;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: hash_1.sha256,

  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3',
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15',
    },
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre,
  ],
});
});

function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG))
    return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils_1.toArray(options.entropy, options.entropyEnc || 'hex');
  var nonce = utils_1.toArray(options.nonce, options.nonceEnc || 'hex');
  var pers = utils_1.toArray(options.pers, options.persEnc || 'hex');
  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
var hmacDrbg = HmacDRBG;

HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;  // 2^48
};

HmacDRBG.prototype._hmac = function hmac() {
  return new hash_1.hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function update(seed) {
  var kmac = this._hmac()
                 .update(this.V)
                 .update([ 0x00 ]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;

  this.K = this._hmac()
               .update(this.V)
               .update([ 0x01 ])
               .update(seed)
               .digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
  // Optional entropy enc
  if (typeof entropyEnc !== 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils_1.toArray(entropy, entropyEnc);
  add = utils_1.toArray(add, addEnc);

  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error('Reseed is required');

  // Optional encoding
  if (typeof enc !== 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  // Optional additional data
  if (add) {
    add = utils_1.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils_1.encode(res, enc);
};

var assert$4 = utils_1$1.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
var key = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    return pub;

  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc,
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    return priv;

  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc,
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: 'Public key * N != O' };

  return { result: true, reason: null };
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    return this.pub;

  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    return this.priv.toString(16, 2);
  else
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new bn(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert$4(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert$4(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  if(!pub.validate()) {
    assert$4(pub.validate(), 'public point not validated');
  }
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};

var assert$5 = utils_1$1.assert;

function Signature(options, enc) {
  if (options instanceof Signature)
    return options;

  if (this._importDER(options, enc))
    return;

  assert$5(options.r && options.s, 'Signature without r or s');
  this.r = new bn(options.r, 16);
  this.s = new bn(options.s, 16);
  if (options.recoveryParam === undefined)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
var signature = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) {
    return initial;
  }
  var octetLen = initial & 0xf;

  // Indefinite length or overflow
  if (octetLen === 0 || octetLen > 4) {
    return false;
  }

  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
    val >>>= 0;
  }

  // Leading zeroes
  if (val <= 0x7f) {
    return false;
  }

  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  var len = buf.length - 1;
  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
    i++;
  }
  if (i === 0) {
    return buf;
  }
  return buf.slice(i);
}

Signature.prototype._importDER = function _importDER(data, enc) {
  data = utils_1$1.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) {
    return false;
  }
  var len = getLength(data, p);
  if (len === false) {
    return false;
  }
  if ((len + p.place) !== data.length) {
    return false;
  }
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var rlen = getLength(data, p);
  if (rlen === false) {
    return false;
  }
  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var slen = getLength(data, p);
  if (slen === false) {
    return false;
  }
  if (data.length !== slen + p.place) {
    return false;
  }
  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0) {
    if (r[1] & 0x80) {
      r = r.slice(1);
    } else {
      // Leading zeroes
      return false;
    }
  }
  if (s[0] === 0) {
    if (s[1] & 0x80) {
      s = s.slice(1);
    } else {
      // Leading zeroes
      return false;
    }
  }

  this.r = new bn(r);
  this.s = new bn(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 0x80);
  while (--octets) {
    arr.push((len >>> (octets << 3)) & 0xff);
  }
  arr.push(len);
}

Signature.prototype.toDER = function toDER(enc) {
  var r = this.r.toArray();
  var s = this.s.toArray();

  // Pad values
  if (r[0] & 0x80)
    r = [ 0 ].concat(r);
  // Pad values
  if (s[0] & 0x80)
    s = [ 0 ].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!s[0] && !(s[1] & 0x80)) {
    s = s.slice(1);
  }
  var arr = [ 0x02 ];
  constructLength(arr, r.length);
  arr = arr.concat(r);
  arr.push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s);
  var res = [ 0x30 ];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils_1$1.encode(res, enc);
};

var assert$6 = utils_1$1.assert;




function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);

  // Shortcut `elliptic.ec(curve-name)`
  if (typeof options === 'string') {
    assert$6(Object.prototype.hasOwnProperty.call(curves_1, options),
      'Unknown curve ' + options);

    options = curves_1[options];
  }

  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
  if (options instanceof curves_1.PresetCurve)
    options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  // Point on curve
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  // Hash for function for DRBG
  this.hash = options.hash || options.curve.hash;
}
var ec = EC;

EC.prototype.keyPair = function keyPair(options) {
  return new key(this, options);
};

EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
  return key.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
  return key.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};

  // Instantiate Hmac_DRBG
  var drbg = new hmacDrbg({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || brorand(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: this.n.toArray(),
  });

  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new bn(2));
  for (;;) {
    var priv = new bn(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  }
};

EC.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};

EC.prototype.sign = function sign(msg, key, enc, options) {
  if (typeof enc === 'object') {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new bn(msg, 16));

  // Zero-extend key to provide enough entropy
  var bytes = this.n.byteLength();
  var bkey = key.getPrivate().toArray('be', bytes);

  // Zero-extend nonce to have the same byte size as N
  var nonce = msg.toArray('be', bytes);

  // Instantiate Hmac_DRBG
  var drbg = new hmacDrbg({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
  });

  // Number of bytes to generate
  var ns1 = this.n.sub(new bn(1));

  for (var iter = 0; ; iter++) {
    var k = options.k ?
      options.k(iter) :
      new bn(drbg.generate(this.n.byteLength()));
    k = this._truncateToN(k, true);
    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
      continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity())
      continue;

    var kpX = kp.getX();
    var r = kpX.umod(this.n);
    if (r.cmpn(0) === 0)
      continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    s = s.umod(this.n);
    if (s.cmpn(0) === 0)
      continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                        (kpX.cmp(r) !== 0 ? 2 : 0);

    // Use complement of `s`, if it is > `n / 2`
    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function verify(msg, signature$1, key, enc) {
  msg = this._truncateToN(new bn(msg, 16));
  key = this.keyFromPublic(key, enc);
  signature$1 = new signature(signature$1, 'hex');

  // Perform primitive values validation
  var r = signature$1.r;
  var s = signature$1.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
    return false;
  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  // Validate signature
  var sinv = s.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u2 = sinv.mul(r).umod(this.n);
  var p;

  if (!this.curve._maxwellTrick) {
    p = this.g.mulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    return p.getX().umod(this.n).cmp(r) === 0;
  }

  // NOTE: Greg Maxwell's trick, inspired by:
  // https://git.io/vad3K

  p = this.g.jmulAdd(u1, key.getPublic(), u2);
  if (p.isInfinity())
    return false;

  // Compare `p.x` of Jacobian point with `r`,
  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
  // inverse of `p.z^2`
  return p.eqXToP(r);
};

EC.prototype.recoverPubKey = function(msg, signature$1, j, enc) {
  assert$6((3 & j) === j, 'The recovery param is more than two bits');
  signature$1 = new signature(signature$1, enc);

  var n = this.n;
  var e = new bn(msg);
  var r = signature$1.r;
  var s = signature$1.s;

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = j & 1;
  var isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  // 1.1. Let x = r + jn.
  if (isSecondKey)
    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
  else
    r = this.curve.pointFromX(r, isYOdd);

  var rInv = signature$1.r.invm(n);
  var s1 = n.sub(e).mul(rInv).umod(n);
  var s2 = s.mul(rInv).umod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function(e, signature$1, Q, enc) {
  signature$1 = new signature(signature$1, enc);
  if (signature$1.recoveryParam !== null)
    return signature$1.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature$1, i);
    } catch (e) {
      continue;
    }

    if (Qprime.eq(Q))
      return i;
  }
  throw new Error('Unable to find valid recovery factor');
};

var assert$7 = utils_1$1.assert;
var parseBytes = utils_1$1.parseBytes;
var cachedProperty = utils_1$1.cachedProperty;

/**
* @param {EDDSA} eddsa - instance
* @param {Object} params - public/private key parameters
*
* @param {Array<Byte>} [params.secret] - secret seed bytes
* @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
* @param {Array<Byte>} [params.pub] - public key point encoded as bytes
*
*/
function KeyPair$1(eddsa, params) {
  this.eddsa = eddsa;
  this._secret = parseBytes(params.secret);
  if (eddsa.isPoint(params.pub))
    this._pub = params.pub;
  else
    this._pubBytes = parseBytes(params.pub);
}

KeyPair$1.fromPublic = function fromPublic(eddsa, pub) {
  if (pub instanceof KeyPair$1)
    return pub;
  return new KeyPair$1(eddsa, { pub: pub });
};

KeyPair$1.fromSecret = function fromSecret(eddsa, secret) {
  if (secret instanceof KeyPair$1)
    return secret;
  return new KeyPair$1(eddsa, { secret: secret });
};

KeyPair$1.prototype.secret = function secret() {
  return this._secret;
};

cachedProperty(KeyPair$1, 'pubBytes', function pubBytes() {
  return this.eddsa.encodePoint(this.pub());
});

cachedProperty(KeyPair$1, 'pub', function pub() {
  if (this._pubBytes)
    return this.eddsa.decodePoint(this._pubBytes);
  return this.eddsa.g.mul(this.priv());
});

cachedProperty(KeyPair$1, 'privBytes', function privBytes() {
  var eddsa = this.eddsa;
  var hash = this.hash();
  var lastIx = eddsa.encodingLength - 1;

  var a = hash.slice(0, eddsa.encodingLength);
  a[0] &= 248;
  a[lastIx] &= 127;
  a[lastIx] |= 64;

  return a;
});

cachedProperty(KeyPair$1, 'priv', function priv() {
  return this.eddsa.decodeInt(this.privBytes());
});

cachedProperty(KeyPair$1, 'hash', function hash() {
  return this.eddsa.hash().update(this.secret()).digest();
});

cachedProperty(KeyPair$1, 'messagePrefix', function messagePrefix() {
  return this.hash().slice(this.eddsa.encodingLength);
});

KeyPair$1.prototype.sign = function sign(message) {
  assert$7(this._secret, 'KeyPair can only verify');
  return this.eddsa.sign(message, this);
};

KeyPair$1.prototype.verify = function verify(message, sig) {
  return this.eddsa.verify(message, sig, this);
};

KeyPair$1.prototype.getSecret = function getSecret(enc) {
  assert$7(this._secret, 'KeyPair is public only');
  return utils_1$1.encode(this.secret(), enc);
};

KeyPair$1.prototype.getPublic = function getPublic(enc) {
  return utils_1$1.encode(this.pubBytes(), enc);
};

var key$1 = KeyPair$1;

var assert$8 = utils_1$1.assert;
var cachedProperty$1 = utils_1$1.cachedProperty;
var parseBytes$1 = utils_1$1.parseBytes;

/**
* @param {EDDSA} eddsa - eddsa instance
* @param {Array<Bytes>|Object} sig -
* @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
* @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
* @param {Array<Bytes>} [sig.Rencoded] - R point encoded
* @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
*/
function Signature$1(eddsa, sig) {
  this.eddsa = eddsa;

  if (typeof sig !== 'object')
    sig = parseBytes$1(sig);

  if (Array.isArray(sig)) {
    sig = {
      R: sig.slice(0, eddsa.encodingLength),
      S: sig.slice(eddsa.encodingLength),
    };
  }

  assert$8(sig.R && sig.S, 'Signature without R or S');

  if (eddsa.isPoint(sig.R))
    this._R = sig.R;
  if (sig.S instanceof bn)
    this._S = sig.S;

  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
}

cachedProperty$1(Signature$1, 'S', function S() {
  return this.eddsa.decodeInt(this.Sencoded());
});

cachedProperty$1(Signature$1, 'R', function R() {
  return this.eddsa.decodePoint(this.Rencoded());
});

cachedProperty$1(Signature$1, 'Rencoded', function Rencoded() {
  return this.eddsa.encodePoint(this.R());
});

cachedProperty$1(Signature$1, 'Sencoded', function Sencoded() {
  return this.eddsa.encodeInt(this.S());
});

Signature$1.prototype.toBytes = function toBytes() {
  return this.Rencoded().concat(this.Sencoded());
};

Signature$1.prototype.toHex = function toHex() {
  return utils_1$1.encode(this.toBytes(), 'hex').toUpperCase();
};

var signature$1 = Signature$1;

var assert$9 = utils_1$1.assert;
var parseBytes$2 = utils_1$1.parseBytes;



function EDDSA(curve) {
  assert$9(curve === 'ed25519', 'only tested with ed25519 so far');

  if (!(this instanceof EDDSA))
    return new EDDSA(curve);

  curve = curves_1[curve].curve;
  this.curve = curve;
  this.g = curve.g;
  this.g.precompute(curve.n.bitLength() + 1);

  this.pointClass = curve.point().constructor;
  this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
  this.hash = hash_1.sha512;
}

var eddsa = EDDSA;

/**
* @param {Array|String} message - message bytes
* @param {Array|String|KeyPair} secret - secret bytes or a keypair
* @returns {Signature} - signature
*/
EDDSA.prototype.sign = function sign(message, secret) {
  message = parseBytes$2(message);
  var key = this.keyFromSecret(secret);
  var r = this.hashInt(key.messagePrefix(), message);
  var R = this.g.mul(r);
  var Rencoded = this.encodePoint(R);
  var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
    .mul(key.priv());
  var S = r.add(s_).umod(this.curve.n);
  return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
};

/**
* @param {Array} message - message bytes
* @param {Array|String|Signature} sig - sig bytes
* @param {Array|String|Point|KeyPair} pub - public key
* @returns {Boolean} - true if public key matches sig of message
*/
EDDSA.prototype.verify = function verify(message, sig, pub) {
  message = parseBytes$2(message);
  sig = this.makeSignature(sig);
  var key = this.keyFromPublic(pub);
  var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
  var SG = this.g.mul(sig.S());
  var RplusAh = sig.R().add(key.pub().mul(h));
  return RplusAh.eq(SG);
};

EDDSA.prototype.hashInt = function hashInt() {
  var hash = this.hash();
  for (var i = 0; i < arguments.length; i++)
    hash.update(arguments[i]);
  return utils_1$1.intFromLE(hash.digest()).umod(this.curve.n);
};

EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
  return key$1.fromPublic(this, pub);
};

EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
  return key$1.fromSecret(this, secret);
};

EDDSA.prototype.makeSignature = function makeSignature(sig) {
  if (sig instanceof signature$1)
    return sig;
  return new signature$1(this, sig);
};

/**
* * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
*
* EDDSA defines methods for encoding and decoding points and integers. These are
* helper convenience methods, that pass along to utility functions implied
* parameters.
*
*/
EDDSA.prototype.encodePoint = function encodePoint(point) {
  var enc = point.getY().toArray('le', this.encodingLength);
  enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
  return enc;
};

EDDSA.prototype.decodePoint = function decodePoint(bytes) {
  bytes = utils_1$1.parseBytes(bytes);

  var lastIx = bytes.length - 1;
  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
  var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

  var y = utils_1$1.intFromLE(normed);
  return this.curve.pointFromY(y, xIsOdd);
};

EDDSA.prototype.encodeInt = function encodeInt(num) {
  return num.toArray('le', this.encodingLength);
};

EDDSA.prototype.decodeInt = function decodeInt(bytes) {
  return utils_1$1.intFromLE(bytes);
};

EDDSA.prototype.isPoint = function isPoint(val) {
  return val instanceof this.pointClass;
};

var require$$0 = getCjsExportFromNamespace(_package$1);

var elliptic_1 = createCommonjsModule(function (module, exports) {

var elliptic = exports;

elliptic.version = require$$0.version;
elliptic.utils = utils_1$1;
elliptic.rand = brorand;
elliptic.curve = curve_1;
elliptic.curves = curves_1;

// Protocols
elliptic.ec = ec;
elliptic.eddsa = eddsa;
});

var CallStatus;
(function (CallStatus) {
    CallStatus["Pending"] = "pending";
    CallStatus["Failed"] = "failed";
    CallStatus["Completed"] = "completed";
})(CallStatus || (CallStatus = {}));

var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["Pending"] = "pending";
    TransactionStatus["Aired"] = "aired";
    TransactionStatus["Failed"] = "failed";
    TransactionStatus["Abandonned"] = "abandonned";
    TransactionStatus["Completed"] = "completed";
    TransactionStatus["Signed"] = "signed";
})(TransactionStatus || (TransactionStatus = {}));

var DappyLoadError;
(function (DappyLoadError) {
    DappyLoadError["UnsupportedAddress"] = "The address format is not supported";
    DappyLoadError["IncompleteAddress"] = "The address is incomplete";
    DappyLoadError["ChainNotFound"] = "Blockchain not found";
    DappyLoadError["MissingBlockchainData"] = "Missing data from the blockchain";
    DappyLoadError["RecordNotFound"] = "Record not found";
    DappyLoadError["ResourceNotFound"] = "Contract not found";
    DappyLoadError["ServerError"] = "Server error";
    DappyLoadError["DangerousLink"] = "Dangerous link";
    DappyLoadError["FailedToParseResponse"] = "Failed to parse response";
    DappyLoadError["InvalidManifest"] = "Invalid manifest";
    DappyLoadError["InvalidSignature"] = "Invalid signature";
    DappyLoadError["InvalidRecords"] = "Invalid records";
    DappyLoadError["DappyLookup"] = "Lookup error";
    DappyLoadError["InvalidServers"] = "Invalid servers";
    DappyLoadError["PostParseError"] = "Parse error after multicall";
    DappyLoadError["UnknownCriticalError"] = "Unknown critical error";
    DappyLoadError["DNSResolutionError"] = "Name System (DNS) resolution error";
    DappyLoadError["DappyResolutionError"] = "Dappy Name System resolution error";
})(DappyLoadError || (DappyLoadError = {}));

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

const toString$1 = Object.prototype.toString;
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
  const tag = toString$1.call(val).slice(8, -1);
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
function toString$2(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString$2;

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

function toArray$1(value) {
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
    toArray$1(errorOrErrors).forEach(err => {
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
var Uint8Array$1 = _root.Uint8Array;

var _Uint8Array = Uint8Array$1;

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
  return path.match(SPLIT_REGEX) || ['']
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
    let deps = toArray$1(keys).map(key => new Reference(key));
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
var validateDpy = function (dpy) {
    return new Promise(function (resolve, reject) {
        dpySchema
            .validate(dpy)
            .then(function () {
            resolve(true);
        })
            .catch(function (err) {
            reject(err);
        });
    });
};

var ec$1 = new elliptic_1.ec('secp256k1');
var validateAndReturnFile = function (dataNotParsed, purseId, publicKeyFromRequest, checkSignature) { return __awaiter(void 0, void 0, Promise, function () {
    var file, parsed, dataAtNameBuffer, unzippedBuffer, parsedFile, err_1, err_2, signatureHex, name, mimeType, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    parsed = JSON.parse(dataNotParsed);
                    if (!parsed.expr[0]) {
                        throw new Error();
                    }
                }
                catch (err) {
                    throw new Error(JSON.stringify({
                        error: DappyLoadError.FailedToParseResponse,
                        args: {
                            message: 'File does not exist',
                        },
                    }));
                }
                try {
                    dataAtNameBuffer = Buffer.from(parsed.expr[0].ExprMap.data[purseId].ExprString.data, 'base64');
                    unzippedBuffer = zlib.gunzipSync(dataAtNameBuffer);
                    file = unzippedBuffer.toString('utf-8');
                }
                catch (err) {
                    console.log(err);
                    throw new Error(JSON.stringify({
                        error: DappyLoadError.InvalidManifest,
                        args: {
                            message: 'Failed to validate file, string is not valid base64 + gzipped',
                        },
                    }));
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 8]);
                parsedFile = JSON.parse(file);
                return [4 /*yield*/, validateDpy(parsedFile)];
            case 2:
                _a.sent();
                return [3 /*break*/, 8];
            case 3:
                err_1 = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                parsedFile = JSON.parse(file);
                return [4 /*yield*/, validateFile(parsedFile)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_2 = _a.sent();
                console.log(err_2);
                throw new Error(JSON.stringify({
                    error: DappyLoadError.InvalidManifest,
                    args: {
                        message: 'Failed to validate file' + err_2,
                    },
                }));
            case 7: return [3 /*break*/, 8];
            case 8:
                signatureHex = parsedFile.signature;
                name = parsedFile.name;
                mimeType = parsedFile.mimeType;
                data = parsedFile.data;
                if (!checkSignature) {
                    return [2 /*return*/, parsedFile];
                }
                return [2 /*return*/, parsedFile];
        }
    });
}); };

var shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

var getNodeIndex = function (node) {
    return "".concat(node.ip, "---").concat(node.hostname);
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

function __awaiter$1(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/*
  We do not do a Promise.all on all ids
  requests will be done BATCH_SIZE by BATCH_SIZE
*/
const BATCH_SIZE = 2;
var BeesLoadStatus;
(function (BeesLoadStatus) {
    BeesLoadStatus["Loading"] = "loading";
    BeesLoadStatus["Failed"] = "failed";
    BeesLoadStatus["Completed"] = "completed";
})(BeesLoadStatus || (BeesLoadStatus = {}));
var BeesLoadError;
(function (BeesLoadError) {
    BeesLoadError["OutOfNodes"] = "Out of nodes";
    BeesLoadError["UnaccurateState"] = "Unaccurate state";
})(BeesLoadError || (BeesLoadError = {}));
const indexData = (data, existingData, comparer) => {
    let found = false;
    let stringToCompare = data.data;
    if (typeof comparer === "function") {
        try {
            stringToCompare = comparer(data.data);
        }
        catch (err) {
            throw err;
        }
    }
    // initialize existingData
    if (Object.keys(existingData).length === 0) {
        existingData = {
            "1": {
                ids: [data.id],
                data: data.data || "",
                stringToCompare: stringToCompare,
            },
        };
    }
    else {
        Object.keys(existingData).forEach((key) => {
            if (stringToCompare === existingData[key].stringToCompare) {
                found = true;
                existingData = Object.assign(Object.assign({}, existingData), { [key]: Object.assign(Object.assign({}, existingData[key]), { ids: existingData[key].ids.concat(data.id) }) });
            }
        });
        if (!found) {
            existingData = Object.assign(Object.assign({}, existingData), { [Object.keys(existingData).length + 1]: {
                    ids: [data.id],
                    data: data.data,
                    stringToCompare: stringToCompare,
                } });
        }
    }
    return existingData;
};
const resolver = (queryHandler, ids, resolverAccuracy, resolverAbsolute, comparer) => {
    let loadErrors = {};
    let loadState = {};
    let loadPending = [];
    return new Promise((resolve, reject) => {
        if (typeof resolverAccuracy !== "number" || resolverAccuracy < 50 || resolverAccuracy > 100) {
            reject("resolverAccuracy should be a number (percentage) between 50 and 100");
            return;
        }
        if (typeof resolverAbsolute !== 'number' || !Number.isInteger(resolverAbsolute) || resolverAbsolute > ids.length) {
            reject("resolverAbsolute should be an integer number and not exceed the length of ids");
            return;
        }
        let i = 0;
        const callBatch = (i) => __awaiter$1(void 0, void 0, void 0, function* () {
            // idsToQuery is of same size as resolverAbsolute
            // but you can change this to do 3 by 3 or 4 by 4 etc.
            const idsToQuery = ids.slice(i, i + BATCH_SIZE);
            if (idsToQuery.length === 0) {
                resolve({
                    loadErrors: loadErrors,
                    loadState: loadState,
                    loadPending: loadPending,
                    loadError: {
                        error: BeesLoadError.OutOfNodes,
                        args: {
                            alreadyQueried: i - Object.keys(loadErrors).length,
                            resolverAbsolute: resolverAbsolute,
                        },
                    },
                    status: BeesLoadStatus.Failed,
                });
                return;
            }
            i += idsToQuery.length;
            loadPending = loadPending.concat(idsToQuery);
            const responses = yield Promise.all(idsToQuery.map(id => queryHandler(id)));
            responses.forEach((data) => {
                loadPending = loadPending.filter((id) => id !== data.id);
                if (data.type === "SUCCESS") {
                    try {
                        loadState = indexData(data, loadState, comparer);
                    }
                    catch (err) {
                        loadErrors = Object.assign(Object.assign({}, loadErrors), { [data.id]: {
                                id: data.id,
                                status: err.message ? parseInt(err.message, 10) : 400,
                            } });
                    }
                }
                else {
                    loadErrors = Object.assign(Object.assign({}, loadErrors), { [data.id]: {
                            id: data.id,
                            status: data.status,
                        } });
                }
            });
            const totalOkResponses = Object.keys(loadState).reduce((total, k) => {
                return total + loadState[k].ids.length;
            }, 0);
            // don't ruen this into a .forEach, return are
            // not effecive in forEach loops
            for (let j = 0; j < Object.keys(loadState).length; j += 1) {
                const key = Object.keys(loadState)[j];
                const nodesWithOkResponses = loadState[key].ids.length;
                // at least [resolverAbsolute] responses of the same
                // resolver must Complete or Fail
                if (nodesWithOkResponses >= resolverAbsolute) {
                    if (resolverAccuracy / 100 >
                        loadState[key].ids.length / totalOkResponses) {
                        resolve({
                            loadErrors: loadErrors,
                            loadState: loadState,
                            loadPending: loadPending,
                            loadError: {
                                error: BeesLoadError.UnaccurateState,
                                args: {
                                    totalOkResponses: totalOkResponses,
                                    loadStates: Object.keys(loadState).map((k) => {
                                        return {
                                            key: k,
                                            okResponses: loadState[k].ids.length,
                                            percent: Math.round((100 *
                                                (100 * loadState[k].ids.length)) /
                                                totalOkResponses) / 100,
                                        };
                                    }),
                                },
                            },
                            status: BeesLoadStatus.Failed,
                        });
                        // will stop for loop
                        return;
                    }
                    resolve({
                        loadErrors: loadErrors,
                        loadState: loadState,
                        loadPending: loadPending,
                        status: BeesLoadStatus.Completed,
                    });
                    // will stop for loop
                    return;
                }
            }
            // if no return in for loop, go
            // on next batch
            callBatch(i);
        });
        callBatch(i);
    });
};

var toString_1$1 = function (type) {
  switch (type) {
    case 1: return 'A'
    case 10: return 'NULL'
    case 28: return 'AAAA'
    case 18: return 'AFSDB'
    case 42: return 'APL'
    case 257: return 'CAA'
    case 60: return 'CDNSKEY'
    case 59: return 'CDS'
    case 37: return 'CERT'
    case 5: return 'CNAME'
    case 49: return 'DHCID'
    case 32769: return 'DLV'
    case 39: return 'DNAME'
    case 48: return 'DNSKEY'
    case 43: return 'DS'
    case 55: return 'HIP'
    case 13: return 'HINFO'
    case 45: return 'IPSECKEY'
    case 25: return 'KEY'
    case 36: return 'KX'
    case 29: return 'LOC'
    case 15: return 'MX'
    case 35: return 'NAPTR'
    case 2: return 'NS'
    case 47: return 'NSEC'
    case 50: return 'NSEC3'
    case 51: return 'NSEC3PARAM'
    case 12: return 'PTR'
    case 46: return 'RRSIG'
    case 17: return 'RP'
    case 24: return 'SIG'
    case 6: return 'SOA'
    case 99: return 'SPF'
    case 33: return 'SRV'
    case 44: return 'SSHFP'
    case 32768: return 'TA'
    case 249: return 'TKEY'
    case 52: return 'TLSA'
    case 250: return 'TSIG'
    case 16: return 'TXT'
    case 252: return 'AXFR'
    case 251: return 'IXFR'
    case 41: return 'OPT'
    case 255: return 'ANY'
  }
  return 'UNKNOWN_' + type
};

var toType = function (name) {
  switch (name.toUpperCase()) {
    case 'A': return 1
    case 'NULL': return 10
    case 'AAAA': return 28
    case 'AFSDB': return 18
    case 'APL': return 42
    case 'CAA': return 257
    case 'CDNSKEY': return 60
    case 'CDS': return 59
    case 'CERT': return 37
    case 'CNAME': return 5
    case 'DHCID': return 49
    case 'DLV': return 32769
    case 'DNAME': return 39
    case 'DNSKEY': return 48
    case 'DS': return 43
    case 'HIP': return 55
    case 'HINFO': return 13
    case 'IPSECKEY': return 45
    case 'KEY': return 25
    case 'KX': return 36
    case 'LOC': return 29
    case 'MX': return 15
    case 'NAPTR': return 35
    case 'NS': return 2
    case 'NSEC': return 47
    case 'NSEC3': return 50
    case 'NSEC3PARAM': return 51
    case 'PTR': return 12
    case 'RRSIG': return 46
    case 'RP': return 17
    case 'SIG': return 24
    case 'SOA': return 6
    case 'SPF': return 99
    case 'SRV': return 33
    case 'SSHFP': return 44
    case 'TA': return 32768
    case 'TKEY': return 249
    case 'TLSA': return 52
    case 'TSIG': return 250
    case 'TXT': return 16
    case 'AXFR': return 252
    case 'IXFR': return 251
    case 'OPT': return 41
    case 'ANY': return 255
    case '*': return 255
  }
  if (name.toUpperCase().startsWith('UNKNOWN_')) return parseInt(name.slice(8))
  return 0
};

var types = {
	toString: toString_1$1,
	toType: toType
};

/*
 * Traditional DNS header RCODEs (4-bits) defined by IANA in
 * https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml
 */

var toString_1$2 = function (rcode) {
  switch (rcode) {
    case 0: return 'NOERROR'
    case 1: return 'FORMERR'
    case 2: return 'SERVFAIL'
    case 3: return 'NXDOMAIN'
    case 4: return 'NOTIMP'
    case 5: return 'REFUSED'
    case 6: return 'YXDOMAIN'
    case 7: return 'YXRRSET'
    case 8: return 'NXRRSET'
    case 9: return 'NOTAUTH'
    case 10: return 'NOTZONE'
    case 11: return 'RCODE_11'
    case 12: return 'RCODE_12'
    case 13: return 'RCODE_13'
    case 14: return 'RCODE_14'
    case 15: return 'RCODE_15'
  }
  return 'RCODE_' + rcode
};

var toRcode = function (code) {
  switch (code.toUpperCase()) {
    case 'NOERROR': return 0
    case 'FORMERR': return 1
    case 'SERVFAIL': return 2
    case 'NXDOMAIN': return 3
    case 'NOTIMP': return 4
    case 'REFUSED': return 5
    case 'YXDOMAIN': return 6
    case 'YXRRSET': return 7
    case 'NXRRSET': return 8
    case 'NOTAUTH': return 9
    case 'NOTZONE': return 10
    case 'RCODE_11': return 11
    case 'RCODE_12': return 12
    case 'RCODE_13': return 13
    case 'RCODE_14': return 14
    case 'RCODE_15': return 15
  }
  return 0
};

var rcodes = {
	toString: toString_1$2,
	toRcode: toRcode
};

/*
 * Traditional DNS header OPCODEs (4-bits) defined by IANA in
 * https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-5
 */

var toString_1$3 = function (opcode) {
  switch (opcode) {
    case 0: return 'QUERY'
    case 1: return 'IQUERY'
    case 2: return 'STATUS'
    case 3: return 'OPCODE_3'
    case 4: return 'NOTIFY'
    case 5: return 'UPDATE'
    case 6: return 'OPCODE_6'
    case 7: return 'OPCODE_7'
    case 8: return 'OPCODE_8'
    case 9: return 'OPCODE_9'
    case 10: return 'OPCODE_10'
    case 11: return 'OPCODE_11'
    case 12: return 'OPCODE_12'
    case 13: return 'OPCODE_13'
    case 14: return 'OPCODE_14'
    case 15: return 'OPCODE_15'
  }
  return 'OPCODE_' + opcode
};

var toOpcode = function (code) {
  switch (code.toUpperCase()) {
    case 'QUERY': return 0
    case 'IQUERY': return 1
    case 'STATUS': return 2
    case 'OPCODE_3': return 3
    case 'NOTIFY': return 4
    case 'UPDATE': return 5
    case 'OPCODE_6': return 6
    case 'OPCODE_7': return 7
    case 'OPCODE_8': return 8
    case 'OPCODE_9': return 9
    case 'OPCODE_10': return 10
    case 'OPCODE_11': return 11
    case 'OPCODE_12': return 12
    case 'OPCODE_13': return 13
    case 'OPCODE_14': return 14
    case 'OPCODE_15': return 15
  }
  return 0
};

var opcodes = {
	toString: toString_1$3,
	toOpcode: toOpcode
};

var toString_1$4 = function (klass) {
  switch (klass) {
    case 1: return 'IN'
    case 2: return 'CS'
    case 3: return 'CH'
    case 4: return 'HS'
    case 255: return 'ANY'
  }
  return 'UNKNOWN_' + klass
};

var toClass = function (name) {
  switch (name.toUpperCase()) {
    case 'IN': return 1
    case 'CS': return 2
    case 'CH': return 3
    case 'HS': return 4
    case 'ANY': return 255
  }
  return 0
};

var classes = {
	toString: toString_1$4,
	toClass: toClass
};

var toString_1$5 = function (type) {
  switch (type) {
    // list at
    // https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-11
    case 1: return 'LLQ'
    case 2: return 'UL'
    case 3: return 'NSID'
    case 5: return 'DAU'
    case 6: return 'DHU'
    case 7: return 'N3U'
    case 8: return 'CLIENT_SUBNET'
    case 9: return 'EXPIRE'
    case 10: return 'COOKIE'
    case 11: return 'TCP_KEEPALIVE'
    case 12: return 'PADDING'
    case 13: return 'CHAIN'
    case 14: return 'KEY_TAG'
    case 26946: return 'DEVICEID'
  }
  if (type < 0) {
    return null
  }
  return `OPTION_${type}`
};

var toCode = function (name) {
  if (typeof name === 'number') {
    return name
  }
  if (!name) {
    return -1
  }
  switch (name.toUpperCase()) {
    case 'OPTION_0': return 0
    case 'LLQ': return 1
    case 'UL': return 2
    case 'NSID': return 3
    case 'OPTION_4': return 4
    case 'DAU': return 5
    case 'DHU': return 6
    case 'N3U': return 7
    case 'CLIENT_SUBNET': return 8
    case 'EXPIRE': return 9
    case 'COOKIE': return 10
    case 'TCP_KEEPALIVE': return 11
    case 'PADDING': return 12
    case 'CHAIN': return 13
    case 'KEY_TAG': return 14
    case 'DEVICEID': return 26946
    case 'OPTION_65535': return 65535
  }
  const m = name.match(/_(\d+)$/);
  if (m) {
    return parseInt(m[1], 10)
  }
  return -1
};

var optioncodes = {
	toString: toString_1$5,
	toCode: toCode
};

const v4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
const v4Size = 4;
const v6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
const v6Size = 16;

const v4 = {
  name: 'v4',
  size: v4Size,
  isFormat: ip => v4Regex.test(ip),
  encode (ip, buff, offset) {
    offset = ~~offset;
    buff = buff || new Uint8Array(offset + v4Size);
    const max = ip.length;
    let n = 0;
    for (let i = 0; i < max;) {
      const c = ip.charCodeAt(i++);
      if (c === 46) { // "."
        buff[offset++] = n;
        n = 0;
      } else {
        n = n * 10 + (c - 48);
      }
    }
    buff[offset] = n;
    return buff
  },
  decode (buff, offset) {
    offset = ~~offset;
    return `${buff[offset++]}.${buff[offset++]}.${buff[offset++]}.${buff[offset]}`
  }
};

const v6 = {
  name: 'v6',
  size: v6Size,
  isFormat: ip => ip.length > 0 && v6Regex.test(ip),
  encode (ip, buff, offset) {
    offset = ~~offset;
    let end = offset + v6Size;
    let fill = -1;
    let hexN = 0;
    let decN = 0;
    let prevColon = true;
    let useDec = false;
    buff = buff || new Uint8Array(offset + v6Size);
    // Note: This algorithm needs to check if the offset
    // could exceed the buffer boundaries as it supports
    // non-standard compliant encodings that may go beyond
    // the boundary limits. if (offset < end) checks should
    // not be necessary...
    for (let i = 0; i < ip.length; i++) {
      let c = ip.charCodeAt(i);
      if (c === 58) { // :
        if (prevColon) {
          if (fill !== -1) {
            // Not Standard! (standard doesn't allow multiple ::)
            // We need to treat
            if (offset < end) buff[offset] = 0;
            if (offset < end - 1) buff[offset + 1] = 0;
            offset += 2;
          } else if (offset < end) {
            // :: in the middle
            fill = offset;
          }
        } else {
          // : ends the previous number
          if (useDec === true) {
            // Non-standard! (ipv4 should be at end only)
            // A ipv4 address should not be found anywhere else but at
            // the end. This codec also support putting characters
            // after the ipv4 address..
            if (offset < end) buff[offset] = decN;
            offset++;
          } else {
            if (offset < end) buff[offset] = hexN >> 8;
            if (offset < end - 1) buff[offset + 1] = hexN & 0xff;
            offset += 2;
          }
          hexN = 0;
          decN = 0;
        }
        prevColon = true;
        useDec = false;
      } else if (c === 46) { // . indicates IPV4 notation
        if (offset < end) buff[offset] = decN;
        offset++;
        decN = 0;
        hexN = 0;
        prevColon = false;
        useDec = true;
      } else {
        prevColon = false;
        if (c >= 97) {
          c -= 87; // a-f ... 97~102 -87 => 10~15
        } else if (c >= 65) {
          c -= 55; // A-F ... 65~70 -55 => 10~15
        } else {
          c -= 48; // 0-9 ... starting from charCode 48
          decN = decN * 10 + c;
        }
        // We don't know yet if its a dec or hex number
        hexN = (hexN << 4) + c;
      }
    }
    if (prevColon === false) {
      // Commiting last number
      if (useDec === true) {
        if (offset < end) buff[offset] = decN;
        offset++;
      } else {
        if (offset < end) buff[offset] = hexN >> 8;
        if (offset < end - 1) buff[offset + 1] = hexN & 0xff;
        offset += 2;
      }
    } else if (fill === 0) {
      // Not Standard! (standard doesn't allow multiple ::)
      // This means that a : was found at the start AND end which means the
      // end needs to be treated as 0 entry...
      if (offset < end) buff[offset] = 0;
      if (offset < end - 1) buff[offset + 1] = 0;
      offset += 2;
    } else if (fill !== -1) {
      // Non-standard! (standard doens't allow multiple ::)
      // Here we find that there has been a :: somewhere in the middle
      // and the end. To treat the end with priority we need to move all
      // written data two bytes to the right.
      offset += 2;
      for (let i = Math.min(offset - 1, end - 1); i >= fill + 2; i--) {
        buff[i] = buff[i - 2];
      }
      buff[fill] = 0;
      buff[fill + 1] = 0;
      fill = offset;
    }
    if (fill !== offset && fill !== -1) {
      // Move the written numbers to the end while filling the everything
      // "fill" to the bytes with zeros.
      if (offset > end - 2) {
        // Non Standard support, when the cursor exceeds bounds.
        offset = end - 2;
      }
      while (end > fill) {
        buff[--end] = offset < end && offset > fill ? buff[--offset] : 0;
      }
    } else {
      // Fill the rest with zeros
      while (offset < end) {
        buff[offset++] = 0;
      }
    }
    return buff
  },
  decode (buff, offset) {
    offset = ~~offset;
    let result = '';
    for (let i = 0; i < v6Size; i += 2) {
      if (i !== 0) {
        result += ':';
      }
      result += (buff[offset + i] << 8 | buff[offset + i + 1]).toString(16);
    }
    return result
      .replace(/(^|:)0(:0)*:0(:|$)/, '$1::$3')
      .replace(/:{3,4}/, '::')
  }
};

function sizeOf (ip) {
  if (v4.isFormat(ip)) return v4.size
  if (v6.isFormat(ip)) return v6.size
  throw Error(`Invalid ip address: ${ip}`)
}

var ipCodec = Object.freeze({
  name: 'ip',
  sizeOf,
  familyOf: string => sizeOf(string) === v4.size ? 1 : 2,
  v4,
  v6,
  encode (ip, buff, offset) {
    offset = ~~offset;
    const size = sizeOf(ip);
    if (typeof buff === 'function') {
      buff = buff(offset + size);
    }
    if (size === v4.size) {
      return v4.encode(ip, buff, offset)
    }
    return v6.encode(ip, buff, offset)
  },
  decode (buff, offset, length) {
    offset = ~~offset;
    length = length || (buff.length - offset);
    if (length === v4.size) {
      return v4.decode(buff, offset, length)
    }
    if (length === v6.size) {
      return v6.decode(buff, offset, length)
    }
    throw Error(`Invalid buffer size needs to be ${v4.size} for v4 or ${v6.size} for v6.`)
  }
});

var dnsPacket = createCommonjsModule(function (module, exports) {

const Buffer = buffer.Buffer;







const QUERY_FLAG = 0;
const RESPONSE_FLAG = 1 << 15;
const FLUSH_MASK = 1 << 15;
const NOT_FLUSH_MASK = ~FLUSH_MASK;
const QU_MASK = 1 << 15;
const NOT_QU_MASK = ~QU_MASK;

const name = exports.name = {};

name.encode = function (str, buf, offset) {
  if (!buf) buf = Buffer.alloc(name.encodingLength(str));
  if (!offset) offset = 0;
  const oldOffset = offset;

  // strip leading and trailing .
  const n = str.replace(/^\.|\.$/gm, '');
  if (n.length) {
    const list = n.split('.');

    for (let i = 0; i < list.length; i++) {
      const len = buf.write(list[i], offset + 1);
      buf[offset] = len;
      offset += len + 1;
    }
  }

  buf[offset++] = 0;

  name.encode.bytes = offset - oldOffset;
  return buf
};

name.encode.bytes = 0;

name.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const list = [];
  let oldOffset = offset;
  let totalLength = 0;
  let consumedBytes = 0;
  let jumped = false;

  while (true) {
    if (offset >= buf.length) {
      throw new Error('Cannot decode name (buffer overflow)')
    }
    const len = buf[offset++];
    consumedBytes += jumped ? 0 : 1;

    if (len === 0) {
      break
    } else if ((len & 0xc0) === 0) {
      if (offset + len > buf.length) {
        throw new Error('Cannot decode name (buffer overflow)')
      }
      totalLength += len + 1;
      if (totalLength > 254) {
        throw new Error('Cannot decode name (name too long)')
      }
      list.push(buf.toString('utf-8', offset, offset + len));
      offset += len;
      consumedBytes += jumped ? 0 : len;
    } else if ((len & 0xc0) === 0xc0) {
      if (offset + 1 > buf.length) {
        throw new Error('Cannot decode name (buffer overflow)')
      }
      const jumpOffset = buf.readUInt16BE(offset - 1) - 0xc000;
      if (jumpOffset >= oldOffset) {
        // Allow only pointers to prior data. RFC 1035, section 4.1.4 states:
        // "[...] an entire domain name or a list of labels at the end of a domain name
        // is replaced with a pointer to a prior occurance (sic) of the same name."
        throw new Error('Cannot decode name (bad pointer)')
      }
      offset = jumpOffset;
      oldOffset = jumpOffset;
      consumedBytes += jumped ? 0 : 1;
      jumped = true;
    } else {
      throw new Error('Cannot decode name (bad label)')
    }
  }

  name.decode.bytes = consumedBytes;
  return list.length === 0 ? '.' : list.join('.')
};

name.decode.bytes = 0;

name.encodingLength = function (n) {
  if (n === '.' || n === '..') return 1
  return Buffer.byteLength(n.replace(/^\.|\.$/gm, '')) + 2
};

const string = {};

string.encode = function (s, buf, offset) {
  if (!buf) buf = Buffer.alloc(string.encodingLength(s));
  if (!offset) offset = 0;

  const len = buf.write(s, offset + 1);
  buf[offset] = len;
  string.encode.bytes = len + 1;
  return buf
};

string.encode.bytes = 0;

string.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const len = buf[offset];
  const s = buf.toString('utf-8', offset + 1, offset + 1 + len);
  string.decode.bytes = len + 1;
  return s
};

string.decode.bytes = 0;

string.encodingLength = function (s) {
  return Buffer.byteLength(s) + 1
};

const header = {};

header.encode = function (h, buf, offset) {
  if (!buf) buf = header.encodingLength(h);
  if (!offset) offset = 0;

  const flags = (h.flags || 0) & 32767;
  const type = h.type === 'response' ? RESPONSE_FLAG : QUERY_FLAG;

  buf.writeUInt16BE(h.id || 0, offset);
  buf.writeUInt16BE(flags | type, offset + 2);
  buf.writeUInt16BE(h.questions.length, offset + 4);
  buf.writeUInt16BE(h.answers.length, offset + 6);
  buf.writeUInt16BE(h.authorities.length, offset + 8);
  buf.writeUInt16BE(h.additionals.length, offset + 10);

  return buf
};

header.encode.bytes = 12;

header.decode = function (buf, offset) {
  if (!offset) offset = 0;
  if (buf.length < 12) throw new Error('Header must be 12 bytes')
  const flags = buf.readUInt16BE(offset + 2);

  return {
    id: buf.readUInt16BE(offset),
    type: flags & RESPONSE_FLAG ? 'response' : 'query',
    flags: flags & 32767,
    flag_qr: ((flags >> 15) & 0x1) === 1,
    opcode: opcodes.toString((flags >> 11) & 0xf),
    flag_aa: ((flags >> 10) & 0x1) === 1,
    flag_tc: ((flags >> 9) & 0x1) === 1,
    flag_rd: ((flags >> 8) & 0x1) === 1,
    flag_ra: ((flags >> 7) & 0x1) === 1,
    flag_z: ((flags >> 6) & 0x1) === 1,
    flag_ad: ((flags >> 5) & 0x1) === 1,
    flag_cd: ((flags >> 4) & 0x1) === 1,
    rcode: rcodes.toString(flags & 0xf),
    questions: new Array(buf.readUInt16BE(offset + 4)),
    answers: new Array(buf.readUInt16BE(offset + 6)),
    authorities: new Array(buf.readUInt16BE(offset + 8)),
    additionals: new Array(buf.readUInt16BE(offset + 10))
  }
};

header.decode.bytes = 12;

header.encodingLength = function () {
  return 12
};

const runknown = exports.unknown = {};

runknown.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(runknown.encodingLength(data));
  if (!offset) offset = 0;

  buf.writeUInt16BE(data.length, offset);
  data.copy(buf, offset + 2);

  runknown.encode.bytes = data.length + 2;
  return buf
};

runknown.encode.bytes = 0;

runknown.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const len = buf.readUInt16BE(offset);
  const data = buf.slice(offset + 2, offset + 2 + len);
  runknown.decode.bytes = len + 2;
  return data
};

runknown.decode.bytes = 0;

runknown.encodingLength = function (data) {
  return data.length + 2
};

const rns = exports.ns = {};

rns.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rns.encodingLength(data));
  if (!offset) offset = 0;

  name.encode(data, buf, offset + 2);
  buf.writeUInt16BE(name.encode.bytes, offset);
  rns.encode.bytes = name.encode.bytes + 2;
  return buf
};

rns.encode.bytes = 0;

rns.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const len = buf.readUInt16BE(offset);
  const dd = name.decode(buf, offset + 2);

  rns.decode.bytes = len + 2;
  return dd
};

rns.decode.bytes = 0;

rns.encodingLength = function (data) {
  return name.encodingLength(data) + 2
};

const rsoa = exports.soa = {};

rsoa.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rsoa.encodingLength(data));
  if (!offset) offset = 0;

  const oldOffset = offset;
  offset += 2;
  name.encode(data.mname, buf, offset);
  offset += name.encode.bytes;
  name.encode(data.rname, buf, offset);
  offset += name.encode.bytes;
  buf.writeUInt32BE(data.serial || 0, offset);
  offset += 4;
  buf.writeUInt32BE(data.refresh || 0, offset);
  offset += 4;
  buf.writeUInt32BE(data.retry || 0, offset);
  offset += 4;
  buf.writeUInt32BE(data.expire || 0, offset);
  offset += 4;
  buf.writeUInt32BE(data.minimum || 0, offset);
  offset += 4;

  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
  rsoa.encode.bytes = offset - oldOffset;
  return buf
};

rsoa.encode.bytes = 0;

rsoa.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const oldOffset = offset;

  const data = {};
  offset += 2;
  data.mname = name.decode(buf, offset);
  offset += name.decode.bytes;
  data.rname = name.decode(buf, offset);
  offset += name.decode.bytes;
  data.serial = buf.readUInt32BE(offset);
  offset += 4;
  data.refresh = buf.readUInt32BE(offset);
  offset += 4;
  data.retry = buf.readUInt32BE(offset);
  offset += 4;
  data.expire = buf.readUInt32BE(offset);
  offset += 4;
  data.minimum = buf.readUInt32BE(offset);
  offset += 4;

  rsoa.decode.bytes = offset - oldOffset;
  return data
};

rsoa.decode.bytes = 0;

rsoa.encodingLength = function (data) {
  return 22 + name.encodingLength(data.mname) + name.encodingLength(data.rname)
};

const rtxt = exports.txt = {};

rtxt.encode = function (data, buf, offset) {
  if (!Array.isArray(data)) data = [data];
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === 'string') {
      data[i] = Buffer.from(data[i]);
    }
    if (!Buffer.isBuffer(data[i])) {
      throw new Error('Must be a Buffer')
    }
  }

  if (!buf) buf = Buffer.alloc(rtxt.encodingLength(data));
  if (!offset) offset = 0;

  const oldOffset = offset;
  offset += 2;

  data.forEach(function (d) {
    buf[offset++] = d.length;
    d.copy(buf, offset, 0, d.length);
    offset += d.length;
  });

  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
  rtxt.encode.bytes = offset - oldOffset;
  return buf
};

rtxt.encode.bytes = 0;

rtxt.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;
  let remaining = buf.readUInt16BE(offset);
  offset += 2;

  let data = [];
  while (remaining > 0) {
    const len = buf[offset++];
    --remaining;
    if (remaining < len) {
      throw new Error('Buffer overflow')
    }
    data.push(buf.slice(offset, offset + len));
    offset += len;
    remaining -= len;
  }

  rtxt.decode.bytes = offset - oldOffset;
  return data
};

rtxt.decode.bytes = 0;

rtxt.encodingLength = function (data) {
  if (!Array.isArray(data)) data = [data];
  let length = 2;
  data.forEach(function (buf) {
    if (typeof buf === 'string') {
      length += Buffer.byteLength(buf) + 1;
    } else {
      length += buf.length + 1;
    }
  });
  return length
};

const rnull = exports.null = {};

rnull.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rnull.encodingLength(data));
  if (!offset) offset = 0;

  if (typeof data === 'string') data = Buffer.from(data);
  if (!data) data = Buffer.alloc(0);

  const oldOffset = offset;
  offset += 2;

  const len = data.length;
  data.copy(buf, offset, 0, len);
  offset += len;

  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
  rnull.encode.bytes = offset - oldOffset;
  return buf
};

rnull.encode.bytes = 0;

rnull.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;
  const len = buf.readUInt16BE(offset);

  offset += 2;

  const data = buf.slice(offset, offset + len);
  offset += len;

  rnull.decode.bytes = offset - oldOffset;
  return data
};

rnull.decode.bytes = 0;

rnull.encodingLength = function (data) {
  if (!data) return 2
  return (Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data)) + 2
};

const rhinfo = exports.hinfo = {};

rhinfo.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rhinfo.encodingLength(data));
  if (!offset) offset = 0;

  const oldOffset = offset;
  offset += 2;
  string.encode(data.cpu, buf, offset);
  offset += string.encode.bytes;
  string.encode(data.os, buf, offset);
  offset += string.encode.bytes;
  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
  rhinfo.encode.bytes = offset - oldOffset;
  return buf
};

rhinfo.encode.bytes = 0;

rhinfo.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const oldOffset = offset;

  const data = {};
  offset += 2;
  data.cpu = string.decode(buf, offset);
  offset += string.decode.bytes;
  data.os = string.decode(buf, offset);
  offset += string.decode.bytes;
  rhinfo.decode.bytes = offset - oldOffset;
  return data
};

rhinfo.decode.bytes = 0;

rhinfo.encodingLength = function (data) {
  return string.encodingLength(data.cpu) + string.encodingLength(data.os) + 2
};

const rptr = exports.ptr = {};
const rcname = exports.cname = rptr;
const rdname = exports.dname = rptr;

rptr.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rptr.encodingLength(data));
  if (!offset) offset = 0;

  name.encode(data, buf, offset + 2);
  buf.writeUInt16BE(name.encode.bytes, offset);
  rptr.encode.bytes = name.encode.bytes + 2;
  return buf
};

rptr.encode.bytes = 0;

rptr.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const data = name.decode(buf, offset + 2);
  rptr.decode.bytes = name.decode.bytes + 2;
  return data
};

rptr.decode.bytes = 0;

rptr.encodingLength = function (data) {
  return name.encodingLength(data) + 2
};

const rsrv = exports.srv = {};

rsrv.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rsrv.encodingLength(data));
  if (!offset) offset = 0;

  buf.writeUInt16BE(data.priority || 0, offset + 2);
  buf.writeUInt16BE(data.weight || 0, offset + 4);
  buf.writeUInt16BE(data.port || 0, offset + 6);
  name.encode(data.target, buf, offset + 8);

  const len = name.encode.bytes + 6;
  buf.writeUInt16BE(len, offset);

  rsrv.encode.bytes = len + 2;
  return buf
};

rsrv.encode.bytes = 0;

rsrv.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const len = buf.readUInt16BE(offset);

  const data = {};
  data.priority = buf.readUInt16BE(offset + 2);
  data.weight = buf.readUInt16BE(offset + 4);
  data.port = buf.readUInt16BE(offset + 6);
  data.target = name.decode(buf, offset + 8);

  rsrv.decode.bytes = len + 2;
  return data
};

rsrv.decode.bytes = 0;

rsrv.encodingLength = function (data) {
  return 8 + name.encodingLength(data.target)
};

const rcaa = exports.caa = {};

rcaa.ISSUER_CRITICAL = 1 << 7;

rcaa.encode = function (data, buf, offset) {
  const len = rcaa.encodingLength(data);

  if (!buf) buf = Buffer.alloc(rcaa.encodingLength(data));
  if (!offset) offset = 0;

  if (data.issuerCritical) {
    data.flags = rcaa.ISSUER_CRITICAL;
  }

  buf.writeUInt16BE(len - 2, offset);
  offset += 2;
  buf.writeUInt8(data.flags || 0, offset);
  offset += 1;
  string.encode(data.tag, buf, offset);
  offset += string.encode.bytes;
  buf.write(data.value, offset);
  offset += Buffer.byteLength(data.value);

  rcaa.encode.bytes = len;
  return buf
};

rcaa.encode.bytes = 0;

rcaa.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const len = buf.readUInt16BE(offset);
  offset += 2;

  const oldOffset = offset;
  const data = {};
  data.flags = buf.readUInt8(offset);
  offset += 1;
  data.tag = string.decode(buf, offset);
  offset += string.decode.bytes;
  data.value = buf.toString('utf-8', offset, oldOffset + len);

  data.issuerCritical = !!(data.flags & rcaa.ISSUER_CRITICAL);

  rcaa.decode.bytes = len + 2;

  return data
};

rcaa.decode.bytes = 0;

rcaa.encodingLength = function (data) {
  return string.encodingLength(data.tag) + string.encodingLength(data.value) + 2
};

const rmx = exports.mx = {};

rmx.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rmx.encodingLength(data));
  if (!offset) offset = 0;

  const oldOffset = offset;
  offset += 2;
  buf.writeUInt16BE(data.preference || 0, offset);
  offset += 2;
  name.encode(data.exchange, buf, offset);
  offset += name.encode.bytes;

  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
  rmx.encode.bytes = offset - oldOffset;
  return buf
};

rmx.encode.bytes = 0;

rmx.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const oldOffset = offset;

  const data = {};
  offset += 2;
  data.preference = buf.readUInt16BE(offset);
  offset += 2;
  data.exchange = name.decode(buf, offset);
  offset += name.decode.bytes;

  rmx.decode.bytes = offset - oldOffset;
  return data
};

rmx.encodingLength = function (data) {
  return 4 + name.encodingLength(data.exchange)
};

const ra = exports.a = {};

ra.encode = function (host, buf, offset) {
  if (!buf) buf = Buffer.alloc(ra.encodingLength(host));
  if (!offset) offset = 0;

  buf.writeUInt16BE(4, offset);
  offset += 2;
  ipCodec.v4.encode(host, buf, offset);
  ra.encode.bytes = 6;
  return buf
};

ra.encode.bytes = 0;

ra.decode = function (buf, offset) {
  if (!offset) offset = 0;

  offset += 2;
  const host = ipCodec.v4.decode(buf, offset);
  ra.decode.bytes = 6;
  return host
};

ra.decode.bytes = 0;

ra.encodingLength = function () {
  return 6
};

const raaaa = exports.aaaa = {};

raaaa.encode = function (host, buf, offset) {
  if (!buf) buf = Buffer.alloc(raaaa.encodingLength(host));
  if (!offset) offset = 0;

  buf.writeUInt16BE(16, offset);
  offset += 2;
  ipCodec.v6.encode(host, buf, offset);
  raaaa.encode.bytes = 18;
  return buf
};

raaaa.encode.bytes = 0;

raaaa.decode = function (buf, offset) {
  if (!offset) offset = 0;

  offset += 2;
  const host = ipCodec.v6.decode(buf, offset);
  raaaa.decode.bytes = 18;
  return host
};

raaaa.decode.bytes = 0;

raaaa.encodingLength = function () {
  return 18
};

const roption = exports.option = {};

roption.encode = function (option, buf, offset) {
  if (!buf) buf = Buffer.alloc(roption.encodingLength(option));
  if (!offset) offset = 0;
  const oldOffset = offset;

  const code = optioncodes.toCode(option.code);
  buf.writeUInt16BE(code, offset);
  offset += 2;
  if (option.data) {
    buf.writeUInt16BE(option.data.length, offset);
    offset += 2;
    option.data.copy(buf, offset);
    offset += option.data.length;
  } else {
    switch (code) {
      // case 3: NSID.  No encode makes sense.
      // case 5,6,7: Not implementable
      case 8: // ECS
        // note: do IP math before calling
        const spl = option.sourcePrefixLength || 0;
        const fam = option.family || ipCodec.familyOf(option.ip);
        const ipBuf = ipCodec.encode(option.ip, Buffer.alloc);
        const ipLen = Math.ceil(spl / 8);
        buf.writeUInt16BE(ipLen + 4, offset);
        offset += 2;
        buf.writeUInt16BE(fam, offset);
        offset += 2;
        buf.writeUInt8(spl, offset++);
        buf.writeUInt8(option.scopePrefixLength || 0, offset++);

        ipBuf.copy(buf, offset, 0, ipLen);
        offset += ipLen;
        break
      // case 9: EXPIRE (experimental)
      // case 10: COOKIE.  No encode makes sense.
      case 11: // KEEP-ALIVE
        if (option.timeout) {
          buf.writeUInt16BE(2, offset);
          offset += 2;
          buf.writeUInt16BE(option.timeout, offset);
          offset += 2;
        } else {
          buf.writeUInt16BE(0, offset);
          offset += 2;
        }
        break
      case 12: // PADDING
        const len = option.length || 0;
        buf.writeUInt16BE(len, offset);
        offset += 2;
        buf.fill(0, offset, offset + len);
        offset += len;
        break
      // case 13:  CHAIN.  Experimental.
      case 14: // KEY-TAG
        const tagsLen = option.tags.length * 2;
        buf.writeUInt16BE(tagsLen, offset);
        offset += 2;
        for (const tag of option.tags) {
          buf.writeUInt16BE(tag, offset);
          offset += 2;
        }
        break
      default:
        throw new Error(`Unknown roption code: ${option.code}`)
    }
  }

  roption.encode.bytes = offset - oldOffset;
  return buf
};

roption.encode.bytes = 0;

roption.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const option = {};
  option.code = buf.readUInt16BE(offset);
  option.type = optioncodes.toString(option.code);
  offset += 2;
  const len = buf.readUInt16BE(offset);
  offset += 2;
  option.data = buf.slice(offset, offset + len);
  switch (option.code) {
    // case 3: NSID.  No decode makes sense.
    case 8: // ECS
      option.family = buf.readUInt16BE(offset);
      offset += 2;
      option.sourcePrefixLength = buf.readUInt8(offset++);
      option.scopePrefixLength = buf.readUInt8(offset++);
      const padded = Buffer.alloc((option.family === 1) ? 4 : 16);
      buf.copy(padded, 0, offset, offset + len - 4);
      option.ip = ipCodec.decode(padded);
      break
    // case 12: Padding.  No decode makes sense.
    case 11: // KEEP-ALIVE
      if (len > 0) {
        option.timeout = buf.readUInt16BE(offset);
        offset += 2;
      }
      break
    case 14:
      option.tags = [];
      for (let i = 0; i < len; i += 2) {
        option.tags.push(buf.readUInt16BE(offset));
        offset += 2;
      }
    // don't worry about default.  caller will use data if desired
  }

  roption.decode.bytes = len + 4;
  return option
};

roption.decode.bytes = 0;

roption.encodingLength = function (option) {
  if (option.data) {
    return option.data.length + 4
  }
  const code = optioncodes.toCode(option.code);
  switch (code) {
    case 8: // ECS
      const spl = option.sourcePrefixLength || 0;
      return Math.ceil(spl / 8) + 8
    case 11: // KEEP-ALIVE
      return (typeof option.timeout === 'number') ? 6 : 4
    case 12: // PADDING
      return option.length + 4
    case 14: // KEY-TAG
      return 4 + (option.tags.length * 2)
  }
  throw new Error(`Unknown roption code: ${option.code}`)
};

const ropt = exports.opt = {};

ropt.encode = function (options, buf, offset) {
  if (!buf) buf = Buffer.alloc(ropt.encodingLength(options));
  if (!offset) offset = 0;
  const oldOffset = offset;

  const rdlen = encodingLengthList(options, roption);
  buf.writeUInt16BE(rdlen, offset);
  offset = encodeList(options, roption, buf, offset + 2);

  ropt.encode.bytes = offset - oldOffset;
  return buf
};

ropt.encode.bytes = 0;

ropt.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  const options = [];
  let rdlen = buf.readUInt16BE(offset);
  offset += 2;
  let o = 0;
  while (rdlen > 0) {
    options[o++] = roption.decode(buf, offset);
    offset += roption.decode.bytes;
    rdlen -= roption.decode.bytes;
  }
  ropt.decode.bytes = offset - oldOffset;
  return options
};

ropt.decode.bytes = 0;

ropt.encodingLength = function (options) {
  return 2 + encodingLengthList(options || [], roption)
};

const rdnskey = exports.dnskey = {};

rdnskey.PROTOCOL_DNSSEC = 3;
rdnskey.ZONE_KEY = 0x80;
rdnskey.SECURE_ENTRYPOINT = 0x8000;

rdnskey.encode = function (key, buf, offset) {
  if (!buf) buf = Buffer.alloc(rdnskey.encodingLength(key));
  if (!offset) offset = 0;
  const oldOffset = offset;

  const keydata = key.key;
  if (!Buffer.isBuffer(keydata)) {
    throw new Error('Key must be a Buffer')
  }

  offset += 2; // Leave space for length
  buf.writeUInt16BE(key.flags, offset);
  offset += 2;
  buf.writeUInt8(rdnskey.PROTOCOL_DNSSEC, offset);
  offset += 1;
  buf.writeUInt8(key.algorithm, offset);
  offset += 1;
  keydata.copy(buf, offset, 0, keydata.length);
  offset += keydata.length;

  rdnskey.encode.bytes = offset - oldOffset;
  buf.writeUInt16BE(rdnskey.encode.bytes - 2, oldOffset);
  return buf
};

rdnskey.encode.bytes = 0;

rdnskey.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  var key = {};
  var length = buf.readUInt16BE(offset);
  offset += 2;
  key.flags = buf.readUInt16BE(offset);
  offset += 2;
  if (buf.readUInt8(offset) !== rdnskey.PROTOCOL_DNSSEC) {
    throw new Error('Protocol must be 3')
  }
  offset += 1;
  key.algorithm = buf.readUInt8(offset);
  offset += 1;
  key.key = buf.slice(offset, oldOffset + length + 2);
  offset += key.key.length;
  rdnskey.decode.bytes = offset - oldOffset;
  return key
};

rdnskey.decode.bytes = 0;

rdnskey.encodingLength = function (key) {
  return 6 + Buffer.byteLength(key.key)
};

const rrrsig = exports.rrsig = {};

rrrsig.encode = function (sig, buf, offset) {
  if (!buf) buf = Buffer.alloc(rrrsig.encodingLength(sig));
  if (!offset) offset = 0;
  const oldOffset = offset;

  const signature = sig.signature;
  if (!Buffer.isBuffer(signature)) {
    throw new Error('Signature must be a Buffer')
  }

  offset += 2; // Leave space for length
  buf.writeUInt16BE(types.toType(sig.typeCovered), offset);
  offset += 2;
  buf.writeUInt8(sig.algorithm, offset);
  offset += 1;
  buf.writeUInt8(sig.labels, offset);
  offset += 1;
  buf.writeUInt32BE(sig.originalTTL, offset);
  offset += 4;
  buf.writeUInt32BE(sig.expiration, offset);
  offset += 4;
  buf.writeUInt32BE(sig.inception, offset);
  offset += 4;
  buf.writeUInt16BE(sig.keyTag, offset);
  offset += 2;
  name.encode(sig.signersName, buf, offset);
  offset += name.encode.bytes;
  signature.copy(buf, offset, 0, signature.length);
  offset += signature.length;

  rrrsig.encode.bytes = offset - oldOffset;
  buf.writeUInt16BE(rrrsig.encode.bytes - 2, oldOffset);
  return buf
};

rrrsig.encode.bytes = 0;

rrrsig.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  var sig = {};
  var length = buf.readUInt16BE(offset);
  offset += 2;
  sig.typeCovered = types.toString(buf.readUInt16BE(offset));
  offset += 2;
  sig.algorithm = buf.readUInt8(offset);
  offset += 1;
  sig.labels = buf.readUInt8(offset);
  offset += 1;
  sig.originalTTL = buf.readUInt32BE(offset);
  offset += 4;
  sig.expiration = buf.readUInt32BE(offset);
  offset += 4;
  sig.inception = buf.readUInt32BE(offset);
  offset += 4;
  sig.keyTag = buf.readUInt16BE(offset);
  offset += 2;
  sig.signersName = name.decode(buf, offset);
  offset += name.decode.bytes;
  sig.signature = buf.slice(offset, oldOffset + length + 2);
  offset += sig.signature.length;
  rrrsig.decode.bytes = offset - oldOffset;
  return sig
};

rrrsig.decode.bytes = 0;

rrrsig.encodingLength = function (sig) {
  return 20 +
    name.encodingLength(sig.signersName) +
    Buffer.byteLength(sig.signature)
};

const rrp = exports.rp = {};

rrp.encode = function (data, buf, offset) {
  if (!buf) buf = Buffer.alloc(rrp.encodingLength(data));
  if (!offset) offset = 0;
  const oldOffset = offset;

  offset += 2; // Leave space for length
  name.encode(data.mbox || '.', buf, offset);
  offset += name.encode.bytes;
  name.encode(data.txt || '.', buf, offset);
  offset += name.encode.bytes;
  rrp.encode.bytes = offset - oldOffset;
  buf.writeUInt16BE(rrp.encode.bytes - 2, oldOffset);
  return buf
};

rrp.encode.bytes = 0;

rrp.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  const data = {};
  offset += 2;
  data.mbox = name.decode(buf, offset) || '.';
  offset += name.decode.bytes;
  data.txt = name.decode(buf, offset) || '.';
  offset += name.decode.bytes;
  rrp.decode.bytes = offset - oldOffset;
  return data
};

rrp.decode.bytes = 0;

rrp.encodingLength = function (data) {
  return 2 + name.encodingLength(data.mbox || '.') + name.encodingLength(data.txt || '.')
};

const typebitmap = {};

typebitmap.encode = function (typelist, buf, offset) {
  if (!buf) buf = Buffer.alloc(typebitmap.encodingLength(typelist));
  if (!offset) offset = 0;
  const oldOffset = offset;

  var typesByWindow = [];
  for (var i = 0; i < typelist.length; i++) {
    var typeid = types.toType(typelist[i]);
    if (typesByWindow[typeid >> 8] === undefined) {
      typesByWindow[typeid >> 8] = [];
    }
    typesByWindow[typeid >> 8][(typeid >> 3) & 0x1F] |= 1 << (7 - (typeid & 0x7));
  }

  for (i = 0; i < typesByWindow.length; i++) {
    if (typesByWindow[i] !== undefined) {
      var windowBuf = Buffer.from(typesByWindow[i]);
      buf.writeUInt8(i, offset);
      offset += 1;
      buf.writeUInt8(windowBuf.length, offset);
      offset += 1;
      windowBuf.copy(buf, offset);
      offset += windowBuf.length;
    }
  }

  typebitmap.encode.bytes = offset - oldOffset;
  return buf
};

typebitmap.encode.bytes = 0;

typebitmap.decode = function (buf, offset, length) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  var typelist = [];
  while (offset - oldOffset < length) {
    var window = buf.readUInt8(offset);
    offset += 1;
    var windowLength = buf.readUInt8(offset);
    offset += 1;
    for (var i = 0; i < windowLength; i++) {
      var b = buf.readUInt8(offset + i);
      for (var j = 0; j < 8; j++) {
        if (b & (1 << (7 - j))) {
          var typeid = types.toString((window << 8) | (i << 3) | j);
          typelist.push(typeid);
        }
      }
    }
    offset += windowLength;
  }

  typebitmap.decode.bytes = offset - oldOffset;
  return typelist
};

typebitmap.decode.bytes = 0;

typebitmap.encodingLength = function (typelist) {
  var extents = [];
  for (var i = 0; i < typelist.length; i++) {
    var typeid = types.toType(typelist[i]);
    extents[typeid >> 8] = Math.max(extents[typeid >> 8] || 0, typeid & 0xFF);
  }

  var len = 0;
  for (i = 0; i < extents.length; i++) {
    if (extents[i] !== undefined) {
      len += 2 + Math.ceil((extents[i] + 1) / 8);
    }
  }

  return len
};

const rnsec = exports.nsec = {};

rnsec.encode = function (record, buf, offset) {
  if (!buf) buf = Buffer.alloc(rnsec.encodingLength(record));
  if (!offset) offset = 0;
  const oldOffset = offset;

  offset += 2; // Leave space for length
  name.encode(record.nextDomain, buf, offset);
  offset += name.encode.bytes;
  typebitmap.encode(record.rrtypes, buf, offset);
  offset += typebitmap.encode.bytes;

  rnsec.encode.bytes = offset - oldOffset;
  buf.writeUInt16BE(rnsec.encode.bytes - 2, oldOffset);
  return buf
};

rnsec.encode.bytes = 0;

rnsec.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  var record = {};
  var length = buf.readUInt16BE(offset);
  offset += 2;
  record.nextDomain = name.decode(buf, offset);
  offset += name.decode.bytes;
  record.rrtypes = typebitmap.decode(buf, offset, length - (offset - oldOffset));
  offset += typebitmap.decode.bytes;

  rnsec.decode.bytes = offset - oldOffset;
  return record
};

rnsec.decode.bytes = 0;

rnsec.encodingLength = function (record) {
  return 2 +
    name.encodingLength(record.nextDomain) +
    typebitmap.encodingLength(record.rrtypes)
};

const rnsec3 = exports.nsec3 = {};

rnsec3.encode = function (record, buf, offset) {
  if (!buf) buf = Buffer.alloc(rnsec3.encodingLength(record));
  if (!offset) offset = 0;
  const oldOffset = offset;

  const salt = record.salt;
  if (!Buffer.isBuffer(salt)) {
    throw new Error('salt must be a Buffer')
  }

  const nextDomain = record.nextDomain;
  if (!Buffer.isBuffer(nextDomain)) {
    throw new Error('nextDomain must be a Buffer')
  }

  offset += 2; // Leave space for length
  buf.writeUInt8(record.algorithm, offset);
  offset += 1;
  buf.writeUInt8(record.flags, offset);
  offset += 1;
  buf.writeUInt16BE(record.iterations, offset);
  offset += 2;
  buf.writeUInt8(salt.length, offset);
  offset += 1;
  salt.copy(buf, offset, 0, salt.length);
  offset += salt.length;
  buf.writeUInt8(nextDomain.length, offset);
  offset += 1;
  nextDomain.copy(buf, offset, 0, nextDomain.length);
  offset += nextDomain.length;
  typebitmap.encode(record.rrtypes, buf, offset);
  offset += typebitmap.encode.bytes;

  rnsec3.encode.bytes = offset - oldOffset;
  buf.writeUInt16BE(rnsec3.encode.bytes - 2, oldOffset);
  return buf
};

rnsec3.encode.bytes = 0;

rnsec3.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  var record = {};
  var length = buf.readUInt16BE(offset);
  offset += 2;
  record.algorithm = buf.readUInt8(offset);
  offset += 1;
  record.flags = buf.readUInt8(offset);
  offset += 1;
  record.iterations = buf.readUInt16BE(offset);
  offset += 2;
  const saltLength = buf.readUInt8(offset);
  offset += 1;
  record.salt = buf.slice(offset, offset + saltLength);
  offset += saltLength;
  const hashLength = buf.readUInt8(offset);
  offset += 1;
  record.nextDomain = buf.slice(offset, offset + hashLength);
  offset += hashLength;
  record.rrtypes = typebitmap.decode(buf, offset, length - (offset - oldOffset));
  offset += typebitmap.decode.bytes;

  rnsec3.decode.bytes = offset - oldOffset;
  return record
};

rnsec3.decode.bytes = 0;

rnsec3.encodingLength = function (record) {
  return 8 +
    record.salt.length +
    record.nextDomain.length +
    typebitmap.encodingLength(record.rrtypes)
};

const rds = exports.ds = {};

rds.encode = function (digest, buf, offset) {
  if (!buf) buf = Buffer.alloc(rds.encodingLength(digest));
  if (!offset) offset = 0;
  const oldOffset = offset;

  const digestdata = digest.digest;
  if (!Buffer.isBuffer(digestdata)) {
    throw new Error('Digest must be a Buffer')
  }

  offset += 2; // Leave space for length
  buf.writeUInt16BE(digest.keyTag, offset);
  offset += 2;
  buf.writeUInt8(digest.algorithm, offset);
  offset += 1;
  buf.writeUInt8(digest.digestType, offset);
  offset += 1;
  digestdata.copy(buf, offset, 0, digestdata.length);
  offset += digestdata.length;

  rds.encode.bytes = offset - oldOffset;
  buf.writeUInt16BE(rds.encode.bytes - 2, oldOffset);
  return buf
};

rds.encode.bytes = 0;

rds.decode = function (buf, offset) {
  if (!offset) offset = 0;
  const oldOffset = offset;

  var digest = {};
  var length = buf.readUInt16BE(offset);
  offset += 2;
  digest.keyTag = buf.readUInt16BE(offset);
  offset += 2;
  digest.algorithm = buf.readUInt8(offset);
  offset += 1;
  digest.digestType = buf.readUInt8(offset);
  offset += 1;
  digest.digest = buf.slice(offset, oldOffset + length + 2);
  offset += digest.digest.length;
  rds.decode.bytes = offset - oldOffset;
  return digest
};

rds.decode.bytes = 0;

rds.encodingLength = function (digest) {
  return 6 + Buffer.byteLength(digest.digest)
};

const renc = exports.record = function (type) {
  switch (type.toUpperCase()) {
    case 'A': return ra
    case 'PTR': return rptr
    case 'CNAME': return rcname
    case 'DNAME': return rdname
    case 'TXT': return rtxt
    case 'NULL': return rnull
    case 'AAAA': return raaaa
    case 'SRV': return rsrv
    case 'HINFO': return rhinfo
    case 'CAA': return rcaa
    case 'NS': return rns
    case 'SOA': return rsoa
    case 'MX': return rmx
    case 'OPT': return ropt
    case 'DNSKEY': return rdnskey
    case 'RRSIG': return rrrsig
    case 'RP': return rrp
    case 'NSEC': return rnsec
    case 'NSEC3': return rnsec3
    case 'DS': return rds
  }
  return runknown
};

const answer = exports.answer = {};

answer.encode = function (a, buf, offset) {
  if (!buf) buf = Buffer.alloc(answer.encodingLength(a));
  if (!offset) offset = 0;

  const oldOffset = offset;

  name.encode(a.name, buf, offset);
  offset += name.encode.bytes;

  buf.writeUInt16BE(types.toType(a.type), offset);

  if (a.type.toUpperCase() === 'OPT') {
    if (a.name !== '.') {
      throw new Error('OPT name must be root.')
    }
    buf.writeUInt16BE(a.udpPayloadSize || 4096, offset + 2);
    buf.writeUInt8(a.extendedRcode || 0, offset + 4);
    buf.writeUInt8(a.ednsVersion || 0, offset + 5);
    buf.writeUInt16BE(a.flags || 0, offset + 6);

    offset += 8;
    ropt.encode(a.options || [], buf, offset);
    offset += ropt.encode.bytes;
  } else {
    let klass = classes.toClass(a.class === undefined ? 'IN' : a.class);
    if (a.flush) klass |= FLUSH_MASK; // the 1st bit of the class is the flush bit
    buf.writeUInt16BE(klass, offset + 2);
    buf.writeUInt32BE(a.ttl || 0, offset + 4);

    offset += 8;
    const enc = renc(a.type);
    enc.encode(a.data, buf, offset);
    offset += enc.encode.bytes;
  }

  answer.encode.bytes = offset - oldOffset;
  return buf
};

answer.encode.bytes = 0;

answer.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const a = {};
  const oldOffset = offset;

  a.name = name.decode(buf, offset);
  offset += name.decode.bytes;
  a.type = types.toString(buf.readUInt16BE(offset));
  if (a.type === 'OPT') {
    a.udpPayloadSize = buf.readUInt16BE(offset + 2);
    a.extendedRcode = buf.readUInt8(offset + 4);
    a.ednsVersion = buf.readUInt8(offset + 5);
    a.flags = buf.readUInt16BE(offset + 6);
    a.flag_do = ((a.flags >> 15) & 0x1) === 1;
    a.options = ropt.decode(buf, offset + 8);
    offset += 8 + ropt.decode.bytes;
  } else {
    const klass = buf.readUInt16BE(offset + 2);
    a.ttl = buf.readUInt32BE(offset + 4);

    a.class = classes.toString(klass & NOT_FLUSH_MASK);
    a.flush = !!(klass & FLUSH_MASK);

    const enc = renc(a.type);
    a.data = enc.decode(buf, offset + 8);
    offset += 8 + enc.decode.bytes;
  }

  answer.decode.bytes = offset - oldOffset;
  return a
};

answer.decode.bytes = 0;

answer.encodingLength = function (a) {
  const data = (a.data !== null && a.data !== undefined) ? a.data : a.options;
  return name.encodingLength(a.name) + 8 + renc(a.type).encodingLength(data)
};

const question = exports.question = {};

question.encode = function (q, buf, offset) {
  if (!buf) buf = Buffer.alloc(question.encodingLength(q));
  if (!offset) offset = 0;

  const oldOffset = offset;

  name.encode(q.name, buf, offset);
  offset += name.encode.bytes;

  buf.writeUInt16BE(types.toType(q.type), offset);
  offset += 2;

  buf.writeUInt16BE(classes.toClass(q.class === undefined ? 'IN' : q.class), offset);
  offset += 2;

  question.encode.bytes = offset - oldOffset;
  return q
};

question.encode.bytes = 0;

question.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const oldOffset = offset;
  const q = {};

  q.name = name.decode(buf, offset);
  offset += name.decode.bytes;

  q.type = types.toString(buf.readUInt16BE(offset));
  offset += 2;

  q.class = classes.toString(buf.readUInt16BE(offset));
  offset += 2;

  const qu = !!(q.class & QU_MASK);
  if (qu) q.class &= NOT_QU_MASK;

  question.decode.bytes = offset - oldOffset;
  return q
};

question.decode.bytes = 0;

question.encodingLength = function (q) {
  return name.encodingLength(q.name) + 4
};

exports.AUTHORITATIVE_ANSWER = 1 << 10;
exports.TRUNCATED_RESPONSE = 1 << 9;
exports.RECURSION_DESIRED = 1 << 8;
exports.RECURSION_AVAILABLE = 1 << 7;
exports.AUTHENTIC_DATA = 1 << 5;
exports.CHECKING_DISABLED = 1 << 4;
exports.DNSSEC_OK = 1 << 15;

exports.encode = function (result, buf, offset) {
  const allocing = !buf;

  if (allocing) buf = Buffer.alloc(exports.encodingLength(result));
  if (!offset) offset = 0;

  const oldOffset = offset;

  if (!result.questions) result.questions = [];
  if (!result.answers) result.answers = [];
  if (!result.authorities) result.authorities = [];
  if (!result.additionals) result.additionals = [];

  header.encode(result, buf, offset);
  offset += header.encode.bytes;

  offset = encodeList(result.questions, question, buf, offset);
  offset = encodeList(result.answers, answer, buf, offset);
  offset = encodeList(result.authorities, answer, buf, offset);
  offset = encodeList(result.additionals, answer, buf, offset);

  exports.encode.bytes = offset - oldOffset;

  // just a quick sanity check
  if (allocing && exports.encode.bytes !== buf.length) {
    return buf.slice(0, exports.encode.bytes)
  }

  return buf
};

exports.encode.bytes = 0;

exports.decode = function (buf, offset) {
  if (!offset) offset = 0;

  const oldOffset = offset;
  const result = header.decode(buf, offset);
  offset += header.decode.bytes;

  offset = decodeList(result.questions, question, buf, offset);
  offset = decodeList(result.answers, answer, buf, offset);
  offset = decodeList(result.authorities, answer, buf, offset);
  offset = decodeList(result.additionals, answer, buf, offset);

  exports.decode.bytes = offset - oldOffset;

  return result
};

exports.decode.bytes = 0;

exports.encodingLength = function (result) {
  return header.encodingLength(result) +
    encodingLengthList(result.questions || [], question) +
    encodingLengthList(result.answers || [], answer) +
    encodingLengthList(result.authorities || [], answer) +
    encodingLengthList(result.additionals || [], answer)
};

exports.streamEncode = function (result) {
  const buf = exports.encode(result);
  const sbuf = Buffer.alloc(2);
  sbuf.writeUInt16BE(buf.byteLength);
  const combine = Buffer.concat([sbuf, buf]);
  exports.streamEncode.bytes = combine.byteLength;
  return combine
};

exports.streamEncode.bytes = 0;

exports.streamDecode = function (sbuf) {
  const len = sbuf.readUInt16BE(0);
  if (sbuf.byteLength < len + 2) {
    // not enough data
    return null
  }
  const result = exports.decode(sbuf.slice(2));
  exports.streamDecode.bytes = exports.decode.bytes;
  return result
};

exports.streamDecode.bytes = 0;

function encodingLengthList (list, enc) {
  let len = 0;
  for (let i = 0; i < list.length; i++) len += enc.encodingLength(list[i]);
  return len
}

function encodeList (list, enc, buf, offset) {
  for (let i = 0; i < list.length; i++) {
    enc.encode(list[i], buf, offset);
    offset += enc.encode.bytes;
  }
  return offset
}

function decodeList (list, enc, buf, offset) {
  for (let i = 0; i < list.length; i++) {
    list[i] = enc.decode(buf, offset);
    offset += enc.decode.bytes;
  }
  return offset
}
});
var dnsPacket_1 = dnsPacket.name;
var dnsPacket_2 = dnsPacket.unknown;
var dnsPacket_3 = dnsPacket.ns;
var dnsPacket_4 = dnsPacket.soa;
var dnsPacket_5 = dnsPacket.txt;
var dnsPacket_6 = dnsPacket.hinfo;
var dnsPacket_7 = dnsPacket.ptr;
var dnsPacket_8 = dnsPacket.cname;
var dnsPacket_9 = dnsPacket.dname;
var dnsPacket_10 = dnsPacket.srv;
var dnsPacket_11 = dnsPacket.caa;
var dnsPacket_12 = dnsPacket.mx;
var dnsPacket_13 = dnsPacket.a;
var dnsPacket_14 = dnsPacket.aaaa;
var dnsPacket_15 = dnsPacket.option;
var dnsPacket_16 = dnsPacket.opt;
var dnsPacket_17 = dnsPacket.dnskey;
var dnsPacket_18 = dnsPacket.rrsig;
var dnsPacket_19 = dnsPacket.rp;
var dnsPacket_20 = dnsPacket.nsec;
var dnsPacket_21 = dnsPacket.nsec3;
var dnsPacket_22 = dnsPacket.ds;
var dnsPacket_23 = dnsPacket.record;
var dnsPacket_24 = dnsPacket.answer;
var dnsPacket_25 = dnsPacket.question;
var dnsPacket_26 = dnsPacket.AUTHORITATIVE_ANSWER;
var dnsPacket_27 = dnsPacket.TRUNCATED_RESPONSE;
var dnsPacket_28 = dnsPacket.RECURSION_DESIRED;
var dnsPacket_29 = dnsPacket.RECURSION_AVAILABLE;
var dnsPacket_30 = dnsPacket.AUTHENTIC_DATA;
var dnsPacket_31 = dnsPacket.CHECKING_DISABLED;
var dnsPacket_32 = dnsPacket.DNSSEC_OK;
var dnsPacket_33 = dnsPacket.encode;
var dnsPacket_34 = dnsPacket.decode;
var dnsPacket_35 = dnsPacket.encodingLength;
var dnsPacket_36 = dnsPacket.streamEncode;
var dnsPacket_37 = dnsPacket.streamDecode;

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

function __awaiter$2(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const nodeRequest = (options) => __awaiter$2(void 0, void 0, void 0, function* () {
    const schemes = {
        http,
        https,
    };
    return new Promise((resolve, reject) => {
        const req = schemes[options.scheme].request(options, (res) => {
            const data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('error', (err) => {
                reject(err);
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        if (options.body) {
            req.write(options.body);
        }
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
});
function isStringNotEmpty(v) {
    return typeof v === 'string' && v.length > 0;
}
const match = (regExp) => (v) => {
    return isStringNotEmpty(v) && regExp.test(v);
};
const ipv4Regex = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;
function isIPv4(v) {
    return match(ipv4Regex)(v);
}
const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
function isIPv6(v) {
    return match(ipv6Regex)(v);
}
function isIP(v) {
    return isIPv4(v) || isIPv6(v);
}
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
function isBase64String(v) {
    return match(base64Regex)(v);
}
const isOptional = (fn) => (v) => {
    return v === undefined || fn(v);
};
const isObjectWith = (schema) => (v) => {
    if (typeof v !== 'object') {
        return false;
    }
    return Object.keys(schema).every((key) => schema[key](v[key]));
};
const isArrayNotEmptyOf = (predicat) => (v) => {
    if (!Array.isArray(v)) {
        return false;
    }
    return v.every(predicat);
};

var RecordType;
(function (RecordType) {
    RecordType["A"] = "A";
    RecordType["AAAA"] = "AAAA";
    RecordType["CERT"] = "CERT";
    RecordType["TXT"] = "TXT";
})(RecordType || (RecordType = {}));

const dappyNetworks = {
    d: [
        {
            ip: '195.154.70.253',
            port: '443',
            hostname: 'dappybetanetwork',
            scheme: 'https',
            caCert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM3akNDQWRhZ0F3SUJBZ0lKQU5wamR1U25BTlFLTUEwR0NTcUdTSWIzRFFFQkN3VUFNQnN4R1RBWEJnTlYKQkFNTUVHUmhjSEI1WW1WMFlXNWxkSGR2Y21zd0hoY05NakV4TVRFNE1Ea3pNek15V2hjTk16QXdNakEwTURregpNek15V2pBYk1Sa3dGd1lEVlFRRERCQmtZWEJ3ZVdKbGRHRnVaWFIzYjNKck1JSUJJakFOQmdrcWhraUc5dzBCCkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQW1hYmkrdUlad0c2UkROcUVyTjZISTRmbVBDbVkxVFN1cnpuYzZZN1gKcmVQTEJkOTJRYlRmR0ZObUFFRWEvU1BBZnhzL2ZzeHh2V3RjdWJDSyt1a3ZiUTlDbFhGckZkam16Z3R6eUhxNApyc1MvaWEyNGJjRlNEY3FpOWVnK2Y4a1VPUUo1TnlpZktUKzRZdWdBa2VEMGhVaEM3TTJhZllTTXBrajZvRW56CjFmNlVpZEU1aGljb2hxamlWOUl5b3JKQ0RFWkV1NWRBSTJYa0pWS1ZYcGdsbk1kdEtxZHU2RUp2cWRUamhtTWoKMDU4VkFKRHJhaWMrMHhyQlo1QWxJWlFRL21laXltb1c5LzZnM1gxUkJlRWNOdjVwTWo0UWRub3gyOHptQllHRwpSdUFoTWd5UzBMbWlwcWM0a25rdVF4c1NKZ2dvV1VQL0kwa2VkRlVMaTdlcUx3SURBUUFCb3pVd016QXhCZ05WCkhSRUVLakFvZ2dsc2IyTmhiR2h2YzNTQ0NXUmhjSEI1Ym05a1pZSVFaR0Z3Y0hsaVpYUmhibVYwZDI5eWF6QU4KQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBSmh2RjlZNm5EOEtkajY5WVZ0MThFaWxzRk4vL1NUbjNibCtnWVY3dwpwcUxCTTJYNDNCeWRnS2dmNWF3c2xGbEthNi9CWk5KNThhcXk5NHBXRSsvSEMyTHNKNGt1NHJOZThPbUY5Vi9aCjc2eXlEZk9mY1BhK0JCRFphOGo5VUZBQ1VXS0RVY2x0UDZ4dWFRZnVWT0JDWDBhVEtCRmgyMUxBQkUzU0JEbEkKL1owckphanREaVd3MzQvVzdMbVpZTzJlSE5kQTRWVjd1cXNvUVZCN2s1aktRZU4xY0Q5Q292UTZ1VDRwYmtYVgpiSUxuM3RWbkJqdVcxajAvbWVnUnNkVlJkRTJQcXNJa1BIeHNFZ0lBNGNVOTdIM3FYaVQycUhrcng2NWVZNGZFCm9PdXlzejd4bWIrVkVscWFLVFdHSlhLS0MrM0lFdjhxbzNDWTFHZGM5VWFCOVE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0t=',
        },
    ],
    gamma: [
        {
            ip: '195.154.71.146',
            port: '443',
            hostname: 'fabco.gamma.dappy',
            scheme: 'https',
            caCert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM3VENDQWRXZ0F3SUJBZ0lKQU9MRGlMNHYrUFc1TUEwR0NTcUdTSWIzRFFFQkN3VUFNQm94R0RBV0JnTlYKQkFNTUR6eEVRVkJRV1Y5T1JWUlhUMUpMUGpBZUZ3MHlNakEwTVRrd05qVTFORFphRncwek1EQTNNRFl3TmpVMQpORFphTUJveEdEQVdCZ05WQkFNTUR6eEVRVkJRV1Y5T1JWUlhUMUpMUGpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCCkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU4rWlpqblJKKzhmUC90dFY5V0E3ckllUGJ0NUJXbU0zcGROOTZQNVZ4eGEKbGFGUzMwbE03SEk1RXRsdXo2MkZ4aUZHdDYzMHBZektiMFpwZ3hsKytTN05NNzNwVmlEMHdvcFRhZnZFQU5UbApHeUcxeWptQ0hicEZnSi9RU0RjcFl4VHdnVmRoQ1pkUFRnenBTUUluVndWOGFFTmZRQzNYc2dFeTI0M0dDZ3pxCjVVVnVrV1piWXR1OUoyZmlHb0pNbmJvaGQ5ajBBYmJHZTFuKzd3bXgwd1VJbHB1UEFVY0YwTVNNSjdsRDlIQXUKSDZMaXpzaXhTcUYvcjM3WnFydjJrei9qYkpZRGNDSm01eGVMRG9IdkR6ZkFTQjRNUnF5VzhpcXIzdEp4cE9icQpWMDFIZ21yVE5qb2w4NnhDaU1tVGFLSzFPaDBXM2lxSWtoQXZzMXl0ejhzQ0F3RUFBYU0yTURRd01nWURWUjBSCkJDc3dLWUlKYkc5allXeG9iM04wZ2dsa1lYQndlVzV2WkdXQ0VXWmhZbU52TG1kaGJXMWhMbVJoY0hCNU1BMEcKQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUJRQ0ZKdGFlckZlNS9SS1hsbTJLU3c0MExLTnZJdXhmd214b0d3cEkycAorTGdoamJtUHNYcEVVUGFOZkVteU9yQVU0aWVLQjU3NVV3ek1NWmtkVG82UXNnU0NQeno2VFdPaW5Mek1mbGRUCit3bkNudTdVMERBTkU3UUZ5Uldrc1VnZVUvSE5acDA1clFXNEwrdXRmUTRlODM1MEtQQXE2MjVVbE5OZzNYZGIKUEJ0QzgxQU5qQmltb2dkamVKbjN6U0FLRGQxdmFLeUZlWkIrRGFtMDhoQkZXRzhvWG1YREgvZDQ2VWZCTVhwLwptY0xRTGZVN05qdncydXIydjQ0Qm40dzlvUjBrU2tTRDEzeW94ZlBXaWwxNThxbkI2NUIrYXZUelIrZFRWR3BrCmxCZS9WUmsrQVpTTW40cDREM2JSOFZLR2d5cG83YmpyS3B4Y05xR3UzK3gzCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=',
        },
    ],
};

// Source implementation: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
const hashString = (str = '') => {
    let hash = 0;
    if (str.length === 0)
        return hash.toString();
    for (let i = 0; i < str.length; i += 1) {
        const chr = str.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = (hash << 5) - hash + chr;
        // eslint-disable-next-line no-bitwise
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

const isDappyNetwork = (network) => {
    return isArrayNotEmptyOf(isObjectWith({
        hostname: isStringNotEmpty,
        ip: isIP,
        port: match(/^\d{1,5}$/),
        scheme: match(/^http(s)?$/),
        caCert: isOptional(isBase64String),
    }))(network);
};

const DEFAULT_DAPPY_NETWORK = 'd';
const CO_RESOLUTION_SETTINGS = {
    1: { absolute: 1, accuracy: 100 },
    2: { absolute: 2, accuracy: 100 },
    3: { absolute: 2, accuracy: 66 },
    4: { absolute: 3, accuracy: 66 },
    5: { absolute: 3, accuracy: 66 },
    6: { absolute: 4, accuracy: 66 },
    7: { absolute: 4, accuracy: 66 },
};
const getDappyNetworkStaticList = () => Promise.resolve(dappyNetworks);
const createGetDappyNetworkMembers = (getDappyNetworks) => (dappyNetwork) => __awaiter$2(void 0, void 0, void 0, function* () {
    const network = dappyNetwork || DEFAULT_DAPPY_NETWORK;
    if (isDappyNetwork(network)) {
        return network;
    }
    const dappyNetworkId = network;
    const networks = yield getDappyNetworks();
    const networkInfo = networks[dappyNetworkId];
    if (!networkInfo || networkInfo.length === 0) {
        throw new Error('unknown or malformed dappy network');
    }
    return networks[dappyNetworkId];
});
const getDappyNetworkMembers = createGetDappyNetworkMembers(getDappyNetworkStaticList);
const getHashOfMajorityResult = (resolved) => Object.values(resolved.loadState)
    .map(({ ids, data }) => ({ count: ids.length, hash: data }))
    .sort((a, b) => b.count - a.count)[0].hash;
const createCoResolveQuery = (query) => (queryArgs, options) => __awaiter$2(void 0, void 0, void 0, function* () {
    var _a;
    const members = yield getDappyNetworkMembers(options === null || options === void 0 ? void 0 : options.dappyNetwork);
    const results = {};
    const resolved = yield resolver((id) => __awaiter$2(void 0, void 0, void 0, function* () {
        try {
            const reponse = yield query(queryArgs, members[Number(id)]);
            const hash = hashString(JSON.stringify(reponse));
            results[hash] = reponse;
            return {
                type: 'SUCCESS',
                data: hash,
                id,
            };
        }
        catch (e) {
            return {
                type: 'ERROR',
                data: e.message,
                id,
            };
        }
    }), members.map((_, i) => i.toString()), CO_RESOLUTION_SETTINGS[Math.min(members.length, 7)].accuracy, CO_RESOLUTION_SETTINGS[Math.min(members.length, 7)].absolute, (a) => a);
    if (resolved.status === 'failed') {
        throw new Error(`Query ${queryArgs} not resolved: ${(_a = resolved.loadError) === null || _a === void 0 ? void 0 : _a.error}`);
    }
    return results[getHashOfMajorityResult(resolved)];
});

const DNS_QUERY_PATH = '/dns-query';
const tryParseDnsPacket = (raw) => {
    try {
        return dnsPacket.decode(raw);
    }
    catch (e) {
        return undefined;
    }
};
const createDohQuery = (request) => ({ name, recordType }, options) => __awaiter$2(void 0, void 0, void 0, function* () {
    const { hostname, port, scheme, ip, caCert } = options;
    const dnsQuery = dnsPacket.encode({
        type: 'query',
        id: 0,
        flags: dnsPacket.RECURSION_DESIRED,
        questions: [
            {
                name,
                type: recordType,
            },
        ],
    });
    const reqOptions = {
        scheme,
        host: ip,
        port,
        path: DNS_QUERY_PATH,
        method: 'POST',
        headers: {
            Host: hostname,
            'content-type': 'application/dns-message',
            'content-length': dnsQuery.length,
        },
        body: dnsQuery,
    };
    if (caCert) {
        reqOptions.ca = Buffer.from(caCert, 'base64').toString();
    }
    const rawResponse = yield request(reqOptions);
    const jsonResponse = tryParseDnsPacket(Buffer.concat(rawResponse));
    if (!jsonResponse || Array.isArray(jsonResponse)) {
        throw new Error(`Could not parse response from ${scheme}://${hostname}:${port}/${DNS_QUERY_PATH}`);
    }
    const packet = Object.assign(Object.assign({}, jsonResponse), { answers: (jsonResponse.answers || []).map((answer) => (Object.assign(Object.assign({}, answer), { data: answer.type === 'TXT'
                ? Buffer.from(answer.data[0]).toString('utf8')
                : answer.data }))) });
    return packet;
});

const tryParseJSON = (raw) => {
    try {
        return JSON.parse(raw);
    }
    catch (e) {
        return undefined;
    }
};

const createPostJSONQuery = (request, queryOptions) => (body, options) => __awaiter$2(void 0, void 0, void 0, function* () {
    const { hostname, port, scheme, ip, caCert } = options;
    const { path } = queryOptions;
    const reqOptions = {
        scheme,
        host: ip,
        port,
        path,
        method: 'POST',
        headers: {
            Host: hostname,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    if (caCert) {
        reqOptions.ca = Buffer.from(caCert, 'base64').toString();
    }
    const rawResponse = yield request(reqOptions);
    const jsonResponse = tryParseJSON(rawResponse.join(''));
    if (!jsonResponse || Array.isArray(jsonResponse)) {
        throw new Error(`Could not parse response from ${scheme}://${hostname}:${port}${path}`);
    }
    return jsonResponse;
});

// DNS RCODEs in https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml
var ReturnCode;
(function (ReturnCode) {
    ReturnCode["NOERROR"] = "NOERROR";
    ReturnCode["FORMERR"] = "FORMERR";
    ReturnCode["SERVFAIL"] = "SERVFAIL";
    ReturnCode["NXDOMAIN"] = "NXDOMAIN";
    ReturnCode["NOTIMP"] = "NOTIMP";
    ReturnCode["REFUSED"] = "REFUSED";
    ReturnCode["YXDOMAIN"] = "YXDOMAIN";
    ReturnCode["XRRSET"] = "YXDOMAIN";
    ReturnCode["NOTAUTH"] = "NOTAUTH";
    ReturnCode["NOTZONE"] = "NOTZONE";
})(ReturnCode || (ReturnCode = {}));
var PacketType;
(function (PacketType) {
    PacketType["QUERY"] = "query";
    PacketType["RESPONSE"] = "response";
})(PacketType || (PacketType = {}));

const CERT_QUERY_PATH = '/dns-query-extended';
const decodeCertificates = (packet) => {
    return Object.assign(Object.assign({}, packet), { answers: packet.answers.map((a) => (Object.assign(Object.assign({}, a), { data: Buffer.from(a.data, 'base64').toString('utf8') }))) });
};
const getCertificates = (name, options) => __awaiter$2(void 0, void 0, void 0, function* () {
    const packet = yield createCoResolveQuery(createPostJSONQuery(nodeRequest, { path: CERT_QUERY_PATH }))({
        type: PacketType.QUERY,
        id: 0,
        questions: [
            {
                name,
                type: RecordType.CERT,
                class: 'IN',
            },
        ],
    }, options);
    return decodeCertificates(packet);
});

const lookup$1 = (name, recordType, options) => {
    switch (recordType) {
        case 'A':
        case 'AAAA':
        case 'TXT':
            return createCoResolveQuery(createDohQuery(nodeRequest))({
                name,
                recordType: RecordType[recordType],
            }, options);
        // Don't execute a DNS overs HTTPS query for CERT or CSP records.
        // Rather execute a POST query to /dns-query-extendes instead.
        case 'CERT':
            return getCertificates(name, options);
        case 'CSP':
            return createCoResolveQuery(createPostJSONQuery(nodeRequest, { path: '/dns-query-extended' }))({
                type: 'question',
                id: 0,
                questions: [
                    {
                        name,
                        type: 'CSP',
                        class: 'IN',
                    },
                ],
            }, options);
        default:
            throw new Error(`Unsupported record type: ${recordType}`);
    }
};

var getNodeFromIndex = function (index) {
    return {
        ip: index.split('---')[0],
        hostname: index.split('---')[1],
    };
};

var WS_PAYLOAD_PAX_SIZE = 512000; // bits
var VERSION$2 = '0.5.5';

var httpBrowserToNode = function (data, node, timeout) {
    return new Promise(function (resolve, reject) {
        var s = JSON.stringify(data);
        var l = Buffer.from(s).length;
        if (l > WS_PAYLOAD_PAX_SIZE) {
            reject("bn payload is ".concat(l / 1000, "kb, max size is ").concat(WS_PAYLOAD_PAX_SIZE / 1000, "kb"));
            return;
        }
        try {
            var ip = node.ip;
            var hostname = node.hostname;
            var port = node.port;
            var caCert = node.caCert ? Buffer.from(node.caCert, 'base64').toString('utf8') : 'INVALIDCERT';
            var options = {
                minVersion: 'TLSv1.3',
                rejectUnauthorized: true,
                ca: caCert,
                host: ip,
                method: 'POST',
                port: port,
                path: "/".concat(data.type),
                headers: {
                    'Content-Type': 'application/json',
                    'Dappy-Browser': VERSION$2,
                    Host: hostname,
                },
            };
            var req = https.request(options, function (res) {
                if (res.statusCode !== 200) {
                    reject(res.statusCode);
                    return;
                }
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
        resolver(function (id) {
            var a = getNodeFromIndex(id);
            return new Promise(function (resolve2, reject2) { return __awaiter(void 0, void 0, void 0, function () {
                var timeout, node, over_1, resp, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeout = null;
                            if (!(blockchains[parameters.chainId] &&
                                blockchains[parameters.chainId].nodes.find(function (n) { return n.ip === a.ip && n.hostname === a.hostname; }))) return [3 /*break*/, 5];
                            node = blockchains[parameters.chainId].nodes.find(function (n) { return n.ip === a.ip && n.hostname === a.hostname; });
                            over_1 = false;
                            timeout = setTimeout(function () {
                                if (!over_1) {
                                    resolve2({
                                        type: 'ERROR',
                                        status: 500,
                                        id: id,
                                    });
                                    over_1 = true;
                                }
                            }, 50000);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, httpBrowserToNode(body, node)];
                        case 2:
                            resp = _a.sent();
                            if (!over_1) {
                                clearTimeout(timeout);
                                resolve2({
                                    type: 'SUCCESS',
                                    data: resp,
                                    id: id,
                                });
                                over_1 = true;
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            resolve2({
                                type: 'ERROR',
                                status: 500,
                                id: id,
                            });
                            over_1 = true;
                            clearTimeout(timeout);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                        case 5:
                            resolve2({
                                type: 'ERROR',
                                status: 500,
                                id: id,
                            });
                            if (timeout)
                                clearTimeout(timeout);
                            return [2 /*return*/];
                    }
                });
            }); });
        }, parameters.urls, parameters.resolverAccuracy, parameters.resolverAbsolute, parameters.comparer).then(function (resolved) {
            if (resolved.status === 'failed') {
                reject({
                    error: resolved.loadError,
                    loadState: resolved.loadState,
                });
                return;
            }
            var data = undefined;
            var idsLenth = 0;
            Object.keys(resolved.loadState).forEach(function (key) {
                if (resolved.loadState[key].ids.length > idsLenth) {
                    idsLenth = resolved.loadState[key].ids.length;
                    data = resolved.loadState[key].data;
                }
            });
            resolve({
                result: data,
                loadState: resolved.loadState,
                loadErrors: resolved.loadErrors,
            });
        });
    });
};

var EXECUTE_RCHAIN_CRON_JOBS = '[Blockchain] Execute RChain cron jobs';
var SAVE_FAILED_RCHAIN_TRANSACTION = '[Blockchain] Save failed RChain transaction';
var EXPLORE_DEPLOY_X = '[Common] Explore deploy x';
var saveFailedRChainTransactionAction = function (values) { return ({
    type: SAVE_FAILED_RCHAIN_TRANSACTION,
    payload: values,
}); };

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
var getSettingsState = function (state) { return state.settings; };
var getSettings = lib_4(getSettingsState, function (state) { return state.settings; });
var getBlockchains = lib_4(getSettingsState, function (state) { return state.blockchains; });
var getAccounts = lib_4(getSettingsState, function (state) { return state.accounts; });
var getRChainAccounts = lib_4(getSettingsState, function (state) {
    return Object.fromEntries(Object.entries(state.accounts).filter(function (_a) {
        var _ = _a[0], account = _a[1];
        return account.platform === 'rchain';
    }));
});
var getEVMAccounts = lib_4(getSettingsState, function (state) {
    return Object.fromEntries(Object.entries(state.accounts).filter(function (_a) {
        var _ = _a[0], account = _a[1];
        return account.platform === 'evm';
    }));
});
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
        if (!blockchains[chainId].nodes.length) {
            return;
        }
        okBlockchains[chainId] = __assign(__assign({}, blockchains[chainId]), { nodes: blockchains[chainId].nodes });
    });
    return okBlockchains;
});
var getFirstReadyNode = lib_4(getBlockchains, function (blockchains) {
    var bc = Object.values(blockchains).find(function (bc) {
        return bc.nodes[0];
    });
    return bc === null || bc === void 0 ? void 0 : bc.nodes[0];
});
var getIsLoadReady = lib_4(getBlockchains, getSettings, function (blockchains, settings) {
    var key = Object.keys(blockchains)[0];
    var firstBlockchain = blockchains[key];
    if (!firstBlockchain) {
        return false;
    }
    return firstBlockchain.nodes.length >= settings.resolverAbsolute;
});

// SELECTORS
var getBlockchainState = lib_4(function (state) { return state; }, function (state) { return state.blockchain; });
var getRChainInfos = lib_4(getBlockchainState, function (state) { return state.rchain.infos; });
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
var getNameSystemContractId = lib_4(getNamesBlockchainInfos, function (i) { return i === null || i === void 0 ? void 0 : i.info.rchainNamesContractId; });
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

var sameSites = {
    lax: 'lax',
    Lax: 'lax',
    strict: 'strict',
    Strict: 'strict',
};
var rightPad = function (str, num) {
    var s = str.slice(0, num);
    for (var i = 0; i < num - str.length; i += 1) {
        s += ' ';
    }
    return s;
};
var onlyLaxCookieOnFirstRequest = function (isFirstRequest, cookie) {
    return isFirstRequest ? cookie.sameSite === 'lax' : true;
};
// RFC 6265
var isCookieDomainSentWithHost = function (cookieDomain, host) {
    if (!cookieDomain)
        return false;
    // Try an exact match
    if (cookieDomain === host)
        return true;
    if (cookieDomain === ".".concat(host))
        return true;
    // TLD cookies not sent fo 2nd/3rd/etc levels
    // do not send cookie if domain = .com or com or .dappy or dappy
    if (cookieDomain.startsWith('.') && (cookieDomain.match(/\./g) || []).length === 1)
        return false;
    if ((cookieDomain.match(/\./g) || []).length === 0)
        return false;
    // does host matches a sublevel of cookieDomain ?
    // turns example.com into .example.com
    var cookieDomainWithPrefix = cookieDomain.startsWith('.') ? cookieDomain : ".".concat(cookieDomain);
    // do sent cookies if cookieDomain = example.com and host = api.example.com
    if (host.endsWith(cookieDomainWithPrefix))
        return true;
    // do not sent cookies if:
    // cookieDomain = api.example.com and host = example.com
    // cookieDomain = api.example.com and host = pro.example.com
    // cookieDomain = eeexample.com and host = example.com
    return false;
};
var getCookiesHeader = function (dappyBrowserView, url, isFirstRequest, s) { return __awaiter(void 0, void 0, void 0, function () {
    var host, cookies, okCookies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = new URL(url).host;
                cookies = [];
                return [4 /*yield*/, dappyBrowserView.browserView.webContents.session.cookies.get({
                        url: "https://".concat(host),
                    })];
            case 1:
                cookies = _a.sent();
                okCookies = cookies
                    .filter(function (c) {
                    console.log('sent with host ?', host, c.domain, isCookieDomainSentWithHost(c.domain, host));
                    return isCookieDomainSentWithHost(c.domain, host);
                })
                    .filter(function (c) { return onlyLaxCookieOnFirstRequest(isFirstRequest, c); });
                return [2 /*return*/, {
                        cookieHeader: okCookies.map(function (c) { return "".concat(c.name, "=").concat(c.value); }).join('; '),
                        numberOfCookies: {
                            lax: okCookies.filter(function (c) { return c.sameSite === 'lax'; }).length,
                            strict: okCookies.filter(function (c) { return c.sameSite === 'strict'; }).length,
                        }
                    }];
        }
    });
}); };
var tryToLoad = function (_a) {
    var dappyNetworkMembers = _a.dappyNetworkMembers, dns = _a.dns, debug = _a.debug, request = _a.request, partitionIdHash = _a.partitionIdHash, dappyBrowserView = _a.dappyBrowserView, setIsFirstRequest = _a.setIsFirstRequest, getIsFirstRequest = _a.getIsFirstRequest, setCookie$1 = _a.setCookie, getBlobData = _a.getBlobData;
    return __awaiter(void 0, void 0, void 0, function () {
        // ============
        // IP APP
        // ============
        function load(i) {
            if (i === void 0) { i = 0; }
            return __awaiter(this, void 0, void 0, function () {
                var st, s, isFirstRequest, port, path, getCookiesHeaderResp;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!networkHosts || !networkHosts[i]) {
                                if (debug)
                                    console.log("[https] Resource for app (".concat(dappyBrowserView.tabId, ") failed to load (").concat(url.hostname, ")"));
                                st = new stream.PassThrough();
                                st.push(getHtmlError("IP app error", "Failed to load"));
                                st.end();
                                return [2 /*return*/, {
                                        data: st,
                                        headers: {},
                                        statusCode: 503
                                    }];
                            }
                            s = "";
                            isFirstRequest = getIsFirstRequest();
                            if (debug) {
                                if (isFirstRequest) {
                                    s += "[https load ".concat(partitionIdHash, "] first hand navigation ").concat(rightPad(request.url, 32), " ").concat(i);
                                }
                                else {
                                    s += "[https load ".concat(partitionIdHash, "] ").concat(rightPad(request.url, 32), " ").concat(i);
                                }
                            }
                            port = url.port ? url.port : "443";
                            path = "/";
                            if (url.pathname) {
                                path = url.pathname;
                            }
                            if (url.search) {
                                path += url.search;
                            }
                            return [4 /*yield*/, getCookiesHeader(dappyBrowserView, url.origin, isFirstRequest)];
                        case 1:
                            getCookiesHeaderResp = _a.sent();
                            /*
                              The next requests (next time tryToLoad is called) for same session / BrowserView will be a secondary requests, after the following line
                              get isFirstRequest still true
                            */
                            setIsFirstRequest(false);
                            return [2 /*return*/, new Promise(function (resolve) {
                                    try {
                                        var options = __assign(__assign({ host: networkHosts[i], port: port, method: request.method, path: path }, (ca ? { ca: ca[0] } : {})), { minVersion: 'TLSv1.2', rejectUnauthorized: true, headers: __assign(__assign({}, request.headers), { host: url.hostname, Cookie: getCookiesHeaderResp.cookieHeader, Origin: "https://".concat(dappyBrowserView.host) }) });
                                        s += rightPad(" | cook: ".concat(getCookiesHeaderResp.numberOfCookies.lax, "lax ").concat(getCookiesHeaderResp.numberOfCookies.strict, "strict"), 22);
                                        // todo
                                        /* if (s.cert) {
                                          options.ca = Buffer.from(s.cert, 'base64').toString('utf8')
                                        } */
                                        if (request.referrer) {
                                            options.headers.referrer = request.referrer;
                                        }
                                        var req_1 = https
                                            .request(options, function (resp) {
                                            var respCookies = [];
                                            if (resp.headers && resp.headers['set-cookie'] && resp.headers['set-cookie'].length) {
                                                respCookies = setCookie.parse(resp, {
                                                    decodeValues: true,
                                                });
                                                respCookies
                                                    .filter(function (c) {
                                                    if (c.domain) {
                                                        if (c.domain === url.host)
                                                            return true;
                                                        if (c.domain === ".".concat(url.host))
                                                            return true;
                                                        // Set-Cookie from request on example.com wants to set a cookie on api.example.com
                                                        if (c.domain.endsWith(".".concat(url.host)))
                                                            return true;
                                                        return false;
                                                    }
                                                    else {
                                                        return true;
                                                    }
                                                })
                                                    .forEach(function (vc) {
                                                    setCookie$1({
                                                        url: "https://".concat(url.host),
                                                        domain: vc.domain,
                                                        name: vc.name,
                                                        value: vc.value,
                                                        expirationDate: vc.expires ? new Date(vc.expires).getTime() / 1000 : undefined,
                                                        secure: true,
                                                        httpOnly: vc.httpOnly,
                                                        sameSite: sameSites[vc.sameSite || ''] || 'lax',
                                                    });
                                                });
                                            }
                                            /*
                                              Redirection is only ok if it is undergoing a first request
                                            */
                                            if (isFirstRequest &&
                                                [300, 301, 302, 303, 304, 307, 308, 309].find(function (a) { return a === resp.statusCode; })) {
                                                s += rightPad(" | ".concat(resp.statusCode, " redirect"), 10);
                                                if (respCookies.length)
                                                    s += " (".concat(respCookies.length, " cook)");
                                                /*
                                                  todo, how to know a request is first hand navigation ?
                                                  all .dappy first hand navigations must have the dappy CSP
                                                  override
                                                */
                                                over = true;
                                                resolve({
                                                    statusCode: resp.statusCode,
                                                    headers: __assign(__assign({}, resp.headers), { 'set-cookie': '' })
                                                });
                                                return;
                                            }
                                            s += rightPad(" | ".concat(resp.statusCode), 7);
                                            if (debug)
                                                console.log(s);
                                            // todo csp
                                            /* resp.headers = {
                                              ...resp.headers,
                                              'Content-Security-Policy': dappyBrowserView.csp || "default-src 'self'",
                                            };
                                            */
                                            if (!over) {
                                                var headers = resp.headers;
                                                if (isFirstRequest) {
                                                    // todo what if there is a CSP in the html document with <meta> ?
                                                    console.log('[csp top-level rq] ' + url.hostname + path + ' ' + csp);
                                                    headers['Content-Security-Policy'] = csp;
                                                }
                                                resolve({
                                                    data: resp,
                                                    headers: headers,
                                                });
                                                over = true;
                                            }
                                        })
                                            .on('error', function (err) {
                                            if (debug)
                                                console.log('[https load] ERR (1)', request.url, err.message, i);
                                            var statusCode = 502;
                                            if (err.message.includes('connect ECONNRESET')) {
                                                statusCode = 523;
                                            }
                                            else {
                                                statusCode = 520;
                                            }
                                            if (networkHosts[i + 1]) {
                                                load(i + 1);
                                            }
                                            else {
                                                if (debug) {
                                                    console.log("[https load] Resource for app (".concat(dappyBrowserView.tabId, ") failed to load (").concat(url.pathname, ")"));
                                                }
                                                var st = new stream.PassThrough();
                                                st.push(getHtmlError("IP app error", err.message || "Could not load"));
                                                st.end();
                                                resolve({
                                                    data: st,
                                                    headers: {},
                                                    statusCode: statusCode
                                                });
                                                over = true;
                                                return;
                                            }
                                        });
                                        if (request.uploadData && request.uploadData[0]) {
                                            var handleUploadData = function () { return __awaiter(_this, void 0, void 0, function () {
                                                var uds, j, bd, file;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            uds = request.uploadData;
                                                            j = 0;
                                                            _a.label = 1;
                                                        case 1:
                                                            if (!(j < uds.length)) return [3 /*break*/, 7];
                                                            if (!uds[j].bytes) return [3 /*break*/, 2];
                                                            req_1.write(uds[j].bytes);
                                                            return [3 /*break*/, 5];
                                                        case 2:
                                                            if (!uds[j].blobUUID) return [3 /*break*/, 4];
                                                            return [4 /*yield*/, getBlobData(uds[j].blobUUID)];
                                                        case 3:
                                                            bd = _a.sent();
                                                            req_1.write(bd);
                                                            return [3 /*break*/, 5];
                                                        case 4:
                                                            file = fs.readFileSync(uds[j].file);
                                                            // todo, test file upload on other platforms than discord (works on discord)
                                                            req_1.write(file);
                                                            _a.label = 5;
                                                        case 5:
                                                            if (j === uds.length - 1) {
                                                                req_1.end();
                                                            }
                                                            _a.label = 6;
                                                        case 6:
                                                            j += 1;
                                                            return [3 /*break*/, 1];
                                                        case 7:
                                                            if ((request.uploadData || []).length === 0) {
                                                                req_1.end();
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); };
                                            handleUploadData();
                                        }
                                        else {
                                            req_1.end();
                                        }
                                    }
                                    catch (err) {
                                        if (debug)
                                            console.log('[https load] ERR (2) ', request.url, err.message, i);
                                        var statusCode = 502;
                                        if (err.message.includes('connect ECONNRESET')) {
                                            statusCode = 523;
                                        }
                                        else {
                                            statusCode = 520;
                                        }
                                        if (networkHosts[i + 1]) {
                                            load(i + 1);
                                        }
                                        else {
                                            if (debug)
                                                console.log("[https] Resource for app (".concat(dappyBrowserView.tabId, ") failed to load (").concat(url.pathname, ")"));
                                            /*
                                              Will catch in main/store/sagas/loadOrReloadBrowserView.ts L193
                                            */
                                            var st = new stream.PassThrough();
                                            st.push(getHtmlError("IP app error", err.message || "Could not to load"));
                                            st.end();
                                            resolve({
                                                data: st,
                                                headers: {},
                                                statusCode: statusCode
                                            });
                                            over = true;
                                            return;
                                        }
                                    }
                                })];
                    }
                });
            });
        }
        var over, url, ca, networkHosts, err_1, txts, err_2, dappAddress, dappAddressRecord, csp, cspRecord, st, s, masterRegistryUri, fileContractId, filePurseId, indexes, multiRequestResult, err_3, dataFromBlockchain, dataFromBlockchainParsed, verifiedDappyFile, e_1, dappyFile, dappHtml, headers, isFirstRequest;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    over = false;
                    url = new URL(request.url);
                    ca = undefined;
                    networkHosts = undefined;
                    if (!dns) return [3 /*break*/, 1];
                    networkHosts = [url.hostname];
                    return [3 /*break*/, 5];
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, lookup$1(url.hostname, 'A', { dappyNetwork: dappyNetworkMembers })];
                case 2:
                    networkHosts = (_c.sent()).answers.map(function (a) { return a.data; });
                    return [4 /*yield*/, lookup$1(url.hostname, 'CERT', { dappyNetwork: dappyNetworkMembers })];
                case 3:
                    ca = (_c.sent()).answers.map(function (a) { return a.data; });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    return [2 /*return*/, Promise.resolve({
                            data: "NS LOOKUP ERROR",
                            headers: {},
                            statusCode: 523
                        })];
                case 5:
                    txts = undefined;
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, lookup$1(url.hostname, 'TXT', { dappyNetwork: dappyNetworkMembers })];
                case 7:
                    txts = (_c.sent()).answers.map(function (a) { return a.data; });
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _c.sent();
                    return [2 /*return*/, Promise.resolve({
                            data: "NS LOOKUP ERROR",
                            headers: {},
                            statusCode: 523
                        })];
                case 9:
                    dappAddress = '';
                    dappAddressRecord = txts.find(function (a) { return a.startsWith("DAPP_ADDRESS="); });
                    if (dappAddressRecord) {
                        dappAddress = dappAddressRecord.replace('DAPP_ADDRESS=', '');
                    }
                    csp = '';
                    cspRecord = (txts || []).find(function (a) { return a.startsWith("CSP="); });
                    if (cspRecord) {
                        csp = cspRecord.replace('CSP=', '');
                    }
                    if (!dappAddress) return [3 /*break*/, 18];
                    console.log('dapp address resolved by name system ' + dappAddress);
                    st = new stream.PassThrough();
                    s = (dappAddress || '').split('.');
                    masterRegistryUri = dappyBrowserView.data.rchainNamesMasterRegistryUri;
                    fileContractId = '';
                    filePurseId = '';
                    //A dapp address can be master.contract.purse or contract.purse
                    if (s.length === 2) {
                        fileContractId = s[0];
                        filePurseId = s[1] || 'index';
                    }
                    else if (s.length === 3) {
                        masterRegistryUri = s[0];
                        fileContractId = s[1];
                        filePurseId = s[2] || 'index';
                    }
                    else {
                        throw new Error('Unable to parse dapp address');
                    }
                    indexes = shuffle(dappyBrowserView.data.blockchain.nodes
                        .map(getNodeIndex));
                    multiRequestResult = void 0;
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, performMultiRequest({
                            type: 'explore-deploy-x',
                            body: {
                                terms: [
                                    src_23({
                                        masterRegistryUri: masterRegistryUri,
                                        contractId: fileContractId,
                                        pursesIds: [filePurseId],
                                    }),
                                ],
                            },
                        }, {
                            chainId: dappyBrowserView.data.chainId,
                            urls: indexes,
                            // todo get values from dappy-lookup
                            resolverMode: 'absolute',
                            resolverAccuracy: 100,
                            resolverAbsolute: 1,
                            multiCallId: EXPLORE_DEPLOY_X,
                        }, (_b = {},
                            _b[dappyBrowserView.data.chainId] = dappyBrowserView.data.blockchain,
                            _b))];
                case 11:
                    multiRequestResult = _c.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_3 = _c.sent();
                    st.push(getHtmlError("dapp error", "Failed to retreive HTML"));
                    st.end();
                    return [2 /*return*/, {
                            data: st,
                            headers: {},
                            statusCode: 404
                        }];
                case 13:
                    dataFromBlockchain = void 0;
                    dataFromBlockchainParsed = void 0;
                    verifiedDappyFile = undefined;
                    _c.label = 14;
                case 14:
                    _c.trys.push([14, 16, , 17]);
                    dataFromBlockchain = multiRequestResult.result;
                    dataFromBlockchainParsed = JSON.parse(dataFromBlockchain);
                    return [4 /*yield*/, validateAndReturnFile(dataFromBlockchainParsed.data.results[0].data, filePurseId, '', false)];
                case 15:
                    verifiedDappyFile = _c.sent();
                    return [3 /*break*/, 17];
                case 16:
                    e_1 = _c.sent();
                    st.push(getHtmlError("dapp error", "Failed to validate HTML file"));
                    st.end();
                    return [2 /*return*/, {
                            data: st,
                            headers: {},
                            statusCode: 404
                        }];
                case 17:
                    dappyFile = verifiedDappyFile;
                    if (!['text/html', 'application/dappy'].includes(dappyFile.mimeType)) {
                        st.push(getHtmlError("dapp error", "Only application/dappy and text/html files can be handled"));
                        st.end();
                        return [2 /*return*/, {
                                data: st,
                                headers: {},
                                statusCode: 404
                            }];
                    }
                    dappHtml = void 0;
                    try {
                        dappHtml = getHtmlFromFile(dappyFile);
                    }
                    catch (e) {
                        st.push(getHtmlError("dapp error", "Failed to get HTML from file (gzip)"));
                        st.end();
                        return [2 /*return*/, {
                                data: st,
                                headers: {},
                                statusCode: 404
                            }];
                    }
                    headers = {
                        'Content-Type': 'text/html; charset=utf-8',
                    };
                    isFirstRequest = getIsFirstRequest();
                    if (isFirstRequest && csp) {
                        // todo what if there is a CSP in the html document with <meta> ?
                        console.log('[csp top-level rq] ' + url.hostname + ' ' + csp);
                        headers['Content-Security-Policy'] = csp;
                    }
                    setIsFirstRequest(false);
                    st.push(dappHtml);
                    st.end();
                    return [2 /*return*/, {
                            data: st,
                            headers: headers
                        }];
                case 18: return [2 /*return*/, load()];
            }
        });
    });
};

var executeSentryRequest = function (request) {
    return new Promise(function (resolve, reject) {
        var options = {
            method: request.method,
            host: 'sentry.io',
            port: 443,
            rejectUnauthorized: true,
            path: request.url.replace('https://sentry.io', '') || '/',
            headers: request.headers,
        };
        https
            .request(options, function (data) { return resolve({ data: data }); })
            .on('error', function (er) {
            console.log(er);
            reject(er); // TODO: A valider
        });
    });
};
var isSentryRequestInDappyApp = function (url, dappyBrowserView) {
    return url.startsWith('https://sentry.io') && !dappyBrowserView;
};
var makeInterceptHttpsRequests = function (_a) {
    var dappyNetworkMembers = _a.dappyNetworkMembers, dappyBrowserView = _a.dappyBrowserView, partitionIdHash = _a.partitionIdHash, setCookie = _a.setCookie, getBlobData = _a.getBlobData, setIsFirstRequest = _a.setIsFirstRequest, getIsFirstRequest = _a.getIsFirstRequest;
    var debug = !true;
    return function (request, callback) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!isSentryRequestInDappyApp(request.url, dappyBrowserView)) return [3 /*break*/, 2];
                    _a = callback;
                    return [4 /*yield*/, executeSentryRequest(request)];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    return [2 /*return*/];
                case 2:
                    if (!dappyBrowserView) {
                        console.log('[https] An unauthorized process, maybe BrowserWindow, tried to make an https request');
                        callback({});
                        return [2 /*return*/];
                    }
                    if (!new URL(request.url).hostname.endsWith('.dappy')) return [3 /*break*/, 7];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    _b = callback;
                    return [4 /*yield*/, tryToLoad({ dappyNetworkMembers: dappyNetworkMembers, partitionIdHash: partitionIdHash, dns: false, debug: debug, dappyBrowserView: dappyBrowserView, setIsFirstRequest: setIsFirstRequest, getIsFirstRequest: getIsFirstRequest, setCookie: setCookie, request: request, getBlobData: getBlobData })];
                case 4:
                    _b.apply(void 0, [_c.sent()]);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    console.log(err_1);
                    callback({});
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    // forbidden for now
                    callback({});
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
};
var makeCookiesOnChange = function (_a) {
    var dappyBrowserView = _a.dappyBrowserView, getCookies = _a.getCookies, dispatchFromMain = _a.dispatchFromMain;
    return function (_, c) { return __awaiter(void 0, void 0, void 0, function () {
        var cookies, cookiesToBeStored;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dappyBrowserView) {
                        console.log('no browserView, cannot save cookies');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getCookies({ url: "https://".concat(c.domain) })];
                case 1:
                    cookies = _a.sent();
                    cookiesToBeStored = cookies
                        .filter(function (c) { return typeof c.expirationDate === 'number'; })
                        .map(function (cook) {
                        return ({
                            sameSite: cook.sameSite === 'strict' ? 'strict' : 'lax',
                            domain: cook.domain,
                            name: cook.name,
                            value: cook.value,
                            expirationDate: cook.expirationDate,
                        });
                    });
                    if (cookiesToBeStored.length) {
                        dispatchFromMain({
                            action: saveCookiesForDomainAction({
                                host: dappyBrowserView.host,
                                cookies: cookiesToBeStored,
                            }),
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
};
var overrideHttpsProtocol = function (_a) {
    var dappyNetworkMembers = _a.dappyNetworkMembers, dappyBrowserView = _a.dappyBrowserView, session = _a.session, partitionIdHash = _a.partitionIdHash, dispatchFromMain = _a.dispatchFromMain, setIsFirstRequest = _a.setIsFirstRequest, getIsFirstRequest = _a.getIsFirstRequest;
    var getBlobData = function (blobUUID) {
        return session.getBlobData(blobUUID);
    };
    session.cookies.on('changed', makeCookiesOnChange({
        dappyBrowserView: dappyBrowserView,
        getCookies: function (filter) { return session.cookies.get(filter); },
        dispatchFromMain: dispatchFromMain,
    }));
    return session.protocol.interceptStreamProtocol('https', makeInterceptHttpsRequests({
        dappyNetworkMembers: dappyNetworkMembers,
        dappyBrowserView: dappyBrowserView,
        partitionIdHash: partitionIdHash,
        setCookie: function (cookieDetails) { return session.cookies.set(cookieDetails); },
        getBlobData: getBlobData,
        setIsFirstRequest: setIsFirstRequest,
        getIsFirstRequest: getIsFirstRequest,
    }));
};

var promisify_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
// Symbols is a better way to do this, but not all browsers have good support,
// so instead we'll just make do with a very unlikely string.
var customArgumentsToken = "__ES6-PROMISIFY--CUSTOM-ARGUMENTS__";
/**
 * promisify()
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) --
 * into an ES6-compatible Promise. Promisify provides a default callback of the
 * form (error, result) and rejects when `error` is truthy.
 *
 * @param {function} original - The function to promisify
 * @return {function} A promisified version of `original`
 */

function promisify(original) {
  // Ensure the argument is a function
  if (typeof original !== "function") {
    throw new TypeError("Argument to promisify must be a function");
  } // If the user has asked us to decode argument names for them, honour that


  var argumentNames = original[customArgumentsToken]; // If the user has supplied a custom Promise implementation, use it.
  // Otherwise fall back to whatever we can find on the global object.

  var ES6Promise = promisify.Promise || Promise; // If we can find no Promise implemention, then fail now.

  if (typeof ES6Promise !== "function") {
    throw new Error("No Promise implementation found; do you need a polyfill?");
  }

  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new ES6Promise(function (resolve, reject) {
      // Append the callback bound to the context
      args.push(function callback(err) {
        if (err) {
          return reject(err);
        }

        for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          values[_key2 - 1] = arguments[_key2];
        }

        if (values.length === 1 || !argumentNames) {
          return resolve(values[0]);
        }

        var o = {};
        values.forEach(function (value, index) {
          var name = argumentNames[index];

          if (name) {
            o[name] = value;
          }
        });
        resolve(o);
      }); // Call the function.

      original.apply(_this, args);
    });
  };
} // Attach this symbol to the exported function, so users can use it


promisify.argumentNames = customArgumentsToken;
promisify.Promise = undefined; // Export the public API
});

unwrapExports(promisify_1);
var promisify_2 = promisify_1.promisify;

var isWindows = process.platform === 'win32';
var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;

// https://github.com/nodejs/node/blob/3e7a14381497a3b73dda68d05b5130563cdab420/lib/os.js#L25-L43
var osTmpdir = function () {
	var path;

	if (isWindows) {
		path = process.env.TEMP ||
			process.env.TMP ||
			(process.env.SystemRoot || process.env.windir) + '\\temp';
	} else {
		path = process.env.TMPDIR ||
			process.env.TMP ||
			process.env.TEMP ||
			'/tmp';
	}

	if (trailingSlashRe.test(path)) {
		path = path.slice(0, -1);
	}

	return path;
};

var helper = createCommonjsModule(function (module) {





var tempDir = process.env.PEMJS_TMPDIR || osTmpdir();

/**
 * pem helper module
 *
 * @module helper
 */

/**
 * helper function to check is the string a number or not
 * @param {String} str String that should be checked to be a number
 */
module.exports.isNumber = function (str) {
  if (Array.isArray(str)) {
    return false
  }
  /*
  var bstr = str && str.toString()
  str = str + ''

  return bstr - parseFloat(bstr) + 1 >= 0 &&
          !/^\s+|\s+$/g.test(str) && /^\d+$/g.test(str) &&
          !isNaN(str) && !isNaN(parseFloat(str))
  */
  return /^\d+$/g.test(str)
};

/**
 * helper function to check is the string a hexaceximal value
 * @param {String} hex String that should be checked to be a hexaceximal
 */
module.exports.isHex = function isHex (hex) {
  return /^(0x){0,1}([0-9A-F]{1,40}|[0-9A-F]{1,40})$/gi.test(hex)
};

/**
 * helper function to convert a string to a hexaceximal value
 * @param {String} str String that should be converted to a hexaceximal
 */
module.exports.toHex = function toHex (str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex
};

// cipherPassword returns an array of supported ciphers.
/**
 * list of supported ciphers
 * @type {Array}
 */
module.exports.ciphers = ['aes128', 'aes192', 'aes256', 'camellia128', 'camellia192', 'camellia256', 'des', 'des3', 'idea'];
var ciphers = module.exports.ciphers;

/**
 * Creates a PasswordFile to hide the password form process infos via `ps auxf` etc.
 * @param {Object} options object of cipher, password and passType, mustPass, {cipher:'aes128', password:'xxxx', passType:"in/out/word"}, if the object empty we do nothing
 * @param {String} options.cipher cipher like 'aes128', 'aes192', 'aes256', 'camellia128', 'camellia192', 'camellia256', 'des', 'des3', 'idea'
 * @param {String} options.password password can be empty or at last 4 to 1023 chars
 * @param {String} options.passType passType: can be in/out/word for passIN/passOUT/passWORD
 * @param {Boolean} options.mustPass mustPass is used when you need to set the pass like as "-password pass:" most needed when empty password
 * @param {Object} params params will be extended with the data that need for the openssl command. IS USED AS POINTER!
 * @param {String} PasswordFileArray PasswordFileArray is an array of filePaths that later need to deleted ,after the openssl command. IS USED AS POINTER!
 * @return {Boolean} result
 */
module.exports.createPasswordFile = function (options, params, PasswordFileArray) {
  if (!options || !Object.prototype.hasOwnProperty.call(options, 'password') || !Object.prototype.hasOwnProperty.call(options, 'passType') || !/^(word|in|out)$/.test(options.passType)) {
    return false
  }
  var PasswordFile = path.join(tempDir, crypto$1.randomBytes(20).toString('hex'));
  PasswordFileArray.push(PasswordFile);
  options.password = options.password.trim();
  if (options.password === '') {
    options.mustPass = true;
  }
  if (options.cipher && (ciphers.indexOf(options.cipher) !== -1)) {
    params.push('-' + options.cipher);
  }
  params.push('-pass' + options.passType);
  if (options.mustPass) {
    params.push('pass:' + options.password);
  } else {
    fs.writeFileSync(PasswordFile, options.password);
    params.push('file:' + PasswordFile);
  }
  return true
};

/**
 * Deletes a file or an array of files
 * @param {Array} files array of files that shoudld be deleted
 * @param {errorCallback} callback Callback function with an error object
 */
module.exports.deleteTempFiles = function (files, callback) {
  var rmFiles = [];
  if (typeof files === 'string') {
    rmFiles.push(files);
  } else if (Array.isArray(files)) {
    rmFiles = files;
  } else {
    return callback(new Error('Unexcepted files parameter type; only string or array supported'))
  }
  var deleteSeries = function (list, finalCallback) {
    if (list.length) {
      var file = list.shift();
      var myCallback = function (err) {
        if (err && err.code === 'ENOENT') {
          // file doens't exist
          return deleteSeries(list, finalCallback)
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          return finalCallback(err)
        } else {
          return deleteSeries(list, finalCallback)
        }
      };
      if (file && typeof file === 'string') {
        fs.unlink(file, myCallback);
      } else {
        return deleteSeries(list, finalCallback)
      }
    } else {
      return finalCallback(null) // no errors
    }
  };
  deleteSeries(rmFiles, callback);
};
/**
 * Callback for return an error object.
 * @callback errorCallback
 * @param {Error} err - An Error Object or null
 */
});
var helper_1 = helper.isNumber;
var helper_2 = helper.isHex;
var helper_3 = helper.toHex;
var helper_4 = helper.ciphers;
var helper_5 = helper.createPasswordFile;
var helper_6 = helper.deleteTempFiles;

var windows = isexe;
isexe.sync = sync;



function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT;

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';');
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase();
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options));
  });
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}

var mode = isexe$1;
isexe$1.sync = sync$1;



function isexe$1 (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat$1(stat, options));
  });
}

function sync$1 (path, options) {
  return checkStat$1(fs.statSync(path), options)
}

function checkStat$1 (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid();
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid();

  var u = parseInt('100', 8);
  var g = parseInt('010', 8);
  var o = parseInt('001', 8);
  var ug = u | g;

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0;

  return ret
}

var core;
if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core = windows;
} else {
  core = mode;
}

var isexe_1 = isexe$2;
isexe$2.sync = sync$2;

function isexe$2 (path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe$2(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }
    cb(er, is);
  });
}

function sync$2 (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}

const isWindows$1 = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys';


const COLON = isWindows$1 ? ';' : ':';


const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' });

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON;

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows$1 && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows$1 ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    );
  const pathExtExe = isWindows$1
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : '';
  const pathExt = isWindows$1 ? pathExtExe.split(colon) : [''];

  if (isWindows$1) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('');
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
};

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  if (!opt)
    opt = {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path.join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    resolve(subStep(p, i, 0));
  });

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii];
    isexe_1(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext);
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    });
  });

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
};

const whichSync = (cmd, opt) => {
  opt = opt || {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path.join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j];
      try {
        const is = isexe_1.sync(cur, { pathExt: pathExtExe });
        if (is) {
          if (opt.all)
            found.push(cur);
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
};

var which_1 = which;
which.sync = whichSync;

var cpspawn = child_process.spawn;





var settings = {};
var tempDir = process.env.PEMJS_TMPDIR || osTmpdir();

/**
 * pem openssl module
 *
 * @module openssl
 */

/**
 * configue this openssl module
 *
 * @static
 * @param {String} option name e.g. pathOpenSSL, openSslVersion; TODO rethink nomenclature
 * @param {*} value value
 */
function set$1 (option, value) {
  settings[option] = value;
}

/**
 * get configuration setting value
 *
 * @static
 * @param {String} option name
 */
function get$1 (option) {
  return settings[option] || null
}

/**
 * Spawn an openssl command
 *
 * @static
 * @param {Array} params Array of openssl command line parameters
 * @param {String} searchStr String to use to find data
 * @param {Array} [tmpfiles] list of temporary files
 * @param {Function} callback Called with (error, stdout-substring)
 */
function exec (params, searchStr, tmpfiles, callback) {
  if (!callback && typeof tmpfiles === 'function') {
    callback = tmpfiles;
    tmpfiles = false;
  }

  spawnWrapper(params, tmpfiles, function (err, code, stdout, stderr) {
    var start, end;

    if (err) {
      return callback(err)
    }

    if ((start = stdout.match(new RegExp('\\-+BEGIN ' + searchStr + '\\-+$', 'm')))) {
      start = start.index;
    } else {
      start = -1;
    }

    // To get the full EC key with parameters and private key
    if (searchStr === 'EC PARAMETERS') {
      searchStr = 'EC PRIVATE KEY';
    }

    if ((end = stdout.match(new RegExp('^\\-+END ' + searchStr + '\\-+', 'm')))) {
      end = end.index + end[0].length;
    } else {
      end = -1;
    }

    if (start >= 0 && end >= 0) {
      return callback(null, stdout.substring(start, end))
    } else {
      return callback(new Error(searchStr + ' not found from openssl output:\n---stdout---\n' + stdout + '\n---stderr---\n' + stderr + '\ncode: ' + code))
    }
  });
}

/**
 *  Spawn an openssl command and get binary output
 *
 * @static
 * @param {Array} params Array of openssl command line parameters
 * @param {Array} [tmpfiles] list of temporary files
 * @param {Function} callback Called with (error, stdout)
*/
function execBinary (params, tmpfiles, callback) {
  if (!callback && typeof tmpfiles === 'function') {
    callback = tmpfiles;
    tmpfiles = false;
  }
  spawnWrapper(params, tmpfiles, true, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    }
    return callback(null, stdout)
  });
}

/**
 * Generically spawn openSSL, without processing the result
 *
 * @static
 * @param {Array}        params   The parameters to pass to openssl
 * @param {Boolean}      binary   Output of openssl is binary or text
 * @param {Function}     callback Called with (error, exitCode, stdout, stderr)
 */
function spawn (params, binary, callback) {
  var pathBin = get$1('pathOpenSSL') || process.env.OPENSSL_BIN || 'openssl';

  testOpenSSLPath(pathBin, function (err) {
    if (err) {
      return callback(err)
    }
    var openssl = cpspawn(pathBin, params);
    var stderr = '';

    var stdout = (binary ? Buffer.alloc(0) : '');
    openssl.stdout.on('data', function (data) {
      if (!binary) {
        stdout += data.toString('binary');
      } else {
        stdout = Buffer.concat([stdout, data]);
      }
    });

    openssl.stderr.on('data', function (data) {
      stderr += data.toString('binary');
    });
    // We need both the return code and access to all of stdout.  Stdout isn't
    // *really* available until the close event fires; the timing nuance was
    // making this fail periodically.
    var needed = 2; // wait for both exit and close.
    var code = -1;
    var finished = false;
    var done = function (err) {
      if (finished) {
        return
      }

      if (err) {
        finished = true;
        return callback(err)
      }

      if (--needed < 1) {
        finished = true;
        if (code) {
          if (code === 2 && (stderr === '' || /depth lookup: unable to/.test(stderr))) {
            return callback(null, code, stdout, stderr)
          }
          return callback(new Error('Invalid openssl exit code: ' + code + '\n% openssl ' + params.join(' ') + '\n' + stderr), code)
        } else {
          return callback(null, code, stdout, stderr)
        }
      }
    };

    openssl.on('error', done);

    openssl.on('exit', function (ret) {
      code = ret;
      done();
    });

    openssl.on('close', function () {
      stdout = (binary ? stdout : Buffer.from(stdout, 'binary').toString('utf-8'));
      stderr = Buffer.from(stderr, 'binary').toString('utf-8');
      done();
    });
  });
}

/**
 * Wrapper for spawn method
 *
 * @static
 * @param {Array} params The parameters to pass to openssl
 * @param {Array} [tmpfiles] list of temporary files
 * @param {Boolean} [binary] Output of openssl is binary or text
 * @param {Function} callback Called with (error, exitCode, stdout, stderr)
 */
function spawnWrapper (params, tmpfiles, binary, callback) {
  if (!callback && typeof binary === 'function') {
    callback = binary;
    binary = false;
  }

  var files = [];
  var delTempPWFiles = [];

  if (tmpfiles) {
    tmpfiles = [].concat(tmpfiles);
    var fpath, i;
    for (i = 0; i < params.length; i++) {
      if (params[i] === '--TMPFILE--') {
        fpath = path.join(tempDir, crypto$1.randomBytes(20).toString('hex'));
        files.push({
          path: fpath,
          contents: tmpfiles.shift()
        });
        params[i] = fpath;
        delTempPWFiles.push(fpath);
      }
    }
  }

  var file;
  for (i = 0; i < files.length; i++) {
    file = files[i];
    fs.writeFileSync(file.path, file.contents);
  }

  spawn(params, binary, function (err, code, stdout, stderr) {
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      callback(err || fsErr, code, stdout, stderr);
    });
  });
}

/**
 * Validates the pathBin for the openssl command
 *
 * @private
 * @param {String} pathBin The path to OpenSSL Bin
 * @param {Function} callback Callback function with an error object
 */
function testOpenSSLPath (pathBin, callback) {
  which_1(pathBin, function (error) {
    if (error) {
      return callback(new Error('Could not find openssl on your system on this path: ' + pathBin))
    }
    callback();
  });
}

/* Once PEM is imported, the openSslVersion is set with this function. */
spawn(['version'], false, function (err, code, stdout, stderr) {
  var text = String(stdout) + '\n' + String(stderr) + '\n' + String(err);
  var tmp = text.match(/^LibreSSL/i);
  set$1('openSslVersion', (tmp && tmp[0] ? 'LibreSSL' : 'openssl').toUpperCase());
});

var openssl = {
  exec: exec,
  execBinary: execBinary,
  spawn: spawn,
  spawnWrapper: spawnWrapper,
  set: set$1,
  get: get$1
};

// PEM format: .pem, .crt, .cer (!bin), .key
// base64 encoded; the cert file might also include the private key; so key file is optional

// DER format: .der, .cer (bin)
// binary encoded format; cannot include key file

// PKCS#7 / P7B format: .p7b, .p7c
// contains cert and ca chain cert files, but not the key file
// A PKCS7 certificate is serialized using either PEM or DER format.

// PKCS#12 / PFX format: .pfx, .p12
// contains all files: key file, cert and ca chain cert files

/**
 * pem convert module
 *
 * @module convert
 */

/**
 * conversion from PEM to DER format
 * if private key is included in PEM encoded file, it won't be included in DER file
 * use this method with type 'rsa' to export private key in that case
 * @param  {String} pathIN  path of the PEM encoded certificate file
 * @param  {String} pathOUT path of the DER encoded certificate file to generate
 * @param  {String} [type] type of file, use 'rsa' for key file, 'x509' otherwise or leave this parameter out
 * @param  {Function} callback callback method called with error, boolean result
 */
var PEM2DER = function (pathIN, pathOUT, type, callback) {
  if (!callback && typeof type === 'function') {
    callback = type;
    type = 'x509';
  }
  var params = [
    type,
    '-outform',
    'der',
    '-in',
    pathIN,
    '-out',
    pathOUT
  ];
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};

/**
 * conversion from DER to PEM format
 * @param  {String} pathIN  path of the DER encoded certificate file
 * @param  {String} pathOUT path of the PEM encoded certificate file to generate
 * @param  {String} [type] type of file, use 'rsa' for key file, 'x509' otherwise or leave this parameter out
 * @param  {Function} callback callback method called with error, boolean result
 */
var DER2PEM = function (pathIN, pathOUT, type, callback) {
  if (!callback && typeof type === 'function') {
    callback = type;
    type = 'x509';
  }
  var params = [
    type,
    '-inform',
    'der',
    '-in',
    pathIN,
    '-out',
    pathOUT
  ];
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};

/**
 * conversion from PEM to P7B format
 * @param  {Object} pathBundleIN  paths of the PEM encoded certificate files ({cert: '...', ca: '...' or ['...', ...]})
 * @param  {String} pathOUT path of the P7B encoded certificate file to generate
 * @param  {Function} callback callback method called with error, boolean result
 */
var PEM2P7B = function (pathBundleIN, pathOUT, callback) {
  var params = [
    'crl2pkcs7',
    '-nocrl',
    '-certfile',
    pathBundleIN.cert,
    '-out',
    pathOUT
  ];
  if (pathBundleIN.ca) {
    if (!Array.isArray(pathBundleIN.ca)) {
      pathBundleIN.ca = [pathBundleIN.ca];
    }
    pathBundleIN.ca.forEach(function (ca) {
      params.push('-certfile');
      params.push(ca);
    });
  }
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};

/**
 * conversion from P7B to PEM format
 * @param  {String} pathIN  path of the P7B encoded certificate file
 * @param  {String} pathOUT path of the PEM encoded certificate file to generate
 * @param  {Function} callback callback method called with error, boolean result
 */
var P7B2PEM = function (pathIN, pathOUT, callback) {
  var params = [
    'pkcs7',
    '-print_certs',
    '-in',
    pathIN,
    '-out',
    pathOUT
  ];
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};// TODO: CA also included?

/**
 * conversion from PEM to PFX
 * @param  {Object} pathBundleIN paths of the PEM encoded certificate files ({cert: '...', key: '...', ca: '...' or ['...', ...]})
 * @param  {String} pathOUT path of the PFX encoded certificate file to generate
 * @param  {String} password password to set for accessing the PFX file
 * @param  {Function} callback callback method called with error, boolean result
 */
var PEM2PFX = function (pathBundleIN, pathOUT, password, callback) {
  var params = [
    'pkcs12',
    '-export',
    '-out',
    pathOUT,
    '-inkey',
    pathBundleIN.key,
    '-in',
    pathBundleIN.cert
  ];
  if (pathBundleIN.ca) {
    if (!Array.isArray(pathBundleIN.ca)) {
      pathBundleIN.ca = [pathBundleIN.ca];
    }
    pathBundleIN.ca.forEach(function (ca) {
      params.push('-certfile');
      params.push(ca);
    });
  }
  var delTempPWFiles = [];
  helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles);
  helper.createPasswordFile({ cipher: '', password: password, passType: 'out' }, params, delTempPWFiles);
  openssl.spawnWrapper(params, false, function (error, code) {
    function done (error) {
      if (error) {
        callback(error);
      } else {
        callback(null, code === 0);
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(error || fsErr);
    });
  });
};

/**
 * conversion from PFX to PEM
 * @param  {Object} pathIN  path of the PFX encoded certificate file
 * @param  {String} pathOUT path of the PEM encoded certificate file to generate
 * @param  {String} password password to set for accessing the PFX file
 * @param  {Function} callback callback method called with error, boolean result
 */
var PFX2PEM = function (pathIN, pathOUT, password, callback) {
  var params = [
    'pkcs12',
    '-in',
    pathIN,
    '-out',
    pathOUT,
    '-nodes'
  ];
  var delTempPWFiles = [];
  helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles);
  helper.createPasswordFile({ cipher: '', password: password, passType: 'out' }, params, delTempPWFiles);
  openssl.spawnWrapper(params, false, function (error, code) {
    function done (error) {
      if (error) {
        callback(error);
      } else {
        callback(null, code === 0);
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(error || fsErr);
    });
  });
};

/**
 * conversion from P7B to PFX/PKCS#12
 * @param  {Object} pathBundleIN  paths of the PEM encoded certificate files ({cert: '...', key: '...', ca: '...' or ['...', ...]})
 * @param  {String} pathOUT path of the PFX certificate file to generate
 * @param  {String} password password to be set for the PFX file and to be used to access the key file
 * @param  {Function} callback callback method called with error, boolean result
 */
var P7B2PFX = function (pathBundleIN, pathOUT, password, callback) {
  var tmpfile = pathBundleIN.cert.replace(/\.[^.]+$/, '.cer');
  var params = [
    'pkcs7',
    '-print_certs',
    '-in',
    pathBundleIN.cert,
    '-out',
    tmpfile
  ];
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error);
    } else {
      var params = [
        'pkcs12',
        '-export',
        '-in',
        tmpfile,
        '-inkey',
        pathBundleIN.key,
        '-out',
        pathOUT
      ];
      if (pathBundleIN.ca) {
        if (!Array.isArray(pathBundleIN.ca)) {
          pathBundleIN.ca = [pathBundleIN.ca];
        }
        pathBundleIN.ca.forEach(function (ca) {
          params.push('-certfile');
          params.push(ca);
        });
      }
      var delTempPWFiles = [tmpfile];
      helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles);
      helper.createPasswordFile({ cipher: '', password: password, passType: 'out' }, params, delTempPWFiles);
      openssl.spawnWrapper(params, false, function (error, code) {
        function done (error) {
          if (error) {
            callback(error);
          } else {
            callback(null, code === 0);
          }
        }
        helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
          done(error || fsErr);
        });
      });
    }
  });
};

var convert = {
	PEM2DER: PEM2DER,
	DER2PEM: DER2PEM,
	PEM2P7B: PEM2P7B,
	P7B2PEM: P7B2PEM,
	PEM2PFX: PEM2PFX,
	PFX2PEM: PFX2PEM,
	P7B2PFX: P7B2PFX
};

/**
 * pem module
 *
 * @module pem
 */

const { promisify } = promisify_1;




var createPrivateKey_1 = createPrivateKey;
var createDhparam_1 = createDhparam;
var createEcparam_1 = createEcparam;
var createCSR_1 = createCSR;
var createCertificate_1 = createCertificate;
var readCertificateInfo_1 = readCertificateInfo;
var getPublicKey_1 = getPublicKey;
var getFingerprint_1 = getFingerprint;
var getModulus_1 = getModulus;
var getDhparamInfo_1 = getDhparamInfo;
var createPkcs12_1 = createPkcs12;
var readPkcs12_1 = readPkcs12;
var verifySigningChain_1 = verifySigningChain;
var checkCertificate_1 = checkCertificate;
var checkPkcs12_1 = checkPkcs12;
var config_1 = config;

/**
 * quick access the convert module
 * @type {module:convert}
 */
var convert$1 = convert;

var KEY_START = '-----BEGIN PRIVATE KEY-----';
var KEY_END = '-----END PRIVATE KEY-----';
var RSA_KEY_START = '-----BEGIN RSA PRIVATE KEY-----';
var RSA_KEY_END = '-----END RSA PRIVATE KEY-----';
var ENCRYPTED_KEY_START = '-----BEGIN ENCRYPTED PRIVATE KEY-----';
var ENCRYPTED_KEY_END = '-----END ENCRYPTED PRIVATE KEY-----';
var CERT_START = '-----BEGIN CERTIFICATE-----';
var CERT_END = '-----END CERTIFICATE-----';

/**
 * Creates a private key
 *
 * @static
 * @param {Number} [keyBitsize=2048] Size of the key, defaults to 2048bit
 * @param {Object} [options] object of cipher and password {cipher:'aes128',password:'xxx'}, defaults empty object
 * @param {String} [options.cipher] string of the cipher for the encryption - needed with password
 * @param {String} [options.password] string of the cipher password for the encryption needed with cipher
 * @param {Function} callback Callback function with an error object and {key}
 */
function createPrivateKey (keyBitsize, options, callback) {
  if (!callback && !options && typeof keyBitsize === 'function') {
    callback = keyBitsize;
    keyBitsize = undefined;
    options = {};
  } else if (!callback && keyBitsize && typeof options === 'function') {
    callback = options;
    options = {};
  }

  keyBitsize = Number(keyBitsize) || 2048;

  var params = ['genrsa'];
  var delTempPWFiles = [];

  if (options && options.cipher && (Number(helper.ciphers.indexOf(options.cipher)) !== -1) && options.password) {
    helper.createPasswordFile({ cipher: options.cipher, password: options.password, passType: 'out' }, params, delTempPWFiles);
  }

  params.push(keyBitsize);

  openssl.exec(params, 'RSA PRIVATE KEY', function (sslErr, key) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      callback(null, {
        key: key
      });
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr);
    });
  });
}

/**
 * Creates a dhparam key
 *
 * @static
 * @param {Number} [keyBitsize=512] Size of the key, defaults to 512bit
 * @param {Function} callback Callback function with an error object and {dhparam}
 */
function createDhparam (keyBitsize, callback) {
  if (!callback && typeof keyBitsize === 'function') {
    callback = keyBitsize;
    keyBitsize = undefined;
  }

  keyBitsize = Number(keyBitsize) || 512;

  var params = ['dhparam',
    '-outform',
    'PEM',
    keyBitsize
  ];

  openssl.exec(params, 'DH PARAMETERS', function (error, dhparam) {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      dhparam: dhparam
    })
  });
}

/**
 * Creates a ecparam key
 * @static
 * @param {String} [keyName=secp256k1] Name of the key, defaults to secp256k1
 * @param {String} [paramEnc=explicit] Encoding of the elliptic curve parameters, defaults to explicit
 * @param {Boolean} [noOut=false] This option inhibits the output of the encoded version of the parameters.
 * @param {Function} callback Callback function with an error object and {ecparam}
 */
function createEcparam (keyName, paramEnc, noOut, callback) {
  if (!callback && typeof noOut === 'undefined' && !paramEnc && typeof keyName === 'function') {
    callback = keyName;
    keyName = undefined;
  } else if (!callback && typeof noOut === 'undefined' && keyName && typeof paramEnc === 'function') {
    callback = paramEnc;
    paramEnc = undefined;
  } else if (!callback && typeof noOut === 'function' && keyName && paramEnc) {
    callback = noOut;
    noOut = undefined;
  }

  keyName = keyName || 'secp256k1';
  paramEnc = paramEnc || 'explicit';
  noOut = noOut || false;

  var params = ['ecparam',
    '-name',
    keyName,
    '-genkey',
    '-param_enc',
    paramEnc
  ];

  var searchString = 'EC PARAMETERS';
  if (noOut) {
    params.push('-noout');
    searchString = 'EC PRIVATE KEY';
  }

  openssl.exec(params, searchString, function (error, ecparam) {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      ecparam: ecparam
    })
  });
}

/**
 * Creates a Certificate Signing Request
 * If client key is undefined, a new key is created automatically. The used key is included
 * in the callback return as clientKey
 * @static
 * @param {Object} [options] Optional options object
 * @param {String} [options.clientKey] Optional client key to use
 * @param {Number} [options.keyBitsize] If clientKey is undefined, bit size to use for generating a new key (defaults to 2048)
 * @param {String} [options.hash] Hash function to use (either md5 sha1 or sha256, defaults to sha256)
 * @param {String} [options.country] CSR country field
 * @param {String} [options.state] CSR state field
 * @param {String} [options.locality] CSR locality field
 * @param {String} [options.organization] CSR organization field
 * @param {String} [options.organizationUnit] CSR organizational unit field
 * @param {String} [options.commonName='localhost'] CSR common name field
 * @param {String} [options.emailAddress] CSR email address field
 * @param {String} [options.csrConfigFile] CSR config file
 * @param {Array}  [options.altNames] is a list of subjectAltNames in the subjectAltName field
 * @param {Function} callback Callback function with an error object and {csr, clientKey}
 */
function createCSR (options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  options = options || {};

  // http://stackoverflow.com/questions/14089872/why-does-node-js-accept-ip-addresses-in-certificates-only-for-san-not-for-cn
  if (options.commonName && (net.isIPv4(options.commonName) || net.isIPv6(options.commonName))) {
    if (!options.altNames) {
      options.altNames = [options.commonName];
    } else if (options.altNames.indexOf(options.commonName) === -1) {
      options.altNames = options.altNames.concat([options.commonName]);
    }
  }

  if (!options.clientKey) {
    createPrivateKey(options.keyBitsize || 2048, function (error, keyData) {
      if (error) {
        return callback(error)
      }
      options.clientKey = keyData.key;
      createCSR(options, callback);
    });
    return
  }

  var params = ['req',
    '-new',
    '-' + (options.hash || 'sha256')
  ];

  if (options.csrConfigFile) {
    params.push('-config');
    params.push(options.csrConfigFile);
  } else {
    params.push('-subj');
    params.push(generateCSRSubject(options));
  }

  params.push('-key');
  params.push('--TMPFILE--');

  var tmpfiles = [options.clientKey];
  var config = null;

  if (options.altNames && Array.isArray(options.altNames) && options.altNames.length) {
    params.push('-extensions');
    params.push('v3_req');
    params.push('-config');
    params.push('--TMPFILE--');
    var altNamesRep = [];
    for (var i = 0; i < options.altNames.length; i++) {
      altNamesRep.push((net.isIP(options.altNames[i]) ? 'IP' : 'DNS') + '.' + (i + 1) + ' = ' + options.altNames[i]);
    }

    tmpfiles.push(config = [
      '[req]',
      'req_extensions = v3_req',
      'distinguished_name = req_distinguished_name',
      '[v3_req]',
      'subjectAltName = @alt_names',
      '[alt_names]',
      altNamesRep.join('\n'),
      '[req_distinguished_name]',
      'commonName = Common Name',
      'commonName_max = 64'
    ].join('\n'));
  } else if (options.config) {
    config = options.config;
  }

  var delTempPWFiles = [];
  if (options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: '', password: options.clientKeyPassword, passType: 'in' }, params, delTempPWFiles);
  }

  openssl.exec(params, 'CERTIFICATE REQUEST', tmpfiles, function (sslErr, data) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      callback(null, {
        csr: data,
        config: config,
        clientKey: options.clientKey
      });
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr);
    });
  });
}

/**
 * Creates a certificate based on a CSR. If CSR is not defined, a new one
 * will be generated automatically. For CSR generation all the options values
 * can be used as with createCSR.
 * @static
 * @param {Object} [options] Optional options object
 * @param {String} [options.serviceCertificate] PEM encoded certificate
 * @param {String} [options.serviceKey] Private key for signing the certificate, if not defined a new one is generated
 * @param {String} [options.serviceKeyPassword] Password of the service key
 * @param {Boolean} [options.selfSigned] If set to true and serviceKey is not defined, use clientKey for signing
 * @param {String|Number} [options.serial] Set a serial max. 20 octets - only together with options.serviceCertificate
 * @param {String} [options.serialFile] Set the name of the serial file, without extension. - only together with options.serviceCertificate and never in tandem with options.serial
 * @param {String} [options.hash] Hash function to use (either md5 sha1 or sha256, defaults to sha256)
 * @param {String} [options.csr] CSR for the certificate, if not defined a new one is generated
 * @param {Number} [options.days] Certificate expire time in days
 * @param {String} [options.clientKeyPassword] Password of the client key
 * @param {String} [options.extFile] extension config file - without '-extensions v3_req'
 * @param {String} [options.config] extension config file - with '-extensions v3_req'
 * @param {String} [options.csrConfigFile] CSR config file - only used if no options.csr is provided
 * @param {Array}  [options.altNames] is a list of subjectAltNames in the subjectAltName field - only used if no options.csr is provided
 * @param {Function} callback Callback function with an error object and {certificate, csr, clientKey, serviceKey}
 */
function createCertificate (options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  options = options || {};

  if (!options.csr) {
    createCSR(options, function (error, keyData) {
      if (error) {
        return callback(error)
      }
      options.csr = keyData.csr;
      options.config = keyData.config;
      options.clientKey = keyData.clientKey;
      createCertificate(options, callback);
    });
    return
  }

  if (!options.clientKey) {
    options.clientKey = '';
  }

  if (!options.serviceKey) {
    if (options.selfSigned) {
      options.serviceKey = options.clientKey;
    } else {
      createPrivateKey(options.keyBitsize || 2048, function (error, keyData) {
        if (error) {
          return callback(error)
        }
        options.serviceKey = keyData.key;
        createCertificate(options, callback);
      });
      return
    }
  }

  readCertificateInfo(options.csr, function (error2, data2) {
    if (error2) {
      return callback(error2)
    }

    var params = ['x509',
      '-req',
      '-' + (options.hash || 'sha256'),
      '-days',
      Number(options.days) || '365',
      '-in',
      '--TMPFILE--'
    ];
    var tmpfiles = [options.csr];
    var delTempPWFiles = [];

    if (options.serviceCertificate) {
      params.push('-CA');
      params.push('--TMPFILE--');
      params.push('-CAkey');
      params.push('--TMPFILE--');
      if (options.serial) {
        params.push('-set_serial');
        if (helper.isNumber(options.serial)) {
        // set the serial to the max lenth of 20 octets ()
        // A certificate serial number is not decimal conforming. That is the
        // bytes in a serial number do not necessarily map to a printable ASCII
        // character.
        // eg: 0x00 is a valid serial number and can not be represented in a
        // human readable format (atleast one that can be directly mapped to
        // the ACSII table).
          params.push('0x' + ('0000000000000000000000000000000000000000' + options.serial.toString(16)).slice(-40));
        } else {
          if (helper.isHex(options.serial)) {
            if (options.serial.startsWith('0x')) {
              options.serial = options.serial.substring(2, options.serial.length);
            }
            params.push('0x' + ('0000000000000000000000000000000000000000' + options.serial).slice(-40));
          } else {
            params.push('0x' + ('0000000000000000000000000000000000000000' + helper.toHex(options.serial)).slice(-40));
          }
        }
      } else {
        params.push('-CAcreateserial');
        if (options.serialFile) {
          params.push('-CAserial');
          params.push(options.serialFile + '.srl');
        }
      }
      if (options.serviceKeyPassword) {
        helper.createPasswordFile({ cipher: '', password: options.serviceKeyPassword, passType: 'in' }, params, delTempPWFiles);
      }
      tmpfiles.push(options.serviceCertificate);
      tmpfiles.push(options.serviceKey);
    } else {
      params.push('-signkey');
      params.push('--TMPFILE--');
      if (options.serviceKeyPassword) {
        helper.createPasswordFile({ cipher: '', password: options.serviceKeyPassword, passType: 'in' }, params, delTempPWFiles);
      }
      tmpfiles.push(options.serviceKey);
    }

    if (options.config) {
      params.push('-extensions');
      params.push('v3_req');
      params.push('-extfile');
      params.push('--TMPFILE--');
      tmpfiles.push(options.config);
    } else if (options.extFile) {
      params.push('-extfile');
      params.push(options.extFile);
    } else {
      var altNamesRep = [];
      if (data2 && data2.san) {
        for (var i = 0; i < data2.san.dns.length; i++) {
          altNamesRep.push('DNS' + '.' + (i + 1) + ' = ' + data2.san.dns[i]);
        }
        for (var i2 = 0; i2 < data2.san.ip.length; i2++) {
          altNamesRep.push('IP' + '.' + (i2 + 1) + ' = ' + data2.san.ip[i2]);
        }
        for (var i3 = 0; i3 < data2.san.email.length; i3++) {
          altNamesRep.push('email' + '.' + (i3 + 1) + ' = ' + data2.san.email[i3]);
        }
        params.push('-extensions');
        params.push('v3_req');
        params.push('-extfile');
        params.push('--TMPFILE--');
        tmpfiles.push([
          '[v3_req]',
          'subjectAltName = @alt_names',
          '[alt_names]',
          altNamesRep.join('\n')
        ].join('\n'));
      }
    }

    if (options.clientKeyPassword) {
      helper.createPasswordFile({ cipher: '', password: options.clientKeyPassword, passType: 'in' }, params, delTempPWFiles);
    }

    openssl.exec(params, 'CERTIFICATE', tmpfiles, function (sslErr, data) {
      function done (err) {
        if (err) {
          return callback(err)
        }
        var response = {
          csr: options.csr,
          clientKey: options.clientKey,
          certificate: data,
          serviceKey: options.serviceKey
        };
        return callback(null, response)
      }

      helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
        done(sslErr || fsErr);
      });
    });
  });
}

/**
 * Exports a public key from a private key, CSR or certificate
 * @static
 * @param {String} certificate PEM encoded private key, CSR or certificate
 * @param {Function} callback Callback function with an error object and {publicKey}
 */
function getPublicKey (certificate, callback) {
  if (!callback && typeof certificate === 'function') {
    callback = certificate;
    certificate = undefined;
  }

  certificate = (certificate || '').toString();

  var params;

  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    params = ['req',
      '-in',
      '--TMPFILE--',
      '-pubkey',
      '-noout'
    ];
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    params = ['rsa',
      '-in',
      '--TMPFILE--',
      '-pubout'
    ];
  } else {
    params = ['x509',
      '-in',
      '--TMPFILE--',
      '-pubkey',
      '-noout'
    ];
  }

  openssl.exec(params, 'PUBLIC KEY', certificate, function (error, key) {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      publicKey: key
    })
  });
}

/**
 * Reads subject data from a certificate or a CSR
 * @static
 * @param {String} certificate PEM encoded CSR or certificate
 * @param {Function} callback Callback function with an error object and {country, state, locality, organization, organizationUnit, commonName, emailAddress}
 */
function readCertificateInfo (certificate, callback) {
  if (!callback && typeof certificate === 'function') {
    callback = certificate;
    certificate = undefined;
  }

  certificate = (certificate || '').toString();
  var isMatch = certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/);
  var type = isMatch ? 'req' : 'x509';
  var params = [type,
    '-noout',
    '-nameopt',
    'RFC2253,sep_multiline,space_eq,-esc_msb,utf8',
    '-text',
    '-in',
    '--TMPFILE--'
  ];
  openssl.spawnWrapper(params, certificate, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    } else if (stderr) {
      return callback(stderr)
    }
    return fetchCertificateData(stdout, callback)
  });
}

/**
 * get the modulus from a certificate, a CSR or a private key
 * @static
 * @param {String} certificate PEM encoded, CSR PEM encoded, or private key
 * @param {String} [password] password for the certificate
 * @param {String} [hash] hash function to use (up to now `md5` supported) (default: none)
 * @param {Function} callback Callback function with an error object and {modulus}
 */
function getModulus (certificate, password, hash, callback) {
  if (!callback && !hash && typeof password === 'function') {
    callback = password;
    password = undefined;
    hash = false;
  } else if (!callback && hash && typeof hash === 'function') {
    callback = hash;
    hash = false;
    // password will be falsy if not provided
  }
  // adding hash function to params, is not supported by openssl.
  // process piping would be the right way (... | openssl md5)
  // No idea how this can be achieved in easy with the current build in methods
  // of pem.
  if (hash && hash !== 'md5') {
    hash = false;
  }

  certificate = (Buffer.isBuffer(certificate) && certificate.toString()) || certificate;

  var type = '';
  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    type = 'req';
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    type = 'rsa';
  } else {
    type = 'x509';
  }
  var params = [
    type,
    '-noout',
    '-modulus',
    '-in',
    '--TMPFILE--'
  ];
  var delTempPWFiles = [];
  if (password) {
    helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles);
  }

  openssl.spawnWrapper(params, certificate, function (sslErr, code, stdout, stderr) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      var match = stdout.match(/Modulus=([0-9a-fA-F]+)$/m);
      if (match) {
        return callback(null, {
          modulus: hash ? commonjsRequire()(match[1]) : match[1]
        })
      } else {
        return callback(new Error('No modulus'))
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr || stderr);
    });
  });
}

/**
 * get the size and prime of DH parameters
 * @static
 * @param {String} DH parameters PEM encoded
 * @param {Function} callback Callback function with an error object and {size, prime}
 */
function getDhparamInfo (dh, callback) {
  dh = (Buffer.isBuffer(dh) && dh.toString()) || dh;

  var params = [
    'dhparam',
    '-text',
    '-in',
    '--TMPFILE--'
  ];

  openssl.spawnWrapper(params, dh, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    } else if (stderr) {
      return callback(stderr)
    }

    var result = {};
    var match = stdout.match(/Parameters: \((\d+) bit\)/);

    if (match) {
      result.size = Number(match[1]);
    }

    var prime = '';
    stdout.split('\n').forEach(function (line) {
      if (/\s+([0-9a-f][0-9a-f]:)+[0-9a-f]?[0-9a-f]?/g.test(line)) {
        prime += line.trim();
      }
    });

    if (prime) {
      result.prime = prime;
    }

    if (!match && !prime) {
      return callback(new Error('No DH info found'))
    }

    return callback(null, result)
  });
}

/**
 * config the pem module
 * @static
 * @param {Object} options
 */
function config (options) {
  Object.keys(options).forEach(function (k) {
    openssl.set(k, options[k]);
  });
}

/**
 * Gets the fingerprint for a certificate
 * @static
 * @param {String} PEM encoded certificate
 * @param {String} [hash] hash function to use (either `md5`, `sha1` or `sha256`, defaults to `sha1`)
 * @param {Function} callback Callback function with an error object and {fingerprint}
 */
function getFingerprint (certificate, hash, callback) {
  if (!callback && typeof hash === 'function') {
    callback = hash;
    hash = undefined;
  }

  hash = hash || 'sha1';

  var params = ['x509',
    '-in',
    '--TMPFILE--',
    '-fingerprint',
    '-noout',
    '-' + hash
  ];

  openssl.spawnWrapper(params, certificate, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    } else if (stderr) {
      return callback(stderr)
    }
    var match = stdout.match(/Fingerprint=([0-9a-fA-F:]+)$/m);
    if (match) {
      return callback(null, {
        fingerprint: match[1]
      })
    } else {
      return callback(new Error('No fingerprint'))
    }
  });
}

/**
 * Export private key and certificate to a PKCS12 keystore
 * @static
 * @param {String} PEM encoded private key
 * @param {String} PEM encoded certificate
 * @param {String} Password of the result PKCS12 file
 * @param {Object} [options] object of cipher and optional client key password {cipher:'aes128', clientKeyPassword: 'xxxx', certFiles: ['file1','file2']}
 * @param {Function} callback Callback function with an error object and {pkcs12}
 */
function createPkcs12 (key, certificate, password, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  var params = ['pkcs12', '-export'];
  var delTempPWFiles = [];

  if (options.cipher && options.clientKeyPassword) {
    // NOTICE: The password field is needed! self if it is empty.
    // create password file for the import "-passin"
    helper.createPasswordFile({ cipher: options.cipher, password: options.clientKeyPassword, passType: 'in' }, params, delTempPWFiles);
  }
  // NOTICE: The password field is needed! self if it is empty.
  // create password file for the password "-password"
  helper.createPasswordFile({ cipher: '', password: password, passType: 'word' }, params, delTempPWFiles);

  params.push('-in');
  params.push('--TMPFILE--');
  params.push('-inkey');
  params.push('--TMPFILE--');

  var tmpfiles = [certificate, key];

  if (options.certFiles) {
    tmpfiles.push(options.certFiles.join(''));

    params.push('-certfile');
    params.push('--TMPFILE--');
  }

  openssl.execBinary(params, tmpfiles, function (sslErr, pkcs12) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      return callback(null, {
        pkcs12: pkcs12
      })
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr);
    });
  });
}

/**
 * read sslcert data from Pkcs12 file. Results are provided in callback response in object notation ({cert: .., ca:..., key:...})
 * @static
 * @param  {Buffer|String}   bufferOrPath Buffer or path to file
 * @param  {Object}   [options]      openssl options
 * @param  {Function} callback     Called with error object and sslcert bundle object
 */
function readPkcs12 (bufferOrPath, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  options.p12Password = options.p12Password || '';

  var tmpfiles = [];
  var delTempPWFiles = [];
  var args = ['pkcs12', '-in', bufferOrPath];

  helper.createPasswordFile({ cipher: '', password: options.p12Password, passType: 'in' }, args, delTempPWFiles);

  if (Buffer.isBuffer(bufferOrPath)) {
    tmpfiles = [bufferOrPath];
    args[2] = '--TMPFILE--';
  }

  if (options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: '', password: options.clientKeyPassword, passType: 'out' }, args, delTempPWFiles);
  } else {
    args.push('-nodes');
  }

  openssl.execBinary(args, tmpfiles, function (sslErr, stdout) {
    function done (err) {
      var keybundle = {};

      if (err && err.message.indexOf('No such file or directory') !== -1) {
        err.code = 'ENOENT';
      }

      if (!err) {
        var certs = readFromString(stdout, CERT_START, CERT_END);
        keybundle.cert = certs.shift();
        keybundle.ca = certs;
        keybundle.key = readFromString(stdout, KEY_START, KEY_END).pop();

        if (keybundle.key) {
        // convert to RSA key
          return openssl.exec(['rsa', '-in', '--TMPFILE--'], 'RSA PRIVATE KEY', [keybundle.key], function (err, key) {
            keybundle.key = key;

            return callback(err, keybundle)
          })
        }

        if (options.clientKeyPassword) {
          keybundle.key = readFromString(stdout, ENCRYPTED_KEY_START, ENCRYPTED_KEY_END).pop();
        } else {
          keybundle.key = readFromString(stdout, RSA_KEY_START, RSA_KEY_END).pop();
        }
      }

      return callback(err, keybundle)
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr);
    });
  });
}

/**
 * Check a certificate
 * @static
 * @param {String} PEM encoded certificate
 * @param {String} [passphrase] password for the certificate
 * @param {Function} callback Callback function with an error object and a boolean valid
 */
function checkCertificate (certificate, passphrase, callback) {
  var params;
  var delTempPWFiles = [];

  if (!callback && typeof passphrase === 'function') {
    callback = passphrase;
    passphrase = undefined;
  }
  certificate = (certificate || '').toString();

  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    params = ['req', '-text', '-noout', '-verify', '-in', '--TMPFILE--'];
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    params = ['rsa', '-noout', '-check', '-in', '--TMPFILE--'];
  } else {
    params = ['x509', '-text', '-noout', '-in', '--TMPFILE--'];
  }
  if (passphrase) {
    helper.createPasswordFile({ cipher: '', password: passphrase, passType: 'in' }, params, delTempPWFiles);
  }

  openssl.spawnWrapper(params, certificate, function (sslErr, code, stdout, stderr) {
    function done (err) {
      if (err && err.toString().trim() !== 'verify OK') {
        return callback(err)
      }
      var result;
      switch (params[0]) {
        case 'rsa':
          result = /^Rsa key ok$/i.test(stdout.trim());
          break
        default:
          result = /Signature Algorithm/im.test(stdout);
          break
      }

      callback(null, result);
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr || stderr);
    });
  });
}

/**
 * check a PKCS#12 file (.pfx or.p12)
 * @static
 * @param {Buffer|String} bufferOrPath PKCS#12 certificate
 * @param {String} [passphrase] optional passphrase which will be used to open the keystore
 * @param {Function} callback Callback function with an error object and a boolean valid
 */
function checkPkcs12 (bufferOrPath, passphrase, callback) {
  if (!callback && typeof passphrase === 'function') {
    callback = passphrase;
    passphrase = '';
  }

  var tmpfiles = [];
  var delTempPWFiles = [];
  var args = ['pkcs12', '-info', '-in', bufferOrPath, '-noout', '-maciter', '-nodes'];

  helper.createPasswordFile({ cipher: '', password: passphrase, passType: 'in' }, args, delTempPWFiles);

  if (Buffer.isBuffer(bufferOrPath)) {
    tmpfiles = [bufferOrPath];
    args[3] = '--TMPFILE--';
  }

  openssl.spawnWrapper(args, tmpfiles, function (sslErr, code, stdout, stderr) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      callback(null, (/MAC verified OK/im.test(stderr) || (!(/MAC verified OK/im.test(stderr)) && !(/Mac verify error/im.test(stderr)))));
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr);
    });
  });
}

/**
 * Verifies the signing chain of the passed certificate
 * @static
 * @param {String|Array} PEM encoded certificate include intermediate certificates
 * @param {String|Array} [List] of CA certificates
 * @param {Function} callback Callback function with an error object and a boolean valid
 */
function verifySigningChain (certificate, ca, callback) {
  if (!callback && typeof ca === 'function') {
    callback = ca;
    ca = undefined;
  }
  if (!Array.isArray(certificate)) {
    certificate = [certificate];
  }
  if (!Array.isArray(ca) && ca !== undefined) {
    if (ca !== '') {
      ca = [ca];
    }
  }

  var files = [];

  if (ca !== undefined) {
    // ca certificates
    files.push(ca.join('\n'));
  }
  // certificate incl. intermediate certificates
  files.push(certificate.join('\n'));

  var params = ['verify'];

  if (ca !== undefined) {
    // ca certificates
    params.push('-CAfile');
    params.push('--TMPFILE--');
  }
  // certificate incl. intermediate certificates
  params.push('--TMPFILE--');

  openssl.spawnWrapper(params, files, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    }

    callback(null, stdout.trim().slice(-4) === ': OK');
  });
}

// HELPER FUNCTIONS
function fetchCertificateData (certData, callback) {
  // try catch : if something will fail in parsing it won't crash the calling code
  try {
    certData = (certData || '').toString();

    var serial, subject, tmp, issuer;
    var certValues = {
      issuer: {}
    };
    var validity = {};
    var san;

    var ky, i;

    // serial
    if ((serial = certData.match(/\s*Serial Number:\r?\n?\s*([^\r\n]*)\r?\n\s*\b/)) && serial.length > 1) {
      certValues.serial = serial[1];
    }

    if ((subject = certData.match(/\s*Subject:\r?\n(\s*(([a-zA-Z0-9.]+)\s=\s[^\r\n]+\r?\n))*\s*\b/)) && subject.length > 1) {
      subject = subject[0];
      tmp = matchAll(subject, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g);
      if (tmp) {
        for (i = 0; i < tmp.length; i++) {
          ky = tmp[i][1].trim();
          if (ky.match('(C|ST|L|O|OU|CN|emailAddress|DC)') || ky === '') {
            continue
          }
          certValues[ky] = tmp[i][2].trim();
        }
      }

      // country
      tmp = subject.match(/\sC\s=\s([^\r\n].*?)[\r\n]/);
      certValues.country = (tmp && tmp[1]) || '';

      // state
      tmp = subject.match(/\sST\s=\s([^\r\n].*?)[\r\n]/);
      certValues.state = (tmp && tmp[1]) || '';

      // locality
      tmp = subject.match(/\sL\s=\s([^\r\n].*?)[\r\n]/);
      certValues.locality = (tmp && tmp[1]) || '';

      // organization
      tmp = matchAll(subject, /\sO\s=\s([^\r\n].*)/g);
      certValues.organization = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // unit
      tmp = matchAll(subject, /\sOU\s=\s([^\r\n].*)/g);
      certValues.organizationUnit = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // common name
      tmp = matchAll(subject, /\sCN\s=\s([^\r\n].*)/g);
      certValues.commonName = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // email
      tmp = matchAll(subject, /emailAddress\s=\s([^\r\n].*)/g);
      certValues.emailAddress = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // DC name
      tmp = matchAll(subject, /\sDC\s=\s([^\r\n].*)/g);
      certValues.dc = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';
    }

    if ((issuer = certData.match(/\s*Issuer:\r?\n(\s*([a-zA-Z0-9.]+)\s=\s[^\r\n].*\r?\n)*\s*\b/)) && issuer.length > 1) {
      issuer = issuer[0];
      tmp = matchAll(issuer, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g);
      for (i = 0; i < tmp.length; i++) {
        ky = tmp[i][1].toString();
        if (ky.match('(C|ST|L|O|OU|CN|emailAddress|DC)')) {
          continue
        }
        certValues.issuer[ky] = tmp[i][2].toString();
      }

      // country
      tmp = issuer.match(/\sC\s=\s([^\r\n].*?)[\r\n]/);
      certValues.issuer.country = (tmp && tmp[1]) || '';

      // state
      tmp = issuer.match(/\sST\s=\s([^\r\n].*?)[\r\n]/);
      certValues.issuer.state = (tmp && tmp[1]) || '';

      // locality
      tmp = issuer.match(/\sL\s=\s([^\r\n].*?)[\r\n]/);
      certValues.issuer.locality = (tmp && tmp[1]) || '';

      // organization
      tmp = matchAll(issuer, /\sO\s=\s([^\r\n].*)/g);
      certValues.issuer.organization = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // unit
      tmp = matchAll(issuer, /\sOU\s=\s([^\r\n].*)/g);
      certValues.issuer.organizationUnit = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var
          r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // common name
      tmp = matchAll(issuer, /\sCN\s=\s([^\r\n].*)/g);
      certValues.issuer.commonName = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var
          r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';

      // DC name
      tmp = matchAll(issuer, /\sDC\s=\s([^\r\n].*)/g);
      certValues.issuer.dc = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase();
        var
          r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : '';
    }

    // SAN
    if ((san = certData.match(/X509v3 Subject Alternative Name: \r?\n([^\r\n]*)\r?\n/)) && san.length > 1) {
      san = san[1].trim() + '\n';
      certValues.san = {};

      // hostnames
      tmp = pregMatchAll('DNS:([^,\\r\\n].*?)[,\\r\\n\\s]', san);
      certValues.san.dns = tmp || '';

      // IP-Addresses IPv4 & IPv6
      tmp = pregMatchAll('IP Address:([^,\\r\\n].*?)[,\\r\\n\\s]', san);
      certValues.san.ip = tmp || '';

      // Email Addresses
      tmp = pregMatchAll('email:([^,\\r\\n].*?)[,\\r\\n\\s]', san);
      certValues.san.email = tmp || '';
    }

    // Validity
    if ((tmp = certData.match(/Not Before\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      validity.start = Date.parse((tmp && tmp[1]) || '');
    }

    if ((tmp = certData.match(/Not After\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      validity.end = Date.parse((tmp && tmp[1]) || '');
    }

    if (validity.start && validity.end) {
      certValues.validity = validity;
    }
    // Validity end

    // Signature Algorithm
    if ((tmp = certData.match(/Signature Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.signatureAlgorithm = (tmp && tmp[1]) || '';
    }

    // Public Key
    if ((tmp = certData.match(/Public[ -]Key: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.publicKeySize = ((tmp && tmp[1]) || '').replace(/[()]/g, '');
    }

    // Public Key Algorithm
    if ((tmp = certData.match(/Public Key Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.publicKeyAlgorithm = (tmp && tmp[1]) || '';
    }

    callback(null, certValues);
  } catch (err) {
    callback(err);
  }
}

function matchAll (str, regexp) {
  var matches = [];
  str.replace(regexp, function () {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null
}

function pregMatchAll (regex, haystack) {
  var globalRegex = new RegExp(regex, 'g');
  var globalMatch = haystack.match(globalRegex) || [];
  var matchArray = [];
  var nonGlobalRegex, nonGlobalMatch;
  for (var i = 0; i < globalMatch.length; i++) {
    nonGlobalRegex = new RegExp(regex);
    nonGlobalMatch = globalMatch[i].match(nonGlobalRegex);
    matchArray.push(nonGlobalMatch[1]);
  }
  return matchArray
}

function generateCSRSubject (options) {
  options = options || {};

  var csrData = {
    C: options.country || options.C,
    ST: options.state || options.ST,
    L: options.locality || options.L,
    O: options.organization || options.O,
    OU: options.organizationUnit || options.OU,
    CN: options.commonName || options.CN || 'localhost',
    DC: options.dc || options.DC || '',
    emailAddress: options.emailAddress
  };

  var csrBuilder = Object.keys(csrData).map(function (key) {
    if (csrData[key]) {
      if (typeof csrData[key] === 'object' && csrData[key].length >= 1) {
        var tmpStr = '';
        csrData[key].map(function (o) {
          tmpStr += '/' + key + '=' + o.replace(/[^\w .*\-,@']+/g, ' ').trim();
        });
        return tmpStr
      } else {
        return '/' + key + '=' + csrData[key].replace(/[^\w .*\-,@']+/g, ' ').trim()
      }
    }
  });

  return csrBuilder.join('')
}

function readFromString (string, start, end) {
  if (Buffer.isBuffer(string)) {
    string = string.toString('utf8');
  }

  var output = [];

  if (!string) {
    return output
  }

  var offset = string.indexOf(start);

  while (offset !== -1) {
    string = string.substring(offset);

    var endOffset = string.indexOf(end);

    if (endOffset === -1) {
      break
    }

    endOffset += end.length;

    output.push(string.substring(0, endOffset));
    offset = string.indexOf(start, endOffset);
  }

  return output
}

// promisify not tested yet
/**
 * Verifies the signing chain of the passed certificate
 * @namespace
 * @name promisified
 * @property {function}  createPrivateKey               @see createPrivateKey
 * @property {function}  createDhparam       - The default number of players.
 * @property {function}  createEcparam         - The default level for the party.
 * @property {function}  createCSR      - The default treasure.
 * @property {function}  createCertificate - How much gold the party starts with.
 */
var promisified = {
  createPrivateKey: promisify(createPrivateKey),
  createDhparam: promisify(createDhparam),
  createEcparam: promisify(createEcparam),
  createCSR: promisify(createCSR),
  createCertificate: promisify(createCertificate),
  readCertificateInfo: promisify(readCertificateInfo),
  getPublicKey: promisify(getPublicKey),
  getFingerprint: promisify(getFingerprint),
  getModulus: promisify(getModulus),
  getDhparamInfo: promisify(getDhparamInfo),
  createPkcs12: promisify(createPkcs12),
  readPkcs12: promisify(readPkcs12),
  verifySigningChain: promisify(verifySigningChain),
  checkCertificate: promisify(checkCertificate),
  checkPkcs12: promisify(checkPkcs12)
};

var pem = {
	createPrivateKey: createPrivateKey_1,
	createDhparam: createDhparam_1,
	createEcparam: createEcparam_1,
	createCSR: createCSR_1,
	createCertificate: createCertificate_1,
	readCertificateInfo: readCertificateInfo_1,
	getPublicKey: getPublicKey_1,
	getFingerprint: getFingerprint_1,
	getModulus: getModulus_1,
	getDhparamInfo: getDhparamInfo_1,
	createPkcs12: createPkcs12_1,
	readPkcs12: readPkcs12_1,
	verifySigningChain: verifySigningChain_1,
	checkCertificate: checkCertificate_1,
	checkPkcs12: checkPkcs12_1,
	config: config_1,
	convert: convert$1,
	promisified: promisified
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
                rejectUnauthorized: false,
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

var SYNC_BLOCKCHAINS = '[MAIN] Sync blockchains';
var initialState$2 = {};
var reducer = function (state, action) {
    if (state === void 0) { state = initialState$2; }
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
        if (!blockchains[chainId].nodes.length) {
            return;
        }
        okBlockchains[chainId] = __assign(__assign({}, blockchains[chainId]), { nodes: blockchains[chainId].nodes });
    });
    return okBlockchains;
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

var LOAD_OR_RELOAD_BROWSER_VIEW = '[MAIN] Load or reload browser view';
var LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED = '[MAIN] Load or reload browser view completed';
var DESTROY_BROWSER_VIEW = '[MAIN] Destroy browser view';
var UPDATE_BROWSER_VIEWS_POSITION = '[MAIN] Update browser views position';
var DISPLAY_ONLY_BROWSER_VIEW_X = '[MAIN] Display only browser view x';
var DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED = '[MAIN] Display only browser view x completed';
var SET_BROWSER_VIEW_MUTED = '[MAIN] Set browser view muted';
var initialState$3 = { browserViews: {}, position: undefined };
// todo DO a saga
var reducer$1 = function (state, action) {
    if (state === void 0) { state = initialState$3; }
    switch (action.type) {
        case LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED: {
            return __assign(__assign({}, state), { browserViews: __assign(__assign({}, state.browserViews), action.payload) });
        }
        case DESTROY_BROWSER_VIEW: {
            var browserView = state.browserViews[action.payload.tabId];
            if (browserView) {
                if (browserView.browserView.webContents.isDevToolsOpened()) {
                    browserView.browserView.webContents.closeDevTools();
                }
                browserView.browserView.webContents.forcefullyCrashRenderer();
                action.meta.browserWindow.removeBrowserView(browserView.browserView);
                var newBrowserViews = __assign({}, state.browserViews);
                delete newBrowserViews[action.payload.tabId];
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

var uniqueEphemeralTokenAskedOnce = false;
var uniqueEphemeralToken = '';
/* browser process - main process */
var registerInterProcessProtocol = function (session, store, getLoadResourceWhenReady, openExternal, browserWindow, dispatchFromMain, getDispatchesFromMainAwaiting) {
    return session.protocol.registerBufferProtocol('interprocess', function (request, callback) {
        if (request.url === 'interprocess://ask-unique-ephemeral-token') {
            if (uniqueEphemeralTokenAskedOnce === false) {
                uniqueEphemeralTokenAskedOnce = true;
                return crypto$1.randomBytes(64, function (err, buf) {
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
        if (request.url === 'interprocess://maximize') {
            if (browserWindow.isMaximized()) {
                browserWindow.unmaximize();
            }
            else {
                browserWindow.maximize();
            }
        }
        if (request.url === 'interprocess://minimize') {
            browserWindow.minimize();
        }
        if (request.url === 'interprocess://close') {
            browserWindow.close();
        }
        /* browser to node */
        if (request.url === 'interprocess://dappy-multi-request') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var parameters = data.parameters;
                var body = data.body;
                if (parameters.multiCallId === EXECUTE_RCHAIN_CRON_JOBS) {
                    parameters.comparer = function (res) {
                        var json = JSON.parse(res);
                        // do not include json.rnodeVersion that might differ
                        return "".concat(json.data.rchainNetwork, "-").concat(json.data.rchainShardId, "-").concat(json.data.lastFinalizedBlockNumber, "-").concat(json.data.rchainNamesRegistryUri);
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
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when dappy-multi-request'));
            }
        }
        /* browser to node */
        if (request.url === 'interprocess://dappy-single-request') {
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
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when dappy-single-request'));
            }
        }
        if (request.url === 'interprocess://dappy-lookup') {
            var blockchains = getBlockchains$1(store.getState());
            var first = Object.keys(blockchains)[0];
            if (!first) {
                callback(Buffer.from(JSON.stringify({
                    success: false,
                    error: "no dappy network"
                })));
                return;
            }
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                if (data.value.method === "lookup") {
                    if (data.value.type === "TXT") {
                        lookup$1(data.value.hostname, data.value.type, { dappyNetwork: blockchains[first].nodes }).then(function (a) {
                            callback(Buffer.from(JSON.stringify({
                                success: true,
                                data: a
                            })));
                        })
                            .catch(function (err) {
                            callback(Buffer.from(JSON.stringify({
                                success: false,
                                error: err.message
                            })));
                        });
                    }
                    else {
                        callback(Buffer.from(JSON.stringify({
                            success: false,
                            error: "unknown type"
                        })));
                    }
                }
                else {
                    callback(Buffer.from(JSON.stringify({
                        success: false,
                        error: "unknown method"
                    })));
                }
            }
            catch (err) {
                callback(Buffer.from(JSON.stringify({
                    success: false,
                    error: err.message
                })));
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
                }
                else {
                    store.dispatch(action);
                }
            }
            catch (err) {
                console.log(err);
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when dispatch-in-main'));
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
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when open-external'));
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
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when copy-to-clipboard'));
            }
        }
        if (request.url === 'interprocess://trigger-command') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                var command = data.command;
                var payload_1 = data.payload;
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
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when trigger-command'));
            }
        }
        if (request.url === 'interprocess://get-dispatches-from-main-awaiting') {
            callback(Buffer.from(JSON.stringify({
                actions: getDispatchesFromMainAwaiting(),
            })));
        }
        if (request.url === 'interprocess://generate-certificate-and-key') {
            try {
                var data = JSON.parse(decodeURI(request.headers['Data']));
                pem.createCertificate({ days: 1000000, selfSigned: true, altNames: data.parameters.altNames }, function (err, keys) {
                    if (err) {
                        console.log(err);
                        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when generate-certificate-and-key'));
                        return;
                    }
                    callback(Buffer.from(JSON.stringify({
                        key: keys.clientKey,
                        certificate: keys.certificate,
                    })));
                });
            }
            catch (err) {
                console.log(err);
                callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when generate-certificate-and-key'));
            }
        }
    });
};

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
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty$1(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

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

// Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of
function miniKindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';
  var type = typeof val;

  switch (type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'symbol':
    case 'function':
      {
        return type;
      }
  }

  if (Array.isArray(val)) return 'array';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  var constructorName = ctorName(val);

  switch (constructorName) {
    case 'Symbol':
    case 'Promise':
    case 'WeakMap':
    case 'WeakSet':
    case 'Map':
    case 'Set':
      return constructorName;
  } // other


  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
}

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function kindOf(val) {
  var typeOfVal = typeof val;

  if (process.env.NODE_ENV !== 'production') {
    typeOfVal = miniKindOf(val);
  }

  return typeOfVal;
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
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(0) : 'It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
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
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(3) : 'You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
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
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }

    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(5) : 'You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(6) : 'You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
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
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }

    if (typeof action.type === 'undefined') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }

    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(9) : 'Reducers may not dispatch actions.');
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
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
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
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
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

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + kindOf(inputState) + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
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
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(12) : "The slice reducer for key \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(13) : "The slice reducer for key \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle '" + ActionTypes.INIT + "' or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
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
        var actionType = action && action.type;
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(14) : "When called with an action of type " + (actionType ? "\"" + String(actionType) + "\"" : '(unknown type)') + ", the slice reducer for key \"" + _key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.");
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
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
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(15) : 'Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
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
      return _objectSpread2(_objectSpread2({}, store), {}, {
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

var createSymbol = function createSymbol(name) {
  return "@@redux-saga/" + name;
};

var CANCEL =
/*#__PURE__*/
createSymbol('CANCEL_PROMISE');
var CHANNEL_END_TYPE =
/*#__PURE__*/
createSymbol('CHANNEL_END');
var IO =
/*#__PURE__*/
createSymbol('IO');
var MATCH =
/*#__PURE__*/
createSymbol('MATCH');
var MULTICAST =
/*#__PURE__*/
createSymbol('MULTICAST');
var SAGA_ACTION =
/*#__PURE__*/
createSymbol('SAGA_ACTION');
var SELF_CANCELLATION =
/*#__PURE__*/
createSymbol('SELF_CANCELLATION');
var TASK =
/*#__PURE__*/
createSymbol('TASK');
var TASK_CANCEL =
/*#__PURE__*/
createSymbol('TASK_CANCEL');
var TERMINATE =
/*#__PURE__*/
createSymbol('TERMINATE');
var SAGA_LOCATION =
/*#__PURE__*/
createSymbol('LOCATION');

function _extends$4() {
  _extends$4 = Object.assign || function (target) {
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

  return _extends$4.apply(this, arguments);
}

function _objectWithoutPropertiesLoose$1(source, excluded) {
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

var undef = function undef(v) {
  return v === null || v === undefined;
};
var notUndef = function notUndef(v) {
  return v !== null && v !== undefined;
};
var func = function func(f) {
  return typeof f === 'function';
};
var string$1 = function string(s) {
  return typeof s === 'string';
};
var array$2 = Array.isArray;
var object$1 = function object(obj) {
  return obj && !array$2(obj) && typeof obj === 'object';
};
var promise = function promise(p) {
  return p && func(p.then);
};
var iterator = function iterator(it) {
  return it && func(it.next) && func(it.throw);
};
var buffer$1 = function buffer(buf) {
  return buf && func(buf.isEmpty) && func(buf.take) && func(buf.put);
};
var pattern = function pattern(pat) {
  return pat && (string$1(pat) || symbol(pat) || func(pat) || array$2(pat) && pat.every(pattern));
};
var channel = function channel(ch) {
  return ch && func(ch.take) && func(ch.close);
};
var stringableFunc = function stringableFunc(f) {
  return func(f) && f.hasOwnProperty('toString');
};
var symbol = function symbol(sym) {
  return Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
};
var multicast = function multicast(ch) {
  return channel(ch) && ch[MULTICAST];
};
var effect = function effect(eff) {
  return eff && eff[IO];
};

var konst = function konst(v) {
  return function () {
    return v;
  };
};
var kTrue =
/*#__PURE__*/
konst(true);

var noop = function noop() {};

if (process.env.NODE_ENV !== 'production' && typeof Proxy !== 'undefined') {
  noop =
  /*#__PURE__*/
  new Proxy(noop, {
    set: function set() {
      throw internalErr('There was an attempt to assign a property to internal `noop` function.');
    }
  });
}
var identity$1 = function identity(v) {
  return v;
};
var hasSymbol = typeof Symbol === 'function';
var asyncIteratorSymbol = hasSymbol && Symbol.asyncIterator ? Symbol.asyncIterator : '@@asyncIterator';
function check(value, predicate, error) {
  if (!predicate(value)) {
    throw new Error(error);
  }
}
var assignWithSymbols = function assignWithSymbols(target, source) {
  _extends$4(target, source);

  if (Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols(source).forEach(function (s) {
      target[s] = source[s];
    });
  }
};
var flatMap = function flatMap(mapper, arr) {
  var _ref;

  return (_ref = []).concat.apply(_ref, arr.map(mapper));
};
function remove(array, item) {
  var index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
function once$1(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }

    called = true;
    fn();
  };
}

var kThrow = function kThrow(err) {
  throw err;
};

var kReturn = function kReturn(value) {
  return {
    value: value,
    done: true
  };
};

function makeIterator(next, thro, name) {
  if (thro === void 0) {
    thro = kThrow;
  }

  if (name === void 0) {
    name = 'iterator';
  }

  var iterator = {
    meta: {
      name: name
    },
    next: next,
    throw: thro,
    return: kReturn,
    isSagaIterator: true
  };

  if (typeof Symbol !== 'undefined') {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}
function logError(error, _ref2) {
  var sagaStack = _ref2.sagaStack;

  /*eslint-disable no-console*/
  console.error(error);
  console.error(sagaStack);
}
var internalErr = function internalErr(err) {
  return new Error("\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project's github repo.\n  Error: " + err + "\n");
};
var createSetContextWarning = function createSetContextWarning(ctx, props) {
  return (ctx ? ctx + '.' : '') + "setContext(props): argument " + props + " is not a plain object";
};
var FROZEN_ACTION_ERROR = "You can't put (a.k.a. dispatch from saga) frozen actions.\nWe have to define a special non-enumerable property on those actions for scheduling purposes.\nOtherwise you wouldn't be able to communicate properly between sagas & other subscribers (action ordering would become far less predictable).\nIf you are using redux and you care about this behaviour (frozen actions),\nthen you might want to switch to freezing actions in a middleware rather than in action creator.\nExample implementation:\n\nconst freezeActions = store => next => action => next(Object.freeze(action))\n"; // creates empty, but not-holey array

var createEmptyArray = function createEmptyArray(n) {
  return Array.apply(null, new Array(n));
};
var wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
  return function (action) {
    if (process.env.NODE_ENV !== 'production') {
      check(action, function (ac) {
        return !Object.isFrozen(ac);
      }, FROZEN_ACTION_ERROR);
    }

    return dispatch(Object.defineProperty(action, SAGA_ACTION, {
      value: true
    }));
  };
};
var shouldTerminate = function shouldTerminate(res) {
  return res === TERMINATE;
};
var shouldCancel = function shouldCancel(res) {
  return res === TASK_CANCEL;
};
var shouldComplete = function shouldComplete(res) {
  return shouldTerminate(res) || shouldCancel(res);
};
function createAllStyleChildCallbacks(shape, parentCallback) {
  var keys = Object.keys(shape);
  var totalCount = keys.length;

  if (process.env.NODE_ENV !== 'production') {
    check(totalCount, function (c) {
      return c > 0;
    }, 'createAllStyleChildCallbacks: get an empty array or object');
  }

  var completedCount = 0;
  var completed;
  var results = array$2(shape) ? createEmptyArray(totalCount) : {};
  var childCallbacks = {};

  function checkEnd() {
    if (completedCount === totalCount) {
      completed = true;
      parentCallback(results);
    }
  }

  keys.forEach(function (key) {
    var chCbAtKey = function chCbAtKey(res, isErr) {
      if (completed) {
        return;
      }

      if (isErr || shouldComplete(res)) {
        parentCallback.cancel();
        parentCallback(res, isErr);
      } else {
        results[key] = res;
        completedCount++;
        checkEnd();
      }
    };

    chCbAtKey.cancel = noop;
    childCallbacks[key] = chCbAtKey;
  });

  parentCallback.cancel = function () {
    if (!completed) {
      completed = true;
      keys.forEach(function (key) {
        return childCallbacks[key].cancel();
      });
    }
  };

  return childCallbacks;
}
function getMetaInfo(fn) {
  return {
    name: fn.name || 'anonymous',
    location: getLocation(fn)
  };
}
function getLocation(instrumented) {
  return instrumented[SAGA_LOCATION];
}

var BUFFER_OVERFLOW = "Channel's Buffer overflow!";
var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_SLIDE = 3;
var ON_OVERFLOW_EXPAND = 4;

function ringBuffer(limit, overflowAction) {
  if (limit === void 0) {
    limit = 10;
  }

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
        var doubledLimit;

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

        }
      }
    },
    take: take,
    flush: flush
  };
}
var expanding = function expanding(initialSize) {
  return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
};

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

var makeEffect = function makeEffect(type, payload) {
  var _ref;

  return _ref = {}, _ref[IO] = true, _ref.combinator = false, _ref.type = type, _ref.payload = payload, _ref;
};
function take(patternOrChannel, multicastPattern) {
  if (patternOrChannel === void 0) {
    patternOrChannel = '*';
  }

  if (process.env.NODE_ENV !== 'production' && arguments.length) {
    check(arguments[0], notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }

  if (pattern(patternOrChannel)) {
    return makeEffect(TAKE, {
      pattern: patternOrChannel
    });
  }

  if (multicast(patternOrChannel) && notUndef(multicastPattern) && pattern(multicastPattern)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel,
      pattern: multicastPattern
    });
  }

  if (channel(patternOrChannel)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    throw new Error("take(patternOrChannel): argument " + patternOrChannel + " is not valid channel or a valid pattern");
  }
}
function put(channel$1, action) {
  if (process.env.NODE_ENV !== 'production') {
    if (arguments.length > 1) {
      check(channel$1, notUndef, 'put(channel, action): argument channel is undefined');
      check(channel$1, channel, "put(channel, action): argument " + channel$1 + " is not a valid channel");
      check(action, notUndef, 'put(channel, action): argument action is undefined');
    } else {
      check(channel$1, notUndef, 'put(action): argument action is undefined');
    }
  }

  if (undef(action)) {
    action = channel$1; // `undefined` instead of `null` to make default parameter work

    channel$1 = undefined;
  }

  return makeEffect(PUT, {
    channel: channel$1,
    action: action
  });
}
function all(effects) {
  var eff = makeEffect(ALL, effects);
  eff.combinator = true;
  return eff;
}

var validateFnDescriptor = function validateFnDescriptor(effectName, fnDescriptor) {
  check(fnDescriptor, notUndef, effectName + ": argument fn is undefined or null");

  if (func(fnDescriptor)) {
    return;
  }

  var context = null;
  var fn;

  if (array$2(fnDescriptor)) {
    context = fnDescriptor[0];
    fn = fnDescriptor[1];
    check(fn, notUndef, effectName + ": argument of type [context, fn] has undefined or null `fn`");
  } else if (object$1(fnDescriptor)) {
    context = fnDescriptor.context;
    fn = fnDescriptor.fn;
    check(fn, notUndef, effectName + ": argument of type {context, fn} has undefined or null `fn`");
  } else {
    check(fnDescriptor, func, effectName + ": argument fn is not function");
    return;
  }

  if (context && string$1(fn)) {
    check(context[fn], func, effectName + ": context arguments has no such method - \"" + fn + "\"");
    return;
  }

  check(fn, func, effectName + ": unpacked fn argument (from [context, fn] or {context, fn}) is not a function");
};

function getFnCallDescriptor(fnDescriptor, args) {
  var context = null;
  var fn;

  if (func(fnDescriptor)) {
    fn = fnDescriptor;
  } else {
    if (array$2(fnDescriptor)) {
      context = fnDescriptor[0];
      fn = fnDescriptor[1];
    } else {
      context = fnDescriptor.context;
      fn = fnDescriptor.fn;
    }

    if (context && string$1(fn) && func(context[fn])) {
      fn = context[fn];
    }
  }

  return {
    context: context,
    fn: fn,
    args: args
  };
}
function fork(fnDescriptor) {
  if (process.env.NODE_ENV !== 'production') {
    validateFnDescriptor('fork', fnDescriptor);
    check(fnDescriptor, function (arg) {
      return !effect(arg);
    }, 'fork: argument must not be an effect');
  }

  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return makeEffect(FORK, getFnCallDescriptor(fnDescriptor, args));
}
function select(selector) {
  if (selector === void 0) {
    selector = identity$1;
  }

  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if (process.env.NODE_ENV !== 'production' && arguments.length) {
    check(arguments[0], notUndef, 'select(selector, [...]): argument selector is undefined');
    check(selector, func, "select(selector, [...]): argument " + selector + " is not a function");
  }

  return makeEffect(SELECT, {
    selector: selector,
    args: args
  });
}

function deferred() {
  var def = {};
  def.promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  return def;
}

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

function exec$1(task) {
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
 * Puts the scheduler in a `suspended` state and executes a task immediately.
 */

function immediately(task) {
  try {
    suspend();
    return task();
  } finally {
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
  var task;

  while (!semaphore && (task = queue.shift()) !== undefined) {
    exec$1(task);
  }
}

var array$3 = function array(patterns) {
  return function (input) {
    return patterns.some(function (p) {
      return matcher(p)(input);
    });
  };
};
var predicate = function predicate(_predicate) {
  return function (input) {
    return _predicate(input);
  };
};
var string$2 = function string(pattern) {
  return function (input) {
    return input.type === String(pattern);
  };
};
var symbol$1 = function symbol(pattern) {
  return function (input) {
    return input.type === pattern;
  };
};
var wildcard = function wildcard() {
  return kTrue;
};
function matcher(pattern) {
  // prettier-ignore
  var matcherCreator = pattern === '*' ? wildcard : string$1(pattern) ? string$2 : array$2(pattern) ? array$3 : stringableFunc(pattern) ? string$2 : func(pattern) ? predicate : symbol(pattern) ? symbol$1 : null;

  if (matcherCreator === null) {
    throw new Error("invalid pattern: " + pattern);
  }

  return matcherCreator(pattern);
}

var END = {
  type: CHANNEL_END_TYPE
};
var isEnd = function isEnd(a) {
  return a && a.type === CHANNEL_END_TYPE;
};
var CLOSED_CHANNEL_WITH_TAKERS = 'Cannot have a closed channel with pending takers';
var INVALID_BUFFER = 'invalid buffer passed to channel factory function';
var UNDEFINED_INPUT_ERROR = "Saga or channel was provided with an undefined action\nHints:\n  - check that your Action Creator returns a non-undefined value\n  - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners";
function channel$1(buffer$1$1) {
  if (buffer$1$1 === void 0) {
    buffer$1$1 = expanding();
  }

  var closed = false;
  var takers = [];

  if (process.env.NODE_ENV !== 'production') {
    check(buffer$1$1, buffer$1, INVALID_BUFFER);
  }

  function checkForbiddenStates() {
    if (closed && takers.length) {
      throw internalErr(CLOSED_CHANNEL_WITH_TAKERS);
    }

    if (takers.length && !buffer$1$1.isEmpty()) {
      throw internalErr('Cannot have pending takers with non empty buffer');
    }
  }

  function put(input) {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
      check(input, notUndef, UNDEFINED_INPUT_ERROR);
    }

    if (closed) {
      return;
    }

    if (takers.length === 0) {
      return buffer$1$1.put(input);
    }

    var cb = takers.shift();
    cb(input);
  }

  function take(cb) {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
      check(cb, func, "channel.take's callback must be a function");
    }

    if (closed && buffer$1$1.isEmpty()) {
      cb(END);
    } else if (!buffer$1$1.isEmpty()) {
      cb(buffer$1$1.take());
    } else {
      takers.push(cb);

      cb.cancel = function () {
        remove(takers, cb);
      };
    }
  }

  function flush(cb) {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
      check(cb, func, "channel.flush' callback must be a function");
    }

    if (closed && buffer$1$1.isEmpty()) {
      cb(END);
      return;
    }

    cb(buffer$1$1.flush());
  }

  function close() {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
    }

    if (closed) {
      return;
    }

    closed = true;
    var arr = takers;
    takers = [];

    for (var i = 0, len = arr.length; i < len; i++) {
      var taker = arr[i];
      taker(END);
    }
  }

  return {
    take: take,
    put: put,
    flush: flush,
    close: close
  };
}
function multicastChannel() {
  var _ref;

  var closed = false;
  var currentTakers = [];
  var nextTakers = currentTakers;

  function checkForbiddenStates() {
    if (closed && nextTakers.length) {
      throw internalErr(CLOSED_CHANNEL_WITH_TAKERS);
    }
  }

  var ensureCanMutateNextTakers = function ensureCanMutateNextTakers() {
    if (nextTakers !== currentTakers) {
      return;
    }

    nextTakers = currentTakers.slice();
  };

  var close = function close() {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
    }

    closed = true;
    var takers = currentTakers = nextTakers;
    nextTakers = [];
    takers.forEach(function (taker) {
      taker(END);
    });
  };

  return _ref = {}, _ref[MULTICAST] = true, _ref.put = function put(input) {
    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
      check(input, notUndef, UNDEFINED_INPUT_ERROR);
    }

    if (closed) {
      return;
    }

    if (isEnd(input)) {
      close();
      return;
    }

    var takers = currentTakers = nextTakers;

    for (var i = 0, len = takers.length; i < len; i++) {
      var taker = takers[i];

      if (taker[MATCH](input)) {
        taker.cancel();
        taker(input);
      }
    }
  }, _ref.take = function take(cb, matcher) {
    if (matcher === void 0) {
      matcher = wildcard;
    }

    if (process.env.NODE_ENV !== 'production') {
      checkForbiddenStates();
    }

    if (closed) {
      cb(END);
      return;
    }

    cb[MATCH] = matcher;
    ensureCanMutateNextTakers();
    nextTakers.push(cb);
    cb.cancel = once$1(function () {
      ensureCanMutateNextTakers();
      remove(nextTakers, cb);
    });
  }, _ref.close = close, _ref;
}
function stdChannel() {
  var chan = multicastChannel();
  var put = chan.put;

  chan.put = function (input) {
    if (input[SAGA_ACTION]) {
      put(input);
      return;
    }

    asap(function () {
      put(input);
    });
  };

  return chan;
}

var RUNNING = 0;
var CANCELLED$1 = 1;
var ABORTED = 2;
var DONE = 3;

function resolvePromise(promise, cb) {
  var cancelPromise = promise[CANCEL];

  if (func(cancelPromise)) {
    cb.cancel = cancelPromise;
  }

  promise.then(cb, function (error) {
    cb(error, true);
  });
}

var current = 0;
var nextSagaId = (function () {
  return ++current;
});

var _effectRunnerMap;

function getIteratorMetaInfo(iterator, fn) {
  if (iterator.isSagaIterator) {
    return {
      name: iterator.meta.name
    };
  }

  return getMetaInfo(fn);
}

function createTaskIterator(_ref) {
  var context = _ref.context,
      fn = _ref.fn,
      args = _ref.args;

  // catch synchronous failures; see #152 and #441
  try {
    var result = fn.apply(context, args); // i.e. a generator function returns an iterator

    if (iterator(result)) {
      return result;
    }

    var resolved = false;

    var next = function next(arg) {
      if (!resolved) {
        resolved = true; // Only promises returned from fork will be interpreted. See #1573

        return {
          value: result,
          done: !promise(result)
        };
      } else {
        return {
          value: arg,
          done: true
        };
      }
    };

    return makeIterator(next);
  } catch (err) {
    // do not bubble up synchronous failures for detached forks
    // instead create a failed task. See #152 and #441
    return makeIterator(function () {
      throw err;
    });
  }
}

function runPutEffect(env, _ref2, cb) {
  var channel = _ref2.channel,
      action = _ref2.action,
      resolve = _ref2.resolve;

  /**
   Schedule the put in case another saga is holding a lock.
   The put will be executed atomically. ie nested puts will execute after
   this put has terminated.
   **/
  asap(function () {
    var result;

    try {
      result = (channel ? channel.put : env.dispatch)(action);
    } catch (error) {
      cb(error, true);
      return;
    }

    if (resolve && promise(result)) {
      resolvePromise(result, cb);
    } else {
      cb(result);
    }
  }); // Put effects are non cancellables
}

function runTakeEffect(env, _ref3, cb) {
  var _ref3$channel = _ref3.channel,
      channel = _ref3$channel === void 0 ? env.channel : _ref3$channel,
      pattern = _ref3.pattern,
      maybe = _ref3.maybe;

  var takeCb = function takeCb(input) {
    if (input instanceof Error) {
      cb(input, true);
      return;
    }

    if (isEnd(input) && !maybe) {
      cb(TERMINATE);
      return;
    }

    cb(input);
  };

  try {
    channel.take(takeCb, notUndef(pattern) ? matcher(pattern) : null);
  } catch (err) {
    cb(err, true);
    return;
  }

  cb.cancel = takeCb.cancel;
}

function runCallEffect(env, _ref4, cb, _ref5) {
  var context = _ref4.context,
      fn = _ref4.fn,
      args = _ref4.args;
  var task = _ref5.task;

  // catch synchronous failures; see #152
  try {
    var result = fn.apply(context, args);

    if (promise(result)) {
      resolvePromise(result, cb);
      return;
    }

    if (iterator(result)) {
      // resolve iterator
      proc(env, result, task.context, current, getMetaInfo(fn),
      /* isRoot */
      false, cb);
      return;
    }

    cb(result);
  } catch (error) {
    cb(error, true);
  }
}

function runCPSEffect(env, _ref6, cb) {
  var context = _ref6.context,
      fn = _ref6.fn,
      args = _ref6.args;

  // CPS (ie node style functions) can define their own cancellation logic
  // by setting cancel field on the cb
  // catch synchronous failures; see #152
  try {
    var cpsCb = function cpsCb(err, res) {
      if (undef(err)) {
        cb(res);
      } else {
        cb(err, true);
      }
    };

    fn.apply(context, args.concat(cpsCb));

    if (cpsCb.cancel) {
      cb.cancel = cpsCb.cancel;
    }
  } catch (error) {
    cb(error, true);
  }
}

function runForkEffect(env, _ref7, cb, _ref8) {
  var context = _ref7.context,
      fn = _ref7.fn,
      args = _ref7.args,
      detached = _ref7.detached;
  var parent = _ref8.task;
  var taskIterator = createTaskIterator({
    context: context,
    fn: fn,
    args: args
  });
  var meta = getIteratorMetaInfo(taskIterator, fn);
  immediately(function () {
    var child = proc(env, taskIterator, parent.context, current, meta, detached, undefined);

    if (detached) {
      cb(child);
    } else {
      if (child.isRunning()) {
        parent.queue.addTask(child);
        cb(child);
      } else if (child.isAborted()) {
        parent.queue.abort(child.error());
      } else {
        cb(child);
      }
    }
  }); // Fork effects are non cancellables
}

function runJoinEffect(env, taskOrTasks, cb, _ref9) {
  var task = _ref9.task;

  var joinSingleTask = function joinSingleTask(taskToJoin, cb) {
    if (taskToJoin.isRunning()) {
      var joiner = {
        task: task,
        cb: cb
      };

      cb.cancel = function () {
        if (taskToJoin.isRunning()) remove(taskToJoin.joiners, joiner);
      };

      taskToJoin.joiners.push(joiner);
    } else {
      if (taskToJoin.isAborted()) {
        cb(taskToJoin.error(), true);
      } else {
        cb(taskToJoin.result());
      }
    }
  };

  if (array$2(taskOrTasks)) {
    if (taskOrTasks.length === 0) {
      cb([]);
      return;
    }

    var childCallbacks = createAllStyleChildCallbacks(taskOrTasks, cb);
    taskOrTasks.forEach(function (t, i) {
      joinSingleTask(t, childCallbacks[i]);
    });
  } else {
    joinSingleTask(taskOrTasks, cb);
  }
}

function cancelSingleTask(taskToCancel) {
  if (taskToCancel.isRunning()) {
    taskToCancel.cancel();
  }
}

function runCancelEffect(env, taskOrTasks, cb, _ref10) {
  var task = _ref10.task;

  if (taskOrTasks === SELF_CANCELLATION) {
    cancelSingleTask(task);
  } else if (array$2(taskOrTasks)) {
    taskOrTasks.forEach(cancelSingleTask);
  } else {
    cancelSingleTask(taskOrTasks);
  }

  cb(); // cancel effects are non cancellables
}

function runAllEffect(env, effects, cb, _ref11) {
  var digestEffect = _ref11.digestEffect;
  var effectId = current;
  var keys = Object.keys(effects);

  if (keys.length === 0) {
    cb(array$2(effects) ? [] : {});
    return;
  }

  var childCallbacks = createAllStyleChildCallbacks(effects, cb);
  keys.forEach(function (key) {
    digestEffect(effects[key], effectId, childCallbacks[key], key);
  });
}

function runRaceEffect(env, effects, cb, _ref12) {
  var digestEffect = _ref12.digestEffect;
  var effectId = current;
  var keys = Object.keys(effects);
  var response = array$2(effects) ? createEmptyArray(keys.length) : {};
  var childCbs = {};
  var completed = false;
  keys.forEach(function (key) {
    var chCbAtKey = function chCbAtKey(res, isErr) {
      if (completed) {
        return;
      }

      if (isErr || shouldComplete(res)) {
        // Race Auto cancellation
        cb.cancel();
        cb(res, isErr);
      } else {
        cb.cancel();
        completed = true;
        response[key] = res;
        cb(response);
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

    digestEffect(effects[key], effectId, childCbs[key], key);
  });
}

function runSelectEffect(env, _ref13, cb) {
  var selector = _ref13.selector,
      args = _ref13.args;

  try {
    var state = selector.apply(void 0, [env.getState()].concat(args));
    cb(state);
  } catch (error) {
    cb(error, true);
  }
}

function runChannelEffect(env, _ref14, cb) {
  var pattern = _ref14.pattern,
      buffer = _ref14.buffer;
  var chan = channel$1(buffer);
  var match = matcher(pattern);

  var taker = function taker(action) {
    if (!isEnd(action)) {
      env.channel.take(taker, match);
    }

    chan.put(action);
  };

  var close = chan.close;

  chan.close = function () {
    taker.cancel();
    close();
  };

  env.channel.take(taker, match);
  cb(chan);
}

function runCancelledEffect(env, data, cb, _ref15) {
  var task = _ref15.task;
  cb(task.isCancelled());
}

function runFlushEffect(env, channel, cb) {
  channel.flush(cb);
}

function runGetContextEffect(env, prop, cb, _ref16) {
  var task = _ref16.task;
  cb(task.context[prop]);
}

function runSetContextEffect(env, props, cb, _ref17) {
  var task = _ref17.task;
  assignWithSymbols(task.context, props);
  cb();
}

var effectRunnerMap = (_effectRunnerMap = {}, _effectRunnerMap[TAKE] = runTakeEffect, _effectRunnerMap[PUT] = runPutEffect, _effectRunnerMap[ALL] = runAllEffect, _effectRunnerMap[RACE] = runRaceEffect, _effectRunnerMap[CALL] = runCallEffect, _effectRunnerMap[CPS] = runCPSEffect, _effectRunnerMap[FORK] = runForkEffect, _effectRunnerMap[JOIN] = runJoinEffect, _effectRunnerMap[CANCEL$1] = runCancelEffect, _effectRunnerMap[SELECT] = runSelectEffect, _effectRunnerMap[ACTION_CHANNEL] = runChannelEffect, _effectRunnerMap[CANCELLED] = runCancelledEffect, _effectRunnerMap[FLUSH] = runFlushEffect, _effectRunnerMap[GET_CONTEXT] = runGetContextEffect, _effectRunnerMap[SET_CONTEXT] = runSetContextEffect, _effectRunnerMap);

/**
 Used to track a parent task and its forks
 In the fork model, forked tasks are attached by default to their parent
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

function forkQueue(mainTask, onAbort, cont) {
  var tasks = [];
  var result;
  var completed = false;
  addTask(mainTask);

  var getTasks = function getTasks() {
    return tasks;
  };

  function abort(err) {
    onAbort();
    cancelAll();
    cont(err, true);
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
          cont(result);
        }
      }
    };
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
    getTasks: getTasks
  };
}

// there can be only a single saga error created at any given moment

function formatLocation(fileName, lineNumber) {
  return fileName + "?" + lineNumber;
}

function effectLocationAsString(effect) {
  var location = getLocation(effect);

  if (location) {
    var code = location.code,
        fileName = location.fileName,
        lineNumber = location.lineNumber;
    var source = code + "  " + formatLocation(fileName, lineNumber);
    return source;
  }

  return '';
}

function sagaLocationAsString(sagaMeta) {
  var name = sagaMeta.name,
      location = sagaMeta.location;

  if (location) {
    return name + "  " + formatLocation(location.fileName, location.lineNumber);
  }

  return name;
}

function cancelledTasksAsString(sagaStack) {
  var cancelledTasks = flatMap(function (i) {
    return i.cancelledTasks;
  }, sagaStack);

  if (!cancelledTasks.length) {
    return '';
  }

  return ['Tasks cancelled due to error:'].concat(cancelledTasks).join('\n');
}

var crashedEffect = null;
var sagaStack = [];
var addSagaFrame = function addSagaFrame(frame) {
  frame.crashedEffect = crashedEffect;
  sagaStack.push(frame);
};
var clear = function clear() {
  crashedEffect = null;
  sagaStack.length = 0;
}; // this sets crashed effect for the soon-to-be-reported saga frame
// this slightly streatches the singleton nature of this module into wrong direction
// as it's even less obvious what's the data flow here, but it is what it is for now

var setCrashedEffect = function setCrashedEffect(effect) {
  crashedEffect = effect;
};
/**
  @returns {string}

  @example
  The above error occurred in task errorInPutSaga {pathToFile}
  when executing effect put({type: 'REDUCER_ACTION_ERROR_IN_PUT'}) {pathToFile}
      created by fetchSaga {pathToFile}
      created by rootSaga {pathToFile}
*/

var toString$3 = function toString() {
  var firstSaga = sagaStack[0],
      otherSagas = sagaStack.slice(1);
  var crashedEffectLocation = firstSaga.crashedEffect ? effectLocationAsString(firstSaga.crashedEffect) : null;
  var errorMessage = "The above error occurred in task " + sagaLocationAsString(firstSaga.meta) + (crashedEffectLocation ? " \n when executing effect " + crashedEffectLocation : '');
  return [errorMessage].concat(otherSagas.map(function (s) {
    return "    created by " + sagaLocationAsString(s.meta);
  }), [cancelledTasksAsString(sagaStack)]).join('\n');
};

function newTask(env, mainTask, parentContext, parentEffectId, meta, isRoot, cont) {
  var _task;

  if (cont === void 0) {
    cont = noop;
  }

  var status = RUNNING;
  var taskResult;
  var taskError;
  var deferredEnd = null;
  var cancelledDueToErrorTasks = [];
  var context = Object.create(parentContext);
  var queue = forkQueue(mainTask, function onAbort() {
    cancelledDueToErrorTasks.push.apply(cancelledDueToErrorTasks, queue.getTasks().map(function (t) {
      return t.meta.name;
    }));
  }, end);
  /**
   This may be called by a parent generator to trigger/propagate cancellation
   cancel all pending tasks (including the main task), then end the current task.
    Cancellation propagates down to the whole execution tree held by this Parent task
   It's also propagated to all joiners of this task and their execution tree/joiners
    Cancellation is noop for terminated/Cancelled tasks tasks
   **/

  function cancel() {
    if (status === RUNNING) {
      // Setting status to CANCELLED does not necessarily mean that the task/iterators are stopped
      // effects in the iterator's finally block will still be executed
      status = CANCELLED$1;
      queue.cancelAll(); // Ending with a TASK_CANCEL will propagate the Cancellation to all joiners

      end(TASK_CANCEL, false);
    }
  }

  function end(result, isErr) {
    if (!isErr) {
      // The status here may be RUNNING or CANCELLED
      // If the status is CANCELLED, then we do not need to change it here
      if (result === TASK_CANCEL) {
        status = CANCELLED$1;
      } else if (status !== CANCELLED$1) {
        status = DONE;
      }

      taskResult = result;
      deferredEnd && deferredEnd.resolve(result);
    } else {
      status = ABORTED;
      addSagaFrame({
        meta: meta,
        cancelledTasks: cancelledDueToErrorTasks
      });

      if (task.isRoot) {
        var sagaStack = toString$3(); // we've dumped the saga stack to string and are passing it to user's code
        // we know that it won't be needed anymore and we need to clear it

        clear();
        env.onError(result, {
          sagaStack: sagaStack
        });
      }

      taskError = result;
      deferredEnd && deferredEnd.reject(result);
    }

    task.cont(result, isErr);
    task.joiners.forEach(function (joiner) {
      joiner.cb(result, isErr);
    });
    task.joiners = null;
  }

  function setContext(props) {
    if (process.env.NODE_ENV !== 'production') {
      check(props, object$1, createSetContextWarning('task', props));
    }

    assignWithSymbols(context, props);
  }

  function toPromise() {
    if (deferredEnd) {
      return deferredEnd.promise;
    }

    deferredEnd = deferred();

    if (status === ABORTED) {
      deferredEnd.reject(taskError);
    } else if (status !== RUNNING) {
      deferredEnd.resolve(taskResult);
    }

    return deferredEnd.promise;
  }

  var task = (_task = {}, _task[TASK] = true, _task.id = parentEffectId, _task.meta = meta, _task.isRoot = isRoot, _task.context = context, _task.joiners = [], _task.queue = queue, _task.cancel = cancel, _task.cont = cont, _task.end = end, _task.setContext = setContext, _task.toPromise = toPromise, _task.isRunning = function isRunning() {
    return status === RUNNING;
  }, _task.isCancelled = function isCancelled() {
    return status === CANCELLED$1 || status === RUNNING && mainTask.status === CANCELLED$1;
  }, _task.isAborted = function isAborted() {
    return status === ABORTED;
  }, _task.result = function result() {
    return taskResult;
  }, _task.error = function error() {
    return taskError;
  }, _task);
  return task;
}

function proc(env, iterator$1, parentContext, parentEffectId, meta, isRoot, cont) {
  if (process.env.NODE_ENV !== 'production' && iterator$1[asyncIteratorSymbol]) {
    throw new Error("redux-saga doesn't support async generators, please use only regular ones");
  }

  var finalRunEffect = env.finalizeRunEffect(runEffect);
  /**
    Tracks the current effect cancellation
    Each time the generator progresses. calling runEffect will set a new value
    on it. It allows propagating cancellation to child effects
  **/

  next.cancel = noop;
  /** Creates a main task to track the main flow */

  var mainTask = {
    meta: meta,
    cancel: cancelMain,
    status: RUNNING
  };
  /**
   Creates a new task descriptor for this generator.
   A task is the aggregation of it's mainTask and all it's forked tasks.
   **/

  var task = newTask(env, mainTask, parentContext, parentEffectId, meta, isRoot, cont);
  var executingContext = {
    task: task,
    digestEffect: digestEffect
  };
  /**
    cancellation of the main task. We'll simply resume the Generator with a TASK_CANCEL
  **/

  function cancelMain() {
    if (mainTask.status === RUNNING) {
      mainTask.status = CANCELLED$1;
      next(TASK_CANCEL);
    }
  }
  /**
    attaches cancellation logic to this task's continuation
    this will permit cancellation to propagate down the call chain
  **/


  if (cont) {
    cont.cancel = task.cancel;
  } // kicks up the generator


  next(); // then return the task descriptor to the caller

  return task;
  /**
   * This is the generator driver
   * It's a recursive async/continuation function which calls itself
   * until the generator terminates or throws
   * @param {internal commands(TASK_CANCEL | TERMINATE) | any} arg - value, generator will be resumed with.
   * @param {boolean} isErr - the flag shows if effect finished with an error
   *
   * receives either (command | effect result, false) or (any thrown thing, true)
   */

  function next(arg, isErr) {
    try {
      var result;

      if (isErr) {
        result = iterator$1.throw(arg); // user handled the error, we can clear bookkept values

        clear();
      } else if (shouldCancel(arg)) {
        /**
          getting TASK_CANCEL automatically cancels the main task
          We can get this value here
           - By cancelling the parent task manually
          - By joining a Cancelled task
        **/
        mainTask.status = CANCELLED$1;
        /**
          Cancels the current effect; this will propagate the cancellation down to any called tasks
        **/

        next.cancel();
        /**
          If this Generator has a `return` method then invokes it
          This will jump to the finally block
        **/

        result = func(iterator$1.return) ? iterator$1.return(TASK_CANCEL) : {
          done: true,
          value: TASK_CANCEL
        };
      } else if (shouldTerminate(arg)) {
        // We get TERMINATE flag, i.e. by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
        result = func(iterator$1.return) ? iterator$1.return() : {
          done: true
        };
      } else {
        result = iterator$1.next(arg);
      }

      if (!result.done) {
        digestEffect(result.value, parentEffectId, next);
      } else {
        /**
          This Generator has ended, terminate the main task and notify the fork queue
        **/
        if (mainTask.status !== CANCELLED$1) {
          mainTask.status = DONE;
        }

        mainTask.cont(result.value);
      }
    } catch (error) {
      if (mainTask.status === CANCELLED$1) {
        throw error;
      }

      mainTask.status = ABORTED;
      mainTask.cont(error, true);
    }
  }

  function runEffect(effect, effectId, currCb) {
    /**
      each effect runner must attach its own logic of cancellation to the provided callback
      it allows this generator to propagate cancellation downward.
       ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
      And the setup must occur before calling the callback
       This is a sort of inversion of control: called async functions are responsible
      of completing the flow by calling the provided continuation; while caller functions
      are responsible for aborting the current flow by calling the attached cancel function
       Library users can attach their own cancellation logic to promises by defining a
      promise[CANCEL] method in their returned promises
      ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
    **/
    if (promise(effect)) {
      resolvePromise(effect, currCb);
    } else if (iterator(effect)) {
      // resolve iterator
      proc(env, effect, task.context, effectId, meta,
      /* isRoot */
      false, currCb);
    } else if (effect && effect[IO]) {
      var effectRunner = effectRunnerMap[effect.type];
      effectRunner(env, effect.payload, currCb, executingContext);
    } else {
      // anything else returned as is
      currCb(effect);
    }
  }

  function digestEffect(effect, parentEffectId, cb, label) {
    if (label === void 0) {
      label = '';
    }

    var effectId = nextSagaId();
    env.sagaMonitor && env.sagaMonitor.effectTriggered({
      effectId: effectId,
      parentEffectId: parentEffectId,
      label: label,
      effect: effect
    });
    /**
      completion callback and cancel callback are mutually exclusive
      We can't cancel an already completed effect
      And We can't complete an already cancelled effectId
    **/

    var effectSettled; // Completion callback passed to the appropriate effect runner

    function currCb(res, isErr) {
      if (effectSettled) {
        return;
      }

      effectSettled = true;
      cb.cancel = noop; // defensive measure

      if (env.sagaMonitor) {
        if (isErr) {
          env.sagaMonitor.effectRejected(effectId, res);
        } else {
          env.sagaMonitor.effectResolved(effectId, res);
        }
      }

      if (isErr) {
        setCrashedEffect(effect);
      }

      cb(res, isErr);
    } // tracks down the current cancel


    currCb.cancel = noop; // setup cancellation logic on the parent cb

    cb.cancel = function () {
      // prevents cancelling an already completed effect
      if (effectSettled) {
        return;
      }

      effectSettled = true;
      currCb.cancel(); // propagates cancel downward

      currCb.cancel = noop; // defensive measure

      env.sagaMonitor && env.sagaMonitor.effectCancelled(effectId);
    };

    finalRunEffect(effect, effectId, currCb);
  }
}

var RUN_SAGA_SIGNATURE = 'runSaga(options, saga, ...args)';
var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ": saga argument must be a Generator function!";
function runSaga(_ref, saga) {
  var _ref$channel = _ref.channel,
      channel = _ref$channel === void 0 ? stdChannel() : _ref$channel,
      dispatch = _ref.dispatch,
      getState = _ref.getState,
      _ref$context = _ref.context,
      context = _ref$context === void 0 ? {} : _ref$context,
      sagaMonitor = _ref.sagaMonitor,
      effectMiddlewares = _ref.effectMiddlewares,
      _ref$onError = _ref.onError,
      onError = _ref$onError === void 0 ? logError : _ref$onError;

  if (process.env.NODE_ENV !== 'production') {
    check(saga, func, NON_GENERATOR_ERR);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var iterator$1 = saga.apply(void 0, args);

  if (process.env.NODE_ENV !== 'production') {
    check(iterator$1, iterator, NON_GENERATOR_ERR);
  }

  var effectId = nextSagaId();

  if (sagaMonitor) {
    // monitors are expected to have a certain interface, let's fill-in any missing ones
    sagaMonitor.rootSagaStarted = sagaMonitor.rootSagaStarted || noop;
    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop;
    sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop;
    sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop;
    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop;
    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop;
    sagaMonitor.rootSagaStarted({
      effectId: effectId,
      saga: saga,
      args: args
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    if (notUndef(dispatch)) {
      check(dispatch, func, 'dispatch must be a function');
    }

    if (notUndef(getState)) {
      check(getState, func, 'getState must be a function');
    }

    if (notUndef(effectMiddlewares)) {
      var MIDDLEWARE_TYPE_ERROR = 'effectMiddlewares must be an array of functions';
      check(effectMiddlewares, array$2, MIDDLEWARE_TYPE_ERROR);
      effectMiddlewares.forEach(function (effectMiddleware) {
        return check(effectMiddleware, func, MIDDLEWARE_TYPE_ERROR);
      });
    }

    check(onError, func, 'onError passed to the redux-saga is not a function!');
  }

  var finalizeRunEffect;

  if (effectMiddlewares) {
    var middleware = compose.apply(void 0, effectMiddlewares);

    finalizeRunEffect = function finalizeRunEffect(runEffect) {
      return function (effect, effectId, currCb) {
        var plainRunEffect = function plainRunEffect(eff) {
          return runEffect(eff, effectId, currCb);
        };

        return middleware(plainRunEffect)(effect);
      };
    };
  } else {
    finalizeRunEffect = identity$1;
  }

  var env = {
    channel: channel,
    dispatch: wrapSagaDispatch(dispatch),
    getState: getState,
    sagaMonitor: sagaMonitor,
    onError: onError,
    finalizeRunEffect: finalizeRunEffect
  };
  return immediately(function () {
    var task = proc(env, iterator$1, context, effectId, getMetaInfo(saga),
    /* isRoot */
    true, undefined);

    if (sagaMonitor) {
      sagaMonitor.effectResolved(effectId, task);
    }

    return task;
  });
}

function sagaMiddlewareFactory(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$context = _ref.context,
      context = _ref$context === void 0 ? {} : _ref$context,
      _ref$channel = _ref.channel,
      channel$1 = _ref$channel === void 0 ? stdChannel() : _ref$channel,
      sagaMonitor = _ref.sagaMonitor,
      options = _objectWithoutPropertiesLoose$1(_ref, ["context", "channel", "sagaMonitor"]);

  var boundRunSaga;

  if (process.env.NODE_ENV !== 'production') {
    check(channel$1, channel, 'options.channel passed to the Saga middleware is not a channel');
  }

  function sagaMiddleware(_ref2) {
    var getState = _ref2.getState,
        dispatch = _ref2.dispatch;
    boundRunSaga = runSaga.bind(null, _extends$4({}, options, {
      context: context,
      channel: channel$1,
      dispatch: dispatch,
      getState: getState,
      sagaMonitor: sagaMonitor
    }));
    return function (next) {
      return function (action) {
        if (sagaMonitor && sagaMonitor.actionDispatched) {
          sagaMonitor.actionDispatched(action);
        }

        var result = next(action); // hit reducers

        channel$1.put(action);
        return result;
      };
    };
  }

  sagaMiddleware.run = function () {
    if (process.env.NODE_ENV !== 'production' && !boundRunSaga) {
      throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
    }

    return boundRunSaga.apply(void 0, arguments);
  };

  sagaMiddleware.setContext = function (props) {
    if (process.env.NODE_ENV !== 'production') {
      check(props, object$1, createSetContextWarning('sagaMiddleware', props));
    }

    assignWithSymbols(context, props);
  };

  return sagaMiddleware;
}

var done = function done(value) {
  return {
    done: true,
    value: value
  };
};

var qEnd = {};
function safeName(patternOrChannel) {
  if (channel(patternOrChannel)) {
    return 'channel';
  }

  if (stringableFunc(patternOrChannel)) {
    return String(patternOrChannel);
  }

  if (func(patternOrChannel)) {
    return patternOrChannel.name;
  }

  return String(patternOrChannel);
}
function fsmIterator(fsm, startState, name) {
  var stateUpdater,
      errorState,
      effect,
      nextState = startState;

  function next(arg, error) {
    if (nextState === qEnd) {
      return done(arg);
    }

    if (error && !errorState) {
      nextState = qEnd;
      throw error;
    } else {
      stateUpdater && stateUpdater(arg);
      var currentState = error ? fsm[errorState](error) : fsm[nextState]();
      nextState = currentState.nextState;
      effect = currentState.effect;
      stateUpdater = currentState.stateUpdater;
      errorState = currentState.errorState;
      return nextState === qEnd ? done(arg) : effect;
    }
  }

  return makeIterator(next, function (error) {
    return next(null, error);
  }, name);
}

function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = {
    done: false,
    value: take(patternOrChannel)
  };

  var yFork = function yFork(ac) {
    return {
      done: false,
      value: fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var action,
      setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return {
        nextState: 'q1',
        effect: yFork(action)
      };
    }
  }, 'q1', "takeEvery(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}

var validateTakeEffect = function validateTakeEffect(fn, patternOrChannel, worker) {
  check(patternOrChannel, notUndef, fn.name + " requires a pattern or channel");
  check(worker, notUndef, fn.name + " requires a saga parameter");
};

function takeEvery$1(patternOrChannel, worker) {
  if (process.env.NODE_ENV !== 'production') {
    validateTakeEffect(takeEvery$1, patternOrChannel, worker);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return fork.apply(void 0, [takeEvery, patternOrChannel, worker].concat(args));
}

var SYNC_SETTINGS = '[MAIN] Sync settings';
var initialState$4 = {
    settings: initialState$1.settings
};
var reducer$2 = function (state, action) {
    if (state === void 0) { state = initialState$4; }
    switch (action.type) {
        case SYNC_SETTINGS: {
            return {
                settings: action.payload,
            };
        }
        default:
            return state;
    }
};
var getSettingsMainState = lib_4(function (state) { return state; }, function (state) { return state.settings; });
var getSettings$1 = lib_4(getSettingsMainState, function (state) { return state.settings; });

var TRANSFER_TRANSACTIONS = '[MAIN] Transfer transactions';
var initialState$5 = {};
var reducer$3 = function (state, action) {
    var _a, _b;
    if (state === void 0) { state = initialState$5; }
    switch (action.type) {
        case TRANSFER_TRANSACTIONS: {
            var payload = action.payload;
            return __assign(__assign({}, state), (_a = {}, _a[payload.origin.tabId] = __assign(__assign({}, (state[payload.origin.tabId] || {})), (_b = {}, _b[payload.id] = payload, _b)), _a));
        }
        default:
            return state;
    }
};
var getTransactionsMainState = lib_4(function (state) { return state; }, function (state) { return state.transactions; });
var getTransactionsMain = lib_4(getTransactionsMainState, function (state) { return state; });

var TRANSFER_IDENTIFICATIONS = '[MAIN] Transfer identification';
var initialState$6 = {};
var reducer$4 = function (state, action) {
    var _a, _b;
    if (state === void 0) { state = initialState$6; }
    switch (action.type) {
        case TRANSFER_IDENTIFICATIONS: {
            var payload = action.payload;
            return __assign(__assign({}, state), (_a = {}, _a[payload.tabId] = __assign(__assign({}, state[payload.tabId]), (_b = {}, _b[payload.callId] = payload.identification, _b)), _a));
        }
        default:
            return state;
    }
};
var getIdentificationsMainState = lib_4(function (state) { return state; }, function (state) { return state.identifications; });
var getIdentificationsMain = lib_4(getIdentificationsMainState, function (state) { return state; });

var TRANSFER_TABS = '[MAIN] Transfer tabs';
var initialState$7 = {
    tabs: initialState.tabs,
};
var reducer$5 = function (state, action) {
    if (state === void 0) { state = initialState$7; }
    switch (action.type) {
        case TRANSFER_TABS: {
            var payload = action.payload;
            return __assign(__assign({}, state), { tabs: payload });
        }
        default:
            return state;
    }
};
var getTabsMainState = lib_4(function (state) { return state; }, function (state) { return state.tabs; });
var getTabs$1 = lib_4(getTabsMainState, function (state) { return state.tabs; });

var SEND_RCHAIN_TRANSACTION_FROM_SANDBOX = '[Common] Send RChain transaction from sandbox';
var SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX = '[Common] Send RChain payment request from sandbox';
var IDENTIFY_FROM_SANDBOX = '[Common] Identify from sandbox';
var SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX = '[Common] Sign Ethereum transaction from sandbox';

var OPEN_DAPP_MODAL = '[Main] Open dapp modal';
var openDappModalAction = function (values) { return ({
    type: OPEN_DAPP_MODAL,
    payload: values,
}); };

var getUiState = function (state) { return state.ui; };
var getLanguage = lib_4(getUiState, function (state) { return state.language; });
var getMenuCollapsed = lib_4(getUiState, function (state) { return state.menuCollapsed; });
var getTabsListDisplay = lib_4(getUiState, function (state) { return state.tabsListDisplay; });
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
var getIsNavigationInNames = lib_4(getNavigationUrl, function (navigationUrl) {
    return navigationUrl.startsWith('/names');
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
var getContractLogs = lib_4(getUiState, function (ui) { return ui.contractLogs; });
var showAccountCreationAtStartup = lib_4(getUiState, function (ui) { return ui.showAccountCreationAtStartup; });
var getIsBalancesHidden = lib_4(getUiState, function (ui) { return ui.isBalancesHidden; });

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
        if (tab && (!dappModals[tab.id] || dappModals[tab.id].length === 0)) {
            return tab.id;
        }
        return undefined;
    }
    else {
        return undefined;
    }
});

var looksLikePublicKey = function (astring) {
    if (typeof astring === "string" && astring.length === 130) {
        return true;
    }
    return false;
};

// todo, cannot do import, why ?
var rchainToolkit = require('@fabcotech/rchain-toolkit');
var hexString = create().matches(/^0x[0-9a-fA-F]+$/, 'string must be in hexadecimal and starts with 0x');
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
    tabId: create(),
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
})
    .strict(true)
    .noUnknown()
    .required();
var signEthereumTransactionFromSandboxSchema = create$2()
    .shape({
    parameters: create$2()
        .shape({
        nonce: hexString.required(),
        gasPrice: hexString.required(),
        gasLimit: hexString.required(),
        value: hexString.optional(),
        data: hexString.optional(),
        from: hexString.optional(),
        to: hexString.required(),
        chainId: create$1().required(),
    })
        .noUnknown()
        .required()
        .strict(true),
    callId: create().required(),
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
})
    .strict(true)
    .noUnknown()
    .required();
/* browser process - main process */
var registerInterProcessDappProtocol = function (dappyBrowserView, session, store, dispatchFromMain) {
    return session.protocol.registerBufferProtocol('interprocessdapp', function (request, callback) {
        var data = {};
        try {
            data = JSON.parse(request.headers['Data']);
        }
        catch (e) { }
        if (request.url === 'interprocessdapp://get-identifications') {
            var identifications = getIdentificationsMain(store.getState());
            callback(Buffer.from(JSON.stringify({ identifications: identifications[dappyBrowserView.tabId] })));
        }
        if (request.url === 'interprocessdapp://get-transactions') {
            var transactions = getTransactionsMain(store.getState());
            callback(Buffer.from(JSON.stringify({ transactions: transactions[dappyBrowserView.tabId] })));
        }
        if (request.url === 'interprocessdapp://message-from-dapp-sandboxed') {
            try {
                var state = store.getState();
                var payloadBeforeValid_1 = data.action.payload;
                if (!payloadBeforeValid_1) {
                    console.error('[interprocessdapp://] dapp dispatched a transaction with an invalid payload');
                    callback(Buffer.from('invalid payload'));
                    return;
                }
                if (data.action.type === IDENTIFY_FROM_SANDBOX) {
                    identifyFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function () {
                        dispatchFromMain({
                            action: openDappModalAction({
                                tabId: dappyBrowserView.tabId,
                                title: 'IDENTIFICATION_MODAL',
                                text: '',
                                parameters: __assign(__assign({}, payloadBeforeValid_1), { tabId: dappyBrowserView.tabId }),
                                buttons: [],
                            }),
                        });
                        callback(Buffer.from(''));
                    })
                        .catch(function (err) {
                        console.error('A dapp tried to trigger an identification with an invalid schema');
                        console.error(err);
                        callback(Buffer.from(err.message));
                    });
                    return;
                }
                // ETHEREUM / EVM
                if (data.action.type === SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX) {
                    signEthereumTransactionFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function (valid) {
                        var payload = payloadBeforeValid_1;
                        var id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        var payload2 = {
                            parameters: payload.parameters,
                            origin: {
                                origin: 'dapp',
                                accountName: undefined,
                                tabId: dappyBrowserView.tabId,
                                dappTitle: dappyBrowserView.title,
                                callId: payload.callId,
                            },
                            tabId: dappyBrowserView.tabId,
                            chainId: '',
                            id: id,
                        };
                        dispatchFromMain({
                            action: openDappModalAction({
                                tabId: dappyBrowserView.tabId,
                                title: 'ETHEREUM_SIGN_TRANSACTION_MODAL',
                                text: '',
                                parameters: payload2,
                                buttons: [],
                            }),
                        });
                        callback(Buffer.from(''));
                    })
                        .catch(function (err) {
                        console.error('[interprocessdapp://] a dapp tried to request Sign Ethereum transaction with an invalid schema');
                        console.error(err.message);
                        callback(Buffer.from(err.message));
                        return;
                    });
                    return;
                }
                // RCHAIN
                var okBlockchains = getOkBlockchainsMain(state);
                var chainId_1 = Object.keys(okBlockchains)[0];
                try {
                    if (!chainId_1) {
                        dispatchFromMain({
                            action: saveFailedRChainTransactionAction({
                                blockchainId: chainId_1,
                                platform: 'rchain',
                                origin: {
                                    origin: 'dapp',
                                    accountName: undefined,
                                    tabId: dappyBrowserView.tabId,
                                    dappTitle: dappyBrowserView.title,
                                    callId: payloadBeforeValid_1.callId,
                                },
                                value: { message: "blockchain ".concat(chainId_1, " not available") },
                                sentAt: new Date().toISOString(),
                                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
                            }),
                        });
                        console.error("[interprocessdapp://] blockchain ".concat(chainId_1, " not available"));
                        callback(Buffer.from('blockchain not found'));
                        return;
                    }
                }
                catch (err) {
                    console.error('[interprocessdapp://] unknown error');
                    console.error(err);
                    callback(Buffer.from(err.message));
                    return;
                }
                if (data.action.type === SEND_RCHAIN_TRANSACTION_FROM_SANDBOX) {
                    sendRChainTransactionFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function (valid) {
                        if (payloadBeforeValid_1.parameters.signatures) {
                            Object.keys(payloadBeforeValid_1.parameters.signatures).forEach(function (k) {
                                if (typeof k !== 'string' || typeof payloadBeforeValid_1.parameters.signatures[k] !== 'string') {
                                    throw new Error('[interprocessdapp://] payloadBeforeValid.parameters.signatures is not valid');
                                }
                            });
                        }
                        var payload = payloadBeforeValid_1;
                        var id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        var payload2 = {
                            parameters: payload.parameters,
                            origin: {
                                origin: 'dapp',
                                accountName: undefined,
                                tabId: dappyBrowserView.tabId,
                                dappTitle: dappyBrowserView.title,
                                callId: payload.callId,
                            },
                            tabId: dappyBrowserView.tabId,
                            chainId: chainId_1,
                            id: id,
                        };
                        dispatchFromMain({
                            action: openDappModalAction({
                                tabId: dappyBrowserView.tabId,
                                title: 'RCHAIN_TRANSACTION_MODAL',
                                text: '',
                                parameters: payload2,
                                buttons: [],
                            }),
                        });
                        callback(Buffer.from(''));
                    })
                        .catch(function (err) {
                        console.error('[interprocessdapp://] a dapp tried to send RChain transaction with an invalid schema');
                        console.error(err);
                        callback(Buffer.from(err.message));
                        return;
                    });
                }
                else if (data.action.type === SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX) {
                    sendRChainPaymentRequestFromSandboxSchema
                        .validate(payloadBeforeValid_1)
                        .then(function () {
                        var payload = payloadBeforeValid_1;
                        if (looksLikePublicKey(payload.parameters.to)) {
                            try {
                                payload.parameters.to = rchainToolkit.utils.revAddressFromPublicKey(payload.parameters.to);
                            }
                            catch (err) {
                                console.error('[interprocessdapp://] failed to generate REV address based on public key');
                                console.error(err);
                                callback(Buffer.from('failed to generate REV address based on public key'));
                                return;
                            }
                        }
                        var id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        var payload2 = {
                            parameters: payload.parameters,
                            origin: {
                                origin: 'dapp',
                                tabId: dappyBrowserView.tabId,
                                dappTitle: dappyBrowserView.title,
                                callId: payload.callId,
                            },
                            chainId: chainId_1,
                            tabId: dappyBrowserView.tabId,
                            id: id,
                        };
                        dispatchFromMain({
                            action: openDappModalAction({
                                tabId: dappyBrowserView.tabId,
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
                        console.error('[interprocessdapp://] A dapp tried to send RChain transaction with an invalid schema');
                        console.error(err);
                        callback(Buffer.from(err.message));
                        return;
                    });
                }
            }
            catch (err) {
                console.error('[interprocessdapp://] An error occured');
                console.error(err);
                callback(Buffer.from(err.message));
            }
        }
    });
};

/* browser process - main process */
var registerDappyNetworkProtocol = function (dappyBrowserView, session, store) {
    return session.protocol.registerBufferProtocol('dappynetwork', function (request, callback) {
        var blockchains = getOkBlockchainsMain(store.getState());
        var chainId = Object.keys(blockchains)[0];
        var settings = getSettings$1(store.getState());
        if (!chainId) {
            console.log('[dappynetwork://] unknown blockchain ');
            callback(null);
            return;
        }
        var indexes = blockchains[chainId].nodes
            .map(getNodeIndex);
        if (request.url === "dappynetwork:///explore-deploys") {
            console.log('dappynetwork:///explore-deploys');
            var data = {};
            try {
                data = JSON.parse(request.headers.Data);
            }
            catch (err) { }
            performMultiRequest({
                type: 'explore-deploy-x',
                body: data,
            }, {
                chainId: chainId,
                urls: indexes,
                resolverMode: settings.resolverMode,
                resolverAccuracy: settings.resolverAccuracy,
                resolverAbsolute: settings.resolverAbsolute,
                multiCallId: 'useless',
                comparer: function (res) {
                    return res;
                },
            }, blockchains).then(function (multiCallResult) {
                var json = JSON.parse(multiCallResult.result);
                if (!json.success) {
                    callback(json.error);
                    return;
                }
                callback({
                    mimeType: 'application/json',
                    data: Buffer.from(JSON.stringify(json.data)),
                });
            }).catch(function (err) {
                console.log('[dappynetwork://] multi-request /explore-deploys failed');
                callback(null);
                console.log(err);
            });
        }
        else if (request.url === 'dappynetwork:///api/explore-deploy') {
            console.log('dappynetwork:///api/explore-deploy');
            performMultiRequest({
                type: 'api/explore-deploy',
                body: { term: request.headers.Data },
            }, {
                chainId: chainId,
                urls: indexes,
                resolverMode: settings.resolverMode,
                resolverAccuracy: settings.resolverAccuracy,
                resolverAbsolute: settings.resolverAbsolute,
                multiCallId: 'useless',
                comparer: function (res) {
                    return res;
                },
            }, blockchains).then(function (multiCallResult) {
                var json = JSON.parse(multiCallResult.result);
                if (!json.success) {
                    callback(json.error);
                    return;
                }
                callback({
                    mimeType: 'application/json',
                    data: Buffer.from(JSON.stringify(json.data)),
                });
            }).catch(function (err) {
                console.log('[dappynetwork://] multi-request /api/explore-deploy failed');
                callback(null);
                console.log(err);
            });
        }
        else if (request.url === 'dappynetwork:///api/data-at-name') {
            console.log('dappynetwork:///api/data-at-name');
            var data = {};
            try {
                data = JSON.parse(request.headers.Data);
            }
            catch (err) { }
            performMultiRequest({
                type: 'api/data-at-name',
                body: data,
            }, {
                chainId: chainId,
                urls: indexes,
                resolverMode: settings.resolverMode,
                resolverAccuracy: settings.resolverAccuracy,
                resolverAbsolute: settings.resolverAbsolute,
                multiCallId: 'useless',
                comparer: function (res) {
                    return res;
                },
            }, blockchains).then(function (multiCallResult) {
                var json = JSON.parse(multiCallResult.result);
                if (!json.success) {
                    callback(json.error);
                    return;
                }
                callback({
                    mimeType: 'application/json',
                    data: Buffer.from(JSON.stringify(json.data)),
                });
            }).catch(function (err) {
                console.log('[dappynetwork://] multi-request /api/data-at-name failed');
                callback(null);
                console.log(err);
            });
        }
        else if (request.url === 'dappynetwork:///api/prepare-deploy') {
            console.log('dappynetwork:///api/prepare-deploy');
            var data = {};
            try {
                data = JSON.parse(request.headers.Data);
            }
            catch (err) { }
            performMultiRequest({
                type: 'api/prepare-deploy',
                body: data,
            }, {
                chainId: chainId,
                urls: indexes,
                resolverMode: settings.resolverMode,
                resolverAccuracy: settings.resolverAccuracy,
                resolverAbsolute: settings.resolverAbsolute,
                multiCallId: 'useless',
                comparer: function (res) {
                    return res;
                },
            }, blockchains).then(function (multiCallResult) {
                var json = JSON.parse(multiCallResult.result);
                if (!json.success) {
                    callback(json.error);
                    return;
                }
                callback({
                    mimeType: 'application/json',
                    data: Buffer.from(JSON.stringify(json.data)),
                });
            }).catch(function (err) {
                console.log('[dappynetwork://] multi-request /api/prepare-deploy failed');
                callback(null);
                console.log(err);
            });
        }
        else if (request.url.startsWith('dappynetwork:///api/blocks/')) {
            console.log('dappynetwork:///api/blocks/x');
            var data = {};
            try {
                data = JSON.parse(request.headers.Data);
            }
            catch (err) { }
            performMultiRequest({
                type: request.url.replace('dappynetwork://', ''),
                body: data,
            }, {
                chainId: chainId,
                urls: indexes,
                resolverMode: settings.resolverMode,
                resolverAccuracy: settings.resolverAccuracy,
                resolverAbsolute: settings.resolverAbsolute,
                multiCallId: 'useless',
                comparer: function (res) {
                    return res;
                },
            }, blockchains).then(function (multiCallResult) {
                var json = JSON.parse(multiCallResult.result);
                if (!json.success) {
                    callback(json.error);
                    return;
                }
                callback({
                    mimeType: 'application/json',
                    data: Buffer.from(JSON.stringify(json.data)),
                });
            }).catch(function (err) {
                console.log('[dappynetwork://] multi-request /api/blocks/ failed');
                callback(null);
                console.log(err);
            });
        }
        else {
            console.log('[dappynetwork://] unknown multi-request ' + request.url);
            callback(null);
        }
    });
};

var csss = fs.readdirSync(path.join(electron.app.getAppPath(), 'dist/css'));
var jss = fs.readdirSync(path.join(electron.app.getAppPath(), 'dist/js'));
var files$1 = jss.concat(csss);
var registerDappyLocalProtocol = function (session) {
    return session.protocol.registerBufferProtocol('dappyl', function (request, callback) {
        var filePath = request.url.replace('dappyl://', '');
        if (files$1.find(function (a) { return ["js/".concat(a), "css/".concat(a)].includes(filePath); })) {
            if (filePath.endsWith('.js')) {
                var buf = fs.readFileSync(path.join(electron.app.getAppPath(), 'dist/', filePath));
                callback(buf);
            }
            else if (filePath.endsWith('.css')) {
                var buf = fs.readFileSync(path.join(electron.app.getAppPath(), 'dist/', filePath));
                callback(buf);
            }
            else {
                callback(Buffer.from(''));
            }
        }
        else {
            callback(Buffer.from(''));
        }
    });
};

var preventAllPermissionRequests = function (session) {
    return session.setPermissionRequestHandler(function (webContents, permission, callback) {
        // Permission list available here: https://www.electronjs.org/fr/docs/latest/api/session#sessetpermissionrequesthandlerhandler
        callback(false);
    });
};

var DID_NAVIGATE_IN_PAGE = '[History] Did navigate in page';
var didNavigateInPageAction = function (values) { return ({
    type: DID_NAVIGATE_IN_PAGE,
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
var getCanGoBackward = lib_4(getSessions, getActiveTab, getFocusedTabId, function (sessions, activeTab, focusedTabId) {
    var session = sessions[focusedTabId];
    if (!session) {
        return false;
    }
    if (!activeTab && session.items[session.cursor]) {
        return true;
    }
    return !!session.items[session.cursor - 1];
});

var development = !!process.defaultApp;
var loadOrReloadBrowserView = function (action) {
    var payload, settings, blockchains, browserViews, position, dappyNetworkMembers, url, viewSession, a, b, c, d, bv, sameTabIdBrowserViewId, bv, a, b, c, d, e, view, newBrowserViews, partitionIdHash, isFirstRequest, setIsFirstRequest, getIsFirstRequest, err_1, title, handleNavigation;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                return [4 /*yield*/, select(getSettings$1)];
            case 1:
                settings = _a.sent();
                return [4 /*yield*/, select(getBlockchains$1)];
            case 2:
                blockchains = _a.sent();
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 3:
                browserViews = _a.sent();
                return [4 /*yield*/, select(getBrowserViewsPositionMain)];
            case 4:
                position = _a.sent();
                dappyNetworkMembers = undefined;
                if (payload.tab.data.isDappyNameSystem) {
                    if (blockchains[payload.tab.data.chainId]) {
                        dappyNetworkMembers = blockchains[payload.tab.data.chainId].nodes;
                    }
                    else {
                        action.meta.dispatchFromMain({
                            action: loadResourceFailedAction({
                                tabId: payload.tab.id,
                                url: payload.tab.url,
                                error: {
                                    error: DappyLoadError.DappyLookup,
                                    args: {
                                        message: "Network not found"
                                    }
                                }
                            })
                        });
                        return [2 /*return*/];
                    }
                }
                url = new URL(payload.tab.url);
                viewSession = electron.session.fromPartition("persist:main:".concat(url.host), { cache: true });
                /* reload
                  a browser view with same id (payload.reosurceId) is
                  already running
                */
                if (browserViews[payload.tab.id]) {
                    if (development) {
                        console.log('reload or self navigation, closing browserView and unregister protocols');
                    }
                    a = viewSession.protocol.unregisterProtocol('dappynetwork');
                    b = viewSession.protocol.unregisterProtocol('interprocessdapp');
                    c = viewSession.protocol.uninterceptProtocol('https');
                    d = true;
                    if (!development) {
                        d = viewSession.protocol.uninterceptProtocol('http');
                    }
                    if (development) {
                        console.log(a, b, c, d);
                    }
                    bv = browserViews[payload.tab.id];
                    if (bv && bv.browserView) {
                        if (bv.browserView.webContents.isDevToolsOpened()) {
                            bv.browserView.webContents.closeDevTools();
                        }
                        bv.browserView.webContents.forcefullyCrashRenderer();
                    }
                    action.meta.browserWindow.removeBrowserView(bv.browserView);
                }
                sameTabIdBrowserViewId = Object.keys(browserViews).find(function (id) {
                    return (browserViews[id].tabId === payload.tab.id);
                });
                if (sameTabIdBrowserViewId) {
                    if (development) {
                        console.log('navigation in tab, closing browserView with same tabId');
                    }
                    bv = browserViews[sameTabIdBrowserViewId];
                    a = viewSession.protocol.unregisterProtocol('dappynetwork');
                    b = viewSession.protocol.unregisterProtocol('interprocessdapp');
                    c = viewSession.protocol.uninterceptProtocol('https');
                    d = viewSession.protocol.uninterceptProtocol('dappyl');
                    e = true;
                    if (!development) {
                        e = viewSession.protocol.uninterceptProtocol('http');
                    }
                    if (development) {
                        console.log(a, b, c, d, e);
                    }
                    if (bv && bv.browserView) {
                        if (bv.browserView.webContents.isDevToolsOpened()) {
                            bv.browserView.webContents.closeDevTools();
                        }
                        bv.browserView.webContents.forcefullyCrashRenderer();
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
                        devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS) || !true,
                        disableDialogs: true,
                        partition: "persist:main:".concat(url.host),
                    },
                });
                if (payload.tab.muted) {
                    view.webContents.setAudioMuted(payload.tab.muted);
                }
                action.meta.browserWindow.addBrowserView(view);
                view.setBounds(position);
                newBrowserViews = {};
                newBrowserViews[payload.tab.id] = {
                    tabId: payload.tab.id,
                    title: payload.tab.title,
                    host: new URL(payload.tab.url).host,
                    browserView: view,
                    data: __assign(__assign({}, payload.tab.data), { blockchain: blockchains[payload.tab.data.chainId] }),
                    visible: true,
                };
                partitionIdHash = '';
                isFirstRequest = true;
                setIsFirstRequest = function (a) {
                    isFirstRequest = a;
                };
                getIsFirstRequest = function () {
                    return isFirstRequest;
                };
                preventAllPermissionRequests(viewSession);
                // todo, avoid circular ref to "store" (see logs when "npm run build:main")
                registerInterProcessDappProtocol(newBrowserViews[payload.tab.id], viewSession, store, action.meta.dispatchFromMain);
                overrideHttpProtocol({
                    session: viewSession,
                });
                if (payload.tab.data.isDappyNameSystem) {
                    overrideHttpsProtocol({
                        dappyNetworkMembers: dappyNetworkMembers,
                        dappyBrowserView: newBrowserViews[payload.tab.id],
                        dispatchFromMain: action.meta.dispatchFromMain,
                        session: viewSession,
                        partitionIdHash: partitionIdHash,
                        setIsFirstRequest: setIsFirstRequest,
                        getIsFirstRequest: getIsFirstRequest
                    });
                }
                registerDappyNetworkProtocol(newBrowserViews[payload.tab.id], viewSession, store);
                registerDappyLocalProtocol(viewSession);
                /*
                  Hide all other browser views
                */
                Object.keys(browserViews).forEach(function (id) {
                    var _a;
                    if (id !== payload.tab.id && browserViews[id].visible) {
                        browserViews[id].browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
                        newBrowserViews = __assign(__assign({}, newBrowserViews), (_a = {}, _a[id] = __assign(__assign({}, browserViews[id]), { visible: false }), _a));
                    }
                });
                /*
                  Save new browser views
                */
                return [4 /*yield*/, put({
                        type: LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED,
                        payload: newBrowserViews,
                    })];
            case 5:
                /*
                  Save new browser views
                */
                _a.sent();
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, view.webContents.loadURL(payload.tab.url)];
            case 7:
                _a.sent();
                if (settings.devMode) {
                    view.webContents.openDevTools();
                }
                return [3 /*break*/, 9];
            case 8:
                err_1 = _a.sent();
                action.meta.dispatchFromMain({
                    action: loadResourceFailedAction({
                        tabId: payload.tab.id,
                        url: payload.tab.url,
                        error: {
                            error: DappyLoadError.ServerError,
                            args: {
                                url: payload.tab.url,
                                message: err_1.message
                            }
                        }
                    })
                });
                return [2 /*return*/];
            case 9:
                title = '';
                view.webContents.on('did-finish-load', function (e) {
                    action.meta.browserWindow.webContents.executeJavaScript("console.log('did-finish-load ".concat(payload.tab.id, "')"));
                    action.meta.dispatchFromMain({
                        action: updateTransitoryStateAction({
                            tabId: payload.tab.id,
                            transitoryState: undefined,
                        }),
                    });
                });
                view.webContents.on('did-stop-loading', function (e) {
                    action.meta.browserWindow.webContents.executeJavaScript("console.log('did-stop-loading ".concat(payload.tab.id, "')"));
                    action.meta.dispatchFromMain({
                        action: updateTransitoryStateAction({
                            tabId: payload.tab.id,
                            transitoryState: undefined,
                        }),
                    });
                    var url = view.webContents.getURL();
                    title = view.webContents.getTitle();
                    action.meta.dispatchFromMain({
                        action: updateTabUrlAndTitleAction({
                            url: url,
                            tabId: payload.tab.id,
                            title: title,
                        }),
                    });
                    action.meta.dispatchFromMain({
                        action: didNavigateInPageAction({
                            url: url,
                            tabId: payload.tab.id,
                            title: title,
                        }),
                    });
                });
                /*
                  todo
                  This does not trigger, why ?
                  (Electron ^17.0.1)
                */
                view.webContents.on('did-navigate', function (a, currentUrl, httpResponseCode, httpStatusText) {
                    var currentTitle = view.webContents.getTitle();
                    /*
                      When the page just finished navigating, title
                      is the https url, avoid updating the title at this
                      moment
                    */
                    if (!currentTitle.startsWith('https://')) {
                        title = currentTitle;
                    }
                    action.meta.dispatchFromMain({
                        action: didNavigateInPageAction({
                            url: currentUrl,
                            tabId: payload.tab.id,
                            title: title,
                        }),
                    });
                    action.meta.dispatchFromMain({
                        action: updateTabUrlAndTitleAction({
                            url: currentUrl,
                            tabId: payload.tab.id,
                            title: title,
                        }),
                    });
                });
                view.webContents.on('new-window', function (e) {
                    e.preventDefault();
                });
                view.webContents.on('page-favicon-updated', function (a, favicons) { return __awaiter(_this, void 0, void 0, function () {
                    var urlFav_1, networkHosts, ca, options, options, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(favicons && favicons[0] && typeof favicons[0] === 'string')) return [3 /*break*/, 8];
                                if (!favicons[0].startsWith('data:image')) return [3 /*break*/, 1];
                                action.meta.dispatchFromMain({
                                    action: didChangeFaviconAction({
                                        tabId: payload.tab.id,
                                        img: favicons[0],
                                    }),
                                });
                                return [3 /*break*/, 8];
                            case 1:
                                if (!favicons[0].startsWith('https://')) return [3 /*break*/, 8];
                                urlFav_1 = new URL(favicons[0]);
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 7, , 8]);
                                if (!urlFav_1.hostname.endsWith('.dappy')) return [3 /*break*/, 5];
                                return [4 /*yield*/, lookup$1(urlFav_1.hostname, 'A', { dappyNetwork: dappyNetworkMembers })];
                            case 3:
                                networkHosts = (_a.sent()).answers.map(function (a) { return a.data; });
                                return [4 /*yield*/, lookup$1(urlFav_1.hostname, 'CERT', { dappyNetwork: dappyNetworkMembers })];
                            case 4:
                                ca = (_a.sent()).answers.map(function (a) { return a.data; });
                                options = __assign(__assign({ rejectUnauthorized: true, minVersion: 'TLSv1.2', 
                                    /* no dns */
                                    host: networkHosts[0] }, (ca ? { ca: ca[0] } : {})), { port: urlFav_1.port || "443", path: urlFav_1.pathname + urlFav_1.search, method: 'GET', headers: {
                                        host: urlFav_1.hostname
                                    } });
                                https.request(options, function (res) {
                                    if (res.statusCode !== 200) {
                                        console.error("Could not get favicon (status !== 200) for ".concat(urlFav_1.host));
                                        console.log(favicons[0]);
                                        return;
                                    }
                                    var s = Buffer.from('');
                                    res.on('data', function (a) {
                                        s = Buffer.concat([s, a]);
                                    });
                                    res.on('end', function () {
                                        // todo limit size of favicon ???
                                        var faviconAsBase64 = 'data:' + res.headers['content-type'] + ';base64,' + s.toString('base64');
                                        action.meta.dispatchFromMain({
                                            action: didChangeFaviconAction({
                                                tabId: payload.tab.id,
                                                img: faviconAsBase64,
                                            }),
                                        });
                                    });
                                }).on('error', function (err) {
                                    console.error('[dapp] Could not get favicon (1) ' + favicons[0]);
                                    console.error(err);
                                }).end();
                                return [3 /*break*/, 6];
                            case 5:
                                options = {
                                    rejectUnauthorized: true,
                                    minVersion: 'TLSv1.2',
                                    /* no dns */
                                    host: urlFav_1.hostname,
                                    port: urlFav_1.port || "443",
                                    path: urlFav_1.pathname + urlFav_1.search,
                                    method: 'GET',
                                    headers: {
                                        host: urlFav_1.hostname
                                    },
                                };
                                https.request(options, function (res) {
                                    if (res.statusCode !== 200) {
                                        console.error("Could not get favicon (status !== 200) for ".concat(urlFav_1.host));
                                        console.log(favicons[0]);
                                        return;
                                    }
                                    var s = Buffer.from('');
                                    res.on('data', function (a) {
                                        s = Buffer.concat([s, a]);
                                    });
                                    res.on('end', function () {
                                        // todo limit size of favicon ???
                                        var faviconAsBase64 = 'data:' + res.headers['content-type'] + ';base64,' + s.toString('base64');
                                        action.meta.dispatchFromMain({
                                            action: didChangeFaviconAction({
                                                tabId: payload.tab.id,
                                                img: faviconAsBase64,
                                            }),
                                        });
                                    });
                                }).on('error', function (err) {
                                    console.error('[dapp] Could not get favicon (1) ' + favicons[0]);
                                    console.error(err);
                                }).end();
                                _a.label = 6;
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                err_2 = _a.sent();
                                console.error('[dapp] Could not get favicon (2) ' + favicons[0]);
                                console.error(err_2);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                view.webContents.on('page-title-updated', function (a, title) {
                    if (title !== view.webContents.getTitle()) {
                        title = title;
                        action.meta.dispatchFromMain({
                            action: updateTabUrlAndTitleAction({
                                url: view.webContents.getURL(),
                                tabId: payload.tab.id,
                                title: title,
                            }),
                        });
                    }
                });
                handleNavigation = function (e, futureUrl, tabFavorite) {
                    var parsedFutureUrl = undefined;
                    try {
                        parsedFutureUrl = new URL(futureUrl);
                    }
                    catch (err) {
                        e.preventDefault();
                        return;
                    }
                    if (parsedFutureUrl.protocol === 'https:') {
                        if (parsedFutureUrl.host !== url.host) {
                            console.log('[nav] will navigate to another host', url.host, '->', parsedFutureUrl.host);
                            e.preventDefault();
                            action.meta.dispatchFromMain({
                                action: loadResourceAction({
                                    url: futureUrl,
                                    tabId: payload.tab.id,
                                }),
                            });
                        }
                        else {
                            var currentUrl = new URL(view.webContents.getURL());
                            if (tabFavorite &&
                                (parsedFutureUrl.hostname !== currentUrl.hostname ||
                                    parsedFutureUrl.pathname !== currentUrl.hostname)) {
                                e.preventDefault();
                                action.meta.dispatchFromMain({
                                    action: loadResourceAction({
                                        url: futureUrl,
                                        tabId: payload.tab.id,
                                    }),
                                });
                            }
                            else {
                                // to not e.preventDefault(); and honor navigation
                                setIsFirstRequest(true);
                                console.log('[nav] will navigate to same host');
                            }
                        }
                    }
                    else {
                        e.preventDefault();
                        // todo display error message instead of directly openning
                        action.meta.dispatchFromMain({
                            action: loadResourceFailedAction({
                                tabId: payload.tab.id,
                                url: payload.tab.url,
                                error: {
                                    error: DappyLoadError.DangerousLink,
                                    args: {
                                        url: futureUrl,
                                    }
                                }
                            })
                        });
                    }
                };
                view.webContents.on('will-redirect', function (e, futureUrl) {
                    console.log('will-redirect', futureUrl);
                    if (new URL(futureUrl).host !== url.host) {
                        console.log('will redirect, must change session', url.host, '->', new URL(futureUrl).host);
                    }
                });
                view.webContents.on('did-redirect-navigation', function (e, url) {
                    console.log('did-redirect-navigation', url);
                });
                view.webContents.on('will-navigate', function (e, futureUrl) {
                    console.log('will-navigate', futureUrl);
                    // todo select tab here to know if tab is favorite or not
                    handleNavigation(e, futureUrl, payload.tab.favorite);
                });
                view.webContents.on('did-start-loading', function (e) {
                    action.meta.browserWindow.webContents.executeJavaScript("console.log('did-start-loading ".concat(payload.tab.id, "')"));
                });
                view.webContents.on('dom-ready', function (a) {
                    action.meta.browserWindow.webContents.executeJavaScript("console.log('dom-ready ".concat(payload.tab.id, "')"));
                });
                if (!!!payload.tab.data.html) return [3 /*break*/, 11];
                return [4 /*yield*/, view.webContents.executeJavaScript("\n    window.write(\"".concat(encodeURIComponent(payload.tab.data.html), "\")\n    "))];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11: 
            /*
              Context menu
              IP app will instantly execute window.initContextMenu();
              Dapp will wait for DAPP_INITIAL_SETUP and then execute window.initContextMenu();
            */
            return [4 /*yield*/, view.webContents.executeJavaScript("\n  window.initContextMenu = () => { const paste=[\"Paste\",(e,t,o)=>{navigator.clipboard.readText().then(function(e){const t=o.value,n=o.selectionStart;o.value=t.slice(0,n)+e+t.slice(n)}),e.remove()}],copy=[\"Copy\",(e,t,o)=>{navigator.clipboard.writeText(t),e.remove()}];document.addEventListener(\"contextmenu\",e=>{let t=[];const o=window.getSelection()&&window.getSelection().toString();if(o&&(t=[copy]),\"TEXTAREA\"!==e.target.tagName&&\"INPUT\"!==e.target.tagName||(t=t.concat([paste])),0===t.length)return;const n=document.createElement(\"div\");n.className=\"context-menu\",n.style.width=\"160px\",n.style.color=\"#fff\",n.style.backgroundColor=\"rgba(04, 04, 04, 0.8)\",n.style.top=e.clientY-5+\"px\",n.style.left=e.clientX-5+\"px\",n.style.position=\"absolute\",n.style.zIndex=10,n.style.fontSize=\"16px\",n.style.borderRadius=\"2px\",n.style.fontFamily=\"fira\",n.addEventListener(\"mouseleave\",()=>{n.remove()}),t.forEach(t=>{const l=document.createElement(\"div\");l.style.padding=\"6px\",l.style.cursor=\"pointer\",l.style.borderBottom=\"1px solid #aaa\",l.addEventListener(\"mouseenter\",()=>{console.log(\"onmouseenter\"),l.style.backgroundColor=\"rgba(255, 255, 255, 0.1)\",l.style.color=\"#fff\"}),l.addEventListener(\"mouseleave\",()=>{console.log(\"onmouseleave\"),l.style.backgroundColor=\"transparent\",l.style.color=\"#fff\"}),l.innerText=t[0],l.addEventListener(\"click\",()=>t[1](n,o,e.target)),n.appendChild(l)}),document.body.appendChild(n)}); }; window.initContextMenu();\n  ")];
            case 12:
                /*
                  Context menu
                  IP app will instantly execute window.initContextMenu();
                  Dapp will wait for DAPP_INITIAL_SETUP and then execute window.initContextMenu();
                */
                _a.sent();
                /*
                  Equivalent of window.location, dapps and IP apps can know
                  from which host they've been loaded
                */
                return [4 /*yield*/, view.webContents.executeJavaScript("\n  window.dappy = { host: \"".concat(url.host, "\", path: \"").concat(url.pathname, "\" };\n  "))];
            case 13:
                /*
                  Equivalent of window.location, dapps and IP apps can know
                  from which host they've been loaded
                */
                _a.sent();
                return [2 /*return*/];
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
                    if (id !== payload.tabId && browserViews[id].visible) {
                        modified = true;
                        browserViews[id].browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
                        newBrowserViews = __assign(__assign({}, newBrowserViews), (_a = {}, _a[id] = __assign(__assign({}, browserViews[id]), { visible: false }), _a));
                    }
                    else if (id === payload.tabId && !browserViews[id].visible) {
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
                if (!browserViews[payload.tabId]) {
                    console.error('Did not find browserView, cannot mute/unmute');
                    return [2 /*return*/];
                }
                browserViews[payload.tabId].browserView.webContents.setAudioMuted(payload.muted);
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
                if (browserViews[payload.tabId] && browserViews[payload.tabId].browserView) {
                    try {
                        browserViews[payload.tabId].browserView.webContents.executeJavaScript("\n      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestIdentifications() };\n      if (typeof dappyEthereum !== 'undefined') { dappyEthereum.requestIdentifications() };\n      ");
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
    var payload, tabId, browserViews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = action.payload;
                tabId = payload.origin.tabId;
                return [4 /*yield*/, select(getBrowserViewsMain)];
            case 1:
                browserViews = _a.sent();
                if (browserViews[tabId] && browserViews[tabId].browserView) {
                    try {
                        browserViews[tabId].browserView.webContents.executeJavaScript("\n      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestTransactions() };\n      if (typeof dappyEthereum !== 'undefined') { dappyEthereum.requestTransactions() };\n      ");
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
    settings: reducer$2,
    blockchains: reducer,
    browserViews: reducer$1,
    transactions: reducer$3,
    identifications: reducer$4,
    tabs: reducer$5,
}), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSagas);

// Modules to control application life and create native browser window
/*
  CAREFUL
  Partition is the cold storage identifier on the OS where dappy is installed,
  changing this will remove everything that is in dappy localStorage
  PRIVATE KEYS LOST, ACCOUNTS LOST, TABS LOST etc.....
*/
var partition = "persist:dappy0.3.0";
electron.protocol.registerSchemesAsPrivileged([
    { scheme: 'dappy', privileges: { standard: true, secure: true, bypassCSP: true } },
]);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var browserWindow = undefined;
var dispatchesFromMainAwaiting = [];
var getDispatchesFromMainAwaiting = function () {
    var t = [].concat(dispatchesFromMainAwaiting);
    dispatchesFromMainAwaiting = [];
    return t;
};
var dispatchFromMain = function (a) {
    dispatchesFromMainAwaiting.push(a.action);
};
var isHttpsUrl = function (uri) {
    return /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(uri);
};
/*
  Open external link
*/
var openExternal = function (url) {
    if (isHttpsUrl(url))
        electron.shell.openExternal(url);
    else
        console.error('Only open external https urls');
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
                url: a,
            }),
        });
    }
    return;
});
function createWindow() {
    // Create the browser window.
    browserWindow = new electron.BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: false,
            sandbox: true,
            contextIsolation: true,
            partition: partition,
            devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS) || !true,
        },
    });
    var browserSession = electron.session.fromPartition(partition);
    preventAllPermissionRequests(browserSession);
    overrideHttpProtocol({ session: browserSession });
    overrideHttpsProtocol({
        dappyNetworkMembers: [],
        dappyBrowserView: undefined,
        session: browserSession,
        dispatchFromMain: dispatchFromMain,
        partitionIdHash: '',
        setIsFirstRequest: function () { return false; },
        getIsFirstRequest: function () { return false; },
    });
    registerInterProcessProtocol(browserSession, store, getLoadResourceWhenReady$1, openExternal, browserWindow, dispatchFromMain, getDispatchesFromMainAwaiting);
    browserWindow.setMenuBarVisibility(false);
    // and load the index.html of the app.
    {
        browserWindow.loadFile('dist/index.html');
    }
    // Open the DevTools.
    // browserWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    browserWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        browserWindow = undefined;
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
    if (browserWindow === undefined)
        createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
