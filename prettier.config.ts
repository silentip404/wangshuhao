import type { Config } from 'prettier';

import {
  GLOB_JS,
  GLOB_JSONC_SPECIAL,
  GLOB_JSX,
  GLOB_LICENSE,
} from '#node/utilities/globs.ts';

const prettierConfig: Config = {
  plugins: [
    // Important: When using multiple plugins, add prettier-plugin-jsdoc to the end of the plugins list.
    'prettier-plugin-jsdoc',
  ],

  // 内置选项
  singleQuote: true,
  quoteProps: 'consistent',
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: true,
  singleAttributePerLine: true,

  // prettier-plugin-jsdoc 插件选项
  tsdoc: true,
  jsdocPreferCodeFences: true,
  jsdocVerticalAlignment: true,
  jsdocSeparateTagGroups: true,
  jsdocCommentLineStrategy: 'multiline',

  overrides: [
    /**
     * 不能使用 tsdoc 的文件
     */
    {
      options: {
        tsdoc: false,
      },
      files: [GLOB_JS, GLOB_JSX],
    },

    /**
     * 允许设置更宽的打印宽度
     */
    {
      options: {
        printWidth: 160,
      },
      files: ['node/eslint-config/local-plugins/setup.ts'],
    },

    /**
     * 特殊的 JSONC 文件
     */
    {
      options: {
        parser: 'jsonc',
      },
      files: [...GLOB_JSONC_SPECIAL],
    },

    /**
     * 特殊的 Markdown 文件
     */
    {
      options: {
        parser: 'markdown',
        proseWrap: 'always',
      },
      files: [GLOB_LICENSE],
    },
  ],
};

export default prettierConfig;
