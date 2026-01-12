import { jsdoc } from 'eslint-plugin-jsdoc';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const jsdocScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const jsdocSetup = defineScopedConfig(jsdocScopedFiles, [
  jsdoc({
    config: 'flat/recommended-typescript',
  }),
]);

export { jsdocScopedFiles, jsdocSetup };
