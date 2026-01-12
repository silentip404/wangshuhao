import { tsdocScopedFiles } from '#node/eslint-config/setups/tsdoc.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';

const tsdocOverrides = defineScopedConfig(tsdocScopedFiles, [
  {
    name: 'tsdoc:conflicting-rules',

    // @perfectionist-sort-objects
    rules: {
      'jsdoc/check-tag-names': 'off',
    },
  },
]);

export { tsdocOverrides };
