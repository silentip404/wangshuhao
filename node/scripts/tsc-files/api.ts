import path from 'path';

import { minimatch } from 'minimatch';
import { filter, isDefined, isEmptyish, join, map } from 'remeda';
import {
  createProgram,
  flattenDiagnosticMessageText,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript';
import type { Diagnostic } from 'typescript';

import { NEWLINE } from '#lib/utils/index.ts';
import {
  projects,
  resolveFromRoot,
  toRelativePosixPath,
} from '#node/utils/index.ts';

import type { TypeCheckResult } from './types.ts';

interface ProjectDiagnostics {
  configName: string;
  diagnostics: Diagnostic[];
}

const formatDiagnostic = (diagnostic: Diagnostic): string => {
  const message = flattenDiagnosticMessageText(
    diagnostic.messageText,
    sys.newLine,
  );

  if (diagnostic.file !== undefined && diagnostic.start !== undefined) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start,
    );
    const fileName = toRelativePosixPath({
      filename: diagnostic.file.fileName,
    });

    return `${fileName}(${line + 1},${character + 1}): error TS${diagnostic.code}: ${message}`;
  }

  return `error TS${diagnostic.code}: ${message}`;
};

const checkFilesWithProject = (
  projectConfigPath: string,
  filesToCheck: string[],
): Diagnostic[] => {
  // 读取 tsconfig 文件
  const configFileResult = readConfigFile(
    projectConfigPath,
    sys.readFile.bind(sys),
  );

  if (configFileResult.error !== undefined) {
    return [configFileResult.error];
  }

  // 解析 tsconfig 内容
  const parsedConfig = parseJsonConfigFileContent(
    configFileResult.config,
    sys,
    path.dirname(projectConfigPath),
    { noEmit: true },
    projectConfigPath,
  );

  if (!isEmptyish(parsedConfig.errors)) {
    return parsedConfig.errors;
  }

  // 将相对路径转换为绝对路径
  const absoluteFiles = map(filesToCheck, (file) => resolveFromRoot(file));

  // 创建 Program，只包含指定的文件
  const program = createProgram({
    rootNames: absoluteFiles,
    options: {
      ...parsedConfig.options,
      composite: false,
      incremental: false,
      noEmit: true,
    },
  });

  // 收集所有诊断信息
  const allDiagnostics = [
    ...program.getConfigFileParsingDiagnostics(),
    ...program.getOptionsDiagnostics(),
    ...program.getSyntacticDiagnostics(),
    ...program.getGlobalDiagnostics(),
    ...program.getSemanticDiagnostics(),
  ];

  // 过滤检查文件相关的诊断
  const absoluteFileSet = new Set(absoluteFiles);

  return filter(
    allDiagnostics,
    (diagnostic) =>
      diagnostic.file === undefined || // 全局错误
      absoluteFileSet.has(path.normalize(diagnostic.file.fileName)), // 指定文件的错误
  );
};

/**
 * 使用 TypeScript Compiler API 检查指定文件
 *
 * @returns isSuccess 表示检查是否通过，output 为格式化的诊断输出
 */
const typeCheckViaApi = (typeCheckableFiles: string[]): TypeCheckResult => {
  const projectDiagnostics: (undefined | ProjectDiagnostics)[] = map(
    projects,
    (project) => {
      const matchingFiles = filter(typeCheckableFiles, (file) =>
        project.include.some((pattern) => minimatch(file, pattern)),
      );

      if (isEmptyish(matchingFiles)) {
        return;
      }

      const configPath = resolveFromRoot(project.configName);
      const diagnostics = checkFilesWithProject(configPath, matchingFiles);

      if (isEmptyish(diagnostics)) {
        return;
      }

      return { configName: project.configName, diagnostics };
    },
  );

  const projectsWithErrors = filter(projectDiagnostics, isDefined);

  if (isEmptyish(projectsWithErrors)) {
    return { isSuccess: true, output: '' };
  }

  const output = join(
    map(projectsWithErrors, ({ configName, diagnostics }) => {
      const formattedDiagnostics = map(diagnostics, formatDiagnostic);

      return join(
        [`Using ${configName}:`, '', ...formattedDiagnostics, ''],
        NEWLINE,
      );
    }),
    NEWLINE,
  );

  return { isSuccess: false, output };
};

export { typeCheckViaApi };
