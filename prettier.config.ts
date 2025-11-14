import type { Config } from 'prettier';

const prettierConfig: Config = {
  singleQuote: true,
  quoteProps: 'consistent',
  objectWrap: 'collapse',
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: true,
  overrides: [
    {
      files: [
        '.vscode/**/*.json',
        '.vscode/**/*.code-snippets',
        'tsconfig.json',
        'tsconfig.*.json',
      ],
      options: { parser: 'jsonc' },
    },
    { files: ['*.jsx', '*.tsx', '*.vue'], options: { singleAttributePerLine: true } },
    { files: ['LICENSE'], options: { parser: 'markdown', proseWrap: 'always' } },
  ],
};

export default prettierConfig;
