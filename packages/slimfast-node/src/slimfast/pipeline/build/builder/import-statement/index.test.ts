import traverse from '@babel/traverse';
import { Codebase, FileContainer } from '@modular-rocks/workspace-node';
import { describe, expect, test } from 'vitest';

import { generateImportDeclaration } from '.';
import { parser } from '../../../../visitors/utils/parser';

import type { SlimFastOpts } from '../../../../../types';
import type { NodePath } from '@babel/traverse';

const files: [string, string][] = [[`/path`, '']];
const opts: SlimFastOpts = {
  files,
  src: '/',
  extensions: [],
  ignoredFiles: [],
  ignoredImports: [],
  packageContents: {},
};
const codebase = new Codebase(opts);
const file = new FileContainer(`/path`, '', codebase);

const ast = parser('4 * 5');
let nodePath: NodePath | null = null;

traverse(ast, {
  enter(path) {
    nodePath = path;
  },
});

describe('Combine imports', () => {
  test('It modularises', async () => {
    if (nodePath) {
      const statement = generateImportDeclaration(
        'module',
        '/path/to/folder',
        '/path/to',
        nodePath
      );
      expect(file.print(statement)).toBe('import module from "./to/folder";');
    }
  });
});
