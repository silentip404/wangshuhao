import { isBuiltin } from 'node:module';

import {
  flatMap,
  keys,
  pickBy,
  pipe,
  startsWith,
  toLowerCase,
  values,
} from 'remeda';

import { getAliasRegexs } from './alias.ts';
import { memoizedReadPackageJson } from './read-file.ts';

const parsePackageName = (
  modulePath: string,
): {
  packageName: string;
  subpath: string;
} => {
  const match =
    /^(?<scope>@[\-0-9a-z~][\-.0-9_a-z~]*\/)?(?<name>[\-0-9a-z~][\-.0-9_a-z~]*)(?:\/(?<subpath>.*))?$/v.exec(
      modulePath,
    );
  const { groups } = match ?? {};

  if (groups === undefined) {
    throw new Error(`配置 ${modulePath} 不是有效的 npm 包路径，请检查相关配置`);
  }

  const scope = groups['scope'] ?? '';
  const name = groups['name'] ?? '';
  const subpath = groups['subpath'] ?? '';

  return {
    packageName: scope + name,
    subpath,
  };
};

const isNpmPackage = (modulePath: string): boolean => {
  const ALIAS_REGEXS = getAliasRegexs();

  return (
    !startsWith(modulePath, '.') &&
    !startsWith(modulePath, '/') &&
    !ALIAS_REGEXS.some((aliasRegex) => aliasRegex.test(modulePath)) &&
    !isBuiltin(modulePath)
  );
};

const getExistingDependencies = async (): Promise<string[]> =>
  pipe(
    await memoizedReadPackageJson(),
    pickBy((value, key) => toLowerCase(key).endsWith('dependencies')),
    values(),
    flatMap(keys()),
  );

export { getExistingDependencies, isNpmPackage, parsePackageName };
