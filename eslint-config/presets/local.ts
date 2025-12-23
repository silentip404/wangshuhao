import { defineConfig } from 'eslint/config';

import { localPlugin } from '../local-plugin/index.ts';

const localPresets = defineConfig([
  {
    plugins: {
      // @ts-expect-error: See reasons['typescript-eslint/issues/11543'] in ts-expect-error-reasons.ts
      local: localPlugin,
    },
  },
]);

export { localPresets };
