import unicornPlugin from 'eslint-plugin-unicorn';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const unicornScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const unicornSetup = defineScopedConfig(unicornScopedFiles, [
  unicornPlugin.configs.recommended,
]);

export { unicornScopedFiles, unicornSetup };
