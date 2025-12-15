import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

const importPresets = defineConfig([
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  { settings: { 'import/resolver': { typescript: true } } },
]);

export { importPresets };
