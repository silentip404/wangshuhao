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
    },
  },
]);

export { stylisticOverrides };
