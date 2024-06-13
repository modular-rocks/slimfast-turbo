import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { isAFunction } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('"isAFunction" utility function', () => {
  test('should identify an arrow function expression as a function', () => {
    const code = '() => 3 * 7';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ArrowFunctionExpression(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected an arrow function expression to be identified as a function'
    ).toBe(true);
  });

  test('should identify a function declaration as a function', () => {
    const code = 'function foo() {}';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      FunctionDeclaration(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected a function declaration to be identified as a function'
    ).toBe(true);
  });

  test('should identify a function expression as a function', () => {
    const code = 'const foo = function() {}';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      FunctionExpression(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected a function expression to be identified as a function'
    ).toBe(true);
  });

  test('should identify an object method as a function', () => {
    const code = 'const obj = { method() {} }';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ObjectMethod(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected an object method to be identified as a function'
    ).toBe(true);
  });

  test('should identify a class method as a function', () => {
    const code = 'class MyClass { method() {} }';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ClassMethod(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected a class method to be identified as a function'
    ).toBe(true);
  });

  test('should identify a private class method as a function', () => {
    const code = 'class MyClass { #privateMethod() {} }';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ClassPrivateMethod(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected a private class method to be identified as a function'
    ).toBe(true);
  });

  test('should not identify a non-function expression as a function', () => {
    const code = '3 * 7';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ExpressionStatement(path) {
        rootPath = path;
        path.stop();
      },
    });

    let result = false;
    if (rootPath !== null) {
      result = isAFunction(rootPath);
    }
    expect(
      result,
      'Expected a non-function expression to not be identified as a function'
    ).toBe(false);
  });
});
