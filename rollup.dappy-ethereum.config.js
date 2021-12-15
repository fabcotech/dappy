import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import replace from '@rollup/plugin-replace';

const VERSION = "0.1.0";

export default {
  input: "dappy-x/dappy-ethereum.ts",
  output: {
    format: "iife",
    sourceMap: "inline",
    file: "dapp-libs/js/dappy-ethereum@" + VERSION + ".js",
    name: "DappyEthereum",
    globals: {
    },
  },
  external: [
    "electron",
    /* All the following modules are included in Node JS*/
    "fs",
    "os",
    "crypto",
    "path",
    "http",
    "https",
    "stream",
    "net",
    "tls",
    "zlib",
    "events",
    "url",
    "util",
    "string_decoder",
  ],
  plugins: [typescript(), resolve(), commonjs(), replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  })],
};
