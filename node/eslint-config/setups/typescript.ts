import { configs } from 'typescript-eslint';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';
import { ROOT } from '#node/utilities/path.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

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
