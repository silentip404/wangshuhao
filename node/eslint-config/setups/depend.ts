import { configs } from 'eslint-plugin-depend';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const dependScopedFiles: ScopedFiles = {
  files: ['**/package.json', ...GLOBS_COMBINED_JS],
};

const dependSetup = defineScopedConfig(dependScopedFiles, [
  configs['flat/recommended'],
]);

export { dependScopedFiles, dependSetup };
