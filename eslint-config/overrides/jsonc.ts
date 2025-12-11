import { defineConfig } from 'eslint/config';
import eslintPluginJsonc from 'eslint-plugin-jsonc';

import { defineAuditSettings } from '../utils/index.ts';

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
       * - 提倡根据上下文语义手动管理数组顺序
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
      /**
       * JSON 属性键命名规范
       *
       * @reason
       * - JSON 文件承载多种场景，强制统一命名会破坏生态兼容性
       */
      'jsonc/key-name-casing': 'off',
    },
  },
]);

export { jsoncOverrides };
