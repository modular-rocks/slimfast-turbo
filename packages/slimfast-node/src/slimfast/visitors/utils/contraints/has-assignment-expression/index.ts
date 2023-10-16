import { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

function isInsidePath(
  innerPath: NodePath,
  outerPath: NodePath | RandomObject
): boolean {
  let currentPath: NodePath | null = innerPath;

  while (currentPath !== null) {
    if (currentPath === outerPath) {
      return true;
    }
    currentPath = currentPath.parentPath;
  }

  return false;
}

const isUsedInPath = (
  name: string,
  type: string,
  variablePath: NodePath | RandomObject,
  path: NodePath | RandomObject
): boolean => {
  if (type === 'Identifier') {
    const binding = variablePath.scope.getBinding(name);
    if (binding) {
      return binding.referencePaths.filter(
        (ref: NodePath) => !isInsidePath(ref, path)
      )[0];
    }
  }
  return false;
};

/**
 * Determines if a given AST node path contains an assignment expression, and if the variables involved in that assignment are used in other scopes.
 *
 * The node path is examined for direct representations of an assignment expression. Additionally, nested nodes are inspected for assignment patterns, to determine if the assigned variables are referenced outside their original context.
 *
 * @param path - The AST node path to be checked.
 * @param data - Information or context related to the node.
 * @param opts - Configuration options.
 * @param ast - The complete Abstract Syntax Tree.
 * @returns `true` if the node path contains an assignment expression and the assigned variables are used in other scopes, otherwise `false`.
 *
 * @example
 * const containsAssignment = hasAssignmentExpression(nodePath, data, opts, ast);
 * if (containsAssignment) {
 *   // Handle or flag the assignment for further analysis.
 * }
 */
export const hasAssignmentExpression = (
  path: NodePath,
  data: RandomObject,
  opts: RandomObject,
  ast: Node
) => {
  let usedInOtherScopes = false;

  if (path.isAssignmentExpression()) {
    // most likely used in other scopes
    usedInOtherScopes = true;
  }

  path.traverse({
    AssignmentExpression(variablePath: NodePath | RandomObject) {
      const { left } = variablePath.node;

      if (isUsedInPath(left.name, left.type, variablePath, path)) {
        usedInOtherScopes = true;
      }

      if (left.type === 'ObjectPattern') {
        left.properties.forEach((property: any) => {
          if (
            isUsedInPath(
              property.value.name,
              property.value.type,
              variablePath,
              path
            )
          ) {
            usedInOtherScopes = true;
          }
        });
      }
    },
  });

  return usedInOtherScopes;
};
