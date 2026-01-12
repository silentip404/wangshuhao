import unicornPlugin from 'eslint-plugin-unicorn';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const unicornScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const unicornSetup = defineScopedConfig(unicornScopedFiles, [
  unicornPlugin.configs.recommended,
]);

export { unicornScopedFiles, unicornSetup };
