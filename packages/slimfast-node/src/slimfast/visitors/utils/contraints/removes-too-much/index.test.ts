import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { removesTooMuch } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Removes too much', () => {
  const code = `() => 3 * 7`;
  const ast = parser(code);
  let rootPath: NodePath | null = null;
  const data = {};

  traverse(ast, {
    Expression(path) {
      rootPath = path;
      path.stop();
    },
  });
  test('', () => {
    if (rootPath !== null) {
      const result = removesTooMuch(3)(rootPath, data, {}, ast);
      expect(result).toBe(true);
    }
  });
});
