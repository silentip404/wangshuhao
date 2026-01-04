import { defineConfig } from 'eslint/config';

const nextOverrides = defineConfig([
  {
    name: 'next:conflicting-rules',
    // @perfectionist-sort-objects
    rules: { 'import-x/dynamic-import-chunkname': 'off' },
  },
]);

export { nextOverrides };
