import jsxA11YPlugin from 'eslint-plugin-jsx-a11y';

import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const scopedFiles: ScopedFiles = { files: GLOBS_TSCONFIG_APP_INCLUDE };

const jsxA11ySetup = defineScopedConfig(scopedFiles, [
  jsxA11YPlugin.flatConfigs.strict,
]);

export { jsxA11ySetup };
