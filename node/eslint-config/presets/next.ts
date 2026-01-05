import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';

import { ROOT } from '#node/utilities/index.ts';

// eslint-disable-next-line import-x/no-named-as-default-member -- @next/eslint-plugin-next 是 CommonJS 模块，不支持命名导入
const { configs } = nextPlugin;

const nextPresets = defineConfig([
  configs['core-web-vitals'],
  {
    settings: {
      next: {
        rootDir: ROOT,
      },
    },
  },
]);

export { nextPresets };
