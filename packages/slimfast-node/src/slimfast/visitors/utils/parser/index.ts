import babelParser from '@babel/parser';

import type { RandomObject } from '../../../../types';

const babelConfig: RandomObject = {
  sourceType: 'module',
  createParenthesizedExpressions: true,
  plugins: ['jsx', ['typescript', { isTSX: true }], 'babel-plugin-recast'],
};

/**
 * Parses a given JavaScript or TypeScript code string into its corresponding Abstract Syntax Tree (AST) representation.
 *
 * This function utilizes Babel's parser with a predefined configuration suitable for
 * modern JavaScript and TypeScript code, including JSX. The configuration also ensures
 * the generation of parenthesized expressions and integrates the 'babel-plugin-recast' for further AST manipulations.
 *
 * @param code - The JavaScript or TypeScript code string to be parsed.
 * @returns The Abstract Syntax Tree representation of the provided code.
 *
 * @example
 * const code = `const greet = (name) => "Hello, " + name + "!";`;
 * const ast = parser(code);
 * // `ast` now contains the AST representation of the given code string.
 */
export const parser = (code: string) => babelParser.parse(code, babelConfig);
