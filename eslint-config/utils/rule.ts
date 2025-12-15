import { type RulesConfig, type Severity } from '@eslint/core';
import eslintJs from '@eslint/js';
import { type Config } from 'eslint/config';
import {
  forEachObj,
  intersection,
  isEmptyish,
  isTruthy,
  keys,
  mapToObj,
} from 'remeda';

type Plugins = NonNullable<Config['plugins']>;

const createRules = (ruleNames: string[], severity: Severity): RulesConfig =>
  mapToObj(ruleNames, (ruleName) => [ruleName, severity]);

interface CollectRuleNamesOptions {
  shouldWithPluginName?: boolean;
}
const collectRuleNames = (
  plugins: Plugins,
  options: CollectRuleNamesOptions = {},
): string[] => {
  const { shouldWithPluginName = true } = options;

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

      ruleNames.add(
        shouldWithPluginName ? `${pluginName}/${ruleName}` : ruleName,
      );
    });
  });

  return Array.from(ruleNames);
};

const createDisabledBuiltinExtendedRules = (
  plugins: Plugins,
): Record<string, 'off'> => {
  const disabledNames = intersection(
    keys(eslintJs.configs.all.rules),
    collectRuleNames(plugins, { shouldWithPluginName: false }),
  );

  return mapToObj(disabledNames, (name) => [name, 'off']);
};

export { collectRuleNames, createDisabledBuiltinExtendedRules, createRules };
