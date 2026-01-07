import { isEmptyish, isIncludedIn, map, partition, pipe } from 'remeda';
import type { ArgumentConfig, ParseOptions } from 'ts-command-line-args';

import { printMessage } from '#lib/utilities/print-message.ts';
import { toRelativePosixPath } from '#node/utilities/path.ts';

interface HelpArgument {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- help 符合命令行参数的标准惯例
  help?: boolean;
}
type WithHelpArgument<T> = HelpArgument & T;

const helpArgumentConfig: ArgumentConfig<HelpArgument> = {
  help: {
    type: Boolean,
    optional: true,
    alias: 'h',
    description: '获取帮助信息',
  },
};
const helpArgumentOptions: ParseOptions<HelpArgument> = {
  helpArg: 'help',
};

interface VerifyFilesArguments {
  'files'?: string[];
  'ignore-unknown'?: boolean;
}

const verifyFilesArgumentsConfig: ArgumentConfig<VerifyFilesArguments> = {
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
    map((filename) =>
      toRelativePosixPath({
        filename,
      }),
    ),
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

export type { VerifyFilesArguments, WithHelpArgument };

export {
  analyzeVerifyFiles,
  helpArgumentConfig,
  helpArgumentOptions,
  verifyFilesArgumentsConfig,
};
