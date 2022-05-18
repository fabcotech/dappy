var RChainWeb = (function () {
    'use strict';

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

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const rhoUnforgeableToJs = (expr) => {
        const unforgeable = {};
        Object.keys(expr.ExprUnforg.data).forEach((u) => {
            if (u === "UnforgPrivate") {
                unforgeable.UnforgPrivate = expr.ExprUnforg.data[u].data;
            }
            else if (u === "UnforgDeploy") {
                unforgeable.UnforgDeploy = expr.ExprUnforg.data[u].data;
            }
            else if (u === "UnforgDeployer") {
                unforgeable.UnforgDeployer = expr.ExprUnforg.data[u].data;
            }
        });
        return unforgeable;
    };
    const rholangMapToJsObject = (expr) => {
        const obj = {};
        Object.keys(expr.ExprMap.data).forEach((k) => {
            obj[k] = rhoValToJs(expr.ExprMap.data[k]);
        });
        return obj;
    };
    const rhoExprStringToJs = (expr) => {
        return expr.ExprString.data;
    };
    const rhoExprUriToJs = (expr) => {
        return expr.ExprUri.data;
    };
    const rhoExprBoolToJs = (expr) => {
        return expr.ExprBool.data;
    };
    const rhoExprIntToJs = (expr) => {
        return expr.ExprInt.data;
    };
    const rhoExprListToJs = (expr) => {
        return expr.ExprList.data.map((e) => rhoValToJs(e));
    };
    const rhoExprTupleToJs = (expr) => {
        return expr.ExprTuple.data.map((e) => rhoValToJs(e));
    };
    const rhoExprSetToJs = (expr) => {
        return expr.ExprSet.data.map((e) => rhoValToJs(e));
    };
    const rhoValToJs = (expr) => {
        /* if (val.ids && val.ids[0]) {
              return rhoIdsToJs(val.ids);
            } else  */
        if (expr.ExprUnforg) {
            return rhoUnforgeableToJs(expr);
        }
        else if (expr.ExprMap) {
            return rholangMapToJsObject(expr);
        }
        else if (expr.ExprString) {
            return rhoExprStringToJs(expr);
        }
        else if (expr.ExprUri) {
            return rhoExprUriToJs(expr);
        }
        else if (expr.ExprBool) {
            return rhoExprBoolToJs(expr);
        }
        else if (expr.ExprInt) {
            return rhoExprIntToJs(expr);
        }
        else if (expr.ExprList) {
            return rhoExprListToJs(expr);
        }
        else if (expr.ExprTuple) {
            return rhoExprTupleToJs(expr);
        }
        else if (expr.ExprSet) {
            return rhoExprSetToJs(expr);
        }
        else {
            console.warn("Not implemented", expr);
            return null;
        }
    };

    /*
      converts expr received by decoding buffers
      and decoding Par to javascript variables
    */
    const rhoExprToVar = (a
    //a: rnodeProtos.IExpr
    ) => {
        if (a.g_string) {
            return a.g_string;
        }
        else if (a.g_uri) {
            return a.g_uri;
        }
        else if (a.g_int) {
            return parseInt(a.g_int, 10);
        }
        else if (a.g_bool) {
            return a.g_bool;
        }
        else if (a.e_list_body) {
            if (a.e_list_body && a.e_list_body.ps) {
                return a.e_list_body.ps.map((ps) => {
                    if (ps.exprs && ps.exprs[0]) {
                        return rhoExprToVar(ps.exprs[0]);
                    }
                    else {
                        return null;
                    }
                });
            }
            else {
                return [];
            }
        }
        else if (a.e_tuple_body) {
            if (a.e_tuple_body && a.e_tuple_body.ps) {
                return a.e_tuple_body.ps.map((ps) => {
                    if (ps.exprs && ps.exprs[0]) {
                        return rhoExprToVar(ps.exprs[0]);
                    }
                    else {
                        return null;
                    }
                });
            }
            else {
                return [];
            }
        }
        else if (a.e_set_body) {
            if (a.e_set_body && a.e_set_body.ps) {
                return a.e_set_body.ps.map((ps) => {
                    if (ps.exprs && ps.exprs[0]) {
                        return rhoExprToVar(ps.exprs[0]);
                    }
                    else {
                        return null;
                    }
                });
            }
            else {
                return [];
            }
        }
        else if (a.e_map_body) {
            const obj = {};
            if (a.e_map_body.kvs) {
                a.e_map_body.kvs.forEach((kv) => {
                    if (kv.key && kv.key.exprs && kv.key.exprs[0]) {
                        if (kv.value && kv.value.exprs && kv.value.exprs[0]) {
                            obj[rhoExprToVar(kv.key.exprs[0])] = rhoExprToVar(kv.value.exprs[0]);
                        }
                        else {
                            obj[rhoExprToVar(kv.key.exprs[0])] = null;
                        }
                    }
                });
                return obj;
            }
            else {
                return {};
            }
        }
        else {
            console.warn("Not implemented", a);
            return null;
        }
    };

    /* import { decodePar } from "../../rchain-toolkit/src/utils/decodePar";
     */
    // we avoid importing all rchain-toolkit to have a 
    // lighter bundle
    const decodeBase16 = (hexStr) => {
        const removed0x = hexStr.replace(/^0x/, "");
        const byte2hex = ([arr, bhi], x) => bhi ? [[...arr, parseInt(`${bhi}${x}`, 16)]] : [arr, x];
        const resArr = Array.from(removed0x).reduce(byte2hex, [[]])[0];
        return Uint8Array.from(resArr);
    };
    const encodeBase16 = (bytes) => Array.from(bytes)
        .map((x) => (x & 0xff).toString(16).padStart(2))
        .join("");
    class RChainWebHttp {
        constructor(config) {
            this.readOnlyHost = '';
            this.validatorHost = '';
            if (!config.readOnlyHost) {
                throw new Error("Please provide 1st argument readOnlyHost");
            }
            if (config.readOnlyHost.startsWith("https")) {
                console.log("warning: readOnlyHost does not start with https");
            }
            if (!config.validatorHost) {
                throw new Error("Please provide 1st argument validatorHost");
            }
            if (config.validatorHost.startsWith("https")) {
                console.log("warning: validatorHost does not start with https");
            }
            this.readOnlyHost = config.readOnlyHost;
            this.validatorHost = config.validatorHost;
        }
        // ==============
        // Deploy
        // ==============
        deploy(options, timeout) {
            return __awaiter(this, void 0, void 0, function* () {
                let pd = undefined;
                if (typeof timeout === "number") {
                    pd = yield this.prepareDeploy({
                        deployer: options.deployer,
                        timestamp: options.data.timestamp,
                        nameQty: 1,
                    });
                }
                return new Promise((resolve, reject) => {
                    const req = new XMLHttpRequest();
                    const data = JSON.stringify(options);
                    req.open("POST", this.validatorHost + "/api/deploy", true);
                    req.setRequestHeader("Content-type", "application/json");
                    req.setRequestHeader("Data", data);
                    req.onreadystatechange = () => {
                        //Call a function when the state changes.
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                try {
                                    const b = req.responseText;
                                    if (typeof timeout === "number") {
                                        let s = new Date().getTime();
                                        let ongoning = false;
                                        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                                            if (ongoning) {
                                                return;
                                            }
                                            ongoning = true;
                                            if (new Date().getTime() - timeout > s) {
                                                clearInterval(interval);
                                                reject("TIMEOUT");
                                            }
                                            const dan = yield this.dataAtName({
                                                name: {
                                                    UnforgPrivate: { data: pd.names[0] },
                                                },
                                                depth: 3,
                                            });
                                            if (dan && dan.exprs && dan.exprs.length) {
                                                resolve(dan);
                                                clearInterval(interval);
                                            }
                                            ongoning = false;
                                        }), 8000);
                                    }
                                    else {
                                        resolve(b);
                                    }
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(req.responseText);
                            }
                        }
                    };
                    req.send(data);
                });
            });
        }
        ;
        // ==============
        // Valid after block number
        // ==============
        validAfterBlockNumber() {
            return __awaiter(this, void 0, void 0, function* () {
                const validAfterBlockNumberResponse = (yield this.blocks({
                    position: 1,
                }))[0].blockNumber;
                return validAfterBlockNumberResponse;
            });
        }
        ;
        // ==============
        // Status
        // ==============
        status() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const req = new XMLHttpRequest();
                    req.open("GET", this.readOnlyHost + "/api/status", true);
                    req.setRequestHeader("Content-type", "application/json");
                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                try {
                                    resolve(JSON.parse(req.responseText));
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(req.responseText);
                            }
                        }
                    };
                    req.send();
                });
            });
        }
        ;
        // ==============
        // Exploratory deploy
        // ==============
        exploreDeploy(options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const req = new XMLHttpRequest();
                    const data = options.term;
                    req.open("POST", this.readOnlyHost + "/api/explore-deploy", true);
                    req.setRequestHeader("Data", data);
                    req.setRequestHeader("Content-type", "application/json");
                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                try {
                                    resolve(JSON.parse(req.responseText));
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(req.responseText);
                            }
                        }
                    };
                    req.send(data);
                });
            });
        }
        ;
        exploreDeploys(terms, transform = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (transform) {
                    return Promise.all(terms.map((t) => this.exploreDeploy({ term: t })));
                }
                else {
                    return new Promise((resolve, reject) => {
                        const req = new XMLHttpRequest();
                        const data = JSON.stringify({ terms: terms });
                        req.open("POST", this.readOnlyHost + "/explore-deploys", true);
                        req.setRequestHeader("Data", data);
                        req.setRequestHeader("Content-type", "application/json");
                        req.onreadystatechange = () => {
                            if (req.readyState === 4) {
                                if (req.status === 200) {
                                    try {
                                        resolve(JSON.parse(req.responseText));
                                    }
                                    catch (err) {
                                        reject(err);
                                    }
                                }
                                else {
                                    reject(req.responseText);
                                }
                            }
                        };
                        req.send(data);
                    });
                }
            });
        }
        ;
        // ==============
        // Blocks by position
        // ==============
        blocks(options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const req = new XMLHttpRequest();
                    req.open("GET", this.readOnlyHost + "/api/blocks/" + options.position, true);
                    req.setRequestHeader("Content-type", "application/json");
                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                try {
                                    resolve(JSON.parse(req.responseText));
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(req.responseText);
                            }
                        }
                    };
                    req.send();
                });
            });
        }
        ;
        // ==============
        // DataAtName
        // ==============
        dataAtName(options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const req = new XMLHttpRequest();
                    const data = JSON.stringify(options);
                    req.open("POST", this.readOnlyHost + "/api/data-at-name", true);
                    req.setRequestHeader("Data", data);
                    req.setRequestHeader("Content-type", "application/json");
                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                try {
                                    resolve(JSON.parse(req.responseText));
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(req.responseText);
                            }
                        }
                    };
                    req.send(data);
                });
            });
        }
        ;
        // ==============
        // PrepareDeploy
        // ==============
        prepareDeploy(options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const req = new XMLHttpRequest();
                    const data = JSON.stringify(options);
                    req.open("POST", this.readOnlyHost + "/api/prepare-deploy", true);
                    req.setRequestHeader("Data", data);
                    req.setRequestHeader("Content-type", "application/json");
                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                try {
                                    resolve(JSON.parse(req.responseText));
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(req.responseText);
                            }
                        }
                    };
                    req.send(JSON.stringify(options));
                });
            });
        }
        ;
    }
    var index = {
        utils: {
            rhoValToJs: rhoValToJs,
            rhoExprToVar: rhoExprToVar,
            //decodePar: decodePar,
            //getDeployDataToSign: getDeployDataToSign,
            decodeBase16: decodeBase16,
            encodeBase16: encodeBase16,
        },
        http: RChainWebHttp,
    };

    return index;

})();
