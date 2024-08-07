import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { containsIdentifiersInOtherScopes } from './index.js';
import { parser } from '../../parser/index.js';

import type { NodePath } from '@babel/traverse';

describe('Contains variables in other scopes', () => {
  test('', () => {
    const code = `
    let yes = 'yes';
    function change() {
      yes = 'no';
    }`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      VariableDeclaration(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = containsIdentifiersInOtherScopes(rootPath);
      expect(result).toBe(true);
    }
  });

  test('', () => {
    const code = `let yes = 'yes'`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      VariableDeclarator(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = containsIdentifiersInOtherScopes(rootPath);
      expect(result).toBe(false);
    }
  });
});
