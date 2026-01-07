import { join, split, zipWith } from 'remeda';

import { getCaseVariants } from '#lib/utilities/string.ts';

/**
 * 将文本转换为大小写不敏感的 glob 模式
 *
 * @param text - 文本
 * @returns 大小写不敏感的 glob 模式
 */
const toCaseInsensitiveGlob = (text: string): string => {
  const { raw } = getCaseVariants(text);

  const letters = zipWith(
    split(raw.lowercase, ''),
    split(raw.UPPERCASE, ''),
    (lowercase, uppercase) => {
      if (lowercase === uppercase) {
        return lowercase;
      }

      return `[${lowercase}${uppercase}]`;
    },
  );

  return join(letters, '');
};

/*
 * ════════════════════════════════════════════════════════════════════════════
 * 通用匹配模式
 * 匹配所有文件或特定目录结构
 * ════════════════════════════════════════════════════════════════════════════
 */
const GLOB_ALL = '**';
const GLOB_ONE_LEVEL_FILES = '*/*';
const GLOB_DOT_FILES = '**/.*';
const GLOB_FILES_IN_DOT_DIRECTORY = '**/.*/**';

/*
 * ════════════════════════════════════════════════════════════════════════════
 * 文件类型模式
 * 匹配单一扩展名的原子模式，用于识别特定类型的源文件
 * ════════════════════════════════════════════════════════════════════════════
 */
const GLOB_JS = '**/*.?([cm])js';
const GLOB_TS = '**/*.?([cm])ts';
const GLOB_D_TS = '**/*.d.?([cm])ts';
const GLOB_JSX = '**/*.?([cm])jsx';
const GLOB_TSX = '**/*.?([cm])tsx';
const GLOB_JSON = '**/*.json';
const GLOB_JSONC = '**/*.jsonc';
const GLOB_JSON5 = '**/*.json5';
const GLOB_LICENSE = '**/LICENSE';

/*
 * ════════════════════════════════════════════════════════════════════════════
 * 项目特定文件模式
 * 匹配具有特定用途的文件
 * ════════════════════════════════════════════════════════════════════════════
 */
const GLOB_CONFIG_FILES = [
  '*.config.js',
  '*.config.ts',
  '*.config.*.ts',
  'nano-staged.js',
] as const;

const GLOB_SCRIPTS_FILES = 'node/scripts/**/*.ts';

const GLOB_EXTERNAL_TYPE_DECLARATIONS = 'external-types/**/*.d.ts';

const GLOB_PACKAGE_JSON = '**/package.json';

const GLOB_JSONC_SPECIAL = [
  '**/tsconfig.json',
  '**/tsconfig.*.json',
  '**/.vscode/**/*.json',
  '**/.vscode/**/*.code-snippets',
] as const;

/*
 * ════════════════════════════════════════════════════════════════════════════
 * TypeScript 项目配置
 * 用于各 tsconfig.*.json 的 include 字段
 * ════════════════════════════════════════════════════════════════════════════
 */
const GLOB_TSCONFIG_LIB_INCLUDE = ['lib/**/*.ts'] as const;
const GLOB_TSCONFIG_LIB_BASE_INCLUDE = [
  GLOB_EXTERNAL_TYPE_DECLARATIONS,
] as const;

const GLOB_TSCONFIG_APP_INCLUDE = ['app/**/*.ts', 'app/**/*.tsx'] as const;
const GLOB_TSCONFIG_APP_BASE_INCLUDE = [
  GLOB_EXTERNAL_TYPE_DECLARATIONS,
  'next-env.d.ts',
  '.next/types/**/*.ts',
  '.next/dev/types/**/*.ts',
] as const;

const GLOB_TSCONFIG_NODE_INCLUDE = ['*.js', '*.ts', 'node/**/*.ts'] as const;
const GLOB_TSCONFIG_NODE_BASE_INCLUDE = [
  GLOB_EXTERNAL_TYPE_DECLARATIONS,
] as const;

/*
 * ════════════════════════════════════════════════════════════════════════════
 * 组合模式
 * 基于上述原子模式聚合而成，用于匹配一组相关联的文件类型
 * ════════════════════════════════════════════════════════════════════════════
 */
const GLOB_COMBINED_JS = [
  GLOB_JS,
  GLOB_TS,
  GLOB_D_TS,
  GLOB_JSX,
  GLOB_TSX,
] as const;

const GLOB_COMBINED_DEPENDENCY_SOURCES = [
  GLOB_PACKAGE_JSON,
  ...GLOB_COMBINED_JS,
] as const;

const GLOB_COMBINED_JSONC = [GLOB_JSONC, ...GLOB_JSONC_SPECIAL] as const;

const GLOB_COMBINED_JSON = [
  GLOB_JSON,
  ...GLOB_COMBINED_JSONC,
  GLOB_JSON5,
] as const;

export {
  GLOB_ALL,
  GLOB_COMBINED_DEPENDENCY_SOURCES,
  GLOB_COMBINED_JS,
  GLOB_COMBINED_JSON,
  GLOB_COMBINED_JSONC,
  GLOB_CONFIG_FILES,
  GLOB_DOT_FILES,
  GLOB_EXTERNAL_TYPE_DECLARATIONS,
  GLOB_FILES_IN_DOT_DIRECTORY,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC_SPECIAL,
  GLOB_LICENSE,
  GLOB_ONE_LEVEL_FILES,
  GLOB_SCRIPTS_FILES,
  GLOB_TSCONFIG_APP_BASE_INCLUDE,
  GLOB_TSCONFIG_APP_INCLUDE,
  GLOB_TSCONFIG_LIB_BASE_INCLUDE,
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_BASE_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
  toCaseInsensitiveGlob,
};
