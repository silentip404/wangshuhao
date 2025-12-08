import path from 'node:path';

import { execa } from 'execa';
import { omit } from 'remeda';
import { parse } from 'ts-command-line-args';

import {
  filterTruthyCliArguments,
  helpArgConfig,
  helpArgOptions,
} from '../utils/cli-helper.ts';

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
const { exitCode, all } = await execa(
  'pnpm',
  [
    'typesync',
    ...filterTruthyCliArguments([
      shouldFix === true ? undefined : '--dry=fail',
    ]),
  ],
  { reject: false, all: true },
);

if (exitCode !== 0) {
  console.error(all);
  process.exit(exitCode);
}
