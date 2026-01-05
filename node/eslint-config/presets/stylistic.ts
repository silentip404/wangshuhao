import stylisticPlugin from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

const stylisticPresets = defineConfig([stylisticPlugin.configs.recommended]);

export { stylisticPresets };
