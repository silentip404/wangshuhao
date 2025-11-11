import fs from 'fs';
import path from 'path';
import { print } from './utils/print';
import packageJSON from '../package.json';

interface VersionMismatch {
  config: string;
  expected: string;
  actual: string;
}

interface VersionCheck {
  name: string;
  getVersion: () => string | null;
}

/**
 * 安全退出程序并显示错误信息
 */
function exitWithError(title: string, description: string | string[]): never {
  print({ type: 'error', title, description });
  process.exit(1);
}

/**
 * 读取并解析 pnpm-workspace.yaml 中的 useNodeVersion
 */
function readPnpmWorkspaceVersion(): string | null {
  const workspacePath = path.join(process.cwd(), 'pnpm-workspace.yaml');
  try {
    const content = fs.readFileSync(workspacePath, 'utf-8');
    const lines = content.split('\n');
    const useNodeVersionLine = lines.find((line) => line.trim().startsWith('useNodeVersion:'));

    if (!useNodeVersionLine) {
      return null;
    }

    const match = useNodeVersionLine.match(/useNodeVersion:\s*(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    const err = error as Error;
    exitWithError('无法读取 pnpm-workspace.yaml', ['读取 pnpm-workspace.yaml 时出错', err.message]);
  }
}

/**
 * 读取文件内容并去除首尾空白字符
 */
function readVersionFile(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.trim();
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    exitWithError(`无法读取 ${path.basename(filePath)}`, ['读取文件时出错', err.message]);
  }
}

/**
 * 获取基准版本（从 package.json 的 engines.node）
 */
function getExpectedVersion(): string {
  const expectedVersion = packageJSON.engines?.node;

  if (!expectedVersion) {
    exitWithError(
      'package.json 缺少 engines.node 字段',
      '请在 package.json 中定义 engines.node 字段作为基准版本。',
    );
  }

  return expectedVersion;
}

/**
 * 收集所有需要检查的版本配置
 */
function getVersionChecks(): VersionCheck[] {
  return [
    { name: 'package.json 的 volta.node', getVersion: () => packageJSON.volta?.node || null },
    { name: 'pnpm-workspace.yaml 的 useNodeVersion', getVersion: readPnpmWorkspaceVersion },
    { name: '.nvmrc', getVersion: () => readVersionFile(path.join(process.cwd(), '.nvmrc')) },
    {
      name: '.node-version',
      getVersion: () => readVersionFile(path.join(process.cwd(), '.node-version')),
    },
  ];
}

/**
 * 检查所有版本配置并收集不匹配项
 */
function collectVersionMismatches(
  expectedVersion: string,
  checks: VersionCheck[],
): VersionMismatch[] {
  const mismatches: VersionMismatch[] = [];

  for (const check of checks) {
    const actualVersion = check.getVersion();
    if (actualVersion !== expectedVersion) {
      mismatches.push({
        config: check.name,
        expected: expectedVersion,
        actual: actualVersion || 'undefined',
      });
    }
  }

  return mismatches;
}

/**
 * 格式化错误信息
 */
function formatMismatchErrors(mismatches: VersionMismatch[], expectedVersion: string): string[] {
  const errorDetails = mismatches.map((mismatch) =>
    [
      `  - ${mismatch.config}`,
      `    期望值: ${mismatch.expected}`,
      `    实际值: ${mismatch.actual}`,
    ].join('\n'),
  );

  return [
    `检测到以下配置与 package.json 中的 engines.node (${expectedVersion}) 不一致：`,
    '',
    ...errorDetails,
    '',
    '请确保所有配置文件中的 Node.js 版本与 engines.node 字段严格一致。',
  ];
}

/**
 * 检查 Node.js 版本配置一致性
 */
function verifyNodeVersionConfig(): void {
  const expectedVersion = getExpectedVersion();
  const checks = getVersionChecks();
  const mismatches = collectVersionMismatches(expectedVersion, checks);

  if (mismatches.length > 0) {
    const errorMessages = formatMismatchErrors(mismatches, expectedVersion);
    exitWithError('Node.js 版本配置不一致', errorMessages);
  }
}

// 执行检查
verifyNodeVersionConfig();
