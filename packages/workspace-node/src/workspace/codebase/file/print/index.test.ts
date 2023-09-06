import type { Options } from 'recast';

import { describe, expect, test } from 'vitest';
import { print } from '.';
import { parse } from '../parse';

describe('"print" utility function', () => {
  test('should return an object with the specified properties', () => {
    const code = 'const x = 10;';
    const ast = parse(code);
    const printedResult = print(ast);

    expect(printedResult).toHaveProperty('code');
    expect(printedResult).toHaveProperty('toString');
  });

  test('should produce a map when "sourceMapName" is set', () => {
    const code = 'const x = 10;';
    const ast = parse(code);
    const options: Options = {
      sourceMapName: 'test.js.map',
    };
    const printedResult = print(ast, options);

    expect(printedResult).toHaveProperty('map');
    expect(printedResult).toHaveProperty('code');
    expect(printedResult).toHaveProperty('toString');
  });

  test('should print the AST node correctly', () => {
    const code = 'const x = 10;';
    const ast = parse(code);
    const printedResult = print(ast);

    expect(printedResult.code).toBe(code);
  });

  test('should return the code as a string using toString()', () => {
    const code = 'const x = 10;';
    const ast = parse(code);
    const printedResult = print(ast);

    expect(printedResult.toString()).toBe(printedResult.code);
  });
});
