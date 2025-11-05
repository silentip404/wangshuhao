/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
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
    {
      files: ['*.jsx', '*.cjsx', '*.mjsx', '*.tsx', '*.ctsx', '*.mtsx'],
      options: { singleAttributePerLine: true },
    },
  ],
};

export default config;
