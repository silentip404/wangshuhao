import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';

import { ROOT } from '#node/utils/index.ts';

// @next/eslint-plugin-next is a CommonJS module that doesn't support named imports.
// Accessing default export properties is the intended usage pattern.
// eslint-disable-next-line import-x/no-named-as-default-member
const { configs } = nextPlugin;

const nextPresets = defineConfig([
  configs['core-web-vitals'],
  { settings: { next: { rootDir: ROOT } } },
]);

export { nextPresets };
