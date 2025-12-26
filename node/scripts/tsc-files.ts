import fs from 'fs';
import path from 'path';
import { styleText } from 'util';

import Handlebars from 'handlebars';
import { minimatch } from 'minimatch';
import { writeTSConfig } from 'pkg-types';
import {
  filter,
  forEach,
  isDefined,
  isEmptyish,
  join,
  map,
  omit,
  partition,
  pipe,
} from 'remeda';
import { exec } from 'tinyexec';
import { parse } from 'ts-command-line-args';

import { NEWLINE, printMessage } from '#lib/utils/index.ts';
import {
  helpArgConfig,
  helpArgOptions,
  projects,
  resolveFromRoot,
  ROOT,
  toRelativePosixPath,
} from '#node/utils/index.ts';
import type { WithHelpArg } from '#node/utils/index.ts';

type CliArguments = WithHelpArg<{
  'files': string[];
  'ignore-unknown'?: boolean;
}>;

const getConfigFilename = Handlebars.compile<{ name: string; uid: string }>(
  'tsconfig.tsc-files-{{uid}}.{{name}}.json',
);

const cleanConfigFiles = (): void => {
  const configFiles = pipe(
    fs.readdirSync(ROOT, { withFileTypes: true }),
    filter((dirent) => dirent.isFile()),
    map((dirent) => dirent.name),
    filter(minimatch.filter(getConfigFilename({ name: '*', uid: '*' }))),
  );

  forEach(configFiles, (configFile) => {
    fs.rmSync(resolveFromRoot(configFile), { force: true });
  });
};

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

cleanConfigFiles();

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': shouldIgnoreUnknown } = options;

const [allowedFiles, unknownFiles] = pipe(
  files,
  map((filename) => toRelativePosixPath({ filename })),
  partition(
    minimatch.filter(`**/*.{ts,tsx,d.ts,js,jsx,cts,d.cts,cjs,mts,d.mts,mjs}`),
  ),
);

// 如果存在未知文件且未设置忽略未知文件，则报错退出
if (!isEmptyish(unknownFiles) && shouldIgnoreUnknown !== true) {
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

if (isEmptyish(allowedFiles)) {
  process.exit(0);
}

const errorDescriptions: (
  | undefined
  | { configName: string; description: string }
)[] = await Promise.all(
  map(projects, async (project) => {
    const tscFiles = filter(allowedFiles, (allowedFile) =>
      project.include.some((pattern) => minimatch(allowedFile, pattern)),
    );

    if (isEmptyish(tscFiles)) {
      return;
    }

    const configFile = resolveFromRoot(
      getConfigFilename({ name: project.name, uid: process.pid.toString() }),
    );

    // 写入临时配置文件
    await writeTSConfig(configFile, {
      extends: toRelativePosixPath({
        filename: project.configName,
        shouldAddDotSlash: true,
      }),
      compilerOptions: { incremental: false, composite: false, noEmit: true },
      files: tscFiles,
      include: project.baseInclude,
    });

    const { exitCode, stdout, stderr } = await exec(
      'pnpm',
      ['exec', 'tsc', '--project', configFile, '--pretty'],
      { throwOnError: false },
    );

    if (exitCode === 0) {
      return;
    }

    return {
      configName: project.configName,
      description: join([stdout, stderr], NEWLINE),
    };
  }),
).finally(() => {
  cleanConfigFiles();
});

const definedErrorDescriptions = filter(errorDescriptions, isDefined);

if (!isEmptyish(definedErrorDescriptions)) {
  printMessage({
    type: 'error',
    title: '运行 tsc 检查失败',
    description: map(definedErrorDescriptions, ({ configName, description }) =>
      join(
        [styleText('red', `Using ${configName}:`), '', description],
        NEWLINE,
      ),
    ),
  });

  process.exit(1);
}
