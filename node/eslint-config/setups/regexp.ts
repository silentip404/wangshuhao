import { configs } from 'eslint-plugin-regexp';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const regexpScopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

const regexpSetup = defineScopedConfig(regexpScopedFiles, [
  configs['flat/recommended'],
]);

export { regexpScopedFiles, regexpSetup };
