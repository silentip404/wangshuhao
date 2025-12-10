import { forEachObj, isEmptyish, isTruthy, mapToObj } from 'remeda';

import type { RulesConfig, Severity } from '@eslint/core';
import type { Config } from 'eslint/config';

type Plugins = NonNullable<Config['plugins']>;

const createRules = (ruleNames: string[], severity: Severity): RulesConfig =>
  mapToObj(ruleNames, (ruleName) => [ruleName, severity]);

const collectRuleNames = (plugins: Plugins): string[] => {
  const ruleNames = new Set<string>();

  forEachObj(plugins, (pluginValue, pluginName) => {
    if (isEmptyish(pluginValue)) {
      return;
    }

    const { rules } = pluginValue;

    if (isEmptyish(rules)) {
      return;
    }

    forEachObj(rules, (ruleValue, ruleName) => {
      if (isTruthy(ruleValue.meta?.deprecated)) {
        return;
      }

      ruleNames.add(`${pluginName}/${ruleName}`);
    });
  });

  return Array.from(ruleNames);
};

export { createRules, collectRuleNames };
