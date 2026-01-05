import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { initRule } from '../utilities/index.ts';

type MessageIds = 'missingPaddingBefore';

const isProcessExitCall = (node: TSESTree.CallExpression): boolean => {
  const { callee } = node;

  if (callee.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }

  const { object, property } = callee;

  if (object.type !== AST_NODE_TYPES.Identifier || object.name !== 'process') {
    return false;
  }

  if (property.type !== AST_NODE_TYPES.Identifier || property.name !== 'exit') {
    return false;
  }

  return true;
};

const getStatementNode = (
  node: TSESTree.Node,
): undefined | TSESTree.Statement => {
  let current: undefined | TSESTree.Node = node;

  while (current !== undefined) {
    if (
      current.type === AST_NODE_TYPES.ExpressionStatement ||
      current.type === AST_NODE_TYPES.VariableDeclaration ||
      current.type === AST_NODE_TYPES.ReturnStatement ||
      current.type === AST_NODE_TYPES.IfStatement ||
      current.type === AST_NODE_TYPES.ThrowStatement
    ) {
      return current;
    }

    current = current.parent;
  }

  return undefined;
};

const getBlockStatements = (
  statementNode: TSESTree.Statement,
): undefined | TSESTree.Statement[] => {
  const { parent } = statementNode;

  if (parent.type === AST_NODE_TYPES.BlockStatement) {
    return parent.body;
  }

  if (parent.type === AST_NODE_TYPES.Program) {
    return parent.body.filter(
      (node): node is TSESTree.Statement =>
        node.type !== AST_NODE_TYPES.ImportDeclaration &&
        node.type !== AST_NODE_TYPES.ExportAllDeclaration &&
        node.type !== AST_NODE_TYPES.ExportNamedDeclaration,
    );
  }

  if (parent.type === AST_NODE_TYPES.SwitchCase) {
    return parent.consequent;
  }

  return undefined;
};

const { ruleName, createRule } = initRule(import.meta.url);

const ruleValue = createRule<[], MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    docs: {
      description: 'Require an empty line before `process.exit()` calls.',
    },
    messages: {
      missingPaddingBefore: 'Expected blank line before `process.exit()` call.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { sourceCode } = context;

    const hasPaddingBetween = (
      previousNode: TSESTree.Node,
      nextNode: TSESTree.Node,
    ): boolean => {
      const previousEndLine = previousNode.loc.end.line;
      const nextStartLine = nextNode.loc.start.line;

      // 如果行差大于 1，则说明有空行
      if (nextStartLine - previousEndLine > 1) {
        return true;
      }

      // 检查是否有注释导致的空行效果
      const tokensBetween = sourceCode.getTokensBetween(
        previousNode,
        nextNode,
        {
          includeComments: true,
        },
      );

      if (tokensBetween.length === 0) {
        return nextStartLine - previousEndLine > 1;
      }

      // 检查第一个 token 和 previousNode 之间是否有空行
      const [firstToken] = tokensBetween;

      if (
        firstToken !== undefined &&
        firstToken.loc.start.line - previousEndLine > 1
      ) {
        return true;
      }

      return false;
    };

    return {
      [`CallExpression`]: (node) => {
        if (!isProcessExitCall(node)) {
          return;
        }

        const statementNode = getStatementNode(node);

        if (statementNode === undefined) {
          return;
        }

        const blockStatements = getBlockStatements(statementNode);

        if (blockStatements === undefined) {
          return;
        }

        const statementIndex = blockStatements.indexOf(statementNode);

        if (statementIndex === -1) {
          return;
        }

        // 检查前面是否有空行
        if (statementIndex > 0) {
          const previousStatement = blockStatements[statementIndex - 1];

          if (
            previousStatement !== undefined &&
            !hasPaddingBetween(previousStatement, statementNode)
          ) {
            context.report({
              node: statementNode,
              messageId: 'missingPaddingBefore',
              fix: (fixer) => {
                const tokenBefore = sourceCode.getTokenBefore(statementNode);

                if (tokenBefore === null) {
                  // eslint-disable-next-line unicorn/no-null -- ESLint fixer API requires null
                  return null;
                }

                return fixer.insertTextAfter(tokenBefore, '\n');
              },
            });
          }
        }
      },
    };
  },
});

export { ruleName, ruleValue };
