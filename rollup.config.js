import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';

export default {
  input: 'main/main.ts',
  output: {
    format: 'cjs',
    file: 'main.js',
  },
  external: [
    'electron',
    /* All the following modules are included in Node JS, exlude/external them*/
    'fs',
    'os',
    'dns',
    'crypto',
    'path',
    'http',
    'https',
    'stream',
    'net',
    'tls',
    'zlib',
    'events',
    'url',
    'util',
    'string_decoder',
  ],
  plugins: [typescript(), resolve(), commonjs(), json()],
};
