import eslintJs from '@eslint/js';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const builtinScopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

const builtinSetup = defineScopedConfig(builtinScopedFiles, [
  eslintJs.configs.recommended,
]);

export { builtinScopedFiles, builtinSetup };
