import { dirname, extname, resolve } from 'node:path/posix';

import { program } from '@babel/types';

import { combineImports } from './combine-imports/index.js';
import { generateImportDeclaration } from './import-statement/index.js';
import { replace as replaceInOriginalFile } from './replace/index.js';
import { wrap } from './wrap/index.js';
import { unique } from '../../../../utils/index.js';

import type { Replace, ReplaceOpts } from './replace/index.js';
import type { Wrap, WrapOpts } from './wrap/index.js';
import type { Binding, NodePath } from '@babel/traverse';
import type {
  ExportDefaultDeclaration,
  ImportDeclaration,
  Program,
} from '@babel/types';

export type BuilderData = {
  name: string;
  folder: string;
  toImport: Binding[];
  toInject: Binding[];
};

export type BuilderOpts = WrapOpts &
  ReplaceOpts & {
    wrap?: Wrap;
    replace?: Replace;
  };

export type Builder = (
  path: NodePath,
  data: BuilderData,
  parentPath: string,
  options: BuilderOpts
) => {
  pathname: string;
  ast: Program;
  import: ImportDeclaration;
};

/**
 * Builds the Abstract Syntax Tree (AST) for a module, manages its imports,
 * and optionally replaces nodes in the original file.
 *
 * It identifies the type of node (JSX or function) and wraps it accordingly.
 * The newly created module comprises necessary import statements and the main AST.
 * The function also generates an import declaration for the new module.
 *
 * @param path - The AST node path to be processed.
 * @param data - Details about the module, such as its name, folder, imports to be injected, and bindings.
 * @param parentPath - Path of the original module.
 * @param options - Options affecting generation, wrapping, and replacement processes.
 * @returns An object with:
 *   - `pathname`: New module's path.
 *   - `ast`: New module's AST, including imports and the main content.
 *   - `import`: Import declaration for the new module.
 *
 * @example
 * // For an AST node path: `() => <div>Hello</div>`
 * // And data: { name: 'MyComponent', folder: 'components', toImport: [], toInject: [] }
 * // The function returns AST, module's path, and an import declaration.
 */
export const builder: Builder = (path, data, parentPath, options) => {
  const { name, folder, toImport } = data;

  path = path?.isJSXOpeningElement() ? path.parentPath : path;

  const pathname = resolve(
    dirname(parentPath),
    `./${folder}/${name + extname(parentPath)}`
  );

  type NodeType = (ImportDeclaration | ExportDefaultDeclaration)[];

  const nodes: NodeType = combineImports(
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
