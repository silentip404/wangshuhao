import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

import { moduleIdentifierNamingConvention, paddingLineBeforeProcessExit } from './miscellaneous/exports.ts';

const localScopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const localSetup = defineScopedConfig(localScopedFiles, [
  {
    plugins: {
      '@local/miscellaneous': {
        // @ts-expect-error -- See reasons['typescript-eslint/issues/11543'] in ts-expect-error.ts
        rules: {
          [moduleIdentifierNamingConvention.ruleName]: moduleIdentifierNamingConvention.ruleValue,
          [paddingLineBeforeProcessExit.ruleName]: paddingLineBeforeProcessExit.ruleValue,
        },
      },
    },
  },
]);

export { localScopedFiles, localSetup };
