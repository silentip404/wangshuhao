import { styleText } from 'node:util';

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

const auditConfigWithAllRules = concat(
  normalizeSeverity(
    [
      {
        name: 'eslint:audit/all-builtin-rules',
        files: [...GLOB_JS_DERIVED],
        rules: js.configs.all.rules,
      },
    ],
    SEVERITY,
  ),
  eslintConfigWithAllRules,
);

const allPluginNames = collectPluginNamesByConfigs(auditConfigWithAllRules);
printMessage({
  title: 'ESLint 配置审查提示',
  description: [
    '已开启以下插件的全部规则对项目代码运行 ESLint 检查',
    '',
    `  - js${styleText('gray', '(@eslint/js)')}`,
    ...allPluginNames.map((name) => `  - ${name}`),
    '',
    '请结合问题统计结果和项目实际需求，明确开启或关闭尚未配置的规则',
    '',
    styleText('gray', '正在运行 ESLint 检查...'),
    '',
  ],
});

export default auditConfigWithAllRules;
