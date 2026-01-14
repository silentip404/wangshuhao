import tsdocPlugin from 'eslint-plugin-tsdoc';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const tsdocScopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

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
