import stylisticPlugin from '@stylistic/eslint-plugin';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const stylisticScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const stylisticSetup = defineScopedConfig(stylisticScopedFiles, [
  stylisticPlugin.configs.recommended,
]);

export { stylisticScopedFiles, stylisticSetup };
