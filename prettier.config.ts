import type { Config } from 'prettier';

import { GLOB_JSONC } from '#node/utils/index.ts';

const prettierConfig: Config = {
  singleQuote: true,
  quoteProps: 'consistent',
  objectWrap: 'collapse',
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: true,
  overrides: [
    { files: [...GLOB_JSONC], options: { parser: 'jsonc' } },
    {
      files: ['**/*.jsx', '**/*.tsx', '**/*.vue'],
      options: { singleAttributePerLine: true },
    },
    {
      files: ['**/LICENSE'],
      options: { parser: 'markdown', proseWrap: 'always' },
    },
  ],
};

export default prettierConfig;
