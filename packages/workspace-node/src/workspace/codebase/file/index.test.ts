import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  stringLiteral,
} from '@babel/types';
import { describe, expect, test } from 'vitest';

import { Codebase } from '..';

import { FileContainer } from '.';
import type { CodebaseOpts } from '../../../types';

const str = JSON.stringify;

describe('FileContainer', () => {
  test('Everything works as expected', async () => {
    const files: [string, string][] = [1, 2, 3].map((x: number) => {
      return [`/home/projects/project/path${x}`, 'export default (x) => x * x'];
    });
    const pipeline: Function[] = [];

    const opts: CodebaseOpts = {
      pipeline,
      files,
      src: '/home/projects/project/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const codebase = new Codebase(opts);
    const filesContainer = codebase.extractFiles();
    const file = filesContainer[0];

    expect(file.pathname).toBe('/project/path1');
    expect(file.fullPath).toBe('/home/projects/project/path1');
    file.parse();
    expect(file.simple).toBe(true);
    expect(str(file.fileHandler.codeToAST())).toBe(
      '{"type":"File","start":0,"end":27,"loc":{"start":{"line":1,"column":0,"index":0},"end":{"line":1,"column":27,"index":27}},"errors":[],"program":{"type":"Program","start":0,"end":27,"loc":{"start":{"line":1,"column":0,"index":0},"end":{"line":1,"column":27,"index":27}},"sourceType":"module","interpreter":null,"body":[{"type":"ExportDefaultDeclaration","start":0,"end":27,"loc":{"start":{"line":1,"column":0,"index":0},"end":{"line":1,"column":27,"index":27}},"exportKind":"value","declaration":{"type":"ArrowFunctionExpression","start":15,"end":27,"loc":{"start":{"line":1,"column":15,"index":15},"end":{"line":1,"column":27,"index":27}},"id":null,"generator":false,"async":false,"params":[{"type":"Identifier","start":16,"end":17,"loc":{"start":{"line":1,"column":16,"index":16},"end":{"line":1,"column":17,"index":17},"identifierName":"x"},"name":"x"}],"body":{"type":"BinaryExpression","start":22,"end":27,"loc":{"start":{"line":1,"column":22,"index":22},"end":{"line":1,"column":27,"index":27}},"left":{"type":"Identifier","start":22,"end":23,"loc":{"start":{"line":1,"column":22,"index":22},"end":{"line":1,"column":23,"index":23},"identifierName":"x"},"name":"x"},"operator":"*","right":{"type":"Identifier","start":26,"end":27,"loc":{"start":{"line":1,"column":26,"index":26},"end":{"line":1,"column":27,"index":27},"identifierName":"x"},"name":"x"}}}}],"directives":[]},"comments":[]}'
    );
    expect(file.fileHandler.astToCode(file.ast)).toBe(
      'export default x => x * x;'
    );
    expect(file.print()).toBe('export default x => x * x;');

    const declaration = importDeclaration(
      [importDefaultSpecifier(identifier('myModule'))],
      stringLiteral('my-module')
    );

    file.fileHandler.addImport(declaration);

    expect(file.print()).toBe(
      'import myModule from "my-module";\nexport default x => x * x;'
    );
  });
});

describe('FileContainer - getDominantEOL', () => {
  const opts: CodebaseOpts = {
    pipeline: [],
    files: [],
    src: '/home/projects/project/',
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  test('Should identify Windows (CRLF) EOL', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = "'Hello\r\nWorld\r\n'";
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);
    expect(fileContainer.fileHandler.getDominantEOL()).toBe('\r\n');
  });

  test('Should identify Unix (LF) EOL', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = "'Hello\nWorld\n'";
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);
    expect(fileContainer.fileHandler.getDominantEOL()).toBe('\n');
  });

  test('Should identify old Mac (CR) EOL', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = "'Hello\rWorld\r'";
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);
    expect(fileContainer.fileHandler.getDominantEOL()).toBe('\r');
  });

  test('Should default to LF for mixed EOLs with a tie', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = "'Hello\r\nWorld\n'";
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);
    expect(fileContainer.fileHandler.getDominantEOL()).toBe('\n');
  });

  test('Should default to given EOL for mixed EOLs with a tie', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = "'Hello\r\nWorld\r'";
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);
    expect(fileContainer.fileHandler.getDominantEOL('\r')).toBe('\r');
  });

  test('Should default to LF for no newlines', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = "'HelloWorld'";
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);
    expect(fileContainer.fileHandler.getDominantEOL()).toBe('\n');
  });
});

describe('FileContainer - addImport', () => {
  const opts: CodebaseOpts = {
    pipeline: [],
    files: [],
    src: '/home/projects/project/',
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  test('Should return true if import is added', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = `const msg = "HelloWorld";`;
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);

    // this will also set the ast property, alternative we could use parse
    // fileContainer.parse();
    expect(fileContainer.print()).toBe(code);

    const declaration = importDeclaration(
      [importDefaultSpecifier(identifier('myModule'))],
      stringLiteral('my-module')
    );

    const result = fileContainer.fileHandler.addImport(declaration);

    expect(fileContainer.print()).toBe(
      `import myModule from "my-module";\n${code}`
    );

    expect(result).toBe(true);
  });

  test('Should return false if AST is not defined', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = `const msg = "HelloWorld";`;
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);

    // Ensure ast is not defined
    fileContainer.ast = undefined;

    const declaration = importDeclaration(
      [importDefaultSpecifier(identifier('myModule'))],
      stringLiteral('my-module')
    );

    const result = fileContainer.fileHandler.addImport(declaration);

    expect(fileContainer.print()).toBe(code);
    expect(result).toBe(false);
  });

  test('Should return false if ast.program.body is not available', () => {
    const filePath = `/home/projects/project/file.js`;
    const code = `const msg = "HelloWorld";`;
    const codebase = new Codebase(opts);
    const fileContainer = new FileContainer(filePath, code, codebase);

    // Mock AST to not have program.body
    fileContainer.ast = {
      type: 'File',
      start: 0,
      end: 10,
      loc: {}, // Dummy location
      program: {
        type: 'Program',
        start: 0,
        end: 10,
        loc: {}, // Dummy location
        body: undefined, // No body
      },
    } as any; // Cast to any to bypass type checking for this mock

    const declaration = importDeclaration(
      [importDefaultSpecifier(identifier('myModule'))],
      stringLiteral('my-module')
    );

    const result = fileContainer.fileHandler.addImport(declaration);

    expect(result).toBe(false);
  });
});
