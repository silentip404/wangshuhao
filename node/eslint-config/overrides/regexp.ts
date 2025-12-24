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
       * 强制正则表达式使用 Unicode 标志
       *
       * @reason
       * - 此正则表达式标志仅在面向 es2024 或更高版本时可用，需要单独在 node 环境下开启此规则
       */
      'regexp/require-unicode-regexp': 'off',
      /**
       * 强制使用 `v` 标志
       *
       * @reason
       * - 此正则表达式标志仅在面向 es2024 或更高版本时可用，需要单独在 node 环境下开启此规则
       */
      'regexp/require-unicode-sets-regexp': 'off',
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
