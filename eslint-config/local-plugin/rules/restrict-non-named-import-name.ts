import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import {
  capitalize,
  filter,
  find,
  isNullish,
  map,
  only,
  pipe,
  toCamelCase,
} from 'remeda';

import {
  createESLintSchema,
  defineUnionJSONSchema,
  initRule,
  type InferSchema,
} from '../utils/index.ts';

const importTypeSchema = defineUnionJSONSchema({
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
            required: ['regexSource', 'mode', 'importType', 'value'],
            properties: {
              importType: importTypeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', const: 'equal' },
              value: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['regexSource', 'mode', 'importType'],
            properties: {
              importType: importTypeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', const: 'camelCase' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['regexSource', 'mode', 'importType'],
            properties: {
              importType: importTypeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', const: 'PascalCase' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: [
              'regexSource',
              'mode',
              'importType',
              'template',
              'transform',
            ],
            properties: {
              importType: importTypeSchema,
              regexSource: regexSourceSchema,
              mode: { type: 'string', const: 'template' },
              template: { type: 'string' },
              transform: {
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

type Matcher = NonNullable<Options['0']['matchers']>[number];
type MatcherImportType = Matcher['importType'];
type MessageIds =
  | 'invalidImportName'
  | 'invalidRegexSource'
  | 'matcherNotFound';
type Options = InferSchema<typeof eslintSchema>;
type RegexErrorIdentifier = null;

const getNameVariants = (
  input: string,
): { camelCase: string; pascalCase: string } => {
  const sanitized = input.replace(/[^0-9a-z]+/giv, ' ');
  const camelCase = toCamelCase(sanitized);
  const pascalCase = capitalize(camelCase);

  return { camelCase, pascalCase };
};

const parseImportDeclaration = (
  node: TSESTree.ImportDeclaration,
): {
  camelCaseImportName: string;
  defaultImportName?: string;
  namespaceImportName?: string;
  packageName: string;
  pascalCaseImportName: string;
} => {
  const parseSpecifierNameByType = (
    type: TSESTree.ImportClause['type'],
  ): string | undefined =>
    pipe(
      node.specifiers,
      filter((specifier) => specifier.type === type),
      map((specifier) => specifier.local.name),
      only(),
    );

  const packageName = node.source.value;
  const packageNameVariants = getNameVariants(packageName);

  return {
    packageName,
    defaultImportName: parseSpecifierNameByType(
      AST_NODE_TYPES.ImportDefaultSpecifier,
    ),
    namespaceImportName: parseSpecifierNameByType(
      AST_NODE_TYPES.ImportNamespaceSpecifier,
    ),
    camelCaseImportName: packageNameVariants.camelCase,
    pascalCaseImportName: packageNameVariants.pascalCase,
  };
};

const { ruleName, createRule } = initRule(import.meta.url);

const ruleValue = createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    schema: eslintSchema,
    docs: {
      description:
        'Enforce consistent naming conventions for default and namespace imports based on package names.',
    },
    messages: {
      matcherNotFound: 'Package `{{packageName}}` does not match any matcher.',
      invalidRegexSource: 'Invalid regex source: {{regexSource}}',
      invalidImportName:
        'Import name `{{importName}}` for package `{{packageName}}` must be `{{expectedImportName}}`.',
    },
  },
  defaultOptions: [
    {
      ignoreUnMatched: false,
      matchers: [
        { importType: 'all', regexSource: /^.*$/v.source, mode: 'camelCase' },
      ],
    },
  ],
  create: (context, options) => {
    const [{ ignoreUnMatched, matchers }] = options;

    const createRegexMatcher = (): {
      replace: (options: {
        node: TSESTree.ImportDeclaration;
        regexSource: string;
        replacement: string;
        sourceString: string;
      }) => RegexErrorIdentifier | string;
      test: (options: {
        node: TSESTree.ImportDeclaration;
        regexSource: string;
        testString: string;
      }) => boolean;
    } => {
      const cache = new Map<string, RegexErrorIdentifier | RegExp>();
      const reportedErrors = new Set<string>();

      const getOrCompileRegex = (
        regexSource: string,
        node: TSESTree.ImportDeclaration,
      ): RegexErrorIdentifier | RegExp | undefined => {
        if (!cache.has(regexSource)) {
          try {
            cache.set(regexSource, new RegExp(regexSource));
          } catch {
            cache.set(regexSource, null);
          }
        }

        const regex = cache.get(regexSource);

        if (isNullish(regex) && !reportedErrors.has(regexSource)) {
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
        test: ({ regexSource, testString, node }): boolean => {
          const regex = getOrCompileRegex(regexSource, node);
          return regex?.test(testString) ?? false;
        },

        replace: ({
          regexSource,
          sourceString,
          replacement,
          node,
        }): RegexErrorIdentifier | string => {
          const regex = getOrCompileRegex(regexSource, node);
          return isNullish(regex)
            ? null
            : sourceString.replace(regex, replacement);
        },
      };
    };

    const regexMatcher = createRegexMatcher();

    const checkImportName = ({
      node,
      importName,
      importType,
      packageName,
      camelCaseImportName,
      pascalCaseImportName,
    }: {
      camelCaseImportName: string;
      importName: string;
      importType: MatcherImportType;
      node: TSESTree.ImportDeclaration;
      packageName: string;
      pascalCaseImportName: string;
    }): void => {
      const matchedMatcher = find(matchers ?? [], (matcher) => {
        if (matcher.importType !== 'all' && matcher.importType !== importType) {
          return false;
        }

        return regexMatcher.test({
          regexSource: matcher.regexSource,
          testString: packageName,
          node,
        });
      });

      if (matchedMatcher === undefined) {
        if (ignoreUnMatched === true) {
          return;
        }

        context.report({
          node,
          messageId: 'matcherNotFound',
          data: { packageName },
        });

        return;
      }

      const { mode } = matchedMatcher;

      switch (mode) {
        case 'equal': {
          const { value } = matchedMatcher;

          if (importName !== value) {
            context.report({
              node,
              messageId: 'invalidImportName',
              data: { importName, packageName, expectedImportName: value },
            });
          }
          break;
        }

        case 'camelCase':
        case 'PascalCase': {
          const expectedImportName = {
            [`camelCase`]: camelCaseImportName,
            [`PascalCase`]: pascalCaseImportName,
          }[mode];

          if (importName !== expectedImportName) {
            context.report({
              node,
              messageId: 'invalidImportName',
              data: { importName, packageName, expectedImportName },
            });
          }
          break;
        }

        case 'template': {
          const { regexSource, template, transform } = matchedMatcher;

          const transformedName = regexMatcher.replace({
            regexSource,
            sourceString: packageName,
            replacement: template,
            node,
          });

          if (transformedName === null) {
            return;
          }

          const transformedNameVariants = getNameVariants(transformedName);

          let expectedImportName = transformedName;

          switch (transform) {
            case 'none':
              break;
            case 'camelCase':
              expectedImportName = transformedNameVariants.camelCase;
              break;
            case 'PascalCase':
              expectedImportName = transformedNameVariants.pascalCase;
              break;
            default:
              throw new Error(
                `Invalid transform: ${JSON.stringify({ transform })}`,
              );
          }

          if (importName !== expectedImportName) {
            context.report({
              node,
              messageId: 'invalidImportName',
              data: { importName, packageName, expectedImportName },
            });
          }
          break;
        }

        default: {
          throw new Error(`Invalid mode: ${JSON.stringify({ mode })}`);
        }
      }
    };

    return {
      [`ImportDeclaration`]: (node) => {
        const {
          packageName,
          defaultImportName,
          namespaceImportName,
          camelCaseImportName,
          pascalCaseImportName,
        } = parseImportDeclaration(node);

        if (defaultImportName !== undefined) {
          checkImportName({
            node,
            packageName,
            importName: defaultImportName,
            importType: 'default',
            camelCaseImportName,
            pascalCaseImportName,
          });
        }

        if (namespaceImportName !== undefined) {
          checkImportName({
            node,
            packageName,
            importName: namespaceImportName,
            importType: 'namespace',
            camelCaseImportName,
            pascalCaseImportName,
          });
        }
      },
    };
  },
});

export { ruleName, ruleValue };
