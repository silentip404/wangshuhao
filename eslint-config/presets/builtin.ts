import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

const builtinPresets = defineConfig([js.configs.recommended]);

export { builtinPresets };
