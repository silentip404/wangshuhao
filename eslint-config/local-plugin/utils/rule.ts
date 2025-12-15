import { ESLintUtils } from '@typescript-eslint/utils';

import { getFilenameWithoutExtension } from '#node/utils';

const initRule = (
  ruleFilePath: string,
): {
  ruleName: string;
  createRule: ReturnType<typeof ESLintUtils.RuleCreator>;
} => {
  const ruleName = getFilenameWithoutExtension(ruleFilePath);
  const createRule = ESLintUtils.RuleCreator(
    (name) =>
      `https://github.com/silentip404/wangshuhao/blob/main/eslint-config/local-plugin/rules/${name}.ts`,
  );

  return { ruleName, createRule };
};

export { initRule };
