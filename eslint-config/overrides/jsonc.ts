import { defineConfig } from 'eslint/config';
import eslintPluginJsonc from 'eslint-plugin-jsonc';

import { defineAuditSettings } from '../utils/audit.ts';

const jsoncOverrides = defineConfig([
  {
    name: 'jsonc:conflict-with-prettier',
    extends: eslintPluginJsonc.configs['flat/prettier'],
    settings: defineAuditSettings({ shouldPrependAllRules: false }),
  },
  {
    name: 'jsonc:jsonc-overrides',
    rules: {
      /**
       * JSON 数组值排序检查
       *
       * @reason
       * - 允许开发者根据上下文语义手动管理数组顺序，避免强制排序带来的意外行为
       */
      'jsonc/sort-array-values': 'off',
      /**
       * JSON 文件自动规则应用
       *
       * @reason
       * - 避免自动规则应用可能引入的意外行为
       * - 显式配置规则以确保 linting 行为的精确控制和可预测性
       */
      'jsonc/auto': 'off',
    },
  },
]);

export { jsoncOverrides };
