import path from 'node:path';

import { exec } from 'tinyexec';
import { parse as parseArguments } from 'ts-command-line-args';

import { printMessage } from '#lib/utilities/index.ts';
import { writeToScratch } from '#node/utilities/index.ts';

import type { WithHelpArgument } from './utilities.ts';
import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';

type CliArguments = WithHelpArgument<Record<never, never>>;

const OUTPUT_FILENAME = 'commitlint-config.json';

parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '生成 commitlint 配置文件到 scratch 目录',
      },
    ],
  },
);

const { exitCode, stdout, stderr } = await exec(
  'pnpm',
  ['exec', 'commitlint', '--print-config', 'json'],
  {
    throwOnError: false,
  },
);

if (exitCode !== 0) {
  printMessage({
    type: 'error',
    title: '获取 commitlint 配置失败',
    description: [stdout, stderr],
  });

  process.exit(exitCode);
}

await writeToScratch({
  contents: stdout,
  filename: OUTPUT_FILENAME,
});
