import tsdocPlugin from 'eslint-plugin-tsdoc';
import { defineConfig } from 'eslint/config';

const tsdocPresets = defineConfig([
  {
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      'tsdoc/syntax': 'warn',
    },
  },
]);

export { tsdocPresets };
