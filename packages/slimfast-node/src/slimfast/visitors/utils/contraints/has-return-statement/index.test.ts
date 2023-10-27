import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasReturnStatement } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Has return statement', () => {
  test('', () => {
    const code = `() => {
      return yes;
    }`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasReturnStatement(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = `true`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasReturnStatement(rootPath);
      expect(result).toBe(false);
    }
  });
});
