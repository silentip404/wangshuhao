import { styleText } from 'util';

import eslintJs from '@eslint/js';
import { concat, isEmptyish, map, merge } from 'remeda';

import { printMessage } from '#lib/utils/index.ts';
import {
  collectPluginNames,
  collectRuleNames,
  createRules,
  normalizeSeverity,
  resolveAuditSettings,
} from '#node/eslint-config/index.ts';
import { GLOB_DERIVED_JS } from '#node/utils/index.ts';

import eslintConfig from './eslint.config.ts';

const SEVERITY = 'warn';

const builtinConfigWithAllRules = normalizeSeverity(
  [
    {
      name: 'eslint:audit/all-builtin-rules',
      files: [...GLOB_DERIVED_JS],
      rules: eslintJs.configs.all.rules,
    },
  ],
  SEVERITY,
);

const eslintConfigWithAllRules = map(eslintConfig, (config) => {
  const { shouldPrependAllRules } = resolveAuditSettings(config);

  if (shouldPrependAllRules === false) {
    return config;
  }

  const { plugins } = config;

  if (isEmptyish(plugins)) {
    return config;
  }

  const ruleNames = collectRuleNames(plugins);
  const rules = createRules(ruleNames, SEVERITY);

  return { ...config, rules: merge(rules, config.rules) };
});

const allPluginNames = collectPluginNames(eslintConfigWithAllRules);

if (process.env['IS_KNIP_RUNNING'] !== 'true') {
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
}

export default concat(builtinConfigWithAllRules, eslintConfigWithAllRules);
