import { defineConfig } from 'eslint/config';
import depend, { configs } from 'eslint-plugin-depend';

const dependPresets = defineConfig([
  { plugins: { depend }, extends: [configs['flat/recommended']] },
]);

export { dependPresets };
