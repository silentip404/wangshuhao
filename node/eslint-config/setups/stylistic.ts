import stylisticPlugin from '@stylistic/eslint-plugin';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const stylisticScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const stylisticSetup = defineScopedConfig(stylisticScopedFiles, [
  stylisticPlugin.configs.recommended,
]);

export { stylisticScopedFiles, stylisticSetup };
