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
          allowArrayStart: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowEnumStart: true,
          allowInterfaceStart: true,
          allowModuleStart: true,
          allowObjectStart: true,
          allowTypeStart: true,
          beforeBlockComment: true,
          beforeLineComment: true,
        },
      ],

      /**
       * 多行注释风格规范
       *
       * @reason
       * - 统一的注释风格有助于维护代码库的一致性，降低认知负担
       */
      '@stylistic/multiline-comment-style': 'warn',

      /**
       * 对象花括号换行风格控制
       *
       * @reason
       * - 强制多行提升属性可读性，便于版本控制中追踪单个属性变更
       */
      '@stylistic/object-curly-newline': [
        'warn',
        {
          [`ObjectExpression`]: {
            minProperties: 1,
            multiline: true,
          },

          [`TSTypeLiteral`]: {
            minProperties: 1,
            multiline: true,
          },
        },
      ],
    },
  },
]);

export { stylisticOverrides };
