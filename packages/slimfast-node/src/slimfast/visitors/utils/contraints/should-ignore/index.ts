import Traverse, { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

export default function shouldIgnore(
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
