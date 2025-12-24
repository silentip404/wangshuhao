import type { Linter } from 'eslint';
import type { Config } from 'eslint/config';
import {
  concat,
  drop,
  isArray,
  isEmptyish,
  isNumber,
  isString,
  map,
  mapValues,
  merge,
} from 'remeda';

const normalizeSeverity = (
  configs: Config[],
  severity: Linter.RuleSeverity,
): Config[] =>
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

        if (isArray(ruleValue)) {
          const ruleOptions = drop(ruleValue, 1);
          return concat([severity], ruleOptions);
        }

        return ruleValue satisfies never;
      }),
    });
  });

export { normalizeSeverity };
