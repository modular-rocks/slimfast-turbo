import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { extractIdentifiers } from './index';
import { parser } from '../parser';

import type { NodePath, Binding } from '@babel/traverse';

const str = JSON.stringify;

describe('Extract Identifiers', () => {
  test('', () => {
    const code = 'let result = x * e * o;';
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    traverse(ast, {
      VariableDeclaration(path) {
        const initNode = path.node.declarations[0].init;
        if (initNode) {
          rootPath = path.findParent((p) => p.node === initNode);
        }
      },
    });
    if (rootPath !== null) {
      const data = {
        toInject: [],
        toImport: [],
      };
      extractIdentifiers(rootPath, data);
      const variables = data.toInject.map((x: Binding) => x.identifier.name);
      expect(str(variables)).toBe(str(['x', 'e', 'o']));
    }
  });

  test('', () => {
    const code = `import x from 'x-module'; let result = x * e * o;`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    traverse(ast, {
      VariableDeclaration(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const data = {
        toInject: [],
        toImport: [],
      };
      extractIdentifiers(rootPath, data);
      const imports = data.toImport.map((x: Binding) => x.identifier.name);
      expect(str(imports)).toBe(str(['x']));
    }
  });
});
