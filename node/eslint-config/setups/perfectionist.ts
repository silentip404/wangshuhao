import perfectionistPlugin from 'eslint-plugin-perfectionist';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const perfectionistScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const perfectionistSetup = defineScopedConfig(perfectionistScopedFiles, [
  {
    plugins: {
      perfectionist: perfectionistPlugin,
    },
    settings: {
      perfectionist: {
        type: 'natural',
        order: 'asc',
        ignoreCase: false,
        specialCharacters: 'keep',
        partitionByComment: false,
        partitionByNewLine: false,
      },
    },
  },
]);

export { perfectionistScopedFiles, perfectionistSetup };
