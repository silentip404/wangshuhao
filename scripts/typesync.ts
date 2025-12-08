import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { omit } from 'remeda';
import { parse } from 'ts-command-line-args';

import {
  helpArgConfig,
  helpArgOptions,
  mergeStdOutputs,
} from '../utils/cli-helper.ts';
import { printMessage } from '../utils/print-message.ts';

import type { WithHelpArg } from '../utils/cli-helper.ts';

type CliArguments = WithHelpArg<{ fix?: boolean }>;

const cliArguments = parse<CliArguments>(
  {
    ...helpArgConfig,

    fix: {
      type: Boolean,
      optional: true,
      description: '自动添加缺失的 `@types/dependency-name` 类型依赖',
    },
  },
  {
    ...helpArgOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '检查是否存在缺失的 `@types/dependency-name` 类型依赖',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { fix: shouldFix } = options;

// 执行 typesync 命令
const { status, error, stdout, stderr } = spawnSync(
  'pnpm',
  ['typesync', shouldFix === true ? '' : '--dry=fail'],
  { shell: true },
);

if (error !== undefined) {
  printMessage({
    type: 'error',
    title: '使用临时配置文件执行 tsc 命令失败',
    description: error.message,
  });
  process.exit(1);
}

// 如果 typesync 命令执行失败，则打印输出
if (status !== 0) {
  const output = mergeStdOutputs({ stdout, stderr });

  console.error(output);
}

// 以 typesync 命令的退出状态退出进程
process.exit(status);
