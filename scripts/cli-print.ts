import path from 'node:path';

import { join, omit } from 'remeda';
import { parse } from 'ts-command-line-args';

import { helpArgConfig, helpArgOptions } from '../utils/cli-helper.ts';
import { print, printOptionsSchema } from '../utils/print.ts';

import type { WithHelpArg } from '../utils/cli-helper.ts';
import type { PrintOptions } from '../utils/print.ts';

const typeSchema = printOptionsSchema.shape.type.unwrap();

const cliArguments = parse<WithHelpArg<PrintOptions>>(
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

print(options);
