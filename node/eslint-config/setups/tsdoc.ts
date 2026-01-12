import tsdocPlugin from 'eslint-plugin-tsdoc';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const tsdocScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const tsdocSetup = defineScopedConfig(tsdocScopedFiles, [
  {
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      'tsdoc/syntax': 'warn',
    },
  },
]);

export { tsdocScopedFiles, tsdocSetup };
