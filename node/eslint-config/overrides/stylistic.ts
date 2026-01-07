import { defineConfig } from 'eslint/config';

const stylisticOverrides = defineConfig([
  {
    name: 'stylistic:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * 注释周围空行规范
       *
       * @reason
       * - 在注释前保持空行提升代码视觉层次，使注释与其描述的代码形成清晰的逻辑分组
       */
      '@stylistic/lines-around-comment': [
        'warn',
        {
          beforeBlockComment: true,
          beforeLineComment: true,

          allowArrayStart: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowEnumStart: true,
          allowInterfaceStart: true,
          allowModuleStart: true,
          allowObjectStart: true,
          allowTypeStart: true,
        },
      ],

      /**
       * 多行注释风格规范
       *
       * @reason
       * - 统一的注释风格有助于维护代码库的一致性，降低认知负担
       */
      '@stylistic/multiline-comment-style': ['warn', 'separate-lines'],

      /**
       * 对象花括号换行风格控制
       *
       * @reason
       * - 强制多行提升属性可读性，便于版本控制中追踪单个属性变更
       */
      '@stylistic/object-curly-newline': [
        'warn',
        {
          ObjectExpression: {
            minProperties: 1,
            multiline: true,
          },
          TSTypeLiteral: {
            minProperties: 1,
            multiline: true,
          },
        },
      ],

      /**
       * 特定语句间空行控制
       *
       * @reason
       * - 在关键语句块之间建立清晰的视觉边界，符合现代代码可读性最佳实践
       */
      '@stylistic/padding-line-between-statements': [
        'warn',

        // 指令
        {
          blankLine: 'always',
          next: 'directive',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: 'directive',
        },
        {
          blankLine: 'any',
          next: 'directive',
          prev: 'directive',
        },

        // 类型声明
        {
          blankLine: 'always',
          next: ['interface', 'type'],
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: ['interface', 'type'],
        },
        {
          blankLine: 'any',
          next: ['interface', 'type'],
          prev: ['interface', 'type'],
        },

        // 变量声明
        {
          blankLine: 'always',
          next: '*',
          prev: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          next: ['const', 'let', 'var'],
          prev: '*',
        },
        {
          blankLine: 'any',
          next: ['const', 'let', 'var'],
          prev: ['const', 'let', 'var'],
        },

        // 表达式
        {
          blankLine: 'always',
          next: 'expression',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: 'expression',
        },
        {
          blankLine: 'any',
          next: 'expression',
          prev: 'expression',
        },

        // 块状语句
        {
          blankLine: 'always',
          next: 'block-like',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: 'block-like',
        },

        // 中断点
        {
          blankLine: 'always',
          next: ['return', 'throw', 'break', 'continue'],
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: ['return', 'throw', 'break', 'continue'],
        },

        // 导出
        {
          blankLine: 'always',
          next: 'export',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: 'export',
        },
      ],

      /**
       * 字符串引号风格统一
       *
       * @reason
       * - 禁止滥用模板字符串确保语义准确性
       */
      '@stylistic/quotes': [
        'warn',
        'single',
        {
          allowTemplateLiterals: 'never',
        },
      ],
    },
  },
]);

export { stylisticOverrides };
