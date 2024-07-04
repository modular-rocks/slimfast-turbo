import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasVariableDeclarator } from './index.js';
import { parser } from '../../parser/index.js';

import type { NodePath } from '@babel/traverse';

describe('Has variable declarator', () => {
  test('', () => {
    const code = `yes = 'no'`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      VariableDeclarator(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasVariableDeclarator(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = 'yes';
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      VariableDeclarator(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasVariableDeclarator(rootPath);
      expect(result).toBe(false);
    }
  });
});
