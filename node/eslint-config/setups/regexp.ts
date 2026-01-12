import { configs } from 'eslint-plugin-regexp';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const regexpScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const regexpSetup = defineScopedConfig(regexpScopedFiles, [
  configs['flat/recommended'],
]);

export { regexpScopedFiles, regexpSetup };
