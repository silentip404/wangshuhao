import { defineConfig } from 'eslint/config';

import { GLOB_ALL } from '#node/utilities/index.ts';

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
       *
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
       * 禁止 index 文件
       *
       * @reason
       * - 保持使用 index 文件作为模块边界，符合 Node.js 生态系统的标准做法
       */
      'check-file/no-index': 'off',
    },
  },
]);

export { checkFileOverrides };
