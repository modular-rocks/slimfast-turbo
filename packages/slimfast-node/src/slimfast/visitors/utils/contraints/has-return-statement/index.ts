import { isAFunction } from '../is-a-function';

import type { Constraint } from '../../../../../types';
import type { NodePath } from '@babel/traverse';

/**
 * Determines if a given AST node path represents a return statement or contains a return statement not within a nested function.
 *
 * This function examines the provided node path for two conditions:
 * 1. The path directly represents a return statement.
 * 2. The path contains a return statement that isn't nested within any type of function.
 *
 * @param path - The AST node path to be checked.
 * @returns `true` if either condition is met, otherwise `false`.
 *
 * @example
 * const hasReturn = hasReturnStatement(nodePath);
 * if (hasReturn) {
 *   // Handle the problematic return statement.
 * }
 */
export const hasReturnStatement: Constraint = (path) => {
  // Problematic when
  // 1. The path directly represents a return statement.
  // 2. The path contains a return statement that isn't nested within any type of function.
  let problematic = false;

  if (path.isReturnStatement()) {
    problematic = true;
  }

  path.traverse({
    ReturnStatement(innerPath: NodePath) {
      let parent: NodePath | null = innerPath;
      let isWrapped = false;
      while (!isWrapped && parent) {
        if (isAFunction(parent)) {
          isWrapped = true;
        }
        parent = parent === path ? null : parent.parentPath;
      }
      // If the return statement is not wrapped in a function, it is problematic.
      if (!problematic && !isWrapped) {
        problematic = true;
      }
    },
  });
  return problematic;
};
