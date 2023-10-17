import { describe, expect, test } from 'vitest';

import { ExpressionVisitor } from '.';
import { parser } from '../utils/parser';

import type { SlimFastOpts } from '../../../types';
import type { NodePath } from '@babel/traverse';

const str = JSON.stringify;

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
    const files: [string, string][] = [[`/path`, code]];

    const opts: SlimFastOpts = {
      files,
      src: '/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const ast = parser(code);
    const extracted: Map<NodePath, any> = new Map();

    // TODO: fix ESLint error
    // eslint-disable-next-line no-new
    new ExpressionVisitor(ast, opts, {}, extracted);

    expect(extracted.size).toBe(2);
  }, 5000);
});
