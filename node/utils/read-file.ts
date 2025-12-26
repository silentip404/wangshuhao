import { readFile } from 'fs/promises';
import path from 'path';

import memoize from 'memoize';
import { readPackage } from 'pkg-types';
import { parse as parseYaml } from 'yaml';

import { ROOT } from './path.ts';

const memoizedReadPackageJson = memoize(() => readPackage(ROOT));

const readYamlFile = async (filePath: string): Promise<unknown> => {
  const normalizedPath = path.resolve(filePath);
  const content = await readFile(normalizedPath, 'utf-8');

  return parseYaml(content) as unknown;
};

export { memoizedReadPackageJson, readYamlFile };
