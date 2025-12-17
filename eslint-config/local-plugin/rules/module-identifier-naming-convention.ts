import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import { type RuleContext } from '@typescript-eslint/utils/ts-eslint';
import { find, isNullish } from 'remeda';

import { getSanitizedCaseVariants, type CaseVariants } from '#node/utils';

import {
  createESLintSchema,
  defineUnionJSONSchema,
  getNodeText,
  initRule,
  type InferSchema,
} from '../utils/index.ts';

type Context = RuleContext<MessageIds, [RuleOptions]>;
interface LintModuleIdentifierOptions {
  moduleIdentifier: string;
  type: Exclude<MatcherType, 'all'>;
}
type Matcher = NonNullable<RuleOptions['matchers']>[number];
type MatcherType = Matcher['type'];
type MessageIds =
  | 'invalidModuleIdentifier'
  | 'invalidRegexSource'
  | 'matcherNotFound';
interface RegexSourceMatcher {
  replace: (options: {
    modulePath: string;
    node: RelatedNode;
    regexSource: string;
    replacement: string;
  }) => string | null;
  test: (options: {
    modulePath: string;
    node: RelatedNode;
    regexSource: string;
  }) => boolean;
}
type RelatedNode =
  | TSESTree.ExportAllDeclaration
  | TSESTree.ExportNamedDeclaration
  | TSESTree.ImportDeclaration;
type RuleOptions = InferSchema<typeof eslintSchema>[0];

const typeSchema = defineUnionJSONSchema({
  type: 'string',
  enum: ['default', 'namespace', 'all'],
});
const regexSourceSchema = defineUnionJSONSchema({ type: 'string' });
const eslintSchema = createESLintSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    ignoreUnMatched: { type: 'boolean' },
    matchers: {
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['regexSource', 'mode', 'type', 'identifier'],
            properties: {
              type: typeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', const: 'equal' },
              identifier: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['regexSource', 'mode', 'type'],
            properties: {
              type: typeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', enum: ['camelCase', 'PascalCase'] },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: [
              'regexSource',
              'mode',
              'type',
              'replacement',
              'transformMode',
            ],
            properties: {
              type: typeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', const: 'replace' },
              replacement: { type: 'string' },
              transformMode: {
                type: 'string',
                enum: ['none', 'camelCase', 'PascalCase'],
              },
            },
          },
        ],
      },
    },
  },
});

const createRegexSourceMatcher = (context: Context): RegexSourceMatcher => {
  const cache = new Map<string, RegExp | null>();
  const reportedErrors = new Set<string>();

  const getOrCompileRegex = (
    node: RelatedNode,
    regexSource: string,
  ): RegExp | null => {
    if (!cache.has(regexSource)) {
      try {
        cache.set(regexSource, new RegExp(regexSource));
      } catch {
        cache.set(regexSource, null);
      }
    }

    const regex = cache.get(regexSource) ?? null;

    if (regex === null && !reportedErrors.has(regexSource)) {
      context.report({
        node,
        messageId: 'invalidRegexSource',
        data: { regexSource },
      });

      reportedErrors.add(regexSource);
    }

    return regex;
  };

  return {
    test: ({ modulePath, node, regexSource }): boolean => {
      const regex = getOrCompileRegex(node, regexSource);

      return regex?.test(modulePath) ?? false;
    },

    replace: ({
      modulePath,
      node,
      regexSource,
      replacement,
    }): string | null => {
      const regex = getOrCompileRegex(node, regexSource);

      return isNullish(regex) ? null : modulePath.replace(regex, replacement);
    },
  };
};

const lintModuleIdentifier = (
  lintContext: {
    context: Context;
    modulePathVariants: CaseVariants;
    node: RelatedNode;
    regexSourceMatcher: RegexSourceMatcher;
    ruleOptions: RuleOptions;
  },
  options: LintModuleIdentifierOptions,
): void => {
  const { moduleIdentifier, type } = options;

  const matchedMatcher = find(
    lintContext.ruleOptions.matchers ?? [],
    (matcher) => {
      if (!['all', type].includes(matcher.type)) {
        return false;
      }

      return lintContext.regexSourceMatcher.test({
        node: lintContext.node,
        regexSource: matcher.regexSource,
        modulePath: lintContext.modulePathVariants.raw,
      });
    },
  );

  if (matchedMatcher === undefined) {
    if (lintContext.ruleOptions.ignoreUnMatched === true) {
      return;
    }

    lintContext.context.report({
      node: lintContext.node,
      messageId: 'matcherNotFound',
      data: { modulePath: lintContext.modulePathVariants.raw },
    });

    return;
  }

  const reportInvalidModuleIdentifier = (
    expectedModuleIdentifier: string,
  ): void => {
    if (moduleIdentifier === expectedModuleIdentifier) {
      return;
    }

    lintContext.context.report({
      node: lintContext.node,
      messageId: 'invalidModuleIdentifier',
      data: {
        moduleIdentifier,
        modulePath: lintContext.modulePathVariants.raw,
        expectedModuleIdentifier,
      },
    });
  };

  const { mode } = matchedMatcher;

  switch (mode) {
    case 'equal': {
      const expectedModuleIdentifier = matchedMatcher.identifier;
      reportInvalidModuleIdentifier(expectedModuleIdentifier);

      break;
    }

    case 'camelCase':
    case 'PascalCase': {
      const expectedModuleIdentifier = (() => {
        switch (mode) {
          case 'camelCase':
            return lintContext.modulePathVariants.camelCase;
          case 'PascalCase':
            return lintContext.modulePathVariants.pascalCase;
          default:
            throw new Error(`Unexpected mode: ${JSON.stringify({ mode })}`);
        }
      })();
      reportInvalidModuleIdentifier(expectedModuleIdentifier);

      break;
    }

    case 'replace': {
      const { regexSource, replacement, transformMode } = matchedMatcher;

      const replacedModulePath = lintContext.regexSourceMatcher.replace({
        modulePath: lintContext.modulePathVariants.raw,
        node: lintContext.node,
        regexSource,
        replacement,
      });

      if (replacedModulePath === null) {
        // 正则替换失败，错误提示已由 regexSourceMatcher.replace 方法报告
        return;
      }

      const replacedModulePathVariants =
        getSanitizedCaseVariants(replacedModulePath);

      const expectedModuleIdentifier = (() => {
        switch (transformMode) {
          case 'none':
            return replacedModulePath;
          case 'camelCase':
            return replacedModulePathVariants.camelCase;
          case 'PascalCase':
            return replacedModulePathVariants.pascalCase;
          default:
            throw new Error(
              `Unexpected transformMode: ${JSON.stringify({ transformMode })}`,
            );
        }
      })();
      reportInvalidModuleIdentifier(expectedModuleIdentifier);

      break;
    }

    default: {
      throw new Error(`Unexpected mode: ${JSON.stringify({ mode })}`);
    }
  }
};

const { ruleName, createRule } = initRule(import.meta.url);

const ruleValue = createRule<[RuleOptions], MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    schema: eslintSchema,
    docs: {
      description:
        'Enforce consistent naming conventions for default and namespace identifiers based on module paths.',
    },
    messages: {
      matcherNotFound:
        'module path `{{modulePath}}` does not match any matcher.',
      invalidRegexSource: 'Invalid regex source: {{regexSource}}',
      invalidModuleIdentifier:
        'Module identifier `{{moduleIdentifier}}` for module path `{{modulePath}}` must be `{{expectedModuleIdentifier}}`.',
    },
  },
  defaultOptions: [
    {
      ignoreUnMatched: false,
      matchers: [
        { type: 'all', regexSource: /^.*$/v.source, mode: 'camelCase' },
      ],
    },
  ],
  create: (context, [ruleOptions]) => {
    const regexSourceMatcher = createRegexSourceMatcher(context);
    const baseLintContext = { context, ruleOptions, regexSourceMatcher };

    return {
      [`ImportDeclaration`]: (node) => {
        const modulePathVariants = getSanitizedCaseVariants(node.source.value);

        const defaultModuleIdentifier = find(
          node.specifiers,
          ({ type }) => type === AST_NODE_TYPES.ImportDefaultSpecifier,
        )?.local.name;
        const namespaceModuleIdentifier = find(
          node.specifiers,
          ({ type }) => type === AST_NODE_TYPES.ImportNamespaceSpecifier,
        )?.local.name;
        const namedDefaultModuleIdentifier = find(
          node.specifiers,
          (specifier) => {
            if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
              return false;
            }

            return getNodeText(specifier.imported) === 'default';
          },
        )?.local.name;

        const lintContext = { ...baseLintContext, node, modulePathVariants };

        if (defaultModuleIdentifier !== undefined) {
          lintModuleIdentifier(lintContext, {
            type: 'default',
            moduleIdentifier: defaultModuleIdentifier,
          });
        }

        if (namespaceModuleIdentifier !== undefined) {
          lintModuleIdentifier(lintContext, {
            type: 'namespace',
            moduleIdentifier: namespaceModuleIdentifier,
          });
        }

        if (namedDefaultModuleIdentifier !== undefined) {
          lintModuleIdentifier(lintContext, {
            type: 'default',
            moduleIdentifier: namedDefaultModuleIdentifier,
          });
        }
      },
      [`ExportAllDeclaration`]: (node) => {
        const modulePathVariants = getSanitizedCaseVariants(node.source.value);

        const namespaceModuleIdentifier = node.exported?.name;

        const lintContext = { ...baseLintContext, node, modulePathVariants };

        if (namespaceModuleIdentifier !== undefined) {
          lintModuleIdentifier(lintContext, {
            type: 'namespace',
            moduleIdentifier: namespaceModuleIdentifier,
          });
        }
      },
      [`ExportNamedDeclaration`]: (node) => {
        if (node.source === null) {
          return;
        }

        const modulePathVariants = getSanitizedCaseVariants(node.source.value);

        const namedDefaultModuleIdentifier = (() => {
          const namedDefaultSpecifier = find(
            node.specifiers,
            (specifier) => getNodeText(specifier.local) === 'default',
          );

          return namedDefaultSpecifier === undefined
            ? undefined
            : getNodeText(namedDefaultSpecifier.exported);
        })();

        const lintContext = { ...baseLintContext, node, modulePathVariants };

        if (namedDefaultModuleIdentifier !== undefined) {
          lintModuleIdentifier(lintContext, {
            type: 'default',
            moduleIdentifier: namedDefaultModuleIdentifier,
          });
        }
      },
    };
  },
});

export { ruleName, ruleValue };
