import { NodePath, Node } from '@babel/traverse';

/**
 * Determines if a given Abstract Syntax Tree (AST) node or any of its parent nodes is not present in the provided `extracted` map.
 *
 * The function starts from the specified node (`path`) and traverses its parent nodes to see if any of them
 * exist in the `extracted` map. If any node is found in the map, the function returns `false`, indicating
 * that the node or one of its parent nodes is already extracted. Otherwise, it returns `true`, signifying
 * that neither the node nor its parent nodes are in the `extracted` map.
 *
 * @param path - The starting AST node path from which to check its and its parents' presence in the map.
 * @param extracted - A map containing previously extracted AST nodes.
 * @returns Returns `true` if the provided node and all its parent nodes are not in the `extracted` map, otherwise `false`.
 *
 * @example
 * if (notInExtracted(nodePath, extractedNodesMap)) {
 *   // The node and its parents are not in the extracted map.
 * }
 */
export const notInExtracted = (
  path: NodePath,
  extracted: Map<NodePath, any>
) => {
  let parentPath: NodePath | null = path;
  while (parentPath) {
    if (extracted.get(parentPath)) return false;
    parentPath = parentPath.parentPath;
  }
  return true;
};
