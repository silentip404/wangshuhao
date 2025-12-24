import { makeRe } from 'minimatch';
import { filter, isTruthy, map, pipe } from 'remeda';

const ALIASES_GLOB = ['#*/**'];
const ALIASES_REGEX = pipe(
  ALIASES_GLOB,
  map((alias) => makeRe(alias, { nocomment: true })),
  filter(isTruthy),
);
const ALIASES_REGEX_STRING = map(ALIASES_REGEX, (regex) => regex.source);

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

const GLOB_ALL = '**' as const;

export {
  ALIASES_GLOB,
  ALIASES_REGEX_STRING,
  GLOB_ALL,
  GLOB_DERIVED_DEPEND,
  GLOB_DERIVED_JS,
  GLOB_DERIVED_JSON,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
};
