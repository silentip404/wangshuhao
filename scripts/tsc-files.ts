import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { to } from 'await-to-js';
import { Command } from 'commander';
import { minimatch } from 'minimatch';
import { resolveTSConfig, writeTSConfig } from 'pkg-types';
import {
  isEmptyish,
  isNullish,
  isTruthy,
  join,
  map,
  partition,
  pipe,
} from 'remeda';
import { z } from 'zod';

import { print } from '../utils/print.ts';

const program = new Command();

program
  .name(path.basename(import.meta.url))
  .description('对指定文件运行 tsc 命令，并尊重项目配置')
  .argument('<files...>', '需要运行 tsc 命令的文件列表')
  .option('--ignore-unknown', '自动忽略不支持类型检查的文件')
  .action(async (untypedFiles, untypedOptions) => {
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

    // 过滤出合法的 TypeScript 文件
    const typecheckExtensions = [
      '.ts',
      '.tsx',
      '.d.ts',
      '.js',
      '.jsx',
      '.cts',
      '.d.cts',
      '.cjs',
      '.mts',
      '.d.mts',
      '.mjs',
    ];
    const [typecheckFiles, unknownFiles] = pipe(
      files,
      map((filename) => path.normalize(filename)),
      map((filename) => path.relative(process.cwd(), filename)),
      map((filename) => filename.replace(/\\/g, '/')),
      partition(minimatch.filter(`**/*{${join(typecheckExtensions, ',')}}`)),
    );

    // 检查是否存在不支持类型检查的文件
    if (!isEmptyish(unknownFiles) && isNullish(options.ignoreUnknown)) {
      print({
        type: 'error',
        title: '检测到不支持的文件类型',
        description: [
          '以下文件不是有效的 TypeScript 文件，无法进行类型检查:',
          '',
          ...unknownFiles.map((file) => ` - ${file}`),
          '',
          '如需自动忽略这些文件，请使用 --ignore-unknown 选项',
        ],
      });
      process.exit(1);
    }

    // 如果支持类型检查的文件列表为空，则直接退出
    if (isEmptyish(typecheckFiles)) {
      process.exit(0);
    }

    // 解析 TypeScript 配置文件
    const [resolveError, configFilename] = await to(resolveTSConfig());
    if (resolveError !== null) {
      print({
        type: 'error',
        title: '解析 TypeScript 配置文件失败',
        description: resolveError.message,
      });
      process.exit(1);
    }

    // 写入临时 TypeScript 配置文件
    const temporaryConfigFilename = path.join(
      path.dirname(configFilename),
      `tsconfig.tsc-files.${process.pid}.json`,
    );
    const [writeError] = await to(
      writeTSConfig(temporaryConfigFilename, {
        extends: `./${path.basename(configFilename)}`,
        include: [],
        files: typecheckFiles,
        compilerOptions: { noEmit: true, incremental: false },
      }),
    );
    if (writeError !== null) {
      print({
        type: 'error',
        title: '写入临时 TypeScript 配置文件失败',
        description: writeError.message,
      });

      process.exit(1);
    }

    // 使用临时 TypeScript 配置文件执行 tsc 命令
    const { status, error } = spawnSync(
      'pnpm',
      ['tsc', '--project', temporaryConfigFilename, '--pretty'],
      { stdio: 'inherit', shell: true },
    );

    // 清理临时 TypeScript 配置文件
    fs.rmSync(temporaryConfigFilename, { force: true });

    if (isTruthy(error)) {
      print({
        type: 'error',
        title: '使用临时 TypeScript 配置文件执行 tsc 命令失败',
        description: error.message,
      });
      process.exit(1);
    }

    // 以 tsc 命令的退出状态退出进程
    process.exit(status ?? 1);
  });

program.parse();
