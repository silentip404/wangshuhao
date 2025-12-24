import eslintJs from '@eslint/js';
import { defineConfig } from 'eslint/config';

const builtinPresets = defineConfig([eslintJs.configs.recommended]);

export { builtinPresets };
