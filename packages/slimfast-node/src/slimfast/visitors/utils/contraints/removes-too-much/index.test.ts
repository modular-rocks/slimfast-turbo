import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { removesTooMuch } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Removes too much', () => {
  const code = '() => 3 * 7';
  const ast = parser(code);
  let rootPath: NodePath | null = null;

  traverse(ast, {
    Expression(path) {
      rootPath = path;
      path.stop();
    },
  });
  test('', () => {
    if (rootPath !== null) {
      const result = removesTooMuch(3)(rootPath, { ast });
      expect(result).toBe(true);
    }
  });
});
