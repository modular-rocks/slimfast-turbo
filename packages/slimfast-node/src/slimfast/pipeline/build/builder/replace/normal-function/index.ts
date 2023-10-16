import unique from 'array-unique';
import { identifier, callExpression } from '@babel/types';

import type { RandomObject } from '../../../../../../types';

/**
 * Generates an Abstract Syntax Tree (AST) node for a function call expression
 * with provided name and arguments.
 *
 * It creates a function call expression AST node.
 * The arguments for the function call are derived from the `toInject` array
 * present in the provided `data` object, ensuring that each argument is unique.
 * Each argument is constructed using its name property.
 *
 * @param name - The name of the function to be called.
 * @param data - An object containing relevant data, including an array `toInject` which consists of objects that should contain an `identifier` with a `name` property to be used as function arguments.
 * @returns - A function call expression AST node configured with the provided name and arguments.
 *
 * @example
 * // Assuming data.toInject = [{ identifier: { name: 'arg1' } }, { identifier: { name: 'arg2' } }]
 * const functionCallNode = generateFunction('exampleFunction', data);
 * // functionCallNode represents: exampleFunction(arg1, arg2);
 */
export const generateFunction = (name: string, data: RandomObject) => {
  // TODO: Verify and ensure 'data.toInject' contains valid elements of type 'RandomObject[]'.
  const toInject = unique(data.toInject) as RandomObject[];
  const calleeFunction = identifier(name);
  const args = toInject.map((x: RandomObject) => identifier(x.identifier.name));
  return callExpression(calleeFunction, args);
};
