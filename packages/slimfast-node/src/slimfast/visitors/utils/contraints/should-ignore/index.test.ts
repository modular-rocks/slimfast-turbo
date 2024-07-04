import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { shouldIgnore } from './index.js';
import { parser } from '../../parser/index.js';

import type { NodePath } from '@babel/traverse';

describe('Should Ignore', () => {
  test('', () => {
    const code = `
    class Test extends SuperTest {
      constructor() {
        super();
      }
    }`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      Program(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = shouldIgnore(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = `
    function* generatorFunction() {
      yield 1;
      yield 2;
      yield 3;
    }`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      Program(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = shouldIgnore(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = `
    4 * 7`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      Program(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = shouldIgnore(rootPath);
      expect(result).toBe(false);
    }
  });
});
