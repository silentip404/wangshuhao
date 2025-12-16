import * as regexpPlugin from 'eslint-plugin-regexp';
import { defineConfig } from 'eslint/config';

import { createDisabledBuiltinExtendedRules } from '../utils/index.ts';

const regexpOverrides = defineConfig([
  {
    name: 'regexp:disable-extended-builtin-overrides',
    /**
     * 批量关闭被 eslint-plugin-regexp 扩展的内置规则
     *
     * @reason
     * - 避免规则冲突和重复检查
     * - 统一由 regexp/${ruleName} 代替对应的内置规则
     */
    rules: createDisabledBuiltinExtendedRules({ regexp: regexpPlugin }),
  },
  {
    name: 'regexp:regexp-overrides',
    rules: {
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
       * 强制使用命名捕获组
       *
       * @reason
       * - 使用命名捕获组可以提高正则表达式的可读性和可维护性，便于理解捕获的内容。
       * - 明确的捕获组名称有助于在调试时快速定位和识别正则表达式的功能。
       * - 避免使用无名捕获组可能导致的混淆，特别是在正则表达式较复杂时。
       */
      'regexp/prefer-named-capture-group': 'warn',
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
