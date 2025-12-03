const GLOB_JS = ['**/*.js'] as const;
const GLOB_TS = ['**/*.ts'] as const;
const GLOB_D_TS = ['**/*.d.ts'] as const;
const GLOB_TSX = ['**/*.tsx'] as const;
const GLOB_JS_DERIVED = [
  ...GLOB_JS,
  ...GLOB_TS,
  ...GLOB_D_TS,
  ...GLOB_TSX,
] as const;

const GLOB_JSON = ['**/*.json'] as const;
const GLOB_JSONC = [
  '**/*.jsonc',
  '**/tsconfig.json',
  '**/tsconfig.*.json',
  '**/*.code-snippets',
  '**/.vscode/**/*.json',
] as const;
const GLOB_JSON5 = ['**/*.json5'] as const;
const GLOB_JSON_DERIVED = [...GLOB_JSON, ...GLOB_JSONC, ...GLOB_JSON5] as const;

export {
  GLOB_JS_DERIVED,
  GLOB_JSON,
  GLOB_JSONC,
  GLOB_JSON5,
  GLOB_JSON_DERIVED,
};
