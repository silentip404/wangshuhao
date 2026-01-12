import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

const scopedFiles: ScopedFiles = { files: GLOBS_TSCONFIG_APP_INCLUDE };

const reactHooksSetup = defineScopedConfig(scopedFiles, [
  reactHooksPlugin.configs.flat['recommended-latest'],
]);

export { reactHooksSetup };
