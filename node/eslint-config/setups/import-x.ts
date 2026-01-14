import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

const importXScopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

const importXSetup = defineScopedConfig(importXScopedFiles, [
  // @ts-expect-error -- See reasons['typescript-eslint/issues/11543'] in ts-expect-error.ts
  importX.flatConfigs.recommended,

  // @ts-expect-error -- See reasons['typescript-eslint/issues/11543'] in ts-expect-error.ts
  importX.flatConfigs.typescript,
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  },
]);

export { importXScopedFiles, importXSetup };
