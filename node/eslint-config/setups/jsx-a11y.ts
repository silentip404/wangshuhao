import jsxA11YPlugin from 'eslint-plugin-jsx-a11y';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';

const scopedFiles: ScopedFiles = {
  files: GLOBS_TSCONFIG_APP_INCLUDE,
};

const jsxA11ySetup = defineScopedConfig(scopedFiles, [
  jsxA11YPlugin.flatConfigs.strict,
]);

export { jsxA11ySetup };
