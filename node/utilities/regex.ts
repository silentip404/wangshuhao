import memoize from 'memoize';
import { join } from 'remeda';

import { NULL_CHAR } from './string.ts';

const memoizedCompileRegex = memoize(
  (regexSource: string): undefined | RegExp => {
    try {
      return new RegExp(regexSource);
    } catch {
      return undefined;
    }
  },
  {
    cacheKey: ([regexSource]) => regexSource,
  },
);

const memoizedRegexTest = memoize(
  (regexSource: string, text: string): undefined | boolean => {
    const regex = memoizedCompileRegex(regexSource);

    return regex === undefined ? undefined : regex.test(text);
  },
  {
    cacheKey: (parameters) => join(parameters, NULL_CHAR),
  },
);

const memoizedRegexReplace = memoize(
  (
    regexSource: string,
    text: string,
    replacement: string,
  ): undefined | string => {
    const regex = memoizedCompileRegex(regexSource);

    return regex === undefined ? undefined : text.replace(regex, replacement);
  },
  {
    cacheKey: (parameters) => join(parameters, NULL_CHAR),
  },
);

export { memoizedRegexReplace, memoizedRegexTest };
