import {
  concat,
  drop,
  isEmptyish,
  isNumber,
  isString,
  map,
  mapValues,
  merge,
} from 'remeda';

import type { Severity } from '@eslint/core';
import type { Config } from 'eslint/config';

const normalizeSeverity = (configs: Config[], severity: Severity): Config[] =>
  map(configs, (config) => {
    const { rules } = config;

    if (isEmptyish(rules)) {
      return config;
    }

    return merge(config, {
      rules: mapValues(rules, (ruleValue) => {
        if (isEmptyish(ruleValue)) {
          return ruleValue;
        }

        if (isString(ruleValue) || isNumber(ruleValue)) {
          return severity;
        }

        const ruleOptions = drop(ruleValue, 1);

        return concat([severity], ruleOptions);
      }),
    });
  });

export { normalizeSeverity };
