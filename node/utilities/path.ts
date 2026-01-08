import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../');

interface ToRelativePosixPathOptions {
  filename: string;
  relativeDirname?: string;
  shouldAddDotSlash?: boolean;
}

const resolveFromRoot = (...pathSegments: string[]): string =>
  path.resolve(ROOT, ...pathSegments);

const toRelativePosixPath = ({
  filename,
  relativeDirname = ROOT,
  shouldAddDotSlash = false,
}: ToRelativePosixPathOptions): string => {
  const relativePath = path.relative(
    path.normalize(relativeDirname),
    path.normalize(filename),
  );
  const posixPath = relativePath.replaceAll('\\', '/');

  return shouldAddDotSlash ? `./${posixPath}` : posixPath;
};

const getFilenameWithoutExtension = (filePath: string): string =>
  path.basename(filePath, path.extname(filePath));

export {
  getFilenameWithoutExtension,
  resolveFromRoot,
  ROOT,
  toRelativePosixPath,
};
