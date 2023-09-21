import unique from 'array-unique';
import { NodePath } from '@babel/traverse';
import {
  exportDefaultDeclaration,
  functionDeclaration,
  blockStatement,
  returnStatement,
} from '@babel/types';
import hasAwait from '../has-await';

import type { RandomObject } from '../../../../../../types';

const findBlockStatement = (path: NodePath | RandomObject) => {
  const { node } = path;
  // if (isBlockStatement(node)) {
  //   // should be node.body etc
  //   return node;
  // }

  return blockStatement([
    returnStatement(node.expression ? node.expression : node),
  ]);
};

export default (path: NodePath, data: RandomObject) => {
  // TODO: Verify and ensure 'data.toInject' contains valid elements of type 'RandomObject[]'.
  const toInject = unique(data.toInject) as RandomObject[];
  return exportDefaultDeclaration(
    functionDeclaration(
      null, // can also be BabelTypes.identifier(name), null makes it anonymous
      toInject.map((x: RandomObject) => x.identifier),
      findBlockStatement(path),
      false,
      hasAwait(path)
    )
  );
};
