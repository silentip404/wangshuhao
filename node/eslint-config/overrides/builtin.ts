import { defineConfig } from 'eslint/config';

const builtinOverrides = defineConfig([
  {
    name: 'builtin:overrides',
    // @perfectionist-sort-objects
    rules: {
      /**
       * 箭头函数体风格检查
       *
       * @reason
       * - 简洁的隐式返回语法减少模板代码，提升代码密度和可读性
       */
      'arrow-body-style': ['warn', 'as-needed'],
      /**
       * 注释首字母大写检查
       *
       * @reason
       * - 会对技术术语、代码示例等产生误报
       * - 注释风格属于个人或团队偏好，不影响代码逻辑和可维护性
       */
      'capitalized-comments': 'off',
      /**
       * 圈复杂度控制
       *
       * @reason
       * - 圈复杂度直接衡量代码逻辑分支数量，是评估可测试性和可维护性的科学指标
       * - 限制圈复杂度可促使开发者拆分过长函数，提升代码可读性
       */
      'complexity': 'error',
      /**
       * 控制语句花括号风格
       *
       * @reason
       * - 始终使用花括号可避免因添加语句时忘记加括号而引入的 bug，保持代码的健壮性
       * - 提升代码清晰度，消除视觉歧义，降低维护风险
       */
      'curly': 'error',
      /**
       * switch 语句 default 分支检查
       *
       * @reason
       * - 强制开发者显式声明默认行为，避免运行时遗漏边界情况的错误处理
       */
      'default-case': 'warn',
      /**
       * 函数定义风格检查
       *
       * @reason
       * - 函数表达式避免了提升带来的隐式行为，使代码执行流程更清晰可预测
       */
      'func-style': ['warn', 'expression'],
      /**
       * 限制标识符的长度
       *
       * @reason
       * - 合理限制标识符的长度可以提高代码的可读性，确保代码易于理解和维护。
       * - 确保标识符具有足够的描述性，有助于明确代码的意图。
       */
      'id-length': 'warn',
      /**
       * 代码块嵌套深度控制
       *
       * @reason
       * - 深层嵌套会显著降低代码可读性，是普遍认可的代码异味
       * - 限制嵌套深度可促使开发者拆分过长函数，提升代码可读性
       */
      'max-depth': 'error',
      /**
       * 文件代码行数控制
       *
       * @reason
       * - 限制文件长度促使开发者遵循单一职责原则和模块化设计思维
       * - 较小的文件更易于导航、理解和维护，降低认知负担
       * - 跳过空行和注释的统计，避免因代码格式化和文档注释导致的误报
       */
      'max-lines': [
        'warn',
        { max: 512, skipBlankLines: true, skipComments: true },
      ],
      /**
       * 函数代码行数控制
       *
       * @reason
       * - 限制函数长度促使开发者遵循单一职责原则，提升代码可维护性
       * - 短小函数更易于单元测试、代码审查和重构
       * - 跳过空行和注释的统计，避免因代码格式化和文档注释导致的误报
       */
      'max-lines-per-function': [
        'warn',
        { max: 256, skipBlankLines: true, skipComments: true },
      ],
      /**
       * 函数语句数量控制
       *
       * @reason
       * - 限制函数语句数量可促使开发者拆分过长函数，提升代码可维护性
       * - 有助于发现潜在的性能问题和逻辑错误，因为较长的函数往往会导致难以抵御的代码缺陷
       */
      'max-statements': [
        'warn',
        { max: 32 },
        { ignoreTopLevelFunctions: true },
      ],
      /**
       * 构造函数命名检查
       *
       * @reason
       * - TypeScript 类型系统已提供构造函数误用检查，命名约定检查属于冗余防护
       * - 无法自动区分第三方库函数，手动维护白名单成本高
       * - 现代框架（React 函数组件、工厂函数）广泛使用大写命名但非构造函数的模式
       */
      'new-cap': 'off',
      /**
       * 禁止在循环中使用 await
       *
       * @reason
       * - 规则的初衷是避免可并行操作被顺序执行影响性能
       * - 但许多场景下顺序执行是有意为之（如需要串行依赖或提前终止）
       * - 盲目使用 Promise.all 可能增加代码复杂度且不适合所有场景
       */
      'no-await-in-loop': 'off',
      /**
       * 禁止使用控制台输出方法
       *
       * @reason
       * - 正式输出统一使用封装的日志工具确保日志输出的一致性和可控性
       * - 便于在生产环境中实现统一的日志管理、过滤和上报机制
       * - 临时调试代码使用之后需要及时删除
       */
      'no-console': 'warn',
      /**
       * 禁止使用 continue 语句
       *
       * @reason
       * - continue 作为卫语句可以避免代码嵌套过深，提升可读性
       * - 在循环中提前跳过不满足条件的迭代是常见且合理的模式
       */
      'no-continue': 'off',
      /**
       * 禁止在包含 return 语句的 if 块之后使用 else 块
       *
       * @reason
       * - 简化代码逻辑，避免不必要的嵌套结构，使得控制流程更加清晰。
       */
      'no-else-return': ['warn', { allowElseIf: false }],
      /**
       * 禁止使用否定条件
       *
       * @reason
       * - 否定条件代码可读性较差，容易引起理解混淆。
       * - 倾向于使用正面条件有助于提升代码逻辑的清晰度和可维护性。
       * - 特别是在包含 `else` 分支或使用三元表达式时，避免否定条件可以减少潜在的错误。
       */
      'no-negated-condition': 'warn',
      /**
       * 三元表达式嵌套检查
       *
       * @reason
       * - 嵌套三元表达式显著降低代码可读性，增加维护成本
       * - 复杂的嵌套条件更适合用类型守卫或策略模式表达
       */
      'no-nested-ternary': 'error',
      /**
       * 禁止函数参数重新赋值
       *
       * @reason
       * - 防止参数重新赋值导致的反直觉行为，提高代码可预测性
       * - 遵循明确的不可变约定，减少副作用追踪难度
       */
      'no-param-reassign': ['error', { props: true }],
      /**
       * 语法限制规则
       *
       * @reason
       * - 通过约束特定语法模式统一代码风格，建立团队编码规范共识
       * - 在语法层面预防潜在的代码质量问题和架构反模式
       */
      'no-restricted-syntax': [
        'warn',

        // 基础语法限制
        'FunctionExpression',
        'WithStatement',
        'BinaryExpression[operator="in"]',

        // 导入导出相关语法限制
        {
          message:
            'Inline exports are not allowed. Use export { ... } instead.',
          selector: 'ExportNamedDeclaration[declaration]',
        },
        {
          message:
            'Inline type exports are not allowed. Use export type { ... } instead.',
          selector: 'ExportSpecifier[exportKind="type"]',
        },
      ],
      /**
       * 三元运算符使用检查
       *
       * @reason
       * - 三元运算符是现代 JavaScript/TypeScript 中表达条件逻辑的标准方式，比 if-else 更简洁
       * - 通过 no-nested-ternary 规则限制嵌套使用即可
       */
      'no-ternary': 'off',
      /**
       * 禁止在变量声明时使用 undefined 进行初始化
       *
       * @reason
       * - 禁止将变量初始化为 `undefined`，以确保变量在使用之前具有明确的值，从而提升代码的可读性和维护性。
       * - 减少潜在的逻辑错误，避免在需要具体值的地方使用未定义的状态，保证代码逻辑的一致性。
       * - 促使开发者采取更为明确的初始化方式，为后续的开发和维护提供便利。
       */
      'no-undef-init': 'warn',
      /**
       * undefined 标识符使用检查
       *
       * @reason
       * - 该规则已正式弃用，不再推荐使用
       * - void 0 替代方案显著降低代码可读性
       * - 在 ECMAScript 5+ 和严格模式（ESM 默认）中，undefined 已是只读的全局属性
       * - 现代工具链（no-global-assign、no-shadow-restricted-names）已提供更精确的保护
       */
      'no-undefined': 'off',
      /**
       * 冗余三元表达式检查
       *
       * @reason
       * - 冗余的三元表达式增加认知负担，降低代码表达力
       * - 简化的布尔逻辑或空值合并更符合现代 JavaScript/TypeScript 习惯用法
       */
      'no-unneeded-ternary': ['warn', { defaultAssignment: false }],
      /**
       * 禁止不必要的赋值
       *
       * @reason
       * - 避免多余的赋值操作可以提高代码的简洁性和可读性。
       * - 减少无效或冗余的代码，促进更清晰的逻辑表达，使得代码审查和维护变得更加高效。
       * - 明确表达意图，减少可能引起混淆的代码片段，使得代码更加易于理解。
       */
      'no-useless-assignment': 'warn',
      /**
       * 强制使用对象字面量的简写语法
       *
       * @reason
       * - 简写语法使得代码更加简洁，提高开发效率。
       * - 提高代码可读性，方便开发者迅速理解对象结构。
       * - 符合现代 JavaScript 编码习惯，避免不一致的语法风格可能带来的困惑。
       */
      'object-shorthand': ['error', 'always'],
      /**
       * 变量声明方式控制
       *
       * @reason
       * - 提升代码可读性，每个变量声明独立成行，便于理解和追踪
       * - 在 TypeScript 中每个变量通常需要独立的类型注解，分离声明更符合类型系统的最佳实践
       * - 方便添加、删除或修改单个变量声明，简化版本控制 diff
       */
      'one-var': ['warn', 'never'],
      /**
       * 对象键排序检查
       *
       * @reason
       * - 全局禁用自动排序，避免对所有对象字面量强制排序造成不必要的约束
       * - 对象属性顺序可能反映业务优先级或重要性层级，应尊重开发者的设计意图
       * - 通过 @perfectionist-sort-objects 注释在需要的地方手动启用，实现精准控制
       */
      'sort-keys': 'off',
    },
  },
]);

export { builtinOverrides };
