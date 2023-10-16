import { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

/**
 * Determines if a given AST node path represents a call expression within an expression statement.
 *
 * This function checks if the type of the provided node is 'ExpressionStatement' and the type
 * of its contained expression is 'CallExpression'.
 *
 * @param path - The AST node path to be checked.
 * @param data - Information or context related to the node
 * @param opts - Configuration options
 * @param ast - The complete Abstract Syntax Tree
 * @returns `true` if the node represents a call expression within an expression statement, otherwise `false`.
 *
 * @example
 * const isItACallExpression = isCallExpression(nodePath, data, opts, ast);
 * if (isItACallExpression) {
 *   // Handle the call expression.
 * }
 */
export const isCallExpression = (
  path: NodePath,
  data: RandomObject,
  opts: RandomObject,
  ast: Node
) => {
  const { node } = path;

  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression'
  );
};
