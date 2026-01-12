import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from 'eslint/config';

import {
  GLOB_JSON,
  GLOB_JSON5,
  GLOBS_COMBINED_JSON,
  GLOBS_COMBINED_JSONC,
} from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';
import { appendLocalSettings } from '../utilities/setting.ts';

const allJsoncScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JSON };

const jsoncSetup = defineConfig([
  defineScopedConfig(
    allJsoncScopedFiles,
    appendLocalSettings(
      {
        shouldPrependAllRules: false,
      },
      jsoncPlugin.configs['flat/base'],
    ),
  ),
  defineScopedConfig(
    {
      files: [GLOB_JSON],
      ignores: [...GLOBS_COMBINED_JSONC, GLOB_JSON5],
    },
    jsoncPlugin.configs['flat/recommended-with-json'],
  ),
  defineScopedConfig(
    {
      files: GLOBS_COMBINED_JSONC,
      ignores: [GLOB_JSON, GLOB_JSON5],
    },
    jsoncPlugin.configs['flat/recommended-with-jsonc'],
  ),
  defineScopedConfig(
    {
      files: [GLOB_JSON5],
      ignores: [GLOB_JSON, ...GLOBS_COMBINED_JSONC],
    },
    jsoncPlugin.configs['flat/recommended-with-json5'],
  ),
]);

export { allJsoncScopedFiles, jsoncSetup };
