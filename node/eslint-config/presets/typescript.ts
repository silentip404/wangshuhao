import { defineConfig } from 'eslint/config';
import { configs } from 'typescript-eslint';

import { ROOT } from '#node/utils/index.ts';

const typescriptPresets = defineConfig([
  configs.strictTypeChecked,
  configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: ROOT, projectService: true },
    },
  },
]);

export { typescriptPresets };
