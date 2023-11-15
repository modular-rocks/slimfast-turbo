import { identifier, callExpression } from '@babel/types';

import { unique } from '../../../../../../utils';

import type { Binding } from '@babel/traverse';
import type { CallExpression } from '@babel/types';

export type GenerateFunction = (
  name: string,
  data: { toInject: Binding[] }
) => CallExpression;

/**
 * Generates an Abstract Syntax Tree (AST) node for a function call expression
 * with provided name and arguments.
 *
 * It creates a function call expression AST node.
 * The arguments for the function call are derived from the `toInject` array
 * present in the provided `data` object, ensuring that each argument is unique.
 * Each argument is constructed using the `name` property from the `identifier` of each binding in `toInject`.
 *
 * @param name - The name of the function to be called.
 * @param data - An object containing relevant data, including an array `toInject` which consists of bindings, each containing an `identifier` with a `name` property to be used as function arguments.
 * @returns - A function call expression AST node configured with the provided name and arguments.
 *
 * @example
 * // Assuming data.toInject = [{ identifier: { name: 'arg1' } }, { identifier: { name: 'arg2' } }]
 * const functionCallNode = generateFunction('exampleFunction', data);
 * // functionCallNode represents: exampleFunction(arg1, arg2);
 */
export const generateFunction: GenerateFunction = (name, data) => {
  const toInject = unique(data.toInject);
  const calleeFunction = identifier(name);
  const args = toInject.map((binding) => identifier(binding.identifier.name));
  return callExpression(calleeFunction, args);
};
