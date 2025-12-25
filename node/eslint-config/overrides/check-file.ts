import { defineConfig } from 'eslint/config';
import type { ConfigWithExtends } from 'typescript-eslint';

import {
  GLOB_ALL,
  GLOB_DOT_FILES,
  GLOB_FILES_IN_DOT_DIRECTORIES,
  toCaseInsensitiveGlob,
} from '#node/utils/index.ts';

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
          '**/*.cts': '*.ts',
          '**/*.d.cts': '*.d.ts',
          '**/*.d.mts': '*.d.ts',
          '**/*.jsx': '*.tsx',
          '**/*.mjs': '*.js',
          '**/*.mts': '*.ts',
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
        { [GLOB_ALL]: 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      /**
       * 文件夹匹配检查
       *
       * @reason
       * - 确保文件夹匹配符合一致的约定，提升团队协作效率和代码可读性
       */
      'check-file/folder-match-with-fex': [
        'error',
        { '*.test.ts': '**/__tests__/' },
      ],
      /**
       * 文件夹命名检查
       *
       * @reason
       * - 确保文件夹命名符合一致的约定，提升团队协作效率和代码可读性
       */
      'check-file/folder-naming-convention': [
        'error',
        { [GLOB_ALL]: 'KEBAB_CASE' },
      ],
    },
  },
]);

const checkFileExceptionOverrides = defineConfig([
  {
    name: 'check-file:filename-naming-convention:overrides',
    extends: [
      // 对一些 dot files 关闭检查
      {
        files: [GLOB_DOT_FILES],
        rules: { 'check-file/filename-naming-convention': 'off' },
      },
      // 对一些 dot directories 关闭检查
      {
        files: [GLOB_FILES_IN_DOT_DIRECTORIES],
        rules: { 'check-file/folder-naming-convention': 'off' },
      },
      // 需要保持大写的文件名
      {
        files: [
          `**/${toCaseInsensitiveGlob('LICENSE')}`,
          `**/${toCaseInsensitiveGlob('{README,CHANGELOG}')}.md`,
        ],
        // @perfectionist-sort-objects
        rules: {
          'check-file/filename-naming-convention': [
            'error',
            { [GLOB_ALL]: '[A-Z]+' },
            { ignoreMiddleExtensions: true },
          ],
        },
      },
    ],
  } satisfies Pick<ConfigWithExtends, 'extends' | 'name'>,
]);

export { checkFileExceptionOverrides, checkFileOverrides };
