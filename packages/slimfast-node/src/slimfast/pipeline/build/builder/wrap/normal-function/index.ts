import {
  exportDefaultDeclaration,
  functionDeclaration,
  blockStatement,
  returnStatement,
} from '@babel/types';

import { unique } from '../../../../../../utils/index.js';
import { hasAwait } from '../has-await/index.js';

import type { RandomObject } from '../../../../../../types.js';
import type { Binding, NodePath } from '@babel/traverse';
import type { ExportDefaultDeclaration } from '@babel/types';

// TODO: Refactor
/**
 * Extracts a block statement containing a return statement from the provided AST node path.
 *
 * This function checks if the given AST node path has an expression. If it does, it constructs
 * a return statement with that expression. Otherwise, it constructs a return statement with the node itself.
 * The return statement is then wrapped within a block statement, which is then returned.
 *
 * @param path - The AST node path from which the block statement is to be extracted.
 * @returns A block statement containing a return statement with either the node's expression or the node itself.
 *
 * @example
 * // Given the AST for: `() => myVar`
 * // The function would extract: `{ return myVar; }`
 */
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

export type GenerateExportedFunction = (
  path: NodePath,
  data: { toInject: Binding[] }
) => ExportDefaultDeclaration;

/**
 * Generates an exported default function or JSX component declaration based on a given AST node path and associated data.
 *
 * The function constructs an exported default function which may:
 * 1. Return a simple value (e.g., a string).
 * 2. Act as a JSX component and optionally include properties based on the `data.toInject` array.
 *
 * If the provided AST node path contains asynchronous operations, the generated function will be asynchronous.
 *
 * @param path - The AST node path representing the original function, expression, or JSX element.
 * @param data - Context or information related to the node, including parameters to be injected into the function or component.
 * @returns An exported default function or JSX component declaration based on the provided AST node path and data.
 *
 * @example
 * // Given an AST node path representing: `() => "Hello World!"`
 * // This function would generate the equivalent of:
 * // `export default function() { return "Hello World!"; }`
 *
 * @example
 * // Given an AST node path representing a JSX expression: `() => <div><h1>{name}!</h1></div>`
 * // And data: { toInject: [{ identifier: 'name' }] }
 * // This function would generate the equivalent of:
 * // `export default function(props) { const { name } = props; return <div><h1>{name}!</h1></div>; }`
 */
export const generateExportedFunction: GenerateExportedFunction = (
  path,
  data
) => {
  const toInject = unique(data.toInject);
  return exportDefaultDeclaration(
    functionDeclaration(
      null, // can also be BabelTypes.identifier(name), null makes it anonymous
      toInject.map((binding) => binding.identifier),
      findBlockStatement(path),
      false,
      hasAwait(path)
    )
  );
};
