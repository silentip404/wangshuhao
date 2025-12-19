import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import { defineConfig } from 'eslint/config';

const importXPresets = defineConfig([
  // @ts-expect-error: https://github.com/typescript-eslint/typescript-eslint/issues/11543
  importX.flatConfigs.recommended,
  // @ts-expect-error: https://github.com/typescript-eslint/typescript-eslint/issues/11543
  importX.flatConfigs.typescript,
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ alwaysTryTypes: true }),
      ],
    },
  },
]);

export { importXPresets };
