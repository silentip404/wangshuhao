import { readFile } from 'fs/promises';
import path from 'path';

import memoize from 'memoize';
import { readPackage } from 'pkg-types';
import { parse as parseYaml } from 'yaml';

import { ROOT } from './path.ts';

const memoizedReadPackageJson = memoize(() => readPackage(ROOT));

const memoizedReadYamlFile = memoize(
  async (filePath: string) => {
    const normalizedPath = path.resolve(filePath);
    const content = await readFile(normalizedPath, 'utf-8');

    return parseYaml(content) as unknown;
  },
  { cacheKey: ([filePath]) => path.resolve(filePath) },
);

export { memoizedReadPackageJson, memoizedReadYamlFile };
