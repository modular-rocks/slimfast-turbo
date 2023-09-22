import { NodePath, Node } from '@babel/traverse';

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
