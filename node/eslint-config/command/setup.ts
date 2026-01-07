import createCommandConfig from 'eslint-plugin-command/config';
import { defineConfig } from 'eslint/config';

import { perfectionistSortObjects } from './perfectionist-sort-objects.ts';

const commandSetup = defineConfig([
  createCommandConfig({
    commands: [perfectionistSortObjects],
  }),
]);

export { commandSetup };
