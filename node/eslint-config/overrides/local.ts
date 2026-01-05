import { defineConfig } from 'eslint/config';

import { ensureModulePathInPackage } from '#node/utilities/index.ts';

const localOverrides = defineConfig([
  {
    name: 'local:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      'import-x/no-rename-default': 'off',
    },
  },
  {
    name: 'local:overrides',

    // @perfectionist-sort-objects
    rules: {
      /**
       * 模块标识符命名规范
       *
       * @reason
       * - 统一的模块标识符命名规范可以消除团队协作中的命名歧义，提升代码库的一致性
       * - 规范化的模块标识符能降低代码审查和重构的认知负担
       * - 在大型项目中便于快速定位和理解模块依赖关系，提升代码的可读性和可维护性
       */
      'local/module-identifier-naming-convention': [
        'warn',
        {
          ignoreUnMatched: false,
          matchers: [
            // 特殊命名
            {
              identifier: 'NextImage',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('next/image')}$`,
              type: 'all',
            },
            {
              identifier: 'Handlebars',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('handlebars')}$`,
              type: 'all',
            },
            {
              identifier: 'eslintPlugin',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('@eslint-react/eslint-plugin')}$`,
              type: 'all',
            },
            {
              identifier: 'createIgnoreConfig',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('eslint-config-flat-gitignore')}$`,
              type: 'all',
            },
            {
              identifier: 'prettierConfig',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('eslint-config-prettier/flat')}$`,
              type: 'all',
            },
            {
              identifier: 'createCommandConfig',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('eslint-plugin-command/config')}$`,
              type: 'all',
            },
            {
              identifier: 'stylisticPlugin',
              mode: 'equal',
              regexSource: `^${await ensureModulePathInPackage('@stylistic/eslint-plugin')}$`,
              type: 'all',
            },

            // 通用命名
            {
              mode: 'replace',
              regexSource: /^node:(?<name>.+)$/v.source,
              replacement: '$<name>',
              transformMode: 'none',
              type: 'all',
            },
            {
              mode: 'replace',
              regexSource:
                /^(?:@[\-.0-9_a-z]+\/)?[\-.0-9_a-z]+-plugin-(?<name>[^\/]+)(?<subpath>\/.*)?$/v
                  .source,
              replacement: '$<name>Plugin$<subpath>',
              transformMode: 'camelCase',
              type: 'all',
            },
            {
              mode: 'replace',
              regexSource: /^(?<path>\.\.?\/.+)\.\w+$/v.source,
              replacement: '$<path>',
              transformMode: 'camelCase',
              type: 'all',
            },

            // 默认命名
            {
              mode: 'camelCase',
              regexSource: '^.*$',
              type: 'all',
            },
          ],
        },
      ],

      /**
       * 强制 process.exit() 调用前有空行
       *
       * @reason
       * - process.exit() 是程序的终止点，需要视觉上的分隔以提升代码可读性
       * - 在代码审查时更容易识别程序的退出点
       */
      'local/padding-line-before-process-exit': 'warn',
    },
  },
]);

export { localOverrides };
