import type { NodePath } from '@babel/traverse';

/**
 * Checks if a given AST node or any of its parent nodes are of a type specified in the `blacklistedParents` array.
 *
 * The function traverses up the parent nodes of the given node (`path`) and checks
 * each node's type against the provided list of blacklisted parent types. If any parent
 * node's type matches an entry in the blacklisted list, the function returns `false`,
 * indicating that the path has a blacklisted parent. Otherwise, it returns `true`,
 * signifying that none of the parent nodes are of a blacklisted type.
 *
 * @param path - The starting AST node path from which to check its parent nodes.
 * @param blacklistedParents - An array of AST node types that should be considered as blacklisted.
 * @returns Returns `true` if none of the parent nodes are of a blacklisted type, otherwise `false`.
 *
 * @example
 * const isEligible = rejectParentsWithTypes(nodePath, ['ImportDeclaration', 'TypeParameterDeclaration']);
 * if(isEligible) {
 *   // Process the node
 * }
 */
export function rejectParentsWithTypes(
  path: NodePath | null,
  blacklistedParents: string[]
) {
  let currentPath = path;
  while (currentPath) {
    if (blacklistedParents.includes(currentPath.type)) {
      return false;
    }
    currentPath = currentPath.parentPath;
  }
  return true;
}
