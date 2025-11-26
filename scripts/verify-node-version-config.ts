import fs from 'node:fs';
import path from 'node:path';

import { isTruthy } from 'remeda';

import packageJSON from '../package.json' with { type: 'json' };
import { print } from '../utils/print.ts';

interface VersionMismatch {
  config: string;
  expected: string;
  actual: string;
}

interface VersionCheck {
  name: string;
  getVersion: () => string | undefined;
}

/**
 * 读取并解析 pnpm-workspace.yaml 中的 useNodeVersion
 */
const readPnpmWorkspaceVersion = (): string | undefined => {
  const workspacePath = path.join(process.cwd(), 'pnpm-workspace.yaml');
  const content = fs.readFileSync(workspacePath, 'utf-8');
  const lines = content.split('\n');
  const useNodeVersionLine = lines.find((line) =>
    line.trim().startsWith('useNodeVersion:'),
  );

  if (!isTruthy(useNodeVersionLine)) {
    return;
  }

  const regex = /useNodeVersion:\s*(.+)/;
  const pnpmWorkspaceVersion = regex.exec(useNodeVersionLine)?.[1];

  return isTruthy(pnpmWorkspaceVersion) ? pnpmWorkspaceVersion : undefined;
};

/**
 * 读取文件内容并去除首尾空白字符
 */
const readVersionFile = (filePath: string): string => {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.readFileSync(fullPath, 'utf-8');
};

/**
 * 收集所有需要检查的版本配置
 */
const getVersionChecks = (): VersionCheck[] => [
  {
    name: 'package.json 的 volta.node',
    getVersion: () => packageJSON.volta.node,
  },
  {
    name: 'pnpm-workspace.yaml 的 useNodeVersion',
    getVersion: readPnpmWorkspaceVersion,
  },
  { name: '.nvmrc', getVersion: () => readVersionFile('.nvmrc') },
  { name: '.node-version', getVersion: () => readVersionFile('.node-version') },
];

/**
 * 检查所有版本配置并收集不匹配项
 */
const collectVersionMismatches = (
  expectedVersion: string,
  checks: VersionCheck[],
): VersionMismatch[] => {
  const mismatches: VersionMismatch[] = [];

  for (const check of checks) {
    const actualVersion = check.getVersion()?.trim();
    if (actualVersion !== expectedVersion) {
      mismatches.push({
        config: check.name,
        expected: expectedVersion,
        actual: isTruthy(actualVersion) ? actualVersion : 'undefined',
      });
    }
  }

  return mismatches;
};

/**
 * 格式化错误信息
 */
const formatMismatchErrors = (
  mismatches: VersionMismatch[],
  expectedVersion: string,
): string[] => {
  const errorDetails = mismatches.map((mismatch) =>
    [
      ` - ${mismatch.config}`,
      `   期望值: ${mismatch.expected}`,
      `   实际值: ${mismatch.actual}`,
    ].join('\n'),
  );

  return [
    `检测到以下配置与 package.json 中的 engines.node (${expectedVersion}) 不一致：`,
    '',
    ...errorDetails,
    '',
    '请确保所有配置文件中的 Node.js 版本与 engines.node 字段严格一致。',
  ];
};

/**
 * 检查 Node.js 版本配置一致性
 */
const verifyNodeVersionConfig = (): void => {
  const expectedVersion = packageJSON.engines.node;
  const checks = getVersionChecks();
  const mismatches = collectVersionMismatches(expectedVersion, checks);

  if (mismatches.length > 0) {
    const errorMessages = formatMismatchErrors(mismatches, expectedVersion);

    print({
      type: 'error',
      title: 'Node.js 版本配置不一致',
      description: errorMessages,
    });
    process.exit(1);
  }
};

// 执行检查
verifyNodeVersionConfig();
