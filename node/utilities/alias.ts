import type { MMRegExp } from 'minimatch';
import { makeRe } from 'minimatch';
import { filter, isTruthy, keys, map, pipe } from 'remeda';
import { z } from 'zod';

import { memoizedReadPackageJson } from './read-file.ts';

const STAR_REGEX = /\*/gv;

const isValidAliasPattern = (pattern: string): boolean => {
  if (!pattern.includes('*')) {
    return true;
  }

  const starCount = (pattern.match(STAR_REGEX) ?? []).length;
  const isEndsWithSlashStar = pattern.endsWith('/*');

  // 有且仅有一个 * 并且以 /* 结尾
  return starCount === 1 && isEndsWithSlashStar;
};

const expectedImportsSchema = z.record(z.string(), z.string());

const { imports } = await memoizedReadPackageJson();
const aliasesObject = expectedImportsSchema.parse(imports);

// 检测 aliasesObject 的 key 和 value 符合预期结构
for (const [key, value] of Object.entries(aliasesObject)) {
  if (!isValidAliasPattern(key)) {
    throw new Error(`配置 ${key} 不是期望的别名路径，请检查相关配置`);
  }

  if (!isValidAliasPattern(value)) {
    throw new Error(`配置 ${value} 不是期望的别名路径，请检查相关配置`);
  }
}

const aliases = keys(aliasesObject);
let aliasGlobs: undefined | string[];
let aliasRegexs: undefined | MMRegExp[];

const getAliasGlobs = (): string[] => {
  aliasGlobs ??= map(aliases, (alias) => {
    if (!alias.includes('*')) {
      return alias;
    }

    return alias.replace('/*', '/**');
  });

  return aliasGlobs;
};

const getAliasRegexs = (): MMRegExp[] => {
  aliasRegexs ??= pipe(
    getAliasGlobs(),
    map((glob) =>
      makeRe(glob, {
        nocomment: true,
      }),
    ),
    filter(isTruthy),
  );

  return aliasRegexs;
};

export { aliasesObject, getAliasGlobs, getAliasRegexs };
