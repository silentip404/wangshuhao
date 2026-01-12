import { localScopedFiles } from '#node/eslint-config/local-plugins/setup.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { ensureModulePathInPackage } from '#node/utilities/ensure.ts';

const localOverrides = defineScopedConfig(localScopedFiles, [
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
       * @remarks
       * - 统一的模块标识符命名规范可以消除团队协作中的命名歧义，提升代码库的一致性
       * - 规范化的模块标识符能降低代码审查和重构的认知负担
       * - 在大型项目中便于快速定位和理解模块依赖关系，提升代码的可读性和可维护性
       */
      '@local/miscellaneous/module-identifier-naming-convention': [
        'warn',
        {
          ignoreUnMatched: false,
          matchers: [
            // 特殊命名
            {
              mode: 'equal',
              type: 'all',
              identifier: 'NextImage',
              regexSource: `^${await ensureModulePathInPackage('next/image')}$`,
            },
            {
              mode: 'equal',
              type: 'all',
              identifier: 'Handlebars',
              regexSource: `^${await ensureModulePathInPackage('handlebars')}$`,
            },
            {
              mode: 'equal',
              type: 'all',
              identifier: 'eslintPlugin',
              regexSource: `^${await ensureModulePathInPackage('@eslint-react/eslint-plugin')}$`,
            },
            {
              mode: 'equal',
              type: 'all',
              identifier: 'createIgnoreConfig',
              regexSource: `^${await ensureModulePathInPackage('eslint-config-flat-gitignore')}$`,
            },
            {
              mode: 'equal',
              type: 'all',
              identifier: 'prettierConfig',
              regexSource: `^${await ensureModulePathInPackage('eslint-config-prettier/flat')}$`,
            },
            {
              mode: 'equal',
              type: 'all',
              identifier: 'createCommandConfig',
              regexSource: `^${await ensureModulePathInPackage('eslint-plugin-command/config')}$`,
            },
            {
              mode: 'equal',
              type: 'all',
              identifier: 'stylisticPlugin',
              regexSource: `^${await ensureModulePathInPackage('@stylistic/eslint-plugin')}$`,
            },

            // 通用命名
            {
              mode: 'replace',
              type: 'all',
              regexSource: /^node:(?<name>.+)$/v.source,
              replacement: '$<name>',
              transformMode: 'none',
            },
            {
              mode: 'replace',
              type: 'all',
              regexSource:
                /^(?:@[\-.0-9_a-z]+\/)?[\-.0-9_a-z]+-plugin-(?<name>[^\/]+)(?<subpath>\/.*)?$/v
                  .source,
              replacement: '$<name>Plugin$<subpath>',
              transformMode: 'camelCase',
            },
            {
              mode: 'replace',
              type: 'all',
              regexSource: /^(?<path>\.\.?\/.+)\.\w+$/v.source,
              replacement: '$<path>',
              transformMode: 'camelCase',
            },

            // 默认命名
            {
              regexSource: '^.*$',
              mode: 'camelCase',
              type: 'all',
            },
          ],
        },
      ],

      /**
       * 强制 process.exit() 调用前有空行
       *
       * @remarks
       * - Process.exit() 是程序的终止点，需要视觉上的分隔以提升代码可读性
       * - 在代码审查时更容易识别程序的退出点
       */
      '@local/miscellaneous/padding-line-before-process-exit': 'warn',
    },
  },
]);

export { localOverrides };
