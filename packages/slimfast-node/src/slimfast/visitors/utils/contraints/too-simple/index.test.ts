import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';
import { tooSimple } from './index.js';
import { parser } from '../../parser/index.js';

import type { NodePath } from '@babel/traverse';

describe('Too Simple Constraint', () => {
  test('detects a simple file (low loc)', () => {
    const code = `console.log("hello world");`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      Program(path) {
        rootPath = path;
        path.stop();
      },
    });

    if (rootPath !== null) {
      // With a very short file, loc will likely be below 50.
      const result = tooSimple(rootPath);
      expect(result).toBe(true);
    }
  });
});
