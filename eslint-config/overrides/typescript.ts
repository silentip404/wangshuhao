import { defineConfig } from 'eslint/config';
import { join, keys, toUpperCase } from 'remeda';

import { reasons } from '#node/ts-expect-error-reasons.ts';

const typescriptOverrides = defineConfig([
  {
    name: 'typescript:conflicting-rules',
    // @perfectionist-sort-objects
    rules: {
      'camelcase': 'off',
      'consistent-return': 'off',
      'no-magic-numbers': 'off',
    },
  },
  {
    name: 'typescript:overrides',
    // @perfectionist-sort-objects
    rules: {
      /**
       * TypeScript 指令注释检查
       *
       * @reason
       * - 统一管理 @ts-expect-error 使用场景，防止类型忽略滥用破坏类型安全基础
       * - 强制使用 @ts-expect-error 替代 @ts-ignore，确保底层问题修复后能被及时发现
       * - 预定义原因列表提升代码审查效率，便于追踪和清理技术债务
       */
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'minimumDescriptionLength': 3,
          'ts-check': false,
          'ts-expect-error': {
            descriptionFormat: String.raw`^: See reasons\['(${join(keys(reasons), '|')})'\] in ts-expect-error-reasons\.ts$`,
          },
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
      /**
       * return 语句值检查
       *
       * @reason
       * - 推荐使用 TypeScript 的 noImplicitReturns 选项替代此规则
       * - TypeScript 编译器能够进行更精确的控制流分析，因此覆盖范围比此规则更广
       */
      '@typescript-eslint/consistent-return': 'off',
      /**
       * 类型导出一致性检查
       *
       * @reason
       * - 显式类型导出允许打包工具在隔离模块级别优化代码，移除纯类型导出
       * - 统一导出风格提升代码库的可维护性和可读性
       * - 为 Tree-shaking 提供更精确的依赖分析依据
       */
      '@typescript-eslint/consistent-type-exports': [
        'warn',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      /**
       * 类型导入语法风格检查
       *
       * @reason
       * - 明确区分类型导入和值导入，提升代码可读性和构建性能
       */
      '@typescript-eslint/consistent-type-imports': 'warn',
      /**
       * 函数返回类型声明检查
       *
       * @reason
       * - 显式返回类型作为函数的公共契约，提升代码可维护性和团队协作效率
       * - 在大型 TypeScript 项目中显著提升类型检查性能
       * - 强制声明返回类型使开发人员必须先定义函数的外部形状，后实现细节，建立自上而下的设计思维
       * - 为 AI 辅助编程提供明确的类型上下文，提升代码生成质量和准确性
       */
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowIIFEs: true },
      ],
      /**
       * 模块边界类型声明检查
       *
       * @reason
       * - 显式类型标注明确模块边界的输入输出契约，提升代码可维护性和团队协作效率
       * - 在大型 TypeScript 项目中显著提升类型检查性能
       * - 强制模块边界类型标注推动开发者建立清晰的 API 设计思维
       * - 为 AI 辅助编程提供明确的类型上下文，提升代码生成质量和准确性
       */
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      /**
       * 强制使用变量初始化声明
       *
       * @reason
       * - 提高代码清晰度，确保变量在使用之前被明确初始化，避免潜在的未定义行为。
       * - 通过保证变量总是有初始值，减少在不同作用域中出现未初始化变量的错误。
       * - 在复杂逻辑中明确变量的初始状态，有助于增加团队协作的信心和可维护性。
       */
      '@typescript-eslint/init-declarations': 'warn',
      /**
       * 代码标识符命名检查
       *
       * @reason
       * - 统一的命名约定是代码可读性的基石，降低团队成员理解陌生代码的认知成本
       * - 规范化的命名模式使开发过程更加高效，减少因命名风格带来的决策成本
       * - 强制命名规范促使开发者在标识符设计阶段就明确其语义和职责边界
       */
      '@typescript-eslint/naming-convention': [
        'warn',

        // 默认规则
        { format: ['camelCase'], selector: 'default' },

        // 基础规则
        { format: ['camelCase', 'UPPER_CASE'], selector: 'variable' },
        { format: ['camelCase'], selector: 'parameter' },
        { format: ['camelCase', 'PascalCase'], selector: 'function' },
        {
          format: ['camelCase'],
          leadingUnderscore: 'require',
          modifiers: ['private'],
          selector: ['classProperty', 'classMethod'],
        },

        // 类型系统规则
        { format: ['PascalCase'], selector: 'typeLike' },
        { format: ['UPPER_CASE'], selector: 'enumMember' },

        // 导入规则
        { format: ['camelCase', 'PascalCase'], selector: 'import' },

        // 特殊规则
        {
          format: null,
          modifiers: ['requiresQuotes'],
          selector: ['property', 'method'],
        },
        {
          custom: {
            match: true,
            regex: (() => {
              const prefixes = join(
                ['is', 'should', 'has', 'can', 'did', 'will'],
                '|',
              );
              const camelCaseRegex = `^(${prefixes})[A-Z][a-zA-Z0-9]*$`;
              const upperCaseRegex = `^(${toUpperCase(prefixes)})(_[A-Z0-9]+)+$`;

              return join([camelCaseRegex, upperCaseRegex], '|');
            })(),
          },
          format: null,
          selector: [
            'variable',
            'parameter',
            'classProperty',
            'parameterProperty',
            'accessor',
          ],
          types: ['boolean'],
        },
      ],
      /**
       * 类型导入副作用检查
       *
       * @reason
       * - 项目未启用 verbatimModuleSyntax，TypeScript 编译器会自动处理类型导入的擦除
       * - Next.js 内置打包工具能够自动管理模块导入和副作用
       */
      '@typescript-eslint/no-import-type-side-effects': 'off',
      /**
       * 魔法数字使用检查
       *
       * @reason
       * - 提高代码可读性和可维护性，通过常量命名明确数字含义
       * - 减少因滥用魔法数字导致的维护负担
       * - 重点关注业务逻辑中的魔法数字，而非语义自明的基础数值
       */
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          enforceConst: true,
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreClassFieldInitialValues: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
        },
      ],
      /**
       * 禁止变量声明遮蔽外部作用域中的变量
       *
       * @reason
       * - 防止变量遮蔽有助于提高代码清晰度，减少潜在的错误和混淆。
       * - 通过避免同名变量，提升代码的可维护性，尤其是在复杂的代码库中。
       * - 理清各作用域中的变量关系有助于开发者更好地理解代码的结构。
       */
      '@typescript-eslint/no-shadow': 'warn',
      /**
       * 条件表达式类型检查
       *
       * @reason
       * - 帮助识别死代码和逻辑错误，提高代码可靠性
       * - 消除冗余的条件判断，让代码意图更清晰，便于理解代码逻辑
       */
      '@typescript-eslint/no-unnecessary-condition': 'error',
      /**
       * 类型断言安全性检查
       *
       * @reason
       * - 收窄类型的类型断言会绕过 TypeScript 的类型检查，引入潜在运行时错误
       * - 强制使用类型守卫而非断言，提升类型安全性
       * - AI 辅助编程场景中防止生成不安全的类型断言代码
       */
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      /**
       * 强制使用解构赋值
       *
       * @reason
       * - 解构赋值清晰地表达了变量的来源，增强了代码可读性。
       * - 避免了传统赋值可能引入的混乱，使代码逻辑更明显。
       * - 在 TypeScript 中，解构赋值可以充分利用类型注释，增强类型安全。
       */
      '@typescript-eslint/prefer-destructuring': 'warn',
      /**
       * 空值合并运算符使用检查
       *
       * @reason
       * - 空值合并运算符仅对 null/undefined 进行合并，避免了逻辑或运算符对所有假值的误判
       * - 要求开发者手动评估「空值」与「假值」的语义，避免产生难以发现的 bug，提升代码健壮性
       */
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      /**
       * 函数参数只读性检查
       *
       * @reason
       * - 该规则过于严格，在实际工程中会带来显著的开发摩擦和类型复杂度
       * - 许多生态系统类型（如 DOM API、第三方库）未设计为 readonly，强制标注会导致类型不兼容
       * - AI 辅助编程场景下，过度的 readonly 约束会频繁触发类型错误修复，降低开发效率
       */
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      /**
       * 模板字符串表达式类型约束
       *
       * @reason
       * - 避免非字符串类型隐式转换为 `[object Object]` 等无意义字符串
       * - 显式类型约束提升模板字符串的可预测性，促使开发者明确处理数据转换逻辑
       */
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowBoolean: false,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      /**
       * 布尔表达式类型检查
       *
       * @reason
       * - 作为 TypeScript-first 项目，应充分利用类型系统消除隐式类型转换带来的潜在 bug
       * - 显式的布尔比较可提高代码意图的可读性和可维护性
       */
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        { allowNullableObject: false, allowNumber: false, allowString: false },
      ],
      /**
       * switch 语句穷尽性检查
       *
       * @reason
       * - TypeScript-first 项目应充分利用类型系统确保联合类型和枚举的完整性
       * - 防止联合类型或枚举扩展时遗漏处理分支，提升代码健壮性
       * - 强制显式处理所有情况，避免隐式默认行为导致的运行时错误
       */
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { requireDefaultForNonUnion: true },
      ],
    },
  },
]);

export { typescriptOverrides };
