import { Command } from 'commander';
import { z } from 'zod';
import { print } from './utils/print.ts';

const program = new Command();

program
  .name('cli-print')
  .description('命令行打印工具，用于在命令行中打印各类消息')
  .option('--type <type>', '消息类型 (info/success/warn/error)')
  .requiredOption('--title <title>', '标题')
  .option(
    '--description <description>',
    '描述内容（可多次使用以支持多行）',
    (value: string, previous: string | string[] | undefined) => {
      if (previous === undefined) {
        return value;
      }
      if (typeof previous === 'string') {
        return [previous, value];
      }
      return [...previous, value];
    },
    undefined,
  )
  .action((options) => {
    const OptionsSchema = z.object({
      type: z.enum(['info', 'success', 'warn', 'error']).optional(),
      title: z.string(),
      description: z.union([z.string(), z.array(z.string())]).optional(),
    });
    const parsedOptions = OptionsSchema.safeParse(options);

    if (parsedOptions.success) {
      const { type, title, description } = parsedOptions.data;
      print({ type, title, description });
    } else {
      print({ type: 'error', title: '非法参数', description: parsedOptions.error.message });
      process.exit(1);
    }
  });

program.parse();
