import { defineConfig } from 'eslint/config';

const unicornOverrides = defineConfig([
  {
    name: 'unicorn:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      '@typescript-eslint/init-declarations': 'off',
    },
  },
]);

export { unicornOverrides };
