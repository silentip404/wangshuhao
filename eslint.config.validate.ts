import js from '@eslint/js';
import { concat, isEmptyish, map, merge } from 'remeda';

import { collectPluginNamesByConfigs } from './eslint-config/utils/plugin.ts';
import {
  collectRuleNamesByPlugins,
  createRulesByRuleNames,
} from './eslint-config/utils/rule.ts';
import { normalizeSeverity } from './eslint-config/utils/severity.ts';
import eslintConfig from './eslint.config.ts';
import { GLOB_JS_DERIVED } from './utils/file-patterns.ts';
import { printMessage } from './utils/print-message.ts';

const SEVERITY = 'warn';

const eslintConfigWithAllRules = map(eslintConfig, (config) => {
  const { plugins } = config;

  if (isEmptyish(plugins)) {
    return config;
  }

  const ruleNames = collectRuleNamesByPlugins(plugins);
  const rules = createRulesByRuleNames(ruleNames, SEVERITY);

  return { ...config, rules: merge(rules, config.rules) };
});

const validateConfigWithAllRules = concat(
  normalizeSeverity(
    [
      {
        name: 'eslint:validate/all-builtin-rules',
        files: [...GLOB_JS_DERIVED],
        rules: js.configs.all.rules,
      },
    ],
    SEVERITY,
  ),
  eslintConfigWithAllRules,
);

const allPluginNames = collectPluginNamesByConfigs(validateConfigWithAllRules);
printMessage({
  title: '正在使用 ESLint 全部内置规则和以下插件的全部规则进行配置验证：',
  description: [...allPluginNames.map((name) => `- ${name}`), ''],
});

export default validateConfigWithAllRules;
