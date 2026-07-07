import { resolve } from 'node:path';

import alias from '@rollup/plugin-alias';
import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import { minify } from 'rollup-plugin-esbuild';
import typescript from '@rollup/plugin-typescript';

const sourceFolder = 'src';
const fileFormat = 'es';
const fileName = 'index';
const declarationFile = `${fileName}.d.ts`;
const entryFile = `${fileName}.tsx`;
const outputFile = `${fileName}.js`;
const external = ['react', 'react/jsx-runtime'];

const aliasPlugin = alias({
  entries: [{ find: '#utils', replacement: resolve(sourceFolder, 'utils') }],
});

export default defineConfig([
  {
    plugins: [aliasPlugin, typescript(), minify()],
    input: `${sourceFolder}/${entryFile}`,
    external,
    output: {
      file: outputFile,
      format: fileFormat,
    },
  },
  {
    plugins: [aliasPlugin, dts()],
    input: `${sourceFolder}/${entryFile}`,
    external,
    output: {
      file: declarationFile,
      format: fileFormat,
    },
  },
]);
