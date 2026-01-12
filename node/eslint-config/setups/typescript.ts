import { configs } from 'typescript-eslint';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';
import { ROOT } from '#node/utilities/path.ts';

const typescriptScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const typescriptSetup = defineScopedConfig(typescriptScopedFiles, [
  configs.strictTypeChecked,
  configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: ROOT,
        projectService: true,
      },
    },
  },
]);

export { typescriptScopedFiles, typescriptSetup };
