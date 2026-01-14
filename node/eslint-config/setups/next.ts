import nextPlugin from '@next/eslint-plugin-next';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_TSCONFIG_APP_INCLUDE } from '#node/utilities/globs.ts';
import { ROOT } from '#node/utilities/path.ts';

// eslint-disable-next-line import-x/no-named-as-default-member -- @next/eslint-plugin-next 是 CommonJS 模块，不支持命名导入
const { configs } = nextPlugin;

const nextScopedFiles: ScopedFiles = {
  files: GLOBS_TSCONFIG_APP_INCLUDE,
};

const nextSetup = defineScopedConfig(nextScopedFiles, [
  configs['core-web-vitals'],
  {
    settings: {
      next: {
        rootDir: ROOT,
      },
    },
  },
]);

export { nextSetup };
