import { defineConfig } from 'eslint/config';

const localOverrides = defineConfig([
  {
    name: 'local:local-overrides',
    rules: {
      /**
       * 默认导入命名规范
       *
       * @reason
       * - 统一的默认导入命名规范消除团队协作中的命名歧义，提升代码库的一致性
       * - 规范化的导入名称降低代码审查和重构的认知负担
       * - 在大型项目中便于快速定位和理解模块依赖关系
       */
      'local/restrict-non-named-import-name': [
        'warn',
        {
          ignoreUnMatched: false,
          matchers: [
            // 特殊命名
            {
              importType: 'all',
              regexSource: /^.*eslint.config.ts$/v.source,
              mode: 'equal',
              value: 'eslintConfig',
            },
            {
              importType: 'all',
              regexSource: /^eslint-config-flat-gitignore$/v.source,
              mode: 'equal',
              value: 'createIgnoreConfig',
            },
            {
              importType: 'all',
              regexSource: /^eslint-config-prettier\/flat$/v.source,
              mode: 'equal',
              value: 'prettierConfig',
            },
            {
              importType: 'all',
              regexSource: /^next\/image$/v.source,
              mode: 'equal',
              value: 'Image',
            },
            {
              importType: 'all',
              regexSource: /^jsonc-eslint-parser$/v.source,
              mode: 'equal',
              value: 'jsoncParser',
            },

            // 通用命名
            {
              importType: 'all',
              regexSource: /^node:(?<name>.*)$/v.source,
              mode: 'template',
              template: '$<name>',
              transform: 'camelCase',
            },
            {
              importType: 'all',
              regexSource: /^[\-.0-9_a-z]+-plugin-(?<name>.*)$/v.source,
              mode: 'template',
              template: '$<name>Plugin',
              transform: 'camelCase',
            },

            // 默认命名
            {
              importType: 'all',
              regexSource: /^.*$/v.source,
              mode: 'camelCase',
            },
          ],
        },
      ],
    },
  },
]);

export { localOverrides };
