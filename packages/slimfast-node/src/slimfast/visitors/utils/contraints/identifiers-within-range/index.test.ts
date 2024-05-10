import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { identifiersWithinRange } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Identifiers within range', () => {
  test('', () => {
    const code = '() => x * y * z * a * b * c';
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {
      toInject: [],
      toImport: [],
    };

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = identifiersWithinRange(2, 4)(rootPath, data);
      expect(result).toBe(false);
    }
  });

  test('', () => {
    const code = '() => x * y';
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {
      toInject: [],
      toImport: [],
    };

    traverse(ast, {
      ArrayExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = identifiersWithinRange(2, 4)(rootPath, data);
      expect(result).toBe(true);
    }
  });
});
