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

import { memoizedReadPackageJson } from './read-file.ts';

const parsePackageName = (
  modulePath: string,
): { packageName: string; subpath: string } => {
  const match =
    /^(?<scope>@[\-0-9a-z~][\-.0-9_a-z~]*\/)?(?<name>[\-0-9a-z~][\-.0-9_a-z~]*)(?:\/(?<subpath>.*))?$/v.exec(
      modulePath,
    );

  const { groups } = match ?? {};

  if (groups === undefined) {
    throw new Error(
      `配置 ${JSON.stringify(modulePath)} 不是有效的 npm 包路径，请检查相关配置`,
    );
  }

  const scope = groups['scope'] ?? '';
  const name = groups['name'] ?? '';
  const subpath = groups['subpath'] ?? '';

  return { packageName: scope + name, subpath };
};

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
