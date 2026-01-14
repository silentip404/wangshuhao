import eslintCommentsPluginConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const eslintCommentsScopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

const eslintCommentsSetup = defineScopedConfig(eslintCommentsScopedFiles, [
  eslintCommentsPluginConfigs.recommended,
]);

export { eslintCommentsScopedFiles, eslintCommentsSetup };
