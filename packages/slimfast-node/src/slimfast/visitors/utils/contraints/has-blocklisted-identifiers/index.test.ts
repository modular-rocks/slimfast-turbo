import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasBlocklistedIdentifiers } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Has blocklisted identifiers', () => {
  test('', () => {
    const code = 'x * y';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasBlocklistedIdentifiers(['x', 'y'])(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = 'true';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasBlocklistedIdentifiers(['x', 'y'])(rootPath);
      expect(result).toBe(false);
    }
  });
});
