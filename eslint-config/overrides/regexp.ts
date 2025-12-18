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
       * - Unicode 标志 (u) 确保正则表达式正确处理 Unicode 字符（如 emoji、多字节字符），避免字符边界判断错误
       * - 启用 Unicode 模式可激活更严格的语法检查，在开发阶段提前发现正则表达式错误
       * - 现代 JavaScript 应用普遍需要处理国际化内容，统一使用 u 标志是面向未来的最佳实践
       */
      'regexp/require-unicode-regexp': 'warn',
      /**
       * 强制使用 `v` 标志
       *
       * @reason
       * - `v` 标志确保正则表达式用于 Unicode 字符集，支持国际化，适应多语言环境。
       * - 将此标志应用于使用 `u` 标志的正则表达式，可以确保对 Unicode 字符集的支持。
       * - 增强代码可读性和可维护性，避免因为正则表达式不支持国际字符集而带来的潜在错误。
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
