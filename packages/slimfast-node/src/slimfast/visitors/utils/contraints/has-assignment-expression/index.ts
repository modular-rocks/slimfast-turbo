import type { AssignmentExpression, Identifier } from '@babel/types';
import type { Constraint, RandomObject } from '../../../../../types';
import type { NodePath } from '@babel/traverse';

/**
 * Determines if a given AST node path `innerPath` is contained within another AST node path `outerPath`.
 *
 * This function traverses the ancestors of `innerPath` and checks if any of them are equal to `outerPath`.
 *
 * @param innerPath - The AST node path to check if it is inside `outerPath`.
 * @param outerPath - The AST node path to check against.
 * @returns `true` if `innerPath` is inside `outerPath`, otherwise `false`.
 */
function isInsidePath(innerPath: NodePath, outerPath: NodePath): boolean {
  let currentPath: NodePath | null = innerPath;

  while (currentPath !== null) {
    if (currentPath === outerPath) {
      return true;
    }
    currentPath = currentPath.parentPath;
  }

  return false;
}

/**
 * Determines if a given variable is used within a specified AST node path.
 *
 * @param name - The name of the variable to check.
 * @param variablePath - The AST node path of the variable.
 * @param path - The AST node path to check against.
 * @returns `true` if the variable is used within the `path`, otherwise `false`.
 */
export const isUsedInPath = (
  name: string,
  variablePath: NodePath<AssignmentExpression>,
  path: NodePath
): boolean => {
  const binding = variablePath.scope.getBinding(name);
  if (binding) {
    return (
      binding.referencePaths.filter((ref: NodePath) =>
        isInsidePath(ref, path)
      )[0] !== undefined
    );
  }
  return false;
};

/**
 * Determines if a given AST node path contains an assignment expression, and if the variables involved in that assignment are used in other scopes.
 *
 * The node path is examined for direct representations of an assignment expression. Additionally, nested nodes are inspected for assignment patterns, to determine if the assigned variables are referenced outside their original context.
 *
 * @param path - The AST node path to be checked.
 * @returns `true` if the node path contains an assignment expression and the assigned variables are used in other scopes, otherwise `false`.
 *
 * @example
 * const containsAssignment = hasAssignmentExpression(nodePath);
 * if (containsAssignment) {
 *   // Handle or flag the assignment for further analysis.
 * }
 */
export const hasAssignmentExpression: Constraint = (path) => {
  let usedInOtherScopes = false;

  if (path.isAssignmentExpression()) {
    // most likely used in other scopes
    usedInOtherScopes = true;
  }

  path.traverse({
    AssignmentExpression(variablePath: NodePath<AssignmentExpression>) {
      const { left } = variablePath.node;

      if (
        left.type === 'Identifier' &&
        isUsedInPath(left.name, variablePath, path)
      ) {
        usedInOtherScopes = true;
      }

      if (left.type === 'ObjectPattern') {
        for (const property of left.properties) {
          if (
            property.type === 'ObjectProperty' &&
            property.value.type === 'Identifier' &&
            isUsedInPath(property.value.name, variablePath, path)
          ) {
            usedInOtherScopes = true;
          }
        }
      }
    },
  });

  return usedInOtherScopes;
};
