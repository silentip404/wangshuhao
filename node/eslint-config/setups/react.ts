import eslintPlugin from '@eslint-react/eslint-plugin';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';

const reactScopedFiles: ScopedFiles = { files: GLOBS_TSCONFIG_APP_INCLUDE };

const reactSetup = defineScopedConfig(reactScopedFiles, [
  eslintPlugin.configs['strict-typescript'],
]);

export { reactSetup };
