import Traverse, { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

/**
 * Determines if a given AST node path contains either a `Super` or a `YieldExpression` node.
 *
 * This function traverses the AST represented by the provided node path and checks for the presence
 * of specific node types (i.e., `Super` or `YieldExpression`). If either type is found, it indicates
 * that the original node should be ignored in any subsequent operations or analyses.
 *
 * @param path - The AST node path to be examined.
 * @param data - Information or context related to the node.
 * @param opts - Configuration options influencing the check.
 * @param ast - The complete Abstract Syntax Tree.
 * @returns `true` if the node contains either a `Super` or `YieldExpression` node, otherwise `false`.
 *
 * @example
 * const nodeShouldBeIgnored = shouldIgnore(nodePath, data, opts, ast);
 * if (nodeShouldBeIgnored) {
 *   // Skip processing or analysis for this node
 * }
 */
export function shouldIgnore(
  path: NodePath,
  data: RandomObject,
  opts: RandomObject,
  ast: Node
) {
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
}
