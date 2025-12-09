import fs from 'node:fs';
import path from 'node:path';

import { execa } from 'execa';
import { minimatch } from 'minimatch';
import { resolveTSConfig, writeTSConfig } from 'pkg-types';
import {
  filter,
  forEach,
  isEmptyish,
  join,
  map,
  omit,
  partition,
  pipe,
} from 'remeda';
import { parse } from 'ts-command-line-args';

import { helpArgConfig, helpArgOptions } from '../utils/cli-helper.ts';
import { toRelativePosixPath } from '../utils/path.ts';
import { printMessage } from '../utils/print-message.ts';

import type { WithHelpArg } from '../utils/cli-helper.ts';

type CliArguments = WithHelpArg<{
  'files': string[];
  'ignore-unknown'?: boolean;
}>;

const cliArguments = parse<CliArguments>(
  {
    ...helpArgConfig,
    'files': {
      type: String,
      typeLabel: 'file1.ts file2.ts ...',
      defaultOption: true,
      multiple: true,
      description: '文件列表',
    },
    'ignore-unknown': {
      type: Boolean,
      optional: true,
      description: '是否自动忽略未知文件',
    },
  },
  {
    ...helpArgOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '在尊重 tsconfig.json 配置的前提下，仅对指定文件运行 tsc 检查',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': ignoreUnknown } = options;

const typecheckExtensions: string[] = [
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
const [tscFiles, unknownFiles] = pipe(
  files,
  map((filename) => toRelativePosixPath({ filename })),
  partition(minimatch.filter(`**/*{${join(typecheckExtensions, ',')}}`)),
);

// 如果存在未知文件且未设置忽略未知文件，则报错退出
if (!isEmptyish(unknownFiles) && ignoreUnknown !== true) {
  printMessage({
    type: 'error',
    title: '检测到未知文件',
    description: [
      '以下文件无法运行 tsc 检查:',
      ...unknownFiles.map((file) => `  - ${file}`),
      '',
      '如需自动忽略未知文件，请使用 --ignore-unknown 选项',
    ],
  });
  process.exit(1);
}

if (isEmptyish(tscFiles)) {
  process.exit(0);
}

// 解析 TypeScript 配置文件
const configFilename = await resolveTSConfig();
const configDirname = path.dirname(configFilename);
const temporaryConfigBasename = 'tsconfig.tsc-files.*.json';
const temporaryConfigFilename = path.join(
  configDirname,
  temporaryConfigBasename.replace('*', process.pid.toString()),
);

// 清理旧的临时 TypeScript 配置文件
pipe(
  fs.readdirSync(configDirname, { withFileTypes: true }),
  filter((dirent) => dirent.isFile()),
  map((dirent) => dirent.name),
  filter(minimatch.filter(temporaryConfigBasename)),
  forEach((basename) => {
    const filename = path.join(configDirname, basename);

    fs.rmSync(filename, { force: true });
  }),
);

// 写入临时 TypeScript 配置文件
await writeTSConfig(temporaryConfigFilename, {
  extends: `./${path.basename(configFilename)}`,
  compilerOptions: { noEmit: true, incremental: false },
  files: tscFiles,
  include: [
    // 必要的基础类型声明文件
    // 需要与 tsconfig.json 中的 include 配置保持一致
    '**/*.d.ts',
    '**/*.d.cts',
    '**/*.d.mts',
    '.next/types/**/*.ts',
    '.next/dev/types/**/*.ts',
  ],
});

// 使用临时 TypeScript 配置文件执行 tsc 命令
const { exitCode, all } = await execa(
  'pnpm',
  ['tsc', '--project', temporaryConfigFilename, '--pretty'],
  { reject: false, all: true },
);

// 清理临时 TypeScript 配置文件
fs.rmSync(temporaryConfigFilename, { force: true });

if (exitCode !== 0) {
  console.error(all);
  process.exit(exitCode);
}
