import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  type TSESTree,
} from '@typescript-eslint/utils';
import { Linter } from 'eslint';
import { defineCommand } from 'eslint-plugin-command/commands';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { findLastIndex, isTruthy } from 'remeda';

import { getFilenameWithoutExtension, splitLines } from '#node/utils/index.ts';

const COMMAND = '@perfectionist-sort-objects';
const TEMPORARY_VARIABLE_PREFIX = 'const unsortedObject = ';

const matchCommand = (
  command: string,
  comment: TSESTree.Comment,
): null | undefined | boolean | RegExpMatchArray => {
  const trimmedValue = comment.value.trim();

  const regexString = (() => {
    switch (comment.type) {
      case AST_TOKEN_TYPES.Block:
        return String.raw`(?:\b|\s)${command}(?:\b|\s|$)`;
      case AST_TOKEN_TYPES.Line:
        return String.raw`^${command}$`;
      default:
        throw new Error(
          `Unexpected comment.type: ${JSON.stringify({ comment })}`,
        );
    }
  })();

  return new RegExp(regexString).exec(trimmedValue);
};

const getCommandLoc = (
  command: string,
  comment: TSESTree.Comment,
): TSESTree.SourceLocation => {
  const { loc } = comment;

  const commentLines = splitLines(comment.value);
  const commandCommentIndex = findLastIndex(commentLines, (commentLine) =>
    commentLine.includes(command),
  );
  const commandComment = commentLines[commandCommentIndex];

  if (commandComment === undefined) {
    return loc;
  }

  const columnOffset = commandComment.indexOf(command);

  const line = loc.start.line + commandCommentIndex;
  const column =
    commandCommentIndex === 0
      ? loc.start.column + '//'.length + columnOffset
      : columnOffset;

  return {
    start: { line, column },
    end: { line, column: column + command.length },
  };
};

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
  match: (comment) => matchCommand(COMMAND, comment),
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
