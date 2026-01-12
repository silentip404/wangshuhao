import reactHooksPlugin from 'eslint-plugin-react-hooks';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';

const scopedFiles: ScopedFiles = { files: GLOBS_TSCONFIG_APP_INCLUDE };

const reactHooksSetup = defineScopedConfig(scopedFiles, [
  reactHooksPlugin.configs.flat['recommended-latest'],
]);

export { reactHooksSetup };
