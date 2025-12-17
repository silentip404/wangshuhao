import { type TSESLint } from '@typescript-eslint/utils';
import { fromEntries } from 'remeda';

import { moduleIdentifierNamingConvention } from './rules/index.ts';

const localPlugin: TSESLint.FlatConfig.Plugin = {
  rules: fromEntries([
    [
      moduleIdentifierNamingConvention.ruleName,
      moduleIdentifierNamingConvention.ruleValue,
    ],
  ]),
};

export { localPlugin };
