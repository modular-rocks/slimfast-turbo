import { unique } from '../../../../utils';

import type { ConstraintData } from '../../../../types';
import type { NodePath, Binding } from '@babel/traverse';

const importTypes = ['ImportDefaultSpecifier', 'ImportSpecifier'];
const isImportStatement = (x: Binding) =>
  importTypes.includes(x.path.type) || x.kind === 'module';

const variableTypes = ['VariableDeclarator'];
const isVariableDeclaration = (x: Binding) =>
  variableTypes.includes(x.path.type) || x.kind === 'param';

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
 * @param data - An object to which the categorized bindings will be added. The data should contain keys 'toImport' and 'toInject'.
 * @returns This function modifies the `data` object in-place and doesn't return a value.
 *
 * @example
 * const code = `import React from 'react'; const greet = (name) => "Hello, " + name;`;
 * const ast = parser(code);
 * const data = {
 *  toImport: [],
 *  toInject: [],
 * };
 * traverse(ast, {
 *   Program(path) {
 *     extractIdentifiers(path, data);
 *   }
 * });
 * // Now, `data.toImport` contains the binding related to `React` and `data.toInject` contains the binding related to `greet`.
 */
export const extractIdentifiers = (
  path: NodePath,
  data: ConstraintData<'toImport' | 'toInject'>
) => {
  const identifiers: Binding[] = [];

  path.traverse({
    Identifier(innerPath) {
      const binding = innerPath.scope.getBinding(innerPath.node.name);
      if (binding) {
        identifiers.push(binding);
      }
    },
  });

  const toImport: Binding[] = identifiers.filter(isImportStatement);
  const toInject: Binding[] = identifiers.filter(isVariableDeclaration);

  // TODO: are these used?
  data.toImport = unique(toImport);
  data.toInject = unique(toInject);

  return null;
};
