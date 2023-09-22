import traverse, { NodePath, Node } from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { tooSmall } from './index';
import { parser } from '../../parser';
import { extractIdentifiers } from '../../extract-identifiers';

describe('Too Small', () => {
  const code = `let result = ((2 + 3) * 4 - Math.sqrt(9)) / (6 % 2) + Math.pow(2, 5) - parseFloat('10.5') + parseInt('100', 2);`;
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
      extractIdentifiers(rootPath, data);
      const result = tooSmall(2, 50, true)(rootPath, data, {}, ast);
      expect(result).toBe(false);
    }
  });
  test('', () => {
    if (rootPath !== null) {
      extractIdentifiers(rootPath, data);
      const result = tooSmall(4, 50, true)(rootPath, data, {}, ast);
      expect(result).toBe(false);
    }
  });
  test('', () => {
    if (rootPath !== null) {
      extractIdentifiers(rootPath, data);
      const result = tooSmall(1, 400, true)(rootPath, data, {}, ast);
      expect(result).toBe(true);
    }
  });
});
