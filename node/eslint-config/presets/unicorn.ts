import unicornPlugin from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

const unicornPresets = defineConfig([unicornPlugin.configs.recommended]);

export { unicornPresets };
