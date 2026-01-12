import eslintCommentsPluginConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const eslintCommentsScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const eslintCommentsSetup = defineScopedConfig(eslintCommentsScopedFiles, [
  eslintCommentsPluginConfigs.recommended,
]);

export { eslintCommentsScopedFiles, eslintCommentsSetup };
