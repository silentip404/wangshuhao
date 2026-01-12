import perfectionistPlugin from 'eslint-plugin-perfectionist';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

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
