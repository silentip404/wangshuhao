import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { Command } from 'commander';
import { readPackage } from 'pkg-types';
import readYamlFile from 'read-yaml-file';
import {
  isEmptyish,
  isIncludedIn,
  isNot,
  isNullish,
  isObjectType,
  map,
  partition,
  pipe,
  prop,
} from 'remeda';
import { z } from 'zod';

import { print } from '../utils/print.ts';

const program = new Command();

// 验证参数
const validateParameters = (
  args: unknown[],
): { files: string[]; options: { ignoreUnknown?: boolean } } => {
  const [untypedFiles, untypedOptions] = args;
  const filesSchema = z.array(z.string());
  const parsedFiles = filesSchema.safeParse(untypedFiles);

  if (!parsedFiles.success) {
    print({
      type: 'error',
      title: '文件参数解析失败',
      description: parsedFiles.error.message,
    });
    process.exit(1);
  }

  const optionsSchema = z.object({ ignoreUnknown: z.boolean().optional() });
  const parsedOptions = optionsSchema.safeParse(untypedOptions);

  if (!parsedOptions.success) {
    print({
      type: 'error',
      title: '选项参数解析失败',
      description: parsedOptions.error.message,
    });
    process.exit(1);
  }

  return { files: parsedFiles.data, options: parsedOptions.data };
};

// 获取相关文件
const getRelevantFiles = ({
  files,
  ignoreUnknown,
}: {
  files: string[];
  ignoreUnknown: boolean | undefined;
}): string[] => {
  const nodeVersionRelatedFiles = [
    'package.json',
    'pnpm-workspace.yaml',
    '.nvmrc',
    '.node-version',
  ];

  const [relevantFiles, irrelevantFiles] = pipe(
    files,
    map((filename) => path.normalize(filename)),
    map((filename) => path.relative(process.cwd(), filename)),
    map((filename) => filename.replace(/\\/g, '/')),
    partition((filename) => isIncludedIn(filename, nodeVersionRelatedFiles)),
  );

  if (isNot(isEmptyish)(irrelevantFiles) && isNullish(ignoreUnknown)) {
    print({
      type: 'error',
      title: '检测到不相关的文件',
      description: [
        '以下文件与 Node.js 版本配置同步检查无关:',
        '',
        ...irrelevantFiles.map((file) => ` - ${file}`),
        '',
        '如需自动忽略这些文件，请使用 --ignore-unknown 选项',
      ],
    });
    process.exit(1);
  }

  if (isNot(isEmptyish)(files) && isEmptyish(relevantFiles)) {
    process.exit(0);
  }

  return relevantFiles;
};

// 获取并验证 Node 版本
const getNodeVersion = async (): Promise<string> => {
  const localPackage = await readPackage();

  const nodeVersion = prop(localPackage, 'engines', 'node') as unknown;
  const exactNodeVersionRegex = /^(\d+\.\d+\.\d+)$/;

  if (nodeVersion === undefined) {
    print({
      type: 'error',
      title: '未读取到 Node.js 版本配置',
      description: '请在 package.json 中设置 engines.node 字段',
    });
    process.exit(1);
  }
  if (typeof nodeVersion !== 'string') {
    print({
      type: 'error',
      title: '错误的 Node.js 版本配置',
      description: '原因：package.json 中的 engines.node 字段必须为字符串',
    });
    process.exit(1);
  }
  if (!exactNodeVersionRegex.test(nodeVersion)) {
    print({
      type: 'error',
      title: '错误的 Node.js 版本配置',
      description: `原因：package.json 中的 engines.node 字段必须满足 ${exactNodeVersionRegex.source} 格式`,
    });
    process.exit(1);
  }

  return nodeVersion;
};

// 检查 package.json 中的 volta 配置
const checkVolta = async (nodeVersion: string): Promise<string | null> => {
  const localPackage = await readPackage();
  const voltaNodeVersion = prop(localPackage, 'volta', 'node') as unknown;

  if (voltaNodeVersion !== nodeVersion) {
    return `请在 package.json 中设置 volta.node 字段为 ${nodeVersion}`;
  }

  return null;
};

// 检查 pnpm-workspace.yaml
const checkPnpm = async (nodeVersion: string): Promise<string | null> => {
  const pnpmConfig = await readYamlFile('pnpm-workspace.yaml');

  if (isNot(isObjectType)(pnpmConfig)) {
    print({
      type: 'error',
      title: '解析后的 pnpm-workspace.yaml 配置格式错误',
      description: '解析后的 pnpm-workspace.yaml 配置必须为对象',
    });
    process.exit(1);
  }

  const pnpmNodeVersion = prop(pnpmConfig, 'useNodeVersion') as unknown;

  if (pnpmNodeVersion !== nodeVersion) {
    return `请在 pnpm-workspace.yaml 中设置 useNodeVersion 字段为 ${nodeVersion}`;
  }

  return null;
};

// 检查 .nvmrc
const checkNvmrcFile = async (nodeVersion: string): Promise<string | null> => {
  const nvmrcContent = await readFile('.nvmrc', 'utf-8');

  if (nvmrcContent.trim() !== nodeVersion) {
    return `请在 .nvmrc 中配置 Node.js 版本为 ${nodeVersion}`;
  }

  return null;
};

// 检查 .node-version
const checkNodeVersionFile = async (
  nodeVersion: string,
): Promise<string | null> => {
  const nodeVersionContent = await readFile('.node-version', 'utf-8');

  if (nodeVersionContent.trim() !== nodeVersion) {
    return `请在 .node-version 中配置 Node.js 版本为 ${nodeVersion}`;
  }

  return null;
};

program
  .name(path.basename(import.meta.url))
  .description('检查 Node.js 版本配置是否是否同步')
  .argument('[files...]', '需要检查的文件列表（可选）')
  .option('--ignore-unknown', '自动忽略不相关的文件')
  .action(async (...args) => {
    const { files, options } = validateParameters(args);
    const relevantFiles = getRelevantFiles({
      files,
      ignoreUnknown: options.ignoreUnknown,
    });
    const nodeVersion = await getNodeVersion();

    const shouldCheckFiles = (file: string): boolean => {
      if (isEmptyish(files)) {
        return true;
      }
      return isIncludedIn(file, relevantFiles);
    };

    const errorDescriptions: string[] = [];

    if (shouldCheckFiles('package.json')) {
      const errorDescription = await checkVolta(nodeVersion);
      if (errorDescription !== null) {
        errorDescriptions.push(errorDescription);
      }
    }

    if (shouldCheckFiles('pnpm-workspace.yaml')) {
      const errorDescription = await checkPnpm(nodeVersion);
      if (errorDescription !== null) {
        errorDescriptions.push(errorDescription);
      }
    }

    if (shouldCheckFiles('.nvmrc')) {
      const errorDescription = await checkNvmrcFile(nodeVersion);
      if (errorDescription !== null) {
        errorDescriptions.push(errorDescription);
      }
    }

    if (shouldCheckFiles('.node-version')) {
      const errorDescription = await checkNodeVersionFile(nodeVersion);
      if (errorDescription !== null) {
        errorDescriptions.push(errorDescription);
      }
    }

    if (isNot(isEmptyish)(errorDescriptions)) {
      print({
        type: 'error',
        title: '错误的 Node.js 版本配置',
        description: errorDescriptions,
      });
      process.exit(1);
    }
  });

program.parse();
