import { describe, expect, test } from 'vitest';

import { ExpressionVisitor } from './index.js';
import { parser } from '../utils/parser/index.js';

import type { VisitorOpts } from '../../../types.js';
import type { NodePath } from '@babel/traverse';

const code = `
import a from 'a-module'; 
import b from 'b-module'; 
import c from 'c-module'; 
import z from 'z-module'; 
const x = 1;
const y = 2;
function Multiply() { 
  x * y * z
};
`;

describe('Slimfast Node', () => {
  test('It modularises', async () => {
    const files: [string, string][] = [['/path', code]];

    const opts: VisitorOpts = {
      blocklistedParents: [],
      toImport: [],
      toInject: [],
    };

    const ast = parser(code);
    const extracted: Map<NodePath, any> = new Map();

    new ExpressionVisitor(ast, opts, {}, extracted);

    expect(extracted.size).toBe(2);
  }, 5000);
});
