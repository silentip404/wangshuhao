import { jsdoc } from 'eslint-plugin-jsdoc';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const jsdocScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const jsdocSetup = defineScopedConfig(jsdocScopedFiles, [
  jsdoc({
    config: 'flat/recommended-typescript',
  }),
]);

export { jsdocScopedFiles, jsdocSetup };
