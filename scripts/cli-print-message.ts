import path from 'node:path';

import { join, omit } from 'remeda';
import { parse } from 'ts-command-line-args';

import { helpArgConfig, helpArgOptions } from '../utils/cli-helper.ts';
import {
  printMessage,
  printMessageOptionsSchema,
} from '../utils/print-message.ts';

import type { WithHelpArg } from '../utils/cli-helper.ts';
import type { PrintMessageOptions } from '../utils/print-message.ts';

const typeSchema = printMessageOptionsSchema.shape.type.unwrap();

const cliArguments = parse<WithHelpArg<PrintMessageOptions>>(
  {
    ...helpArgConfig,

    type: {
      type: (value) => typeSchema.parse(value),
      typeLabel: join(typeSchema.options, '/'),
      optional: true,
      description: '消息类型',
    },
    title: { type: String, description: '消息标题' },
    description: {
      type: String,
      multiple: true,
      optional: true,
      description: '消息描述',
    },
  },
  {
    ...helpArgOptions,

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
