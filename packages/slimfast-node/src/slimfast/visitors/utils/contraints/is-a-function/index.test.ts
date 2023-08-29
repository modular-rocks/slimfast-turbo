import traverse, { NodePath, Node } from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import constraint from './index';
import parser from '../../parser';

describe('Is a function', () => {
  test('', () => {
    const code = `() => 3 * 7`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {};

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = constraint(rootPath, data, {}, ast);
      expect(result).toBe(true);
    }
  });
  test('', () => {
    const code = `3 * 7`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {};

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = constraint(rootPath, data, {}, ast);
      expect(result).toBe(false);
    }
  });
});
