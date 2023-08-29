import { dirname, extname, resolve } from 'path/posix';

import { NodePath } from '@babel/traverse';
import { program } from '@babel/types';
import unique from 'array-unique';

import combineImports from './combine-imports';
import importStatement from './import-statement';
import replaceInOriginalFile from './replace';
import wrap from './wrap';

export default (
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
    import: importStatement(name, pathname, parentPath, path),
  };
};
