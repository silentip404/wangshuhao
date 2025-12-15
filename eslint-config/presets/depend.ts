import depend, { configs } from 'eslint-plugin-depend';
import { defineConfig } from 'eslint/config';

const dependPresets = defineConfig([
  { plugins: { depend }, extends: [configs['flat/recommended']] },
]);

export { dependPresets };
