import { basename, dirname, join, relative } from 'node:path/posix';

import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  stringLiteral,
} from '@babel/types';

import type { NodePath } from '@babel/traverse';

/**
 * Generates an AST node representing an import declaration for a specified module.
 *
 * It creates an import declaration that can be utilized within the AST
 * of another module. It modifies the name to be capitalized if the path is related
 * to a JSX Element and computes the relative path to ensure accuracy within
 * different directory structures.
 *
 * @param name - The name of the module or variable to be imported.
 * @param pathname - The full path to the module to be imported.
 * @param parentPath - The path to the parent or originating module.
 * @param path - The AST node path.
 * @returns - AST node representing the import declaration.
 *
 * @example
 * // Generates an import declaration AST node for a module named 'ModuleName' located at './path/to/ModuleName.js'.
 * const importAst = generateImportDeclaration('ModuleName', './path/to/ModuleName.js', './parent/path', jsxPath);
 */
export const generateImportDeclaration = (
  name: string,
  pathname: string,
  parentPath: string,
  path: NodePath
) => {
  name = path.isJSXElement()
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : name;
  const parentDirectory = relative(dirname(parentPath), dirname(pathname));
  const newRelativePath = `./${join(parentDirectory, basename(pathname))}`;

  return importDeclaration(
    [importDefaultSpecifier(identifier(name))],
    stringLiteral(newRelativePath)
  );
};
