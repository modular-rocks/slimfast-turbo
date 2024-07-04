import type { Constraint } from '../../../../../types.js';

/**
 * Determines if a given AST node path represents a call expression within an expression statement.
 *
 * This function checks if the type of the provided node is 'ExpressionStatement' and the type
 * of its contained expression is 'CallExpression'.
 *
 * @param path - The AST node path to be checked.
 * @returns `true` if the node represents a call expression within an expression statement, otherwise `false`.
 *
 * @example
 * const isItACallExpression = isCallExpression(nodePath);
 * if (isItACallExpression) {
 *   // Handle the call expression.
 * }
 */
export const isCallExpression: Constraint = (path) => {
  const { node } = path;

  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression'
  );
};
