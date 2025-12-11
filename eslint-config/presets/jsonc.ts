import { defineConfig } from 'eslint/config';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';

import {
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_JSON_DERIVED,
} from '#node/utils';

const jsoncPresets = defineConfig([
  {
    files: [...GLOB_JSON],
    ignores: [...GLOB_JSONC, ...GLOB_JSON5],
    extends: eslintPluginJsonc.configs['flat/recommended-with-json'],
  },
  {
    files: [...GLOB_JSONC],
    ignores: [...GLOB_JSON, ...GLOB_JSON5],
    extends: eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  },
  {
    files: [...GLOB_JSON5],
    ignores: [...GLOB_JSON, ...GLOB_JSONC],
    extends: eslintPluginJsonc.configs['flat/recommended-with-json5'],
  },
  { files: [...GLOB_JSON_DERIVED], languageOptions: { parser: jsoncParser } },
]);

export { jsoncPresets };
