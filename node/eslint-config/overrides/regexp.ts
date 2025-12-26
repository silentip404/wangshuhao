import { defineConfig } from 'eslint/config';

const regexpOverrides = defineConfig([
  {
    name: 'regexp:conflicting-rules',
    // @perfectionist-sort-objects
    rules: {
      '@typescript-eslint/prefer-regexp-exec': 'off',
      'require-unicode-regexp': 'off',
    },
  },
  {
    name: 'regexp:overrides',
    // @perfectionist-sort-objects
    rules: {
      /**
       * 禁止超线性移动的量词使用
       *
       * @reason
       * - 防止正则表达式在处理输入字符串时出现超线性最坏情况的运行时，降低安全风险。
       * - 避免 attackers 通过特定输入字符串使正则表达式变得极为低效，从而导致拒绝服务攻击（ReDoS）。
       * - 提高代码的可维护性和可读性，促使开发者意识到正则表达式的复杂性与性能影响。
       */
      'regexp/no-super-linear-move': 'error',
      /**
       * 强制使用命名捕获组
       *
       * @reason
       * - 使用命名捕获组可以提高正则表达式的可读性和可维护性，便于理解捕获的内容。
       * - 明确的捕获组名称有助于在调试时快速定位和识别正则表达式的功能。
       * - 避免使用无名捕获组可能导致的混淆，特别是在正则表达式较复杂时。
       */
      'regexp/prefer-named-capture-group': 'warn',
      /**
       * 正则表达式执行方法检查
       *
       * @reason
       * - 统一正则表达式执行方式，提升代码可读性和可维护性
       * - RegExp.exec() 性能略优于 String.match()（非全局模式下）
       * - 明确区分单次匹配和全局匹配的语义，避免 API 混用
       */
      'regexp/prefer-regexp-exec': 'warn',
      /**
       * 强制使用 Unicode 正则表达式标志
       *
       * @reason
       * - 该规则确保正则表达式能够正确处理 Unicode 字符，避免潜在的匹配错误。
       * - 使用 `u` 标志提升正则表达式对不同语言字符和符号的兼容性，符合现代编码标准。
       * - 此规则支持自动修复，减少手动维护成本，提升代码一致性。
       */
      'regexp/require-unicode-regexp': 'warn',
      /**
       * 强制使用 Unicode 集支持的正则表达式标志
       *
       * @reason
       * - 该规则进一步确保在正则表达式中使用 `v` 标志，以便处理字符集的特殊情况。
       * - 确保正则表达式能正确匹配 Unicode 字符集中的不同变体，提升应用程序的国际化能力。
       * - 此规则有助于开发者避免潜在的错误匹配，提升代码质量。
       */
      'regexp/require-unicode-sets-regexp': 'warn',
      /**
       * 强制字符类中的元素顺序
       *
       * @reason
       * - 确保字符类元素顺序一致性，提高正则表达式可读性和可维护性
       * - 促进团队协作，减少不同开发者编写风格带来的冲突
       */
      'regexp/sort-character-class-elements': 'warn',
    },
  },
]);

export { regexpOverrides };
