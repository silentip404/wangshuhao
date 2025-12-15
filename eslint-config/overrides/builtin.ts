import { defineConfig } from 'eslint/config';

const builtinOverrides = defineConfig([
  {
    name: 'builtin:builtin-overrides',
    rules: {
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
       * 函数定义风格检查
       *
       * @reason
       * - 函数表达式避免了提升带来的隐式行为，使代码执行流程更清晰可预测
       */
      'func-style': ['warn', 'expression'],
      /**
       * 三元运算符使用检查
       *
       * @reason
       * - 三元运算符是现代 JavaScript/TypeScript 中表达条件逻辑的标准方式，比 if-else 更简洁
       * - 通过 no-nested-ternary 规则限制嵌套使用即可
       */
      'no-ternary': 'off',
      /**
       * 三元表达式嵌套检查
       *
       * @reason
       * - 嵌套三元表达式显著降低代码可读性，增加维护成本
       * - 复杂的嵌套条件更适合用类型守卫或策略模式表达
       */
      'no-nested-ternary': 'error',
      /**
       * 冗余三元表达式检查
       *
       * @reason
       * - 冗余的三元表达式增加认知负担，降低代码表达力
       * - 简化的布尔逻辑或空值合并更符合现代 JavaScript/TypeScript 习惯用法
       */
      'no-unneeded-ternary': ['warn', { defaultAssignment: false }],
      /**
       * 控制语句花括号风格
       *
       * @reason
       * - 始终使用花括号可避免因添加语句时忘记加括号而引入的 bug，保持代码的健壮性
       * - 提升代码清晰度，消除视觉歧义，降低维护风险
       */
      'curly': 'error',
      /**
       * 注释首字母大写检查
       *
       * @reason
       * - 会对技术术语、代码示例等产生误报
       * - 注释风格属于个人或团队偏好，不影响代码逻辑和可维护性
       */
      'capitalized-comments': 'off',
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
       * 构造函数命名检查
       *
       * @reason
       * - TypeScript 类型系统已提供构造函数误用检查，命名约定检查属于冗余防护
       * - 无法自动区分第三方库函数，手动维护白名单成本高
       * - 现代框架（React 函数组件、工厂函数）广泛使用大写命名但非构造函数的模式
       */
      'new-cap': 'off',
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
       * 箭头函数体风格检查
       *
       * @reason
       * - 简洁的隐式返回语法减少模板代码，提升代码密度和可读性
       */
      'arrow-body-style': ['warn', 'as-needed'],
      /**
       * 圈复杂度控制
       *
       * @reason
       * - 圈复杂度直接衡量代码逻辑分支数量，是评估可测试性和可维护性的科学指标
       * - 限制圈复杂度可促使开发者拆分过长函数，提升代码可读性
       */
      'complexity': 'error',
      /**
       * 代码块嵌套深度控制
       *
       * @reason
       * - 深层嵌套会显著降低代码可读性，是普遍认可的代码异味
       * - 限制嵌套深度可促使开发者拆分过长函数，提升代码可读性
       */
      'max-depth': 'error',
      /**
       * 禁止函数参数重新赋值
       *
       * @reason
       * - 防止参数重新赋值导致的反直觉行为，提高代码可预测性
       * - 遵循明确的不可变约定，减少副作用追踪难度
       */
      'no-param-reassign': ['error', { props: true }],
      /**
       * 禁止在包含 return 语句的 if 块之后使用 else 块
       *
       * @reason
       * - 简化代码逻辑，避免不必要的嵌套结构，使得控制流程更加清晰。
       */
      'no-else-return': ['warn', { allowElseIf: false }],
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
       * 禁止使用控制台输出方法
       *
       * @reason
       * - 正式输出统一使用封装的日志工具确保日志输出的一致性和可控性
       * - 便于在生产环境中实现统一的日志管理、过滤和上报机制
       * - 临时调试代码使用之后需要及时删除
       */
      'no-console': 'warn',
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
          selector: 'ExportNamedDeclaration[declaration]',
          message:
            'Inline exports are not allowed. Use export { ... } instead.',
        },
        {
          selector: 'ExportNamedDeclaration[exportKind="type"]',
          message: 'Use inline type specifiers: export { type ... } instead.',
        },
      ],
    },
  },
]);

export { builtinOverrides };
