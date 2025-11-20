import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { omitBy } from 'remeda';

const prettierPreset = defineConfig([
  {
    ...eslintConfigPrettier,
    /**
     * 排除值为 0 的特殊规则
     *
     * @reason
     * - 在 eslint-config-prettier 中被标记为 0 而不是 "off" 的规则在某些场景下具有实际价值且不会与 Prettier 产生冲突
     *
     * @see https://github.com/prettier/eslint-config-prettier/blob/main/index.js
     * @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#special-rules
     */
    rules: omitBy(eslintConfigPrettier.rules, (ruleValue) => ruleValue === 0),
  },
]);

export { prettierPreset };
