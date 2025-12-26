import { AST_TOKEN_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { findLastIndex } from 'remeda';

import { splitLines } from '#lib/utils/index.ts';

const createCommandMatcher = (command: string) => {
  const blockRegex = new RegExp(
    String.raw`(?:\b|\s)${command}(?:\b|\s|$)`,
    'v',
  );
  const lineRegex = new RegExp(String.raw`^${command}$`, 'v');

  return (
    comment: TSESTree.Comment,
  ): null | undefined | boolean | RegExpMatchArray => {
    const trimmedValue = comment.value.trim();

    const regex = (() => {
      switch (comment.type) {
        case AST_TOKEN_TYPES.Block:
          return blockRegex;
        case AST_TOKEN_TYPES.Line:
          return lineRegex;
        default:
          throw new Error(
            `Unexpected comment.type: ${JSON.stringify({ comment })}`,
          );
      }
    })();

    return regex.exec(trimmedValue);
  };
};

const getCommandLoc = (
  command: string,
  comment: TSESTree.Comment,
): TSESTree.SourceLocation => {
  const { loc } = comment;
  const commandLength = command.length;

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
    end: { line, column: column + commandLength },
  };
};

export { createCommandMatcher, getCommandLoc };
