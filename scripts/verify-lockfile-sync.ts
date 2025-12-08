import path from 'node:path';

import { execa } from 'execa';
import { omit } from 'remeda';
import { parse } from 'ts-command-line-args';

import {
  analyzeVerifyFiles,
  helpArgConfig,
  helpArgOptions,
  verifyFilesArgsConfig,
} from '../utils/cli-helper.ts';

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
const { exitCode, all } = await execa(
  'pnpm',
  ['install', '--frozen-lockfile', '--lockfile-only', '--loglevel=warn'],
  { reject: false, all: true },
);

if (exitCode !== 0) {
  console.error(all);
  process.exit(exitCode);
}
