import { allJsoncScopedFiles } from '#node/eslint-config/setups/jsonc.ts';

import { defineScopedConfig } from '../utilities/config.ts';

const jsoncOverrides = defineScopedConfig(allJsoncScopedFiles, [
  {
    name: 'jsonc:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * JSON 文件自动规则应用
       *
       * @remarks
       * - 避免自动规则应用可能引入的意外行为
       * - 显式配置规则以确保 linting 行为的精确控制和可预测性
       */
      'jsonc/auto': 'off',

      /**
       * JSON 属性键命名规范
       *
       * @remarks
       * - JSON 文件承载多种场景，强制统一命名会破坏生态兼容性
       */
      'jsonc/key-name-casing': 'off',

      /**
       * 对象花括号换行一致性
       *
       * @remarks
       * - 统一的换行风格确保所有对象字面量在花括号后换行，提升代码视觉结构的一致性
       * - 便于 Git diff 时逐行追踪属性变更，减少合并冲突
       */
      'jsonc/object-curly-newline': [
        'warn',
        {
          minProperties: 1,
          multiline: true,
        },
      ],

      /**
       * JSON 数组值排序检查
       *
       * @remarks
       * - 提倡根据上下文语义手动管理数组顺序
       */
      'jsonc/sort-array-values': 'off',

      /**
       * JSON 对象键排序
       *
       * @remarks
       * - 默认关闭，避免对所有 JSON 文件强制排序造成不必要的约束
       * - 对于需要排序的特定 JSON 文件应在项目的 ESLint 配置中针对性地启用
       */
      'jsonc/sort-keys': 'off',
    },
  },
]);

export { jsoncOverrides };
