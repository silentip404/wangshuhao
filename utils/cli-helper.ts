import { isEmptyish, isIncludedIn, map, partition, pipe } from 'remeda';

import { toRelativePosixPath } from './path.ts';
import { printMessage } from './print-message.ts';

import type { ArgumentConfig, ParseOptions } from 'ts-command-line-args';

interface HelpArg {
  help?: boolean;
}
type WithHelpArg<T> = T & HelpArg;
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
  files?: string[];
  allRelatedFiles: string[];
  ignoreUnknown?: boolean;
  unknownErrorTitle: string;
}
interface AnalyzeVerifyFilesResult {
  relatedFiles: string[];
  unknownFiles: string[];
  shouldRunVerification: boolean;
}
const analyzeVerifyFiles = (
  options: AnalyzeVerifyFilesOptions,
): AnalyzeVerifyFilesResult => {
  const { files, allRelatedFiles, ignoreUnknown, unknownErrorTitle } = options;

  const [relatedFiles, unknownFiles] = pipe(
    files ?? [],
    map((filename) => toRelativePosixPath({ filename })),
    partition((filename) => isIncludedIn(filename, allRelatedFiles)),
  );

  // 如果存在未知文件且未设置忽略未知文件，则报错退出
  if (!isEmptyish(unknownFiles) && ignoreUnknown !== true) {
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

export {
  helpArgConfig,
  helpArgOptions,
  type VerifyFilesArgs,
  type WithHelpArg,
  verifyFilesArgsConfig,
  analyzeVerifyFiles,
};
