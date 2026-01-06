import path from 'node:path';

import { join, omit } from 'remeda';
import { parse as parseArguments } from 'ts-command-line-args';

import type { PrintMessageOptions } from '#lib/utilities/index.ts';
import {
  printMessage,
  printMessageOptionsSchema,
} from '#lib/utilities/index.ts';

import type { WithHelpArgument } from './utilities.ts';
import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';

const typeSchema = printMessageOptionsSchema.shape.type.unwrap();

const cliArguments = parseArguments<WithHelpArgument<PrintMessageOptions>>(
  {
    ...helpArgumentConfig,

    type: {
      type: (value) => typeSchema.parse(value),
      typeLabel: join(typeSchema.options, '/'),
      optional: true,
      description: '消息类型',
    },
    title: {
      type: String,
      description: '消息标题',
    },
    description: {
      type: String,
      multiple: true,
      optional: true,
      description: '消息描述',
    },
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '在命令行中打印各类消息',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

printMessage(options);
