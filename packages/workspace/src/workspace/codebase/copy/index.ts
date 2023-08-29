import type { RandomObject } from '../../../types';

/**
 * Merges properties from the `foreignObject` into the `localObject`.
 *
 * @param localObject - The target object to which properties are added.
 * @param foreignObject - The source object from which properties are copied.
 * @example
 * const source = { text: 'hello world' };
 * const target = { sample: 'text' };
 * copy(target, source);
 * console.log(target); // Outputs: { sample: 'text', text: 'hello world' }
 */
export const copy = (localObject: RandomObject, foreignObject: RandomObject) => {
  Object.assign(localObject, foreignObject);
};
