import createCommandConfig from 'eslint-plugin-command/config';

import { GLOBS_COMBINED_JS } from '#node/utilities/globs.ts';

import type { ScopedFiles } from '../utilities/config.ts';
import { defineScopedConfig } from '../utilities/config.ts';

import { perfectionistSortObjects } from './perfectionist-sort-objects.ts';

const scopedFiles: ScopedFiles = { files: GLOBS_COMBINED_JS };

const commandSetup = defineScopedConfig(scopedFiles, [
  createCommandConfig({
    commands: [perfectionistSortObjects],
  }),
]);

export { commandSetup };
