import checkFilePlugin from 'eslint-plugin-check-file';
import { defineConfig } from 'eslint/config';

const checkFilePresets = defineConfig([
  { plugins: { 'check-file': checkFilePlugin } },
]);

export { checkFilePresets };
