import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasReturnStatement } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Is problematic', () => {
  test('wrapped in arrow function', () => {
    const code = `() => {
      return yes;
    }`;

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      // starting from the arrow function declaration so the return statement is wrapped into a function
      enter(path) {
        rootPath = path;
        path.stop();
      },
    });
    let result = true;

    if (rootPath !== null) {
      result = hasReturnStatement(rootPath);
    }

    expect(result).toBe(false);
  });

  test('wrapped in normal function', () => {
    const code = `function foo() {
      return yes;
    }`;

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      // starting from the function declaration so the return statement is wrapped into a function
      enter(path) {
        rootPath = path;
        path.stop();
      },
    });
    let result = true;

    if (rootPath !== null) {
      result = hasReturnStatement(rootPath);
    }

    expect(result).toBe(false);
  });

  test('in return stament expression', () => {
    const code = `function foo() {
      return yes;
    }`;

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      // starting from the ReturnStatement itself
      ReturnStatement(path) {
        rootPath = path;
        path.stop();
      },
    });
    let result = false;

    if (rootPath !== null) {
      result = hasReturnStatement(rootPath);
    }

    expect(result).toBe(true);
  });

  test('in return statement expression', () => {
    const code = `function foo() {
      return yes;
    }`;

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      // starting from the BlockStatement so the return statement is not wrapped into a fu
      BlockStatement(path) {
        rootPath = path;
        path.stop();
      },
    });
    let result = false;

    if (rootPath !== null) {
      result = hasReturnStatement(rootPath);
    }

    expect(result).toBe(true);
  });
});

describe('Has no return statement', () => {
  test('in a random expression', () => {
    const code = 'yes;';

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      enter(path) {
        rootPath = path;
        path.stop();
      },
    });
    let result = true;

    if (rootPath !== null) {
      result = hasReturnStatement(rootPath);
    }

    expect(result).toBe(false);
  });
});
