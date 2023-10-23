import { parse as babelParser } from '@babel/parser';

import type { ParserOptions } from '@babel/parser';

const babelConfig: ParserOptions = {
  sourceType: 'module',
  createParenthesizedExpressions: true,
  plugins: ['jsx', 'typescript'],
};

/**
 * Parses the given code string using Babel's parser with a predefined configuration.
 *
 * @param code - The source code string to be parsed.
 * @returns The AST (Abstract Syntax Tree) representation of the provided code.
 *
 * @example
 * const code = 'import React from "react";';
 * const ast = parse(code);
 * console.log(ast);
 * // Outputs the AST representation of the code.
 */
export const parse = (code: string) => babelParser(code, babelConfig);
