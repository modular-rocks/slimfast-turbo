import { dirname, relative, resolve } from 'path/posix';

import { Binding } from '@babel/traverse';
import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  importSpecifier,
  isImportDefaultSpecifier,
  stringLiteral,
} from '@babel/types';
import unique from 'array-unique';

import type { RandomObject } from '../../../../../types';

interface Entry {
  default?: string | null;
  named: string[];
}

type ImportSpecifierType =
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ImportSpecifier;

/**
 * It aggregates separate import statements (default and named) from the same module,
 * combining them into a single import.
 *
 * It takes an array of import bindings and processes them to generate an array of import
 * declaration AST nodes. The imports are categorized by source, organized into single import
 * declarations for each source, and ensure that named imports are unique.
 *
 * @param pathname - The path of the file being processed.
 * @param folder - The folder path to resolve relative imports.
 * @param imports - An array of Binding objects representing imports.
 * @returns - An array of import declaration AST nodes.
 *
 * @example
 * // Suppose you have multiple import statements in your code:
 * import a from 'moduleA';
 * import { b, c } from 'moduleA';
 * // This function will consolidate them into a single import statement’s AST node:
 * const importNodes = combineImports('path/to/file.js', 'path/to', bindings);
 * //like so:
 * import a, { b, c } from 'moduleA';
 */
export function combineImports(
  pathname: string,
  folder: string,
  imports: Binding[]
) {
  const importsBySource: Map<string, Entry> = new Map();

  imports.forEach((binding: Binding) => {
    const node: RandomObject | undefined = binding.path?.parentPath?.node;
    if (!node) return;
    const fullPath = resolve(dirname(pathname), node.source.value);
    const source = relative(folder, fullPath);

    if (!importsBySource.has(source)) {
      importsBySource.set(source, { named: [] });
    }
    const entry = importsBySource.get(source);

    node.specifiers.forEach((specifier: ImportSpecifier) => {
      if (!entry) return;
      if (isImportDefaultSpecifier(specifier)) {
        const importDefaultSpec = specifier as ImportDefaultSpecifier;
        entry.default = importDefaultSpec.local.name;
        return;
      }
      entry.named.push(specifier.local.name);
    });
  });

  const entries = Array.from(importsBySource.entries());
  return entries.map(([source, entry]) => {
    const specifiers: ImportSpecifierType[] = [];

    if (entry.default) {
      specifiers.push(importDefaultSpecifier(identifier(entry.default)));
    }

    unique(entry.named).forEach((specifier: string) => {
      const node: ImportSpecifierType = importSpecifier(
        identifier(specifier),
        identifier(specifier)
      );
      specifiers.push(node);
    });

    return importDeclaration(
      specifiers,
      stringLiteral(source.replace(/(\.\.\/)([^.])/g, './$2'))
    );
  });
}
