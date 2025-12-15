import { configs } from 'eslint-plugin-regexp';
import { defineConfig } from 'eslint/config';

const regexpPresets = defineConfig([configs['flat/recommended']]);

export { regexpPresets };
