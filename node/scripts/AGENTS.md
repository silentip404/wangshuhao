# AGENTS Guidelines for This Directory or Its Children

This directory contains standalone TypeScript scripts executed directly via Node.js type stripping. Each script serves a specific purpose such as verification, CLI utilities, or automation tasks.

---

## Script Templates

When creating new scripts in this directory, you **MUST** follow one of the two templates below based on whether the script requires command-line arguments.

### Scripts Without Command-Line Arguments

For simple scripts that do not require user input:

```ts
import path from 'node:path';

import { parse as parseArguments } from 'ts-command-line-args';

import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';
import type { WithHelpArgument } from './utilities.ts';

type CliArguments = WithHelpArgument<Record<never, never>>;

parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: 'This is the tool description.',
      },
    ],
  },
);
```

### Scripts With Command-Line Arguments

For scripts that accept command-line arguments:

```ts
import path from 'node:path';

import { omit } from 'remeda';
import { parse as parseArguments } from 'ts-command-line-args';

import type { WithHelpArgument } from './utilities.ts';
import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';

type CliArguments = WithHelpArgument<{
  argument?: string;
}>;

const cliArguments = parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,

    argument: {
      type: String,
      optional: true,
      description: 'This is the argument description.',
    },
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: 'This is the tool description.',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { argument } = options;
```
