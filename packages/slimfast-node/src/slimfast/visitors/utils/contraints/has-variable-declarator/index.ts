import type { Constraint } from '../../../../../types';

/**
 * Determines if a given AST node path represents a variable declarator.
 *
 * A variable declarator is the part of a variable declaration that captures the actual variable
 * name and its initial value without its declaration keyword (`var`, `let`, `const`). For example,
 * in the declaration `const hello = 'world';`, the variable declarator represents `hello = 'world'`.
 *
 * @param path - The AST node path to be checked. This can either be a proper NodePath or an object that behaves similarly.
 * @returns `true` if the node represents a variable declarator, otherwise `false`.
 *
 * @example
 * const isVarDeclarator = hasVariableDeclarator(nodePath);
 * if (isVarDeclarator) {
 *   // Handle the variable declarator node.
 * }
 */
export const hasVariableDeclarator: Constraint = (path) => {
  let itHasVariableDeclarator = false;

  if (path.isVariableDeclarator()) {
    itHasVariableDeclarator = true;
  }

  return itHasVariableDeclarator;
};
