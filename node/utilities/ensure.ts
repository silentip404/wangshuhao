import {
  flatMap,
  isIncludedIn,
  keys,
  map,
  pickBy,
  pipe,
  toLowerCase,
  values,
} from 'remeda';

import { parsePackageName } from './package.ts';
import { memoizedReadPackageJson } from './read-file.ts';

const ensureModulePathInPackage = async (
  modulePath: string,
): Promise<string> => {
  const existingDependencies = pipe(
    await memoizedReadPackageJson(),
    pickBy((value, key) => toLowerCase(key).endsWith('dependencies')),
    values(),
    flatMap(keys()),
  );

  const { packageName } = parsePackageName(modulePath);

  if (isIncludedIn(packageName, existingDependencies)) {
    return modulePath;
  }

  throw new Error(
    `配置 ${packageName}(${modulePath}) 未添加到 package.json 中，请检查相关配置`,
  );
};

const ensureModulePathsInPackage = async (
  modulePaths: string[],
): Promise<string[]> => {
  const ensuredModulePaths = await Promise.all(
    map(modulePaths, ensureModulePathInPackage),
  );

  return ensuredModulePaths;
};

export { ensureModulePathInPackage, ensureModulePathsInPackage };
