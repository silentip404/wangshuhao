import path from 'path';

import { omit } from 'remeda';
import { exec } from 'tinyexec';
import { parse } from 'ts-command-line-args';

import {
  analyzeVerifyFiles,
  helpArgConfig,
  helpArgOptions,
  printMessage,
  verifyFilesArgsConfig,
} from '#node/utils/index.ts';
import type { VerifyFilesArgs, WithHelpArg } from '#node/utils/index.ts';

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

const { files, 'ignore-unknown': shouldIgnoreUnknown } = options;

const allRelatedFiles: string[] = [
  'package.json',
  'pnpm-lock.yaml',
  '.npmrc',
  'pnpm-workspace.yaml',
];
const { shouldRunVerification } = analyzeVerifyFiles({
  files,
  allRelatedFiles,
  shouldIgnoreUnknown,
  unknownErrorTitle: '以下文件与 lockfile 同步验证无关:',
});

if (!shouldRunVerification) {
  process.exit(0);
}

// 执行 pnpm install 验证
const { exitCode, stdout, stderr } = await exec(
  'pnpm',
  ['install', '--frozen-lockfile', '--offline', '--loglevel=warn'],
  { throwOnError: false },
);

if (exitCode !== 0) {
  printMessage({
    type: 'error',
    title: '验证 package.json 和 pnpm-lock.yaml 同步失败',
    description: [stdout, stderr],
  });

  process.exit(exitCode);
}
