import { defineConfig } from 'eslint/config';

const jsdocOverrides = defineConfig([
  {
    name: 'jsdoc:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * JSDoc 注释要求检查
       *
       * @remarks
       * - 良好的文档习惯是代码长期可维护性的重要保障
       * - 标准化的文档注释显著提升 IDE 智能提示体验和团队协作效率
       * - 弥补 TypeScript 类型系统只能表达 "是什么" 而无法表达 "为什么" 和 "如何用" 的局限
       * - 为 AI 辅助编程提供关键的业务上下文，使生成代码更符合实际需求
       */
      'jsdoc/require-jsdoc': 'off',
    },
  },
]);

export { jsdocOverrides };
