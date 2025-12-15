const GLOB_ALIAS = ['#node/*'] as const;

const GLOB_JS = ['**/*.js'] as const;
const GLOB_TS = ['**/*.ts'] as const;
const GLOB_D_TS = ['**/*.d.ts'] as const;
const GLOB_TSX = ['**/*.tsx'] as const;

const GLOB_JSON = ['**/*.json'] as const;
const GLOB_JSONC = [
  '**/*.jsonc',
  '**/tsconfig.json',
  '**/tsconfig.*.json',
  '**/*.code-snippets',
  '**/.vscode/**/*.json',
] as const;
const GLOB_JSON5 = ['**/*.json5'] as const;

const GLOB_DERIVED_JS = [
  ...GLOB_JS,
  ...GLOB_TS,
  ...GLOB_D_TS,
  ...GLOB_TSX,
] as const;
const GLOB_DERIVED_JSON = [...GLOB_JSON, ...GLOB_JSONC, ...GLOB_JSON5] as const;
const GLOB_DERIVED_DEPEND = ['**/package.json', ...GLOB_DERIVED_JS] as const;

export {
  GLOB_ALIAS,
  GLOB_DERIVED_DEPEND,
  GLOB_DERIVED_JS,
  GLOB_DERIVED_JSON,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
};
