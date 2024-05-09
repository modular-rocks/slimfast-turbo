import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { isCallExpression } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Is call expression', () => {
  test('', () => {
    const code = 'getCharacterProgressions(profileInfo, character.id)';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      enter(path) {
        if (path.node.type !== 'Program' && rootPath === null) {
          rootPath = path;
          path.stop();
        }
      },
    });

    if (rootPath !== null) {
      const result = isCallExpression(rootPath);
      const expected = true;
      expect(result).toBe(expected);
    }
  });
});
