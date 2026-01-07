import type { Config } from 'prettier';

import { GLOB_JSONC_SPECIAL, GLOB_LICENSE } from '#node/utilities/globs.ts';

const prettierConfig: Config = {
  singleQuote: true,
  quoteProps: 'consistent',
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: true,
  singleAttributePerLine: true,

  overrides: [
    {
      files: [...GLOB_JSONC_SPECIAL],
      options: {
        parser: 'jsonc',
      },
    },
    {
      files: [GLOB_LICENSE],
      options: {
        parser: 'markdown',
        proseWrap: 'always',
      },
    },
    {
      files: ['node/eslint-config/local-plugins/setup.ts'],
      options: {
        printWidth: 160,
      },
    },
  ],
};

export default prettierConfig;
