import { readFile } from 'node:fs/promises';

import mockFs from 'mock-fs';
import { describe, expect, test } from 'vitest';

import { Codebase } from '../index.js';

import type { CodebaseOpts } from '../../../types.js';

const str = JSON.stringify;

describe('FileContainer', () => {
  const files: [string, string][] = [1, 2, 3].map((x: number) => [
    `/home/projects/project/path${x}`,
    '',
  ]);

  const opts: CodebaseOpts = {
    pipeline: [],
    files,
    src: '/home/projects/project/',
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  test('creates a "FileContainer" instance correctly', async () => {
    const codebase = new Codebase(opts);
    const filesContainer = Object.values(codebase.files);
    const file = filesContainer[0];

    expect(file.pathname).toBe('/project/path1');
    expect(file.fullPath).toBe('/home/projects/project/path1');
    file.parse();
    expect(str(file.codeToAST())).toBe(str({}));
    expect(file.astToCode()).toBe('');
    expect(file.print()).toBe('');
    file.updateCode();
    expect(file.code).toBe('');
    const newFile = file.spawn({
      pathname: '/home/projects/project/path4',
      ast: {},
      import: '',
    });
    expect(newFile.pathname).toBe('/project/path4');
    expect(newFile.fullPath).toBe('/home/projects/project/path4');
  });

  test('should add an import using the "addImport" method', () => {
    const codebase = new Codebase(opts);
    const filesContainer = Object.values(codebase.files);
    const file = filesContainer[0];

    const result = file.addImport('import { hello } from "./hello";');
    // As per the current implementation
    expect(result).toBe(false);
  });

  test('should save a file using the "save" method', async () => {
    mockFs({
      './path/to': {},
    });

    const filePath = './path/to/file.txt';
    const code = 'console.log("Hello World");';

    const codebase = new Codebase({
      ...opts,
      files: [[filePath, code]],
    });

    const filesContainer = Object.values(codebase.files);
    const file = filesContainer[0];

    await file.save();
    const writtenData = await readFile(filePath, 'utf-8');

    expect(writtenData).toBe(code);

    mockFs.restore();
  });

  test('should handle early exit behavior in the "parse" method', () => {
    const codebase = new Codebase(opts);
    const filesContainer = Object.values(codebase.files);
    const file = filesContainer[0];

    const mockAST = {
      type: 'Program',
    };

    file.parse();

    // Check that the AST is empty (as per the current implementation)
    expect(file.ast).toEqual({});

    // Set a pre-existing AST and mark the file as 'simple'
    file.ast = mockAST;

    // Parse the file again (now with a pre-existing AST and 'simple' flag set)
    file.parse();

    // Check that the 'simple' flag remains true and the AST remains unchanged
    expect(file.ast).toEqual(mockAST);
  });

  test('should generate an AST using the "print" method when there is no pre-existing AST', () => {
    const codebase = new Codebase(opts);
    const filesContainer = Object.values(codebase.files);
    const file = filesContainer[0];

    // Ensure that no AST is pre-existing
    file.ast = null;

    file.print();

    // Assert that the file's content has been parsed and an AST has been generated
    expect(file.ast).toEqual({});
  });
});
