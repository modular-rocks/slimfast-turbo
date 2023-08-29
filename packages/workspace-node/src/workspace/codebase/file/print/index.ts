import type { Options, types } from 'recast';
import { print as recastPrinter } from 'recast';

export const print = (ast: types.ASTNode, opts?: Options) =>
  recastPrinter(ast, opts);
