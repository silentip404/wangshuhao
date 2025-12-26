import memoize from 'memoize';
import { join } from 'remeda';

import { NULL_CHAR } from './string.ts';

const memoizedCompileRegex = memoize(
  (regexSource: string): null | RegExp => {
    try {
      return new RegExp(regexSource);
    } catch {
      return null;
    }
  },
  { cacheKey: ([regexSource]) => regexSource },
);

const memoizedRegexTest = memoize(
  (regexSource: string, text: string): null | boolean => {
    const regex = memoizedCompileRegex(regexSource);

    return regex === null ? null : regex.test(text);
  },
  { cacheKey: (parameters) => join(parameters, NULL_CHAR) },
);

const memoizedRegexReplace = memoize(
  (regexSource: string, text: string, replacement: string): null | string => {
    const regex = memoizedCompileRegex(regexSource);

    return regex === null ? null : text.replace(regex, replacement);
  },
  { cacheKey: (parameters) => join(parameters, NULL_CHAR) },
);

export { memoizedRegexReplace, memoizedRegexTest };
