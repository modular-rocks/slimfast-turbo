import type { RandomObject } from '../../../types';

export const copy = (localObject: RandomObject, foreignObject: RandomObject) => {
  Object.assign(localObject, foreignObject);
};
