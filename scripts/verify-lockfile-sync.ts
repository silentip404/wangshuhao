import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { omit } from 'remeda';
import { parse } from 'ts-command-line-args';

import {
  analyzeVerifyFiles,
  helpArgConfig,
  helpArgOptions,
  verifyFilesArgsConfig,
} from '../utils/cli-helper.ts';
import { print } from '../utils/print.ts';

import type { VerifyFilesArgs, WithHelpArg } from '../utils/cli-helper.ts';

type CliArguments = WithHelpArg<VerifyFilesArgs>;

const cliArguments = parse<CliArguments>(
  { ...helpArgConfig, ...verifyFilesArgsConfig },
  {
    ...helpArgOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '验证 package.json 和 pnpm-lock.yaml 是否同步',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': ignoreUnknown } = options;

const allRelatedFiles: string[] = [
  'package.json',
  'pnpm-lock.yaml',
  '.npmrc',
  'pnpm-workspace.yaml',
];
const { shouldRunVerification } = analyzeVerifyFiles({
  files,
  allRelatedFiles,
  ignoreUnknown,
  unknownErrorTitle: '以下文件与 lockfile 同步验证无关:',
});

if (!shouldRunVerification) {
  process.exit(0);
}

// 执行 pnpm install 验证
const { status, error } = spawnSync(
  'pnpm',
  ['install', '--frozen-lockfile', '--lockfile-only', '--loglevel=warn'],
  { stdio: 'inherit', shell: true },
);

if (error !== undefined) {
  print({
    type: 'error',
    title: '执行 lockfile 同步验证失败',
    description: error.message,
  });
  process.exit(1);
}

// 以 pnpm install 命令的退出状态退出进程
process.exit(status);
