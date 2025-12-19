import { defineConfig } from 'eslint/config';

import { localPlugin } from '../local-plugin/index.ts';

const localPresets = defineConfig([
  {
    plugins: {
      // @ts-expect-error: https://github.com/typescript-eslint/typescript-eslint/issues/11543
      local: localPlugin,
    },
  },
]);

export { localPresets };
