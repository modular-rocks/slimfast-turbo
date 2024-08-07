import Traverse from '@babel/traverse';

import type { Constraint } from '../../../../../types.js';

/**
 * Determines if a given AST node path contains either a `Super` or a `YieldExpression` node.
 *
 * This function traverses the AST represented by the provided node path and checks for the presence
 * of specific node types (i.e., `Super` or `YieldExpression`). If either type is found, it indicates
 * that the original node should be ignored in any subsequent operations or analyses.
 *
 * @param path - The AST node path to be examined.
 * @returns `true` if the node contains either a `Super` or `YieldExpression` node, otherwise `false`.
 *
 * @example
 * const nodeShouldBeIgnored = shouldIgnore(nodePath);
 * if (nodeShouldBeIgnored) {
 *   // Skip processing or analysis for this node
 * }
 */
export const shouldIgnore: Constraint = (path) => {
  let shouldNot = false;

  const visitor = {
    Super() {
      shouldNot = true;
    },
    YieldExpression() {
      shouldNot = true;
    },
  };

  Traverse(path.node, visitor, path.scope, path.parentPath);

  return shouldNot;
};
