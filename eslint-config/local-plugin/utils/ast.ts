import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

const getNodeText = (
  node: TSESTree.Identifier | TSESTree.StringLiteral,
): string => {
  switch (node.type) {
    case AST_NODE_TYPES.Identifier:
      return node.name;
    case AST_NODE_TYPES.Literal:
      return node.value;
    default:
      throw new Error(`Unexpected node.type: ${JSON.stringify({ node })}`);
  }
};

export { getNodeText };
