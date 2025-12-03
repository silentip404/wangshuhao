import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';

const importPresets = defineConfig([
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  { settings: { 'import/resolver': { typescript: true } } },
]);

export { importPresets };
