import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from 'eslint/config';
import { parseForESLint } from 'jsonc-eslint-parser';

import {
  GLOB_COMBINED_JSONC,
  GLOB_JSON,
  GLOB_JSON5,
} from '#node/utilities/globs.ts';

import { defineConfigWithAuditSettings } from '../utilities/audit.ts';

const jsoncPresets = defineConfig([
  {
    extends: defineConfigWithAuditSettings(jsoncPlugin.configs['flat/base'], {
      shouldPrependAllRules: false,
    }),
    languageOptions: {
      parser: {
        parseForESLint,
      },
    },
  },
  {
    files: [GLOB_JSON],
    ignores: [...GLOB_COMBINED_JSONC, GLOB_JSON5],
    extends: jsoncPlugin.configs['flat/recommended-with-json'],
  },
  {
    files: [...GLOB_COMBINED_JSONC],
    ignores: [GLOB_JSON, GLOB_JSON5],
    extends: jsoncPlugin.configs['flat/recommended-with-jsonc'],
  },
  {
    files: [GLOB_JSON5],
    ignores: [GLOB_JSON, ...GLOB_COMBINED_JSONC],
    extends: jsoncPlugin.configs['flat/recommended-with-json5'],
  },
]);

export { jsoncPresets };
