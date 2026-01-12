import { unicornScopedFiles } from '#node/eslint-config/setups/unicorn.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';

const unicornOverrides = defineScopedConfig(unicornScopedFiles, [
  {
    name: 'unicorn:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      '@typescript-eslint/init-declarations': 'off',
    },
  },
]);

export { unicornOverrides };
