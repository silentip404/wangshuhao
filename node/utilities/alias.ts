import type { MMRegExp } from 'minimatch';
import { makeRe } from 'minimatch';
import { filter, isTruthy, keys, map, pipe } from 'remeda';
import { z } from 'zod';

import { memoizedReadPackageJson } from './read-file.ts';

const STAR_REGEX = /\*/gv;

const expectedImportsSchema = z.record(z.string(), z.string());

const { imports } = await memoizedReadPackageJson();
const parsedImports = expectedImportsSchema.parse(imports);
const aliases = keys(parsedImports);

// 检测 aliases 符合预期结构
for (const alias of aliases) {
  if (!alias.includes('*')) {
    continue;
  }

  const starCount = (alias.match(STAR_REGEX) ?? []).length;
  const isEndsWithSlashStar = alias.endsWith('/*');

  // 有且仅有一个 * 并且以 /* 结尾
  if (starCount !== 1 || !isEndsWithSlashStar) {
    throw new Error(`配置 ${alias} 不是期望的别名路径，请检查相关配置`);
  }
}

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

export { getAliasGlobs, getAliasRegexs };
