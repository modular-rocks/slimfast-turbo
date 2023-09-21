import { NodePath, Node } from '@babel/traverse';

import type { RandomObject } from '../../../../../types';

export default (
  path: NodePath,
  data: RandomObject,
  opts: RandomObject,
  ast: Node
) => {
  return [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
    'ObjectMethod',
    'ClassMethod',
    'PrivateMethod',
  ].includes(path.type);
};
