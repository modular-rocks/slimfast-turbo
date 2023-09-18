import { describe, expect, test } from 'vitest';

import { CodebaseOpts } from '@modular-rocks/workspace/dist/types/types';

import { Codebase as CodebaseBase } from '@modular-rocks/workspace';
import { FileContainer as FileContainerBase } from '@modular-rocks/workspace/dist/types/workspace/codebase/file';

import type { FileHandler as FileHandlerBase } from '@modular-rocks/workspace/dist/types/workspace/codebase/file';

import SlimfastBase from '.';

type OutPutIteration = [number, number];

export class FileHandler implements FileHandlerBase {
  private fileContainer: FileContainerBase | null = null;

  private codebase: CodebaseBase | null = null;

  assignFileContainer(fileContainer: FileContainerBase): this {
    this.fileContainer = fileContainer;
    return this;
  }

  assignCodebase(codebase: CodebaseBase): this {
    this.codebase = codebase;
    return this;
  }

  tooSimple(): Boolean {
    return false;
  }

  addImport(importStatement?: any) {
    return false;
  }

  codeToAST() {
    return {};
  }

  astToCode() {
    return '';
  }
}

class Slimfast extends SlimfastBase<FileHandler> {
  constructor(opts: CodebaseOpts) {
    super(new FileHandler(), opts);
  }
}

const normalFunction = (i: number, time: number, output: OutPutIteration[]) => {
  return () => {
    const result: OutPutIteration = [i, time];
    output.push(result);
    return result;
  };
};

const asyncFunction = (i: number, time: number, output: OutPutIteration[]) => {
  return async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        const result: OutPutIteration = [i, time];
        output.push(result);
        resolve(result);
      }, time);
    });
  };
};

describe('Slimfast base', () => {
  test('Is invoked in order', async () => {
    const output: OutPutIteration[] = [];

    const pipeline = [
      asyncFunction(1, 500, output),
      asyncFunction(2, 20, output),
      normalFunction(3, 600, output),
      normalFunction(4, 30, output),
      asyncFunction(5, 200, output),
      asyncFunction(6, 800, output),
    ];

    const files: [string, string][] = [1, 2, 3].map((x: number) => [
      `/path${x}`,
      '',
    ]);
    const opts: CodebaseOpts = {
      pipeline,
      files,
      src: '/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const slimFast = new Slimfast(opts);
    await slimFast.run();

    const result = [
      [1, 500],
      [1, 500],
      [1, 500],
      [2, 20],
      [2, 20],
      [2, 20],
      [3, 600],
      [3, 600],
      [3, 600],
      [4, 30],
      [4, 30],
      [4, 30],
      [5, 200],
      [5, 200],
      [5, 200],
      [6, 800],
      [6, 800],
      [6, 800],
    ];
    expect(typeof slimFast.original).toBe('object');
    expect(typeof slimFast.refactored).toBe('object');
    expect(typeof slimFast.original.files).toBe('object');
    expect(typeof slimFast.refactored.files).toBe('object');
    expect(JSON.stringify(output)).toBe(JSON.stringify(result));
    const newCodebase = slimFast.newCodeBase(opts);
    expect(newCodebase.src).toBe(slimFast.refactored.src);
  }, 8000);
  test('Default options adds an empty array for pipeline', async () => {
    const output: OutPutIteration[] = [];
    const files: [string, string][] = [1, 2, 3].map((x: number) => [
      `/path${x}`,
      '',
    ]);
    const opts: CodebaseOpts = {
      files,
      src: '/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const slimFast = new Slimfast(opts);
    await slimFast.run();

    expect(JSON.stringify(output)).toBe(JSON.stringify([]));
    expect(JSON.stringify(slimFast.opts.pipeline)).toBe(JSON.stringify([]));
  });
});
