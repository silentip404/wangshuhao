import eslintPlugin from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';

const reactPresets = defineConfig([eslintPlugin.configs['strict-typescript']]);

export { reactPresets };
