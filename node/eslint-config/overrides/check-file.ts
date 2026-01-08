import { defineConfig } from 'eslint/config';

import { GLOB_ALL } from '#node/utilities/globs.ts';

const checkFileOverrides = defineConfig([
  {
    name: 'check-file:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * 文件名黑名单
       *
       * @reason
       * - 确保文件命名符合一致的命名约定，提升团队协作效率和代码可读性
       */
      'check-file/filename-blocklist': [
        'error',
        {
          '**/*.cjs': '*.js',
          '**/*.mjs': '*.js',
          '**/*.cts': '*.ts',
          '**/*.mts': '*.ts',
          '**/*.d.cts': '*.d.ts',
          '**/*.d.mts': '*.d.ts',
          '**/*.jsx': '*.tsx',
          '**/*.cjsx': '*.tsx',
          '**/*.mjsx': '*.tsx',
        },
      ],

      /**
       * 文件命名检查
       *
       * @reason
       * - 确保文件命名符合一致的命名约定，提升团队协作效率和代码可读性
       */
      'check-file/filename-naming-convention': [
        'error',
        {
          [GLOB_ALL]: 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      /**
       * 文件夹匹配检查
       *
       * @reason
       * - 确保文件夹匹配符合一致的约定，提升团队协作效率和代码可读性
       */
      'check-file/folder-match-with-fex': [
        'error',
        {
          '*.test.ts': '**/__tests__/',
        },
      ],

      /**
       * 文件夹命名检查
       *
       * @reason
       * - 确保文件夹命名符合一致的约定，提升团队协作效率和代码可读性
       */
      'check-file/folder-naming-convention': [
        'error',
        {
          [GLOB_ALL]: 'KEBAB_CASE',
        },
      ],

      /**
       * 禁止使用 index 文件
       *
       * @reason
       * - 避免桶文件（barrel file）带来的循环依赖风险
       * - 促进模块化设计，鼓励开发者对导出内容进行清晰命名
       * - 使模块依赖关系更加清晰明确，提升打包器 tree-shaking 的准确性
       */
      'check-file/no-index': [
        'error',
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
]);

export { checkFileOverrides };
