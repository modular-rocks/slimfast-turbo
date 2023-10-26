import type { Constraint, RandomObject } from '../../../../../types';
import type { NodePath } from '@babel/traverse';

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
 * Checks if variables declared in a given AST node path are referenced or manipulated outside of their original declaring scope.
 *
 * This function specifically focuses on nodes that declare variables (`let`, `const`, `var`). It examines whether these variables are either accessed or manipulated in a different scope than their original declaration.
 * This can be particularly useful for understanding dependencies or potential side-effects associated with variables.
 *
 * @param path - The AST node path of the variable declaration to be examined.
 * @returns `true` if any of the declared variables within the node path are referenced or manipulated outside their declaring scope, otherwise `false`.
 *
 * @example
 * const hasExternalReferences = containsIdentifiersInOtherScopes(nodePath);
 * if (hasExternalReferences) {
 *   // Handle or analyze the variables that are used externally.
 * }
 */
export const containsIdentifiersInOtherScopes: Constraint = (path) => {
  let usedInOtherScopes = false;

  // TODO: double check this condition
  if (path.isVariableDeclaration()) {
    // most likely used in other scopes
    usedInOtherScopes = true;
  }

  path.traverse({
    VariableDeclaration(variableDeclarationPath: NodePath | RandomObject) {
      variableDeclarationPath.node.declarations.forEach((declarator: any) => {
        const binding = variableDeclarationPath.scope.getBinding(
          declarator.id.name
        );
        if (
          binding &&
          binding.referencePaths.filter(
            (ref: NodePath) => !isInsidePath(ref, path)
          )[0]
        ) {
          usedInOtherScopes = true;
        }
      });
    },
  });

  return usedInOtherScopes;
};
