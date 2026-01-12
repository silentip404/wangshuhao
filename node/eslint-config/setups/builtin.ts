import eslintJs from '@eslint/js';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const builtinScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const builtinSetup = defineScopedConfig(builtinScopedFiles, [
  eslintJs.configs.recommended,
]);

export { builtinScopedFiles, builtinSetup };
