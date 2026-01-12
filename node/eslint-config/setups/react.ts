import eslintPlugin from '@eslint-react/eslint-plugin';

import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const reactScopedFiles: ScopedFiles = { files: GLOBS_TSCONFIG_APP_INCLUDE };

const reactSetup = defineScopedConfig(reactScopedFiles, [
  eslintPlugin.configs['strict-typescript'],
]);

export { reactSetup };
