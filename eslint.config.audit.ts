import { styleText } from 'node:util';

import eslintJs from '@eslint/js';
import { concat, isEmptyish, map, merge } from 'remeda';

import { printMessage } from '#lib/utilities/print-message.ts';
import { collectPluginNames } from '#node/eslint-config/utilities/plugin.ts';
import {
  collectRuleNames,
  createRules,
} from '#node/eslint-config/utilities/rule.ts';
import { resolveLocalSettings } from '#node/eslint-config/utilities/setting.ts';
import { normalizeSeverity } from '#node/eslint-config/utilities/severity.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import eslintConfig from './eslint.config.ts';

const AUDIT_SEVERITY = 'warn';

const auditConfig = concat(
  normalizeSeverity(
    [
      {
        name: 'eslint:audit/all-builtin-rules',
        files: [...GLOBS_COMBINED_JS],
        rules: eslintJs.configs.all.rules,
      },
    ],
    AUDIT_SEVERITY,
  ),
  map(eslintConfig, (config) => {
    const { shouldPrependAllRules } = resolveLocalSettings(config);

    if (shouldPrependAllRules === false) {
      return config;
    }

    const { plugins } = config;

    if (isEmptyish(plugins)) {
      return config;
    }

    const ruleNames = collectRuleNames(plugins);
    const rules = createRules(ruleNames, AUDIT_SEVERITY);

    return {
      ...config,
      rules: merge(rules, config.rules),
    };
  }),
);

if (process.env['IS_KNIP_RUNNING'] !== 'true') {
  printMessage({
    title: 'ESLint 配置审查提示',
    description: [
      '已开启以下插件的全部规则对项目代码运行 ESLint 检查',
      '',
      `  - js${styleText('gray', '(@eslint/js)')}`,
      ...map(collectPluginNames(auditConfig), (name) => `  - ${name}`),
      '',
      '请结合问题统计结果和项目实际需求，明确开启或关闭尚未配置的规则',
      '',
      styleText('gray', '正在运行 ESLint 检查...'),
      '',
    ],
  });
}

export default auditConfig;
