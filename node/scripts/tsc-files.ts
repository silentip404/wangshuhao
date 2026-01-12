import fs from 'node:fs';
import path from 'node:path';

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
import { parse as parseArguments } from 'ts-command-line-args';

import { printMessage } from '#lib/utilities/print-message.ts';
import {
  resolveFromRoot,
  ROOT,
  toRelativePosixPath,
} from '#node/utilities/path.ts';
import { projects } from '#node/utilities/typescript.ts';

import { NEWLINE } from '../utilities/string.ts';

import type { WithHelpArgument } from './utilities.ts';
import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';

type CliArguments = WithHelpArgument<{
  'files': string[];
  'ignore-unknown'?: boolean;
}>;
interface TypeCheckResult {
  isSuccess: boolean;
  output: string;
}

const TS_FILE_EXTENSIONS_PATTERN =
  '**/*.{ts,tsx,d.ts,js,jsx,cts,d.cts,cjs,mts,d.mts,mjs}';

const buildTemporaryConfigFilename = Handlebars.compile<{
  name: string;
  uid: string;
}>('tsconfig.tsc-files-{{uid}}.{{name}}.json');

const cleanupTemporaryConfigs = (): void => {
  const temporaryConfigFiles = pipe(
    fs.readdirSync(ROOT, {
      withFileTypes: true,
    }),
    filter((dirent) => dirent.isFile()),
    map((dirent) => dirent.name),
    filter(
      minimatch.filter(
        buildTemporaryConfigFilename({
          name: '*',
          uid: '*',
        }),
      ),
    ),
  );

  forEach(temporaryConfigFiles, (temporaryConfigFile) => {
    fs.rmSync(resolveFromRoot(temporaryConfigFile), {
      force: true,
    });
  });
};

const typeCheckViaCli = async (
  typeCheckableFiles: string[],
): Promise<TypeCheckResult> => {
  cleanupTemporaryConfigs();

  const projectCheckResults: (
    | undefined
    | {
        configName: string;
        errorOutput: string;
      }
  )[] = await Promise.all(
    map(projects, async (project) => {
      const matchingFiles = filter(typeCheckableFiles, (file) =>
        project.include.some((pattern) => minimatch(file, pattern)),
      );

      if (isEmptyish(matchingFiles)) {
        return;
      }

      const temporaryConfigPath = resolveFromRoot(
        buildTemporaryConfigFilename({
          name: project.name,
          uid: process.pid.toString(),
        }),
      );

      // 写入临时配置文件
      await writeTSConfig(temporaryConfigPath, {
        extends: toRelativePosixPath({
          filename: project.configName,
          shouldAddDotSlash: true,
        }),
        compilerOptions: {
          composite: false,
          incremental: false,
          noEmit: true,
        },
        files: matchingFiles,
        include: project.baseInclude,
      });

      const { exitCode, stdout, stderr } = await exec(
        'pnpm',
        ['exec', 'tsc', '--project', temporaryConfigPath, '--pretty'],
        {
          throwOnError: false,
        },
      );

      if (exitCode === 0) {
        return;
      }

      return {
        configName: project.configName,
        errorOutput: join([stdout, stderr], NEWLINE),
      };
    }),
  ).finally(() => {
    cleanupTemporaryConfigs();
  });

  const failedProjects = filter(projectCheckResults, isDefined);

  if (isEmptyish(failedProjects)) {
    return {
      isSuccess: true,
      output: '',
    };
  }

  const output = join(
    map(failedProjects, ({ configName, errorOutput }) =>
      join([`Using ${configName}:`, '', errorOutput.trim(), ''], NEWLINE),
    ),
    NEWLINE,
  );

  return {
    isSuccess: false,
    output,
  };
};

const cliArguments = parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,

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
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '在尊重 tsconfig.json 配置的前提下，仅对指定文件运行 tsc 检查',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': shouldIgnoreUnknown } = options;

const [typeCheckableFiles, unsupportedFiles] = pipe(
  files,
  map((filename) =>
    toRelativePosixPath({
      filename,
    }),
  ),
  // eslint-disable-next-line unicorn/no-array-callback-reference -- 此处为误报：minimatch.filter 接收的第一个参数为 pattern 字符串而非回调函数
  partition(minimatch.filter(TS_FILE_EXTENSIONS_PATTERN)),
);

// 如果存在未知文件且未设置忽略未知文件，则报错退出
if (!isEmptyish(unsupportedFiles) && shouldIgnoreUnknown !== true) {
  printMessage({
    type: 'error',
    title: '检测到未知文件',
    description: [
      '以下文件无法运行 tsc 检查:',
      ...unsupportedFiles.map((file) => `  - ${file}`),
      '',
      '如需自动忽略未知文件，请使用 --ignore-unknown 选项',
    ],
  });

  process.exit(1);
}

if (isEmptyish(typeCheckableFiles)) {
  process.exit(0);
}

const cliResult = await typeCheckViaCli(typeCheckableFiles);

if (!cliResult.isSuccess) {
  printMessage({
    type: 'error',
    title: '运行 tsc 检查失败',
    description: cliResult.output,
  });

  process.exit(1);
}
