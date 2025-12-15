import { type TSESLint } from '@typescript-eslint/utils';

import { restrictNonNamedImportName } from './rules/index.ts';

const localPlugin: TSESLint.FlatConfig.Plugin = {
  rules: {
    [restrictNonNamedImportName.ruleName]: restrictNonNamedImportName.ruleValue,
  },
};

export { localPlugin };
