import createCommandConfig from 'eslint-plugin-command/config';

import type { ScopedFiles } from '#node/eslint-config/utilities/config.ts';
import { defineScopedConfig } from '#node/eslint-config/utilities/config.ts';
import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import { perfectionistSortObjects } from './perfectionist-sort-objects.ts';

const scopedFiles: ScopedFiles = {
  files: GLOBS_COMBINED_JS,
};

const commandSetup = defineScopedConfig(scopedFiles, [
  createCommandConfig({
    commands: [perfectionistSortObjects],
  }),
]);

export { commandSetup };
