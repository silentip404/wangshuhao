import prettierConfig from 'eslint-config-prettier/flat';
import { omitBy } from 'remeda';

import { GLOB_ALL } from '#node/utilities/globs.ts';

import { defineScopedConfig } from '../utilities/config.ts';

const prettierOverrides = defineScopedConfig({ files: [GLOB_ALL] }, [
  {
    name: 'prettier:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      /**
       * 移除官方 prettier 冲突规则中被标记为 0 的规则
       *
       * @remarks
       * 这些被标记为 0 而不是 'off' 的规则在适当配置下可以与 Prettier 配合使用
       *
       * @see https://github.com/prettier/eslint-config-prettier/blob/main/index.js
       */
      ...omitBy(prettierConfig.rules, (ruleValue) => ruleValue === 0),

      '@stylistic/exp-list-style': 'off',
      '@stylistic/max-len': 'off',
      'jsdoc/tag-lines': 'off',
      'jsonc/array-bracket-newline': 'off',
      'jsonc/array-bracket-spacing': 'off',
      'jsonc/array-element-newline': 'off',
      'jsonc/comma-dangle': 'off',
      'jsonc/comma-style': 'off',
      'jsonc/indent': 'off',
      'jsonc/key-spacing': 'off',
      'jsonc/no-floating-decimal': 'off',
      'jsonc/object-curly-newline': 'off',
      'jsonc/object-curly-spacing': 'off',
      'jsonc/object-property-newline': 'off',
      'jsonc/quote-props': 'off',
      'jsonc/quotes': 'off',
      'jsonc/space-unary-ops': 'off',
    },
  },
]);

export { prettierOverrides };
