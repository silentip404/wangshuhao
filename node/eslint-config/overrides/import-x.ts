import { map } from 'remeda';

import { importXScopedFiles } from '#node/eslint-config/setups/import-x.ts';
import { getAliasGlobs, getAliasRegexs } from '#node/utilities/alias.ts';
import { GLOB_ONE_LEVEL_FILES } from '#node/utilities/globs.ts';
import { getExistingDependencies } from '#node/utilities/package.ts';

import { defineScopedConfig } from '../utilities/config.ts';

const DOUBLE_STAR_END_REGEX = /\*\*$/gv;

const aliasGlobs = getAliasGlobs();
const aliasRegexs = getAliasRegexs();
const existingDependencies = await getExistingDependencies();
const importXOverrides = defineScopedConfig(importXScopedFiles, [
  {
    name: 'import-x:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      'no-duplicate-imports': 'off',
    },
  },
  {
    name: 'import-x:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * 类型导入标记位置统一
       *
       * @remarks
       * - 顶层类型导入语法便于 Node.js type stripping 完全跳过纯类型包的解析
       */
      'import-x/consistent-type-specifier-style': ['warn', 'prefer-top-level'],

      /**
       * 动态导入代码块命名规范
       *
       * @remarks
       * - 该规则主要针对 Webpack 特定注释语法，与本项目的工具链无关
       */
      'import-x/dynamic-import-chunkname': 'off',

      /**
       * 导出语句位置要求
       *
       * @remarks
       * - 标准化模块布局，确保依赖声明先行，提升整体架构清晰度
       * - 符合现代 ESM 模块化实践，便于大型项目维护和团队协作
       */
      'import-x/exports-last': 'warn',

      /**
       * 导入语句文件扩展名检查
       *
       * @remarks
       * - 明确的扩展名使模块解析更透明，便于理解项目结构和依赖关系
       * - 提高代码可移植性，减少构建工具和运行时环境的差异
       */
      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          checkTypeImports: true,
          fix: true,
        },
      ],

      /**
       * Import 语句位置规范
       *
       * @remarks
       * - 统一的导入位置便于快速了解模块依赖关系，提升代码可维护性
       */
      'import-x/first': 'error',

      /**
       * 导出语句集中管理
       *
       * @remarks
       * - 统一的导出位置为模块建立清晰的对外接口视图,符合 API 优先的设计理念
       * - 集中式导出便于快速定位模块的公共接口,降低维护成本
       */
      'import-x/group-exports': 'warn',

      /**
       * 模块依赖数量控制
       *
       * @remarks
       * - 过多的依赖关系通常表明模块承担了过多职责，违反单一职责原则
       * - 限制依赖数量促使开发者进行合理的模块拆分和架构设计
       * - 降低模块耦合度，提升代码的可测试性和可维护性
       * - 排除类型导入的限制，避免对 TypeScript 类型系统的正常使用造成干扰
       */
      'import-x/max-dependencies': [
        'warn',
        {
          max: 16,
          ignoreTypeImports: true,
        },
      ],

      /**
       * 导入语句后空行处理
       *
       * @remarks
       * - 在导入块和业务代码之间保持视觉分隔，提高代码可读性
       * - 明确区分模块依赖声明和实际业务逻辑，便于代码审查和理解
       */
      'import-x/newline-after-import': 'warn',

      /**
       * 循环依赖检测
       *
       * @remarks
       * - 循环依赖是公认的架构反模式，会导致模块初始化顺序不确定和运行时错误
       * - 及早发现循环依赖有助于保持清晰的模块依赖关系，提升代码架构质量
       * - TypeScript 类型系统无法完全避免运行时的循环依赖问题
       */
      'import-x/no-cycle': [
        'error',
        {
          maxDepth: Infinity,
          ignoreExternal: true,
        },
      ],

      /**
       * 禁止使用默认导出
       *
       * @remarks
       * - 一定程度上避免导入时随意命名导致的团队协作混乱和代码理解困难
       * - 命名导出提供更好的 IDE 支持（自动补全、重命名重构）和代码可追溯性
       */
      'import-x/no-default-export': 'warn',

      /**
       * 重复导入检查
       *
       * @remarks
       * - 合并来自同一模块的多个导入语句，提高代码整洁度和可维护性
       */
      'import-x/no-duplicates': [
        'warn',
        {
          'prefer-inline': false,
        },
      ],

      /**
       * 模块内部路径导入控制
       *
       * @remarks
       * - 建立清晰的模块边界和依赖关系
       * - 降低模块间耦合度，提升代码重构的安全性和可维护性
       * - 通过白名单机制平衡架构约束与工程实用性
       */
      'import-x/no-internal-modules': [
        'warn',
        {
          allow: [
            // 重要说明：
            //
            // 此选项仅接受 glob 字符串，内部使用 makeRe 创建正则表达式后匹配
            // 并且不支持外部传入 { nocomment: true } 参数，因此 # 号需要转义

            // 允许导入别名路径中的浅层文件
            ...map(aliasGlobs, (glob) =>
              glob
                .replaceAll(DOUBLE_STAR_END_REGEX, '*')
                .replaceAll('#', String.raw`\#`),
            ),

            // 允许导入一层目录下的所有文件
            GLOB_ONE_LEVEL_FILES,

            // 允许导入第三方依赖的内部模块
            ...map(existingDependencies, (dependency) => `${dependency}/**`),
          ],
        },
      ],

      /**
       * 禁止将默认导出作为命名导入
       *
       * @remarks
       * - 保持默认导入风格一致，避免混淆命名导入和默认导入
       */
      'import-x/no-named-default': 'warn',

      /**
       * 禁止使用命名导出
       *
       * @remarks
       * - 已启用 import-x/no-default-export 鼓励命名导出，再启用此规则会导致冲突
       */
      'import-x/no-named-export': 'off',

      /**
       * 命名空间导入使用约束
       *
       * @remarks
       * - 命名导入使代码依赖关系更加明确，便于静态分析工具进行 tree-shaking 优化
       * - 显式导入提升代码可读性，避免命名空间对象的过度使用，降低模块耦合度
       */
      'import-x/no-namespace': 'warn',

      /**
       * Node.js 内置模块使用检查
       *
       * @remarks
       * - 默认禁止使用 Node.js 内置模块，确保基础代码的跨平台兼容性和环境无关性
       * - 外部通过显式的文件匹配来放开限制，使项目边界清晰、职责分明
       */
      'import-x/no-nodejs-modules': 'error',

      /**
       * 禁止相对路径导入父目录模块
       *
       * @remarks
       * - 强制树状依赖结构，避免复杂图状导入关系，提升整体架构稳定性
       * - 推动使用路径别名机制，强化模块边界清晰度，便于大型项目扩展
       */
      'import-x/no-relative-parent-imports': [
        'warn',
        {
          ignore: [
            // 重要说明：
            //
            // 此选项仅接受正则字符串，内部使用 new RegExp 匹配

            // 允许导入别名路径
            ...map(aliasRegexs, (regex) => regex.source),

            // 专门设计用于被多个子模块复用的辅助函数
            String.raw`^\.\./utilities\.ts$`,
            String.raw`^\.\./utilities/.*$`,
          ],
        },
      ],

      /**
       * 未分配导入检查
       *
       * @remarks
       * - 明确标记允许的副作用导入模式，提高代码可维护性和可理解性
       * - 避免误报项目中合理的副作用导入，同时防止无意义的导入语句
       */
      'import-x/no-unassigned-import': [
        'error',
        {
          allow: ['**/*.css'],
        },
      ],

      /**
       * 导入路径简化
       *
       * @remarks
       * - 冗余路径段（如 `..` 重复、双斜杠）会降低代码可读性，增加路径理解成本
       */
      'import-x/no-useless-path-segments': 'warn',

      /**
       * 单一导出时使用默认导出
       *
       * @remarks
       * - 已启用 import-x/no-default-export 鼓励命名导出，再启用此规则会导致冲突
       */
      'import-x/prefer-default-export': 'off',

      /**
       * 模块语法歧义检查
       *
       * @remarks
       * - 在明确的 ESM 环境中，此规则带来的价值有限但会增加不必要的约束
       */
      'import-x/unambiguous': 'off',
    },
  },
]);

export { importXOverrides };
