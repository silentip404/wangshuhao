import { eslintCommentsScopedFiles } from '#node/eslint-config/setups/eslint-comments.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';

const eslintCommentsOverrides = defineScopedConfig(eslintCommentsScopedFiles, [
  {
    name: 'eslint-comments:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * ESLint 指令注释使用控制
       *
       * @remarks
       * - 限制 ESLint 指令注释的使用范围，将规则例外的影响最小化
       * - 防止大范围规则禁用导致代码质量基线失控
       * - 促使开发者优先考虑修复问题而非绕过规则检查
       */
      '@eslint-community/eslint-comments/no-use': [
        'error',
        {
          allow: ['eslint-disable-next-line'],
        },
      ],

      /**
       * ESLint 指令注释描述要求
       *
       * @remarks
       * - 强制为禁用规则的代码添加上下文说明，避免团队协作中的信息黑洞
       */
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },
]);

export { eslintCommentsOverrides };
