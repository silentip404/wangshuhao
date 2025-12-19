import { type Linter } from 'eslint';
import { type Config } from 'eslint/config';
import { forEachObj, isEmptyish, isTruthy, mapToObj } from 'remeda';

type Plugins = NonNullable<Config['plugins']>;

const createRules = (
  ruleNames: string[],
  severity: Linter.RuleSeverity,
): Linter.RulesRecord =>
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

export { collectRuleNames, createRules };
