import { isIncludedIn, map } from 'remeda';

import { getExistingDependencies, parsePackageName } from './package.ts';

const ensureModulePathInPackage = async (
  modulePath: string,
): Promise<string> => {
  const existingDependencies = await getExistingDependencies();
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
