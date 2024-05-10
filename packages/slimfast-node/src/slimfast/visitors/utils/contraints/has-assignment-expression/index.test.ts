import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasAssignmentExpression } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Has assignment expression', () => {
  test('', () => {
    const code = `yes = 'no'`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      AssignmentExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = 'yes';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      AssignmentExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(false);
    }
  });
});
