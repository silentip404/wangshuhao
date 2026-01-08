import { jsdoc } from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';

const jsdocPresets = defineConfig([
  jsdoc({
    config: 'flat/recommended-typescript',
  }),
]);

export { jsdocPresets };
