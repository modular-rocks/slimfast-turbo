import type { Constraint } from '../../../../../types';

/**
 * Determines if a given AST node path represents any kind of function.
 *
 * This function checks if the provided node path type corresponds to any of the
 * standard JavaScript function types (e.g., regular functions, arrow functions, class methods).
 *
 * @param path - The AST node path to be checked.
 * @returns `true` if the node represents any kind of function, otherwise `false`.
 *
 * @example
 * const isFunctionNode = isAFunction(nodePath);
 * if (isFunctionNode) {
 *   // Handle the function node.
 * }
 */
export const isAFunction: Constraint = (path) => {
  return [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
    'ObjectMethod',
    'ClassMethod',
    'PrivateMethod',
  ].includes(path.type);
};
