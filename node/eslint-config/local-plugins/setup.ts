import { defineConfig } from 'eslint/config';

import { moduleIdentifierNamingConvention, paddingLineBeforeProcessExit } from './miscellaneous/exports.ts';

const localPluginsSetup = defineConfig([
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

export { localPluginsSetup };
