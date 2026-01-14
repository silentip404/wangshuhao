import importAliasPlugin from '@dword-design/eslint-plugin-import-alias';
import { mapKeys, mapValues, pipe } from 'remeda';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { aliasesObject } from '#node/utilities/alias.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const importAliasScopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

const importAliasSetup = defineScopedConfig(importAliasScopedFiles, [
  importAliasPlugin.configs.recommended,
  {
    rules: {
      '@dword-design/import-alias/prefer-alias': [
        'warn',
        {
          aliasForSubpaths: true,
          alias: pipe(
            aliasesObject,
            mapKeys((key) => key.replace('/*', '')),
            mapValues((value) => value.replace('/*', '')),
          ),
        },
      ],
    },
  },
]);

export { importAliasSetup };
