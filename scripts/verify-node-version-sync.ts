import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { readPackage } from 'pkg-types';
import readYamlFile from 'read-yaml-file';
import {
  filter,
  isDefined,
  isEmptyish,
  isIncludedIn,
  map,
  omit,
  prop,
} from 'remeda';
import { parse } from 'ts-command-line-args';
import { z } from 'zod';

import {
  analyzeVerifyFiles,
  helpArgConfig,
  helpArgOptions,
  verifyFilesArgsConfig,
} from '../utils/cli-helper.ts';
import { printMessage } from '../utils/print-message.ts';

import type { VerifyFilesArgs, WithHelpArg } from '../utils/cli-helper.ts';

const packageJSON = await readPackage();

// 获取并验证 Node 版本
const getStandardNodeVersion = (): string => {
  const nodeVersion = prop(packageJSON, 'engines', 'node') as unknown;
  const exactNodeVersionRegex = /^(\d+\.\d+\.\d+)$/;

  if (nodeVersion === undefined) {
    printMessage({
      type: 'error',
      title: '未读取到 Node.js 版本配置',
      description: '请在 package.json 中设置 engines.node 字段',
    });
    process.exit(1);
  }
  if (typeof nodeVersion !== 'string') {
    printMessage({
      type: 'error',
      title: '错误的 Node.js 版本配置',
      description: '原因：package.json 中的 engines.node 字段必须为字符串',
    });
    process.exit(1);
  }
  if (!exactNodeVersionRegex.test(nodeVersion)) {
    printMessage({
      type: 'error',
      title: '错误的 Node.js 版本配置',
      description: `原因：package.json 中的 engines.node 字段必须满足 ${exactNodeVersionRegex.source} 格式`,
    });
    process.exit(1);
  }

  return nodeVersion;
};

type CliArguments = WithHelpArg<VerifyFilesArgs>;

const cliArguments = parse<CliArguments>(
  { ...helpArgConfig, ...verifyFilesArgsConfig },
  {
    ...helpArgOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '验证 Node.js 版本配置是否同步',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': ignoreUnknown } = options;

const allRelatedFiles: string[] = [
  'package.json',
  'pnpm-workspace.yaml',
  '.nvmrc',
  '.node-version',
];
const { shouldRunVerification, relatedFiles } = analyzeVerifyFiles({
  files,
  allRelatedFiles,
  ignoreUnknown,
  unknownErrorTitle: '以下文件与 Node.js 版本配置同步验证无关:',
});

if (!shouldRunVerification) {
  process.exit(0);
}

const shouldVerifyFile = (filename: string): boolean => {
  if (files === undefined) {
    return true;
  }

  return isIncludedIn(filename, relatedFiles);
};

const standardNodeVersion = getStandardNodeVersion();

const errors = await Promise.all([
  // 校验 package.json 中的 volta.node 字段
  Promise.resolve(
    (() => {
      if (!shouldVerifyFile('package.json')) {
        return;
      }

      const nodeVersion = prop(packageJSON, 'volta', 'node') as unknown;

      if (nodeVersion === standardNodeVersion) {
        return;
      }

      return `请在 package.json 中设置 volta.node 字段为 ${standardNodeVersion}`;
    })(),
  ),

  // 校验 pnpm-workspace.yaml 中的 useNodeVersion 字段
  (async () => {
    if (!shouldVerifyFile('pnpm-workspace.yaml')) {
      return;
    }

    const config = await readYamlFile('pnpm-workspace.yaml');
    const configSchema = z.record(z.string(), z.unknown());
    const nodeVersion = prop(configSchema.parse(config), 'useNodeVersion');

    if (nodeVersion === standardNodeVersion) {
      return;
    }

    return `请在 pnpm-workspace.yaml 中设置 useNodeVersion 字段为 ${standardNodeVersion}`;
  })(),

  // 校验 .nvmrc 中的 Node.js 版本
  (async () => {
    if (!shouldVerifyFile('.nvmrc')) {
      return;
    }

    const content = await readFile('.nvmrc', 'utf-8');
    const nodeVersion = content.trim();

    if (nodeVersion === standardNodeVersion) {
      return;
    }

    return `请在 .nvmrc 中设置 Node.js 版本为 ${standardNodeVersion}`;
  })(),

  // 校验 .node-version 中的 Node.js 版本
  (async () => {
    if (!shouldVerifyFile('.node-version')) {
      return;
    }

    const content = await readFile('.node-version', 'utf-8');
    const nodeVersion = content.trim();

    if (nodeVersion === standardNodeVersion) {
      return;
    }

    return `请在 .node-version 中设置 Node.js 版本为 ${standardNodeVersion}`;
  })(),
]);

const definedErrors = filter(errors, isDefined);

if (!isEmptyish(definedErrors)) {
  printMessage({
    type: 'error',
    title: '错误的 Node.js 版本配置',
    description: map(definedErrors, (definedError) => `- ${definedError}`),
  });

  process.exit(1);
}
