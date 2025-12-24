import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from 'eslint/config';
import * as jsoncParser from 'jsonc-eslint-parser';

import {
  GLOB_DERIVED_JSON,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
} from '#node/utils/index.ts';

const jsoncPresets = defineConfig([
  {
    files: [...GLOB_JSON],
    ignores: [...GLOB_JSONC, ...GLOB_JSON5],
    extends: jsoncPlugin.configs['flat/recommended-with-json'],
  },
  {
    files: [...GLOB_JSONC],
    ignores: [...GLOB_JSON, ...GLOB_JSON5],
    extends: jsoncPlugin.configs['flat/recommended-with-jsonc'],
  },
  {
    files: [...GLOB_JSON5],
    ignores: [...GLOB_JSON, ...GLOB_JSONC],
    extends: jsoncPlugin.configs['flat/recommended-with-json5'],
  },
  { files: [...GLOB_DERIVED_JSON], languageOptions: { parser: jsoncParser } },
]);

export { jsoncPresets };
