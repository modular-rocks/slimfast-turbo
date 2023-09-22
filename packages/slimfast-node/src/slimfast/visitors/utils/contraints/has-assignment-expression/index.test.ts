import traverse, { NodePath, Node } from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasAssignmentExpression } from './index';
import { parser } from '../../parser';

describe('Has assignment expression', () => {
  test('', () => {
    const code = `yes = 'no'`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {};

    traverse(ast, {
      AssignmentExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath, data, {}, ast);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = `yes`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {};

    traverse(ast, {
      AssignmentExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath, data, {}, ast);
      expect(result).toBe(false);
    }
  });
});
