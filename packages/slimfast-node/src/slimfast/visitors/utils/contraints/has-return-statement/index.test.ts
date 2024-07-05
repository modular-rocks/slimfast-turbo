import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasReturnStatement } from './index.js';
import { parser } from '../../parser/index.js';

import type { NodePath } from '@babel/traverse';

describe('"hasReturnStatement" constraint function', () => {
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

  test('in return statement expression', () => {
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

  test('in block statement expression', () => {
    const code = `function foo() {
      return yes;
    }`;

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      // starting from the BlockStatement so the return statement is not wrapped into a function
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
  test('in a simple expression', () => {
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

describe('Problematic return statements', () => {
  const snippets = [
    'function foo () { return 42; }',
    'function foo () { if (true) { return "Hello"; } }',
    'function foo () { for (let i = 0; i < 10; i++) { return i; } }',
    'function foo () { let i = 0; while (i < 5) { return i; i++; } }',
    'function foo () { let j = 0; do { return j; j++; } while (j < 3); }',
    'function foo () { switch (x) { case 1: return "one"; case 2: return "two"; } }',
    'function foo () { try { return "Trying"; } catch (e) { console.log(e); } }',
    'function foo () { try { throw new Error("Oops"); } catch (e) { return "Caught"; } }',
    'function foo () { try { /* some code */ } finally { return "Finally"; } }',
    'function foo () { label: { return "Label"; } }',
  ];

  snippets.forEach((code, index) => {
    test(`snippet ${index + 1} is problematic`, () => {
      const ast = parser(code);
      let rootPath: NodePath | null = null;

      traverse(ast, {
        BlockStatement(path) {
          rootPath = path;
          path.stop();
        },
      });
      let result = false;

      if (rootPath !== null) {
        result = hasReturnStatement(rootPath);
      }

      expect(result, code).toBe(true);
    });
  });
});

describe('Non-problematic return statements', () => {
  const snippets = [
    'function test() { const result = true ? (() => { return 1; })() : 2; }',
    'function test() { const result = true && (() => { return 3; })(); }',
    'function test() { const result = false || (() => { return 4; })(); }',
    'function test() { const result = !(() => { return 5; })(); }',
    'function test() { const result = (1, (() => { return 6; })()); }',
    'function test() { const result = (x = (() => { return 7; })()); }',
    'function test() { const arr = [(() => { return 8; })()]; }',
    'function test() { const obj = { key: (() => { return 9; })() }; }',
    'function test() { const result = `${(() => { return 10; })()}`; }',
    'function test() { const result = tag`${(() => { return 11; })()}`; }',
  ];

  snippets.forEach((code, index) => {
    test(`snippet ${index + 1} is not problematic`, () => {
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

      expect(result, code).toBe(false);
    });
  });
});
