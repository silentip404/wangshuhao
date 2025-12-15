import * as plugin from 'eslint-plugin-regexp';
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
    rules: createDisabledBuiltinExtendedRules({ regexp: plugin }),
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
       * 正则表达式 Unicode Sets 标志使用
       *
       * @reason
       * - v 标志是 ES2024 特性，与当前项目的 TypeScript target (ES2017) 不兼容
       * - 避免引入需要新运行时环境或 polyfill 的语法特性，保持与目标环境的稳定兼容性
       */
      'regexp/require-unicode-sets-regexp': 'off',
    },
  },
]);

export { regexpOverrides };
