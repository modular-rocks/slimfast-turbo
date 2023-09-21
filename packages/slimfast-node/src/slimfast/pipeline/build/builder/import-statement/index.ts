import { basename, dirname, join, relative } from 'path/posix';

import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  stringLiteral,
} from '@babel/types';

import type { RandomObject } from '../../../../../types';

export default (
  name: string,
  pathname: string,
  parentPath: string,
  path: RandomObject
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
