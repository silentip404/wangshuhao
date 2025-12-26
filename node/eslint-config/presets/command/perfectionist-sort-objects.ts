import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { Linter } from 'eslint';
import { defineCommand } from 'eslint-plugin-command/commands';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { isTruthy } from 'remeda';

import { getFilenameWithoutExtension } from '#node/utils/index.ts';

import { createCommandMatcher, getCommandLoc } from './utils.ts';

const COMMAND = '@perfectionist-sort-objects';
const TEMPORARY_VARIABLE_PREFIX = 'const unsortedObject = ';

const matchCommand = createCommandMatcher(COMMAND);

const linter = new Linter();
const config: Linter.Config = {
  plugins: { perfectionist: perfectionistPlugin },
  rules: {
    'perfectionist/sort-objects': [
      'warn',
      { type: 'natural', ignoreCase: false },
    ],
  },
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
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

    const wrappedObjectText = `${TEMPORARY_VARIABLE_PREFIX}${objectText}`;
    const fixReport = linter.verifyAndFix(wrappedObjectText, config);

    if (fixReport.fixed && isTruthy(fixReport.output)) {
      const sortedObjectText = fixReport.output.slice(
        TEMPORARY_VARIABLE_PREFIX.length,
      );

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
