import checkFilePlugin from 'eslint-plugin-check-file';

import {
  GLOB_ALL,
  GLOBS_COMBINED_JS,
  GLOBS_COMBINED_JSON,
} from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const checkFileScopedFiles: ScopedFiles = { files: [GLOB_ALL] };

const checkFileSetup = defineScopedConfig(checkFileScopedFiles, [
  {
    plugins: {
      'check-file': checkFilePlugin,
    },
  },
  {
    ignores: [...GLOBS_COMBINED_JS, ...GLOBS_COMBINED_JSON],
    processor: 'check-file/eslint-processor-check-file',
  },
]);

export { checkFileScopedFiles, checkFileSetup };
