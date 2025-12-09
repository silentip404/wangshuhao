import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import {
  concat,
  drop,
  forEach,
  forEachObj,
  isArray,
  isEmptyish,
  isNumber,
  isString,
  isTruthy,
  map,
  mapValues,
  merge,
  pipe,
} from 'remeda';

import eslintConfig from './eslint.config.ts';
import { GLOB_JS_DERIVED } from './utils/file-patterns.ts';
import { printMessage } from './utils/print-message.ts';

const validateAddedRuleSeverity = 'warn' as const;

const allBuiltinRulesConfig = defineConfig({
  name: 'eslint:validate/all-builtin-rules',
  files: [...GLOB_JS_DERIVED],
  rules: mapValues(js.configs.all.rules, (ruleValue, ruleName) => {
    if (isString(ruleValue) || isNumber(ruleValue)) {
      return validateAddedRuleSeverity;
    }

    if (isArray(ruleValue)) {
      return concat([validateAddedRuleSeverity], drop(ruleValue, 1));
    }

    throw new Error(
      `内置规则 ${ruleName} 的值类型错误，请优化 ${import.meta.filename} 脚本`,
    );
  }),
});

const allPluginNames = new Set<string>();
const eslintConfigWithAllRules = pipe(
  allBuiltinRulesConfig,
  concat(eslintConfig),
  map((config) => {
    const { plugins } = config;
    if (isEmptyish(plugins)) {
      return config;
    }

    const allPluginRules: Record<string, typeof validateAddedRuleSeverity> = {};

    forEachObj(plugins, (pluginValue, pluginName) => {
      if (pluginName === 'js') {
        return;
      }

      allPluginNames.add(pluginName);

      const { rules } = pluginValue;
      if (isEmptyish(rules)) {
        return;
      }

      forEachObj(rules, (ruleValue, ruleName) => {
        if (isTruthy(ruleValue.meta?.deprecated)) {
          return;
        }

        allPluginRules[`${pluginName}/${ruleName}`] = validateAddedRuleSeverity;
      });
    });

    return { ...config, rules: merge(allPluginRules, config.rules) };
  }),
);

printMessage({
  title: '正在使用 ESLint 全部内置规则和以下插件的全部规则进行配置验证：',
  description: Array.from(allPluginNames).map((name) => `- ${name}`),
});

// 检查配置的 name 属性缺失
forEach(eslintConfigWithAllRules, (config, index) => {
  if (!isTruthy(config.name)) {
    printMessage({
      type: 'warn',
      title: `配置[${index}]的 name 属性缺失`,
      description:
        '您可以运行 pnpm eslint:validate:inspector 命令辅助检查配置的完整性',
    });
  }
});

export default eslintConfigWithAllRules;
