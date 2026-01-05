import prettierConfig from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import { omitBy } from 'remeda';

const prettierOverrides = defineConfig([
  {
    name: 'prettier:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      /**
       * 移除官方 prettier 冲突规则中被标记为 0 的规则
       *
       * @reason 这些被标记为 0 而不是 'off' 的规则在适当配置下可以与 Prettier 配合使用
       *
       * @see https://github.com/prettier/eslint-config-prettier/blob/main/index.js
       */
      ...omitBy(prettierConfig.rules, (ruleValue) => ruleValue === 0),

      // 其他冲突规则
      '@stylistic/max-len': 'off',
    },
  },
]);

export { prettierOverrides };
