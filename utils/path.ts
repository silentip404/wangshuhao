import path from 'node:path';

interface ToRelativePosixPathOptions {
  filename: string;
  addDotSlash?: boolean;
  relativeDirname?: string;
}

/**
 * 将任意格式的文件路径转换为相对于指定目录的 POSIX 格式路径
 *
 * @param filename - 原始文件路径，支持 \、/ 或混合格式
 * @param relativeDirname - 相对目录，默认为 process.cwd()
 * @param addDotSlash - 是否在路径前添加 ./ 前缀，默认为 false
 * @returns 标准化后的相对 POSIX 路径（使用正斜杠 /）
 *
 * @example
 * // Windows 环境下
 * toRelativePosixPath({ filename: 'scripts\\test.ts' })
 * // => 'scripts/test.ts'
 *
 * toRelativePosixPath({ filename: 'scripts/test.ts' })
 * // => 'scripts/test.ts'
 *
 * toRelativePosixPath({ filename: 'scripts\\..\\scripts/test.ts' })
 * // => 'scripts/test.ts'
 *
 * toRelativePosixPath({ filename: 'scripts\\test.ts', addDotSlash: true })
 * // => './scripts/test.ts'
 */
const toRelativePosixPath = ({
  filename,
  relativeDirname = process.cwd(),
  addDotSlash = false,
}: ToRelativePosixPathOptions): string => {
  const relativePath = path.relative(
    path.normalize(relativeDirname),
    path.normalize(filename),
  );

  const posixPath = relativePath.replace(/\\/gu, '/');

  return addDotSlash ? `./${posixPath}` : posixPath;
};

const getFilenameWithoutExtension = (filePath: string): string =>
  path.basename(filePath, path.extname(filePath));

export { getFilenameWithoutExtension, toRelativePosixPath };
