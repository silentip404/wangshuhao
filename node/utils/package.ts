import { isBuiltin } from 'module';

import { startsWith } from 'remeda';

import { ALIASES_REGEX } from './file-patterns.ts';

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

const isNpmPackage = (modulePath: string): boolean =>
  !startsWith(modulePath, '.') &&
  !startsWith(modulePath, '/') &&
  !ALIASES_REGEX.some((aliasRegex) => aliasRegex.test(modulePath)) &&
  !isBuiltin(modulePath);

export { isNpmPackage, parsePackageName };
