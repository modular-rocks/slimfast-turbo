import traverse from '@babel/traverse';
import { program } from '@babel/types';
import { Codebase, FileContainer } from '@modular-rocks/workspace-node';
import unique from 'array-unique';
import { describe, expect, test } from 'vitest';

import { combineImports } from '.';
import { extractIdentifiers } from '../../../../visitors/utils/extract-identifiers';
import { parser } from '../../../../visitors/utils/parser';

import type { ConstraintData } from '../../../../../types';
import type { NodePath } from '@babel/traverse';
import type { CodebaseOpts } from '@modular-rocks/workspace-node/dist/types/types';

const files: [string, string][] = [[`/path`, '']];
const opts: CodebaseOpts = {
  files,
  src: '/',
  extensions: [],
  ignoredFiles: [],
  ignoredImports: [],
  packageContents: {},
};
const codebase = new Codebase(opts);
const file = new FileContainer(`/path`, '', codebase);

describe('Combine imports', () => {
  test('It modularises', async () => {
    const code = `
      import { k, v } from './c-module'; 
      import c from './c-module'; 
      import { y, o } from './c-module'; 
    `;

    let rootPath: NodePath | null = null;
    const ast = parser(code);

    traverse(ast, {
      Program(path) {
        rootPath = path;
        path.stop();
      },
    });

    if (rootPath !== null) {
      const data: ConstraintData<'toImport' | 'toInject'> = {
        toImport: [],
        toInject: [],
      };
      extractIdentifiers(rootPath, data);
      const imports = unique(data.toImport);
      const combined = combineImports('/path/to', '/path/to/folder', imports);
      const combinedAst = program(combined);
      expect(file.print(combinedAst)).toBe(
        'import c, { k, v, y, o } from ".././c-module";'
      );
      expect(combined.length).toBe(1);
    }
  });
  test('It modularises', async () => {
    const code = `
      import { k, v } from './c-module'; 
      import c from './c-module'; 
      import { y, o } from './c-module'; 
      import hello from './hello';
      import { p, e } from './hello';
    `;

    let rootPath: NodePath | null = null;
    const ast = parser(code);

    traverse(ast, {
      Program(path) {
        rootPath = path;
        path.stop();
      },
    });

    if (rootPath !== null) {
      const data: ConstraintData<'toImport' | 'toInject'> = {
        toImport: [],
        toInject: [],
      };

      extractIdentifiers(rootPath, data);
      const imports = unique(data.toImport);
      const combined = combineImports(
        '/src/path/to',
        '/src/path/to/folder',
        imports
      );
      const combinedAst = program(combined);
      expect(file.print(combinedAst)).toBe(
        `import c, { k, v, y, o } from ".././c-module";
import hello, { p, e } from ".././hello";`
      );
      expect(combined.length).toBe(2);
    }
  });
});
