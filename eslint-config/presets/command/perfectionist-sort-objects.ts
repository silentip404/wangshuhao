import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils';
import { Linter } from 'eslint';
import { defineCommand } from 'eslint-plugin-command/commands';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { isTruthy, merge, pick, pipe } from 'remeda';

const TEMPORARY_VARIABLE_PREFIX = 'const unsortedObject = ';

const linter = new Linter();
const config: Linter.Config = {
  plugins: {
    perfectionist: pipe(
      perfectionistPlugin,
      pick(['meta', 'rules']),
      merge({ rules: pick(perfectionistPlugin.rules, ['sort-objects']) }),
    ),
  },
  rules: {
    'perfectionist/sort-objects': [
      'warn',
      { type: 'natural', ignoreCase: false },
    ],
  },
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};

const perfectionistSortObjects = defineCommand({
  name: 'perfectionist-sort-objects',
  commentType: 'both',
  match: (comment) => {
    const trimmedValue = comment.value.trim();

    const regex = (() => {
      switch (comment.type) {
        case AST_TOKEN_TYPES.Block:
          return /(?:\b|\s)@perfectionist-sort-objects(?:\b|\s|$)/v;
        case AST_TOKEN_TYPES.Line:
          return /^@perfectionist-sort-objects$/v;
        default:
          throw new Error(
            `Unexpected comment.type: ${JSON.stringify({ comment })}`,
          );
      }
    })();

    return regex.exec(trimmedValue);
  },
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
        message: 'Object properties are not sorted.',
        removeComment: false,
        fix: (fixer) => fixer.replaceText(node, sortedObjectText),
      });
    }
  },
});

export { perfectionistSortObjects };
