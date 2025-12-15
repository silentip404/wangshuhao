import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';

const perfectionistPresets = defineConfig([
  {
    plugins: { perfectionist: perfectionistPlugin },
    settings: {
      perfectionist: {
        type: 'natural',
        order: 'asc',
        ignoreCase: false,
        specialCharacters: 'keep',
        partitionByComment: false,
        partitionByNewLine: false,
      },
    },
  },
]);

export { perfectionistPresets };
