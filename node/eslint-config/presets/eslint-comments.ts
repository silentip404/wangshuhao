import eslintCommentsPluginConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { defineConfig } from 'eslint/config';

const eslintCommentsPresets = defineConfig([
  eslintCommentsPluginConfigs.recommended,
]);

export { eslintCommentsPresets };
