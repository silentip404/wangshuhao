import { readFile } from 'fs/promises';
import path from 'path';

import type { PackageJson } from 'pkg-types';
import { readPackage } from 'pkg-types';
import { parse as parseYaml } from 'yaml';

import { ROOT } from './path.ts';

let packageJsonCachePromise: undefined | Promise<PackageJson> = undefined;
const yamlFileCacheMap = new Map<string, Promise<unknown>>();

const readPackageJsonUsingCache = async (): Promise<PackageJson> => {
  if (packageJsonCachePromise === undefined) {
    packageJsonCachePromise = readPackage(ROOT);

    packageJsonCachePromise.catch(() => {
      packageJsonCachePromise = undefined;
    });
  }

  return await packageJsonCachePromise;
};

const readYamlFileUsingCache = async (filePath: string): Promise<unknown> => {
  const normalizedPath = path.resolve(filePath);

  let cached = yamlFileCacheMap.get(normalizedPath);

  if (cached === undefined) {
    cached = (async () => {
      const content = await readFile(normalizedPath, 'utf-8');

      return parseYaml(content) as unknown;
    })();

    yamlFileCacheMap.set(normalizedPath, cached);

    cached.catch(() => {
      yamlFileCacheMap.delete(normalizedPath);
    });
  }

  return await cached;
};

export { readPackageJsonUsingCache, readYamlFileUsingCache };
