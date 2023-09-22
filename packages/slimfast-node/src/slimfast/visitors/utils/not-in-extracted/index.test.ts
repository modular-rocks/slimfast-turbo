import traverse, { NodePath, Node } from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { notInExtracted } from './index';
import { parser } from '../parser';

import type { RandomObject } from '../../../../types';

describe('Not in extracted', () => {
  const code = `let result = ((2 + 3) * 4 - Math.sqrt(9)) / (6 % 2) + Math.pow(2, 5) - parseFloat('10.5') + parseInt('100', 2);`;
  const ast = parser(code);

  test('', () => {
    let rootPath: NodePath | null = null;
    traverse(ast, {
      enter(path) {
        if (rootPath === null) {
          rootPath = path;
        }
        path.stop();
      },
    });

    if (rootPath !== null) {
      const extracted: Map<NodePath, RandomObject> = new Map();
      extracted.set(rootPath, {});
      const result = notInExtracted(rootPath, extracted);
      expect(result).toBe(false);
    }
  });

  test('', () => {
    let rootPath: NodePath | null = null;
    traverse(ast, {
      enter(path) {
        if (rootPath === null) {
          rootPath = path;
        }
        path.stop();
      },
    });

    if (rootPath !== null) {
      const extracted: Map<NodePath, RandomObject> = new Map();
      const result = notInExtracted(rootPath, extracted);
      expect(result).toBe(true);
    }
  });
});
