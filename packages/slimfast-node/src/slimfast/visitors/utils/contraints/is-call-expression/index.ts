import { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

export const isCallExpression = (
  path: NodePath,
  data: RandomObject,
  opts: RandomObject,
  ast: Node
) => {
  const { node } = path;

  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression'
  );
};
