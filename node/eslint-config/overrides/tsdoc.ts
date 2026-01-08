import { defineConfig } from 'eslint/config';

const tsdocOverrides = defineConfig([
  {
    name: 'tsdoc:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      'jsdoc/check-tag-names': 'off',
    },
  },
]);

export { tsdocOverrides };
