import fs from 'fs';
import path from 'path';
import { printError } from './utils/print.mjs';

/**
 * 读取并解析 package.json
 */
function readPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    printError({
      title: '无法读取 package.json',
      description: ['读取 package.json 时出错', `${error.message}`],
    });
  }
}

/**
 * 读取并解析 pnpm-workspace.yaml
 */
function readPnpmWorkspace() {
  const workspacePath = path.join(process.cwd(), 'pnpm-workspace.yaml');
  try {
    const content = fs.readFileSync(workspacePath, 'utf-8');
    const lines = content.split('\n');
    const useNodeVersionLine = lines.find((line) => line.trim().startsWith('useNodeVersion:'));

    if (!useNodeVersionLine) {
      return null;
    }

    // 提取 useNodeVersion 的值
    const match = useNodeVersionLine.match(/useNodeVersion:\s*(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    printError({
      title: '无法读取 pnpm-workspace.yaml',
      description: ['读取 pnpm-workspace.yaml 时出错', `${error.message}`],
    });
  }
}

/**
 * 读取文件内容并去除换行符
 */
function readFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.trim();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // 文件不存在
    }
    printError({
      title: `无法读取 ${path.basename(filePath)}`,
      description: ['读取文件时出错', `${error.message}`],
    });
  }
}

/**
 * 检查版本一致性
 */
function checkNodeVersion() {
  const packageJson = readPackageJson();
  const expectedVersion = packageJson.engines?.node;

  if (!expectedVersion) {
    printError({
      title: 'package.json 缺少 engines.node 字段',
      description: '请在 package.json 中定义 engines.node 字段作为基准版本。',
    });
  }

  const errors = [];

  // 检查 volta.node
  const voltaNode = packageJson.volta?.node;
  if (voltaNode !== expectedVersion) {
    errors.push({
      config: 'package.json 的 volta.node',
      expected: expectedVersion,
      actual: voltaNode || '未定义',
    });
  }

  // 检查 pnpm-workspace.yaml 的 useNodeVersion
  const useNodeVersion = readPnpmWorkspace();
  if (useNodeVersion !== expectedVersion) {
    errors.push({
      config: 'pnpm-workspace.yaml 的 useNodeVersion',
      expected: expectedVersion,
      actual: useNodeVersion || '未定义',
    });
  }

  // 检查 .nvmrc
  const nvmrcPath = path.join(process.cwd(), '.nvmrc');
  const nvmrcVersion = readFileContent(nvmrcPath);
  if (nvmrcVersion !== expectedVersion) {
    errors.push({
      config: '.nvmrc',
      expected: expectedVersion,
      actual: nvmrcVersion || '文件不存在',
    });
  }

  // 检查 .node-version
  const nodeVersionPath = path.join(process.cwd(), '.node-version');
  const nodeVersion = readFileContent(nodeVersionPath);
  if (nodeVersion !== expectedVersion) {
    errors.push({
      config: '.node-version',
      expected: expectedVersion,
      actual: nodeVersion || '文件不存在',
    });
  }

  // 如果有错误，输出错误信息
  if (errors.length > 0) {
    const errorMessages = errors.map((error) => [
      `  - ${error.config}`,
      `    期望值: ${error.expected}`,
      `    实际值: ${error.actual}`,
    ]);

    printError({
      title: 'Node.js 版本配置不一致',
      description: [
        `检测到以下配置与 package.json 中的 engines.node (${expectedVersion}) 不一致：`,
        ...errorMessages.flat(),
        '请确保所有配置文件中的 Node.js 版本与 engines.node 字段严格一致。',
      ],
    });
  }
}

// 执行检查
checkNodeVersion();
