import createIgnoreConfig from 'eslint-config-flat-gitignore';
import { defineConfig } from 'eslint/config';

const ignorePresets = defineConfig([
  createIgnoreConfig({
    root: true,
    files: ['.gitignore', '.husky/_/.gitignore'],
  }),
]);

export { ignorePresets };
