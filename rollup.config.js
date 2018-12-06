import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input: 'bin/main-app.js',
    output: {
      file: `dist/dac.js`,
      format: 'iife',
      name: 'dac'
    },
    onwarn,
    plugins: [resolve()]
  },
  {
    input: 'bin/main-app.js',
    output: {
      file: `dist/dac.min.js`,
      format: 'iife',
      name: 'dac'
    },
    onwarn,
    plugins: [resolve(), terser()]
  }
];