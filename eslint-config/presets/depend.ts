import dependPlugin, { configs } from 'eslint-plugin-depend';
import { defineConfig } from 'eslint/config';

const dependPresets = defineConfig([
  { plugins: { depend: dependPlugin }, extends: [configs['flat/recommended']] },
]);

export { dependPresets };
