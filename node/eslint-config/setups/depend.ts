import { configs } from 'eslint-plugin-depend';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const dependScopedFiles: ScopedFiles = {
  files: ['**/package.json', ...GLOBS_COMBINED_JS],
};

const dependSetup = defineScopedConfig(dependScopedFiles, [
  configs['flat/recommended'],
]);

export { dependScopedFiles, dependSetup };
