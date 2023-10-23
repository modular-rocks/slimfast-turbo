import { describe, expect, test } from 'vitest';

import { parse } from '.';

describe('"parse" utility function', () => {
  test('should return an AST for valid code', () => {
    const code = 'const x = 10;';
    const ast = parse(code);

    expect(ast).toBeDefined();
    expect(ast.type).toBe('File');
    expect(ast.program.body[0].type).toBe('VariableDeclaration');
  });

  test('should handle JSX correctly', () => {
    const jsxCode = '<div>Hello World</div>';
    const ast = parse(jsxCode);

    expect(ast).toBeDefined();
    expect(ast.program.body[0].type).toBe('ExpressionStatement');
    // type guard
    if (ast.program.body[0].type === 'ExpressionStatement') {
      expect(ast.program.body[0].expression.type).toBe('JSXElement');
    }
  });
});
