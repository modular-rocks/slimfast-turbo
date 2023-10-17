import { print as recastPrinter } from 'recast';

import type { Options, types } from 'recast';

/**
 * Prints the given AST node using the provided options.
 *
 * @param ast - The AST node to be printed.
 * @param opts - recast options https://github.com/benjamn/recast/blob/master/lib/options.ts
 * @returns An object containing:
 *  - `code`: A string representation of the AST node.
 *  - `map`: An optional source map if the `sourceMapName` option is set.
 *  - `toString()`: A method that returns the code as a string.
 *
 * @example
 * const printedResult = print(astNode, options);
 * console.log(printedResult.code);
 * // Outputs the printed code based on the AST node and options.
 */
export const print = (ast: types.ASTNode, opts?: Options) =>
  recastPrinter(ast, opts);
