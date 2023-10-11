import unique from 'array-unique';
import { NodePath, Node, Binding } from '@babel/traverse';

import type { RandomObject } from '../../../../types';

const importTypes = ['ImportDefaultSpecifier', 'ImportSpecifier'];
const isImportStatement = (x: Binding) =>
  importTypes.includes(x.path.type) || x.kind === 'module';

const variableTypes = ['VariableDeclarator'];
const isVariableDeclaration = (x: Binding) =>
  variableTypes.includes(x.path.type) || x.kind === 'param';

const buildBinding = (name: string, binding: Binding): Binding => {
  // need to only return binding
  return binding;
  // return {
  //   name,
  //   kind: binding.kind,
  //   identifier: binding.identifier,
  //   parentType: binding.path.type,
  //   parentPath: binding.path,
  // }
};

/**
 * Traverses a given Abstract Syntax Tree (AST) node path and extracts bindings associated with any `Identifier` nodes.
 *
 * The function categorizes the extracted bindings into two main groups:
 * - `toImport`: Contains bindings that are related to import statements.
 * - `toInject`: Contains bindings that are associated with variable declarations or function parameters.
 *
 * These categorized bindings are added to the provided `data` object under the respective keys.
 *
 * @param path - The starting AST node path to be traversed.
 * @param data - An object to which the categorized bindings will be added.
 * @param opts - Optional configuration options.
 * @param ast - The entire AST, if available.
 * @returns This function modifies the `data` object in-place and doesn't return a value.
 *
 * @example
 * const code = `import React from 'react'; const greet = (name) => "Hello, " + name;`;
 * const ast = parser(code);
 * const data = {};
 * traverse(ast, {
 *   Program(path) {
 *     extractIdentifiers(path, data);
 *   }
 * });
 * // Now, `data.toImport` contains the binding related to `React` and `data.toInject` contains the binding related to `greet`.
 */
export const extractIdentifiers = (
  path: NodePath,
  data: RandomObject,
  opts?: RandomObject,
  ast?: Node
) => {
  const identifiers: Binding[] = [];

  path.traverse({
    Identifier(innerPath: RandomObject) {
      const binding: Binding = innerPath.scope.getBinding(innerPath.node.name);
      if (binding) {
        identifiers.push(binding);
      }
      // binding && identifiers.push(buildBinding(path.node.name, binding))
    },
  });

  const toImport: Binding[] = identifiers.filter(isImportStatement);
  const toInject: Binding[] = identifiers.filter(isVariableDeclaration);

  data.toImport = unique(toImport);
  data.toInject = unique(toInject);

  return null;
};
