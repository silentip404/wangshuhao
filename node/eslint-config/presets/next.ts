import { configs } from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';

import { ROOT } from '#node/utils/index.ts';

const nextPresets = defineConfig([
  configs['core-web-vitals'],
  { settings: { next: { rootDir: ROOT } } },
]);

export { nextPresets };
