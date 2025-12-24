import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from 'eslint/config';

import { defineConfigWithAuditSettings } from '../utils/index.ts';

const jsoncOverrides = defineConfig([
  {
    name: 'jsonc:conflicting-rules',
    extends: defineConfigWithAuditSettings(
      jsoncPlugin.configs['flat/prettier'],
      {
        /**
         * 本意是为了仅关闭可能与 Prettier 冲突的 jsonc 规则
         * 但在 configs['flat/prettier'] 中存在 jsonc 插件定义
         * 因此在运行规则审查时，应明确跳过为此配置前置追加全部规则
         */
        shouldPrependAllRules: false,
      },
    ),
  },
  {
    name: 'jsonc:overrides',
    // @perfectionist-sort-objects
    rules: {
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
      /**
       * JSON 数组值排序检查
       *
       * @reason
       * - 提倡根据上下文语义手动管理数组顺序
       */
      'jsonc/sort-array-values': 'off',
      /**
       * JSON 对象键排序
       *
       * @reason
       * - 默认关闭，避免对所有 JSON 文件强制排序造成不必要的约束
       * - 对于需要排序的特定 JSON 文件应在项目的 ESLint 配置中针对性地启用
       */
      'jsonc/sort-keys': 'off',
    },
  },
]);

export { jsoncOverrides };
