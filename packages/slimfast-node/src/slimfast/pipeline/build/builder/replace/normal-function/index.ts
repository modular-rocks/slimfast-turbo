import unique from 'array-unique';
import { identifier, callExpression } from '@babel/types';

import type { RandomObject } from '../../../../../../types';

export const generateFunction = (name: string, data: RandomObject) => {
  // TODO: Verify and ensure 'data.toInject' contains valid elements of type 'RandomObject[]'.
  const toInject = unique(data.toInject) as RandomObject[];
  const calleeFunction = identifier(name);
  const args = toInject.map((x: RandomObject) => identifier(x.identifier.name));
  return callExpression(calleeFunction, args);
};
