import { print } from 'recast';
import type { Options, types } from 'recast';

export default (ast: types.ASTNode, opts?: Options) => print(ast, opts);
