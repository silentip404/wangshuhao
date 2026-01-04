import fs from 'node:fs';

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
  pipe,
} from 'remeda';
import { exec } from 'tinyexec';

import { NEWLINE } from '#lib/utilities/index.ts';
import {
  projects,
  resolveFromRoot,
  ROOT,
  toRelativePosixPath,
} from '#node/utilities/index.ts';

import type { TypeCheckResult } from './types.ts';

const buildTemporaryConfigFilename = Handlebars.compile<{
  name: string;
  uid: string;
}>('tsconfig.tsc-files-{{uid}}.{{name}}.json');

const cleanupTemporaryConfigs = (): void => {
  const temporaryConfigFiles = pipe(
    fs.readdirSync(ROOT, { withFileTypes: true }),
    filter((dirent) => dirent.isFile()),
    map((dirent) => dirent.name),
    filter(
      minimatch.filter(buildTemporaryConfigFilename({ name: '*', uid: '*' })),
    ),
  );

  forEach(temporaryConfigFiles, (temporaryConfigFile) => {
    fs.rmSync(resolveFromRoot(temporaryConfigFile), { force: true });
  });
};

/**
 * 使用 CLI 方式（tsc 命令）检查指定文件
 *
 * @returns isSuccess 表示检查是否通过，output 为格式化的诊断输出
 */
const typeCheckViaCli = async (
  typeCheckableFiles: string[],
): Promise<TypeCheckResult> => {
  cleanupTemporaryConfigs();

  const projectCheckResults: (
    | undefined
    | { configName: string; errorOutput: string }
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
        compilerOptions: { composite: false, incremental: false, noEmit: true },
        files: matchingFiles,
        include: project.baseInclude,
      });

      const { exitCode, stdout, stderr } = await exec(
        'pnpm',
        ['exec', 'tsc', '--project', temporaryConfigPath],
        { throwOnError: false },
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
    return { isSuccess: true, output: '' };
  }

  const output = join(
    map(failedProjects, ({ configName, errorOutput }) =>
      join([`Using ${configName}:`, '', errorOutput.trim(), ''], NEWLINE),
    ),
    NEWLINE,
  );

  return { isSuccess: false, output };
};

export { typeCheckViaCli };
