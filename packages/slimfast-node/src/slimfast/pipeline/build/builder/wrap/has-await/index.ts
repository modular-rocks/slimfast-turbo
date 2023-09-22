import traverse, { NodePath } from '@babel/traverse';

export const hasAwait = (path: NodePath) => {
  let itHasAwait = false;

  const visitor = {
    AwaitExpression() {
      itHasAwait = true;
    },
  };

  traverse(path.node, visitor, path.scope, path.parentPath);

  return itHasAwait;
};
