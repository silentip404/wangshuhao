import {
  clone,
  isEmptyish,
  forEach,
  forEachObj,
  merge,
  concat,
  isString,
  isArray,
  isNumber,
} from 'remeda';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfig from './eslint.config';
import { print } from './scripts/utils/print';

const allPluginNames = new Set<string>();

const allCoreRulesConfig = clone(
  defineConfig({
    name: 'eslint:validate/all-core-rules',
    files: ['**/*.d.ts', '**/*.js', '**/*.ts', '**/*.tsx'],
    rules: js.configs.all.rules,
  }),
);
// 修改全部核心规则为 warn 级别
forEach(allCoreRulesConfig, (config) => {
  const { rules } = config;
  if (isEmptyish(rules)) return;

  forEachObj(rules, (ruleValue, ruleName) => {
    if (isString(rules[ruleName]) || isNumber(rules[ruleName])) {
      rules[ruleName] = 'warn';
    } else if (isArray(rules[ruleName])) {
      rules[ruleName][0] = 'warn';
    } else {
      throw new Error(`核心规则 ${ruleName} 的值类型错误，请优化 ${import.meta.filename} 脚本`);
    }
  });
});

const eslintConfigWithAllRules = concat(allCoreRulesConfig, clone(eslintConfig));
// 追加插件的全部规则
forEach(eslintConfigWithAllRules, (config) => {
  const { plugins } = config;
  if (isEmptyish(plugins)) return;

  const allPluginRules: Record<string, 'warn'> = {};

  forEachObj(plugins, (pluginConfig, pluginName) => {
    if (pluginName === 'js') return;

    allPluginNames.add(pluginName);

    const { rules } = pluginConfig;
    if (isEmptyish(rules)) return;

    forEachObj(rules, (ruleValue, ruleName) => {
      allPluginRules[`${pluginName}/${ruleName}`] = 'warn';
    });
  });

  config.rules = merge(allPluginRules, config.rules);
});
print({
  title: '正在使用 ESLint 全部核心规则和以下插件的全部规则进行配置验证：',
  description: Array.from(allPluginNames).map((name) => ` - ${name}`),
});

// 检查配置的 name 属性缺失
forEach(eslintConfigWithAllRules, (config, index) => {
  if (!config.name) {
    print({
      type: 'warn',
      title: `配置[${index}]的 name 属性缺失`,
      description: '您可以运行 pnpm eslint:validate:inspector 命令辅助检查配置的完整性',
    });
  }
});

export default eslintConfigWithAllRules;
