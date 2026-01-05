import type { TSESLint } from '@typescript-eslint/utils';
import { fromEntries } from 'remeda';

import {
  moduleIdentifierNamingConvention,
  paddingLineBeforeProcessExit,
} from './rules/index.ts';

const localPlugin: TSESLint.FlatConfig.Plugin = {
  rules: fromEntries([
    [
      moduleIdentifierNamingConvention.ruleName,
      moduleIdentifierNamingConvention.ruleValue,
    ],
    [
      paddingLineBeforeProcessExit.ruleName,
      paddingLineBeforeProcessExit.ruleValue,
    ],
  ]),
};

export { localPlugin };
