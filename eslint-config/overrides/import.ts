import { defineConfig } from 'eslint/config';
import { map } from 'remeda';

import { ensureDependenciesInPackage, GLOB_ALIAS } from '#node/utils';

const importOverrides = defineConfig([
  {
    name: 'import:related-non-import-overrides',
    rules: {
      /**
       * 重复导入检查
       *
       * @reason
       * - import/no-duplicates 提供更强大的功能，包括自动合并导入和更好的 TypeScript 支持
       */
      'no-duplicate-imports': 'off',
    },
  },
  {
    name: 'import:import-overrides',
    rules: {
      /**
       * Node.js 内置模块协议前缀检查
       *
       * @reason
       * - 使用 node: 协议明确区分内置模块和第三方包，避免命名冲突和误导
       * - ESM 环境中 node: 协议是官方推荐的最佳实践，提高代码可读性和可维护性
       */
      'import/enforce-node-protocol-usage': ['warn', 'always'],
      /**
       * 禁止使用默认导出
       *
       * @reason
       * - 一定程度上避免导入时随意命名导致的团队协作混乱和代码理解困难
       * - 命名导出提供更好的 IDE 支持（自动补全、重命名重构）和代码可追溯性
       */
      'import/no-default-export': 'warn',
      /**
       * 导入语句后空行处理
       *
       * @reason
       * - 在导入块和业务代码之间保持视觉分隔，提高代码可读性
       * - 明确区分模块依赖声明和实际业务逻辑，便于代码审查和理解
       */
      'import/newline-after-import': 'warn',
      /**
       * ESM 模块明确性检查
       *
       * @reason
       * - 该规则主要用于混合 script/module 环境，在纯 ESM 项目中无实际价值
       * - 避免强制在副作用导入文件中添加无意义的 export {}（降低代码可读性）
       */
      'import/unambiguous': 'off',
      /**
       * 重复导入检查
       *
       * @reason
       * - 合并来自同一模块的多个导入语句，提高代码整洁度和可维护性
       */
      'import/no-duplicates': ['warn', { 'prefer-inline': true }],
      /**
       * 禁止使用命名导出
       *
       * @reason
       * - 已启用 import/no-default-export 鼓励命名导出，再启用此规则会导致冲突
       */
      'import/no-named-export': 'off',
      /**
       * 单一导出时使用默认导出
       *
       * @reason
       * - 已启用 import/no-default-export 鼓励命名导出，再启用此规则会导致冲突
       */
      'import/prefer-default-export': 'off',
      /**
       * 导入语句文件扩展名检查
       *
       * @reason
       * - 明确的扩展名使模块解析更透明，便于理解项目结构和依赖关系
       * - 提高代码可移植性，减少构建工具和运行时环境的差异
       */
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          checkTypeImports: true,
          pathGroupOverrides: map(GLOB_ALIAS, (alias) => ({
            // 忽略别名后缀名
            pattern: alias,
            action: 'ignore',
          })),
        },
      ],
      /**
       * 未分配导入检查
       *
       * @reason
       * - 明确标记允许的副作用导入模式，提高代码可维护性和可理解性
       * - 避免误报项目中合理的副作用导入，同时防止无意义的导入语句
       */
      'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
      /**
       * 类型导入标记位置统一
       *
       * @reason
       * - 内联标记可以减少导入语句数量，避免重复的模块路径声明
       */
      'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
      /**
       * Node.js 内置模块使用检查
       *
       * @reason
       * - 默认禁止使用 Node.js 内置模块，确保基础代码的跨平台兼容性和环境无关性
       * - 外部通过显式的文件匹配来放开限制，使项目边界清晰、职责分明
       */
      'import/no-nodejs-modules': 'error',
      /**
       * 导入模块路径解析检查
       *
       * @reason
       * - 强化模块依赖关系的完整性和准确性，提升整体代码可靠性
       * - 在开发阶段确保所有导入路径在文件系统中可被正确解析，提前防范模块加载失败
       */
      'import/no-unresolved': 'error',
      /**
       * 禁止相对路径导入父目录模块
       *
       * @reason
       * - 强制树状依赖结构，避免复杂图状导入关系，提升整体架构稳定性
       * - 推动使用路径别名机制，强化模块边界清晰度，便于大型项目扩展
       */
      'import/no-relative-parent-imports': [
        'warn',
        {
          ignore: [
            // 允许别名导入
            ...GLOB_ALIAS,

            // 允许一些特殊文件导入
            '../utils/index.ts',
            '../local-plugin/index.ts',
          ],
        },
      ],
      /**
       * 导出语句位置要求
       *
       * @reason
       * - 标准化模块布局，确保依赖声明先行，提升整体架构清晰度
       * - 符合现代 ESM 模块化实践，便于大型项目维护和团队协作
       */
      'import/exports-last': 'warn',
      /**
       * 模块依赖数量控制
       *
       * @reason
       * - 过多的依赖关系通常表明模块承担了过多职责，违反单一职责原则
       * - 限制依赖数量促使开发者进行合理的模块拆分和架构设计
       * - 降低模块耦合度，提升代码的可测试性和可维护性
       * - 排除类型导入的限制，避免对 TypeScript 类型系统的正常使用造成干扰
       */
      'import/max-dependencies': ['warn', { max: 16, ignoreTypeImports: true }],
      /**
       * 循环依赖检测
       *
       * @reason
       * - 循环依赖是公认的架构反模式，会导致模块初始化顺序不确定和运行时错误
       * - 及早发现循环依赖有助于保持清晰的模块依赖关系，提升代码架构质量
       * - TypeScript 类型系统无法完全避免运行时的循环依赖问题
       */
      'import/no-cycle': [
        'error',
        { maxDepth: Infinity, ignoreExternal: true },
      ],
      /**
       * import 语句位置规范
       *
       * @reason
       * - 统一的导入位置便于快速了解模块依赖关系，提升代码可维护性
       */
      'import/first': 'error',
      /**
       * 导出语句集中管理
       *
       * @reason
       * - 统一的导出位置为模块建立清晰的对外接口视图,符合 API 优先的设计理念
       * - 集中式导出便于快速定位模块的公共接口,降低维护成本
       */
      'import/group-exports': 'warn',
      /**
       * 模块内部路径导入控制
       *
       * @reason
       * - 强制通过公开 API 访问模块，建立清晰的模块边界和依赖关系
       * - 降低模块间耦合度，提升代码重构的安全性和可维护性
       * - 通过白名单机制平衡架构约束与工程实用性
       */
      'import/no-internal-modules': [
        'warn',
        {
          allow: [
            // 允许导入别名路径
            ...map(GLOB_ALIAS, (alias) => alias.replace('#', '\\#')),

            // 允许导入一层目录下的 index.ts
            '*/index.ts',

            // 允许导入第三方依赖的特定内部模块
            'next/*',
            'next/font/*',
            'eslint/config',
            'eslint-config-prettier/flat',
            '@typescript-eslint/utils/*',
          ],
        },
      ],
      /**
       * 命名空间导入使用约束
       *
       * @reason
       * - 命名导入使代码依赖关系更加明确，便于静态分析工具进行 tree-shaking 优化
       * - 显式导入提升代码可读性，避免命名空间对象的过度使用，降低模块耦合度
       */
      'import/no-namespace': [
        'warn',
        { ignore: ensureDependenciesInPackage(['eslint-plugin-regexp']) },
      ],
    },
  },
]);

export { importOverrides };
