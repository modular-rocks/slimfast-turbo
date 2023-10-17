import { dirname, extname, resolve } from 'path/posix';

import { program } from '@babel/types';
import unique from 'array-unique';

import { combineImports } from './combine-imports';
import { generateImportDeclaration } from './import-statement';
import { replace as replaceInOriginalFile } from './replace';
import { wrap } from './wrap';

import type { RandomObject, SlimFastOpts } from '../../../../types';
import type { NodePath } from '@babel/traverse';

/**
 * Builds the AST for a module, manages its imports, and optionally replaces nodes in the original file.
 *
 * It n generates the Abstract Syntax Tree (AST) for a module. It identifies the type
 * of node (JSX or function) and wraps it accordingly. The newly created module comprises necessary
 * import statements and the main AST. The function also generates an import declaration for the new module.
 *
 * @param path - The AST node path to be processed.
 * @param data - Details about the module, e.g., its name, folder, and imports.
 * @param parentPath - Path of the original module.
 * @param options - Options affecting generation, wrapping, and replacement processes.
 * @returns An object with:
 *   - `pathname`: New module's path.
 *   - `ast`: New module's AST, including imports and the main content.
 *   - `import`: Import declaration for the new module.
 *
 * @example
 * // For an AST node path: `() => <div>Hello</div>`
 * // And data: { name: 'MyComponent', folder: 'components', toImport: [] }
 * // The function returns AST, module's path, and an import declaration.
 */
export const builder = (
  path: NodePath,
  data: RandomObject,
  parentPath: string,
  options: SlimFastOpts
) => {
  const { name, folder, toImport } = data;

  path = path && path.isJSXOpeningElement() ? path.parentPath : path;

  const pathname = resolve(
    dirname(parentPath),
    `./${folder}/${name + extname(parentPath)}`
  );

  const nodes: any[] = combineImports(
    pathname,
    dirname(pathname),
    unique(toImport)
  );
  const body = (options.wrap || wrap)(path, data, options);
  nodes.push(body);

  (options.replace || replaceInOriginalFile)(name, path, data, options);

  return {
    pathname,
    ast: program(nodes),
    import: generateImportDeclaration(name, pathname, parentPath, path),
  };
};
