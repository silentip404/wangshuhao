import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

const builtinPreset = defineConfig([js.configs.recommended]);

export { builtinPreset };
