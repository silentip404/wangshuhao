import { defineConfig } from 'eslint/config';
import { join, toUpperCase } from 'remeda';
import { plugin } from 'typescript-eslint';

import { createDisabledBuiltinExtendedRules } from '../utils/rule.ts';

const typescriptOverrides = defineConfig([
  {
    name: 'typescript:disable-extended-builtin-overrides',
    /**
     * 批量关闭被 TypeScript ESLint 扩展的内置规则
     *
     * @reason
     * - 避免规则冲突和重复检查
     * - 统一由 @typescript-eslint/${ruleName} 代替对应的内置规则
     */
    rules: createDisabledBuiltinExtendedRules({ '@typescript-eslint': plugin }),
  },
  {
    name: 'typescript:related-non-typescript-overrides',
    rules: {
      /**
       * 驼峰命名检查
       *
       * @reason
       * - 规则实现过于笼统，覆盖场景不足
       * - 使用 @typescript-eslint/naming-convention 替代，获得更精细的类型感知命名控制
       */
      'camelcase': 'off',
      /**
       * switch 语句 default 分支检查
       *
       * @reason
       * - 作为 @typescript-eslint/switch-exhaustiveness-check 的补充
       * - 强制开发者显式声明默认行为，避免运行时遗漏边界情况的错误处理
       */
      'default-case': 'warn',
    },
  },
  {
    name: 'typescript:typescript-overrides',
    rules: {
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
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
        },
      ],
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
       * 函数参数只读性检查
       *
       * @reason
       * - 该规则过于严格，在实际工程中会带来显著的开发摩擦和类型复杂度
       * - 许多生态系统类型（如 DOM API、第三方库）未设计为 readonly，强制标注会导致类型不兼容
       * - AI 辅助编程场景下，过度的 readonly 约束会频繁触发类型错误修复，降低开发效率
       */
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      /**
       * 空值合并运算符使用检查
       *
       * @reason
       * - 空值合并运算符仅对 null/undefined 进行合并，避免了逻辑或运算符对所有假值的误判
       * - 要求开发者手动评估「空值」与「假值」的语义，避免产生难以发现的 bug，提升代码健壮性
       */
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      /**
       * 布尔表达式类型检查
       *
       * @reason
       * - 作为 TypeScript-first 项目，应充分利用类型系统消除隐式类型转换带来的潜在 bug
       * - 显式的布尔比较可提高代码意图的可读性和可维护性
       */
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      /**
       * 条件表达式类型检查
       *
       * @reason
       * - 帮助识别死代码和逻辑错误，提高代码可靠性
       * - 消除冗余的条件判断，让代码意图更清晰，便于理解代码逻辑
       */
      '@typescript-eslint/no-unnecessary-condition': 'error',
      /**
       * 类型导入语法风格检查
       *
       * @reason
       * - 明确区分类型导入和值导入，提升代码可读性和构建性能
       */
      '@typescript-eslint/consistent-type-imports': 'warn',
      /**
       * 类型导入副作用检查
       *
       * @reason
       * - 配合 verbatimModuleSyntax 避免意外的副作用导入（如 import {} from 'mod'）
       * - 确保类型导入在编译后完全移除，减少运行时开销
       */
      '@typescript-eslint/no-import-type-side-effects': 'error',
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
      /**
       * 正则表达式执行方法检查
       *
       * @reason
       * - 统一正则表达式执行方式，提升代码可读性和可维护性
       * - RegExp.exec() 性能略优于 String.match()（非全局模式下）
       * - 明确区分单次匹配和全局匹配的语义，避免 API 混用
       */
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      /**
       * return 语句值检查
       *
       * @reason
       * - 推荐使用 TypeScript 的 noImplicitReturns 选项替代此规则
       * - TypeScript 编译器能够进行更精确的控制流分析，因此覆盖范围比此规则更广
       */
      '@typescript-eslint/consistent-return': 'off',
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
        { selector: 'default', format: ['camelCase'] },

        // 基础规则
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'parameter', format: ['camelCase'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        {
          selector: ['classProperty', 'classMethod'],
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },

        // 类型系统规则
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },

        // 导入规则
        { selector: 'import', format: ['camelCase', 'PascalCase'] },

        // 特殊规则
        {
          selector: ['property', 'method'],
          modifiers: ['requiresQuotes'],
          format: null,
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: null,
          custom: {
            regex: (() => {
              const prefixes = join(['is', 'should', 'ignore'], '|');
              const camelCaseRegex = `^(${prefixes})[A-Z][a-zA-Z0-9]*$`;
              const upperCaseRegex = `^(${toUpperCase(prefixes)})(_[A-Z0-9]+)+$`;

              return join([camelCaseRegex, upperCaseRegex], '|');
            })(),
            match: true,
          },
        },
      ],

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
    },
  },
]);

export { typescriptOverrides };
