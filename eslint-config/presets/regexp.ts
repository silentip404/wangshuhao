import { defineConfig } from 'eslint/config';
import { configs } from 'eslint-plugin-regexp';

const regexpPresets = defineConfig([configs['flat/recommended']]);

export { regexpPresets };
