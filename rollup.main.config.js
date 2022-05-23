import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import replace from '@rollup/plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = process.env.NODE_ENV === 'production';

export default {
  input: 'main/main.ts',
  output: {
    format: 'cjs',
    file: 'main.js',
    sourcemap: !production,
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
    'isarray',
    'util',
    'string_decoder',
  ],
  plugins: [
    sourcemaps(),
    typescript(),
    resolve(),
    commonjs(),
    json(),
    replace({
      'process.env.PRODUCTION': production ? 'true' : 'false',
    }),
  ],
};
