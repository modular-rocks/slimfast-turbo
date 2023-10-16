import { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

/**
 * Determines if a given AST node path represents any kind of function.
 *
 * This function checks if the provided node path type corresponds to any of the
 * standard JavaScript function types (e.g., regular functions, arrow functions, class methods).
 *
 * @param path - The AST node path to be checked.
 * @param data - Information or context related to the node.
 * @param opts - Configuration options.
 * @param ast - The complete Abstract Syntax Tree.
 * @returns `true` if the node represents any kind of function, otherwise `false`.
 *
 * @example
 * const isFunctionNode = isAFunction(nodePath, data, opts, ast);
 * if (isFunctionNode) {
 *   // Handle the function node.
 * }
 */
export const isAFunction = (
  path: NodePath,
  data: RandomObject,
  opts: RandomObject,
  ast: Node
) => {
  return [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
    'ObjectMethod',
    'ClassMethod',
    'PrivateMethod',
  ].includes(path.type);
};
