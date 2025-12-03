import path from 'node:path';

import { Command } from 'commander';
import { isDefined } from 'remeda';
import { z } from 'zod';

import { print } from '../utils/print.ts';

const program = new Command();

program
  .name(path.basename(import.meta.url))
  .description('命令行打印工具，用于在命令行中打印各类消息')
  .option('--type <type>', '消息类型 (info/success/warn/error)')
  .requiredOption('--title <title>', '标题')
  .option(
    '--description <description>',
    '描述内容（可多次使用以支持多行）',
    (value: string, previous: string | string[] | undefined) => {
      if (!isDefined(previous)) {
        return value;
      }
      if (typeof previous === 'string') {
        return [previous, value];
      }
      return [...previous, value];
    },
    undefined,
  )
  .action((untypedOptions) => {
    const optionsSchema = z.object({
      type: z.enum(['info', 'success', 'warn', 'error']).optional(),
      title: z.string(),
      description: z.union([z.string(), z.array(z.string())]).optional(),
    });
    const parsedOptions = optionsSchema.safeParse(untypedOptions);

    if (parsedOptions.success) {
      const options = parsedOptions.data;
      print(options);
    } else {
      print({
        type: 'error',
        title: '非法参数',
        description: parsedOptions.error.message,
      });
      process.exit(1);
    }
  });

program.parse();
