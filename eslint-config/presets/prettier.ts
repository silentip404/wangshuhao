import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import { omitBy } from 'remeda';

const prettierPresets = defineConfig([
  {
    ...prettierConfig,
    /**
     * 移除 prettier 配置中被标记为 0 的规则
     *
     * @reason 这些被标记为 0 而不是 'off' 的规则在某些情况下可以使用
     *
     * @see https://github.com/prettier/eslint-config-prettier/blob/main/index.js
     */
    rules: omitBy(prettierConfig.rules, (ruleValue) => ruleValue === 0),
  },
]);

export { prettierPresets };
