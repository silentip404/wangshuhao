import { defineConfig } from 'eslint/config';

import { ensureModulePathInPackage } from '#node/utils/index.ts';

const localOverrides = defineConfig([
  {
    name: 'local:conflicting-rules',
    // @perfectionist-sort-objects
    rules: { 'import-x/no-rename-default': 'off' },
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
              type: 'all',
              regexSource: `^${ensureModulePathInPackage('next/image')}$`,
              mode: 'equal',
              identifier: 'NextImage',
            },
            {
              type: 'all',
              regexSource: `^${ensureModulePathInPackage('eslint-config-flat-gitignore')}$`,
              mode: 'equal',
              identifier: 'createIgnoreConfig',
            },
            {
              type: 'all',
              regexSource: `^${ensureModulePathInPackage('eslint-config-prettier/flat')}$`,
              mode: 'equal',
              identifier: 'prettierConfig',
            },
            {
              type: 'all',
              regexSource: `^${ensureModulePathInPackage('jsonc-eslint-parser')}$`,
              mode: 'equal',
              identifier: 'jsoncParser',
            },
            {
              type: 'all',
              regexSource: `^${ensureModulePathInPackage('eslint-plugin-command/config')}$`,
              mode: 'equal',
              identifier: 'createCommandConfig',
            },

            // 通用命名
            {
              type: 'all',
              regexSource:
                /^[\-.0-9_a-z]+-plugin-(?<name>[^\/]+)(?<subpath>\/.*)?$/v
                  .source,
              mode: 'replace',
              replacement: '$<name>Plugin$<subpath>',
              transformMode: 'camelCase',
            },
            {
              type: 'all',
              regexSource: /^(?<path>\.\.?\/.+)\.\w+$/v.source,
              mode: 'replace',
              replacement: '$<path>',
              transformMode: 'camelCase',
            },

            // 默认命名
            { type: 'all', regexSource: '^.*$', mode: 'camelCase' },
          ],
        },
      ],
    },
  },
]);

export { localOverrides };
