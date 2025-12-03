import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { Command } from 'commander';
import {
  isEmptyish,
  isIncludedIn,
  isNot,
  isNullish,
  isTruthy,
  map,
  partition,
  pipe,
} from 'remeda';
import { z } from 'zod';

import { print } from '../utils/print.ts';

const program = new Command();

program
  .name(path.basename(import.meta.url))
  .description('检查 package.json 和 pnpm-lock.yaml 是否同步')
  .argument('[files...]', '需要检查的文件列表（可选）')
  .option('--ignore-unknown', '自动忽略不相关的文件')
  .action((untypedFiles, untypedOptions) => {
    const filesSchema = z.array(z.string());
    const parsedFiles = filesSchema.safeParse(untypedFiles);

    if (!parsedFiles.success) {
      print({
        type: 'error',
        title: '文件参数解析失败',
        description: parsedFiles.error.message,
      });
      process.exit(1);
    }

    const optionsSchema = z.object({ ignoreUnknown: z.boolean().optional() });
    const parsedOptions = optionsSchema.safeParse(untypedOptions);

    if (!parsedOptions.success) {
      print({
        type: 'error',
        title: '选项参数解析失败',
        description: parsedOptions.error.message,
      });
      process.exit(1);
    }

    const files = parsedFiles.data;
    const options = parsedOptions.data;

    // 需要检查的锁文件相关文件
    const lockfileRelatedFiles = [
      'package.json',
      'pnpm-lock.yaml',
      '.npmrc',
      'pnpm-workspace.yaml',
    ];

    // 过滤出锁文件相关的文件
    const [relevantFiles, irrelevantFiles] = pipe(
      files,
      map((filename) => path.normalize(filename)),
      map((filename) => path.relative(process.cwd(), filename)),
      map((filename) => filename.replace(/\\/g, '/')),
      partition((filename) => isIncludedIn(filename, lockfileRelatedFiles)),
    );

    // 检查是否存在不相关的文件
    if (
      isNot(isEmptyish)(irrelevantFiles) &&
      isNullish(options.ignoreUnknown)
    ) {
      print({
        type: 'error',
        title: '检测到不相关的文件',
        description: [
          '以下文件与 lockfile 同步检查无关:',
          '',
          ...irrelevantFiles.map((file) => ` - ${file}`),
          '',
          '如需自动忽略这些文件，请使用 --ignore-unknown 选项',
        ],
      });
      process.exit(1);
    }

    // 如果相关文件列表为空，则直接退出
    if (isNot(isEmptyish)(files) && isEmptyish(relevantFiles)) {
      process.exit(0);
    }

    // 执行 pnpm install 检查
    const { status, error } = spawnSync(
      'pnpm',
      ['install', '--frozen-lockfile', '--lockfile-only', '--loglevel=warn'],
      { stdio: 'inherit', shell: true },
    );

    if (isTruthy(error)) {
      print({
        type: 'error',
        title: '执行 lockfile 同步检查失败',
        description: error.message,
      });
      process.exit(1);
    }

    // 以 pnpm install 命令的退出状态退出进程
    process.exit(status ?? 1);
  });

program.parse();
