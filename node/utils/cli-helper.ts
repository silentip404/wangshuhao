import { isEmptyish, isIncludedIn, map, partition, pipe } from 'remeda';
import type { ArgumentConfig, ParseOptions } from 'ts-command-line-args';

import { printMessage } from '#lib/utils/index.ts';

import { toRelativePosixPath } from './path.ts';

interface HelpArg {
  help?: boolean;
}
type WithHelpArg<T> = HelpArg & T;
const helpArgConfig: ArgumentConfig<HelpArg> = {
  help: {
    type: Boolean,
    optional: true,
    alias: 'h',
    description: '获取帮助信息',
  },
};
const helpArgOptions: ParseOptions<HelpArg> = { helpArg: 'help' };

interface VerifyFilesArgs {
  'files'?: string[];
  'ignore-unknown'?: boolean;
}
const verifyFilesArgsConfig: ArgumentConfig<VerifyFilesArgs> = {
  'files': {
    type: String,
    typeLabel: 'file1.ts file2.ts ...',
    defaultOption: true,
    multiple: true,
    optional: true,
    description: '文件列表',
  },
  'ignore-unknown': {
    type: Boolean,
    optional: true,
    description: '是否自动忽略未知文件',
  },
};
interface AnalyzeVerifyFilesOptions {
  allRelatedFiles: string[];
  unknownErrorTitle: string;
  files?: string[];
  shouldIgnoreUnknown?: boolean;
}
interface AnalyzeVerifyFilesResult {
  relatedFiles: string[];
  shouldRunVerification: boolean;
  unknownFiles: string[];
}
const analyzeVerifyFiles = (
  options: AnalyzeVerifyFilesOptions,
): AnalyzeVerifyFilesResult => {
  const { files, allRelatedFiles, shouldIgnoreUnknown, unknownErrorTitle } =
    options;

  const [relatedFiles, unknownFiles] = pipe(
    files ?? [],
    map((filename) => toRelativePosixPath({ filename })),
    partition((filename) => isIncludedIn(filename, allRelatedFiles)),
  );

  // 如果存在未知文件且未设置忽略未知文件，则报错退出
  if (!isEmptyish(unknownFiles) && shouldIgnoreUnknown !== true) {
    printMessage({
      type: 'error',
      title: '检测到未知文件',
      description: [
        unknownErrorTitle,
        '',
        ...unknownFiles.map((file) => `  - ${file}`),
        '',
        '如需自动忽略未知文件，请使用 --ignore-unknown 选项',
      ],
    });
    process.exit(1);
  }

  return {
    relatedFiles,
    unknownFiles,
    shouldRunVerification: files === undefined || !isEmptyish(relatedFiles),
  };
};

export type { VerifyFilesArgs, WithHelpArg };
export {
  analyzeVerifyFiles,
  helpArgConfig,
  helpArgOptions,
  verifyFilesArgsConfig,
};
