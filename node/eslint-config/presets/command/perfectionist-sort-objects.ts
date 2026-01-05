import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { Linter } from 'eslint';
import { defineCommand } from 'eslint-plugin-command/commands';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { isTruthy } from 'remeda';

import { getFilenameWithoutExtension } from '#node/utilities/index.ts';

import { createCommandMatcher, getCommandLoc } from './utilities.ts';

const COMMAND = '@perfectionist-sort-objects';
const TEMPORARY_VARIABLE_PREFIX = 'const unsortedObject = ';
const PLACEHOLDER_PREFIX = '"__SORT_PLACEHOLDER_';
const PLACEHOLDER_SUFFIX = '__"';

const matchCommand = createCommandMatcher(COMMAND);

const linter = new Linter();
const config: Linter.Config = {
  plugins: {
    perfectionist: perfectionistPlugin,
  },
  rules: {
    'perfectionist/sort-objects': [
      'warn',
      {
        type: 'natural',
        ignoreCase: false,
      },
    ],
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};

/**
 * 替换属性值为占位符
 */
const replacePropertyValues = (
  objectText: string,
  node: TSESTree.ObjectExpression | TSESTree.ObjectPattern,
  source: {
    getText: (node: TSESTree.Node) => string;
  },
): {
  placeholderMap: Map<string, string>;
  replacedText: string;
} => {
  const placeholderMap = new Map<string, string>();
  let replacedText = objectText;
  const [nodeStart] = node.range;

  const replacements: {
    end: number;
    originalText: string;
    start: number;
  }[] = [];

  for (const property of node.properties) {
    if (property.type !== AST_NODE_TYPES.Property) {
      continue;
    }

    const { value: valueNode } = property;
    const originalText = source.getText(valueNode);
    const relativeStart = valueNode.range[0] - nodeStart;
    const relativeEnd = valueNode.range[1] - nodeStart;

    replacements.push({
      end: relativeEnd,
      originalText,
      start: relativeStart,
    });
  }

  replacements.sort((left, right) => right.start - left.start);

  for (const [index, { start, end, originalText }] of replacements.entries()) {
    const placeholder = `${PLACEHOLDER_PREFIX}${index}${PLACEHOLDER_SUFFIX}`;

    placeholderMap.set(placeholder, originalText);
    replacedText =
      replacedText.slice(0, start) + placeholder + replacedText.slice(end);
  }

  return {
    placeholderMap,
    replacedText,
  };
};

/**
 * 将占位符替换回原始内容
 */
const restorePlaceholders = (
  text: string,
  placeholderMap: Map<string, string>,
): string => {
  let result = text;

  for (const [placeholder, original] of placeholderMap) {
    result = result.replace(placeholder, original);
  }

  return result;
};

const perfectionistSortObjects = defineCommand({
  name: getFilenameWithoutExtension(import.meta.url),
  commentType: 'both',
  match: matchCommand,
  action: (context) => {
    let node = context.findNodeBelow('ObjectExpression', 'ObjectPattern');

    if (node === undefined) {
      const variableDeclaration = context.findNodeBelow('VariableDeclaration');

      if (variableDeclaration?.type !== AST_NODE_TYPES.VariableDeclaration) {
        return;
      }

      const [declarator] = variableDeclaration.declarations;

      if (declarator.init?.type === AST_NODE_TYPES.ObjectExpression) {
        node = declarator.init;
      } else if (declarator.id.type === AST_NODE_TYPES.ObjectPattern) {
        node = declarator.id;
      }
    }

    if (node === undefined) {
      context.reportError('Unable to find object to sort.');

      return;
    }

    if (node.properties.length <= 1) {
      return;
    }

    const objectText = context.source.getText(node);

    // 替换所有属性值为占位符
    const { replacedText, placeholderMap } = replacePropertyValues(
      objectText,
      node,
      context.source,
    );

    const wrappedObjectText = `${TEMPORARY_VARIABLE_PREFIX}${replacedText}`;
    const fixReport = linter.verifyAndFix(wrappedObjectText, config);

    if (fixReport.fixed && isTruthy(fixReport.output)) {
      let sortedObjectText = fixReport.output.slice(
        TEMPORARY_VARIABLE_PREFIX.length,
      );

      // 将占位符替换回原始内容
      sortedObjectText = restorePlaceholders(sortedObjectText, placeholderMap);

      context.report({
        node,
        loc: getCommandLoc(COMMAND, context.comment),
        message: 'Object properties are not sorted.',
        removeComment: false,
        fix: (fixer) => fixer.replaceText(node, sortedObjectText),
      });
    }
  },
});

export { perfectionistSortObjects };
