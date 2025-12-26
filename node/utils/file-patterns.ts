import { makeRe } from 'minimatch';
import { filter, isTruthy, join, map, pipe, split, zipWith } from 'remeda';

import { getCaseVariants } from '#lib/utils/index.ts';

const GLOB_ALL = '**' as const;
const GLOB_DOT_FILES = '**/.*' as const;
const GLOB_FILES_IN_DOT_DIRECTORIES = '**/.*/**' as const;

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

const GLOB_TSCONFIG_APP_INCLUDE = ['app/**/*.ts', 'app/**/*.tsx'] as const;
const GLOB_TSCONFIG_APP_INCLUDE_BASE = [
  'next-env.d.ts',
  '.next/types/**/*.ts',
  '.next/dev/types/**/*.ts',
] as const;
const GLOB_TSCONFIG_LIB_INCLUDE = ['lib/**/*.ts'] as const;
const GLOB_TSCONFIG_LIB_BASE_INCLUDE = [] as const;
const GLOB_TSCONFIG_NODE_INCLUDE = ['*.js', '*.ts', 'node/**/*.ts'] as const;
const GLOB_TSCONFIG_NODE_BASE_INCLUDE = [] as const;

const GLOB_CONFIG_FILES = [
  '*.config.js',
  '*.config.ts',
  '*.config.*.ts',
] as const;

const toCaseInsensitiveGlob = (glob: string): string => {
  const { raw } = getCaseVariants(glob);

  const letters = zipWith(
    split(raw.lowercase, ''),
    split(raw.UPPERCASE, ''),
    (lowercase, uppercase) => {
      if (lowercase === uppercase) {
        return lowercase;
      }

      return `[${lowercase}${uppercase}]`;
    },
  );

  return join(letters, '');
};

export {
  ALIASES_GLOB,
  ALIASES_REGEX_STRING,
  GLOB_ALL,
  GLOB_CONFIG_FILES,
  GLOB_DERIVED_DEPEND,
  GLOB_DERIVED_JS,
  GLOB_DERIVED_JSON,
  GLOB_DOT_FILES,
  GLOB_FILES_IN_DOT_DIRECTORIES,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_TSCONFIG_APP_INCLUDE,
  GLOB_TSCONFIG_APP_INCLUDE_BASE,
  GLOB_TSCONFIG_LIB_BASE_INCLUDE,
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_BASE_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
  toCaseInsensitiveGlob,
};
