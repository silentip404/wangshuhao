import path from 'path';

import type { PackageJson } from 'pkg-types';
import { readPackage } from 'pkg-types';
import readYamlFile from 'read-yaml-file';

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
    cached = readYamlFile(normalizedPath);
    yamlFileCacheMap.set(normalizedPath, cached);

    cached.catch(() => {
      yamlFileCacheMap.delete(normalizedPath);
    });
  }

  return await cached;
};

export { readPackageJsonUsingCache, readYamlFileUsingCache };
