import traverse from '@babel/traverse';

import type { NodePath } from '@babel/traverse';

/**
 * Checks if the provided AST node path contains an `await` expression.
 *
 * The function traverses the provided node path and examines each node. If it encounters a node
 * corresponding to an `await` expression (`AwaitExpression`), it returns `true`. If no such nodes
 * are found, the function returns `false`.
 *
 * @param path - The AST node path to be examined.
 * @returns `true` if the node path contains an `await` expression, otherwise `false`.
 *
 * @example
 * const nodeContainsAwait = hasAwait(nodePath);
 * if (nodeContainsAwait) {
 *   console.log('The node contains an await expression.');
 * } else {
 *   console.log('The node does not contain an await expression.');
 * }
 */
export const hasAwait = (path: NodePath) => {
  let itHasAwait = false;

  const visitor = {
    AwaitExpression() {
      itHasAwait = true;
    },
  };

  traverse(path.node, visitor, path.scope, path.parentPath);

  return itHasAwait;
};
