import mockFs from 'mock-fs';
import { describe, expect, test } from 'vitest';

import { Workspace } from '.';
import { Codebase } from './codebase';

import type { CodebaseOpts, WorkspaceOpts } from '../types';

type OutPutIteration = [number, number];

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

describe('Workspace base', () => {
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
    const opts: WorkspaceOpts = {
      pipeline,
      files,
      src: '/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const codebaseOpts: CodebaseOpts = {
      pipeline,
      files,
      src: '/home/projects/project/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const workspace = new Workspace(opts);
    const codebase = new Codebase(codebaseOpts);
    await workspace.pipeline(codebase.extractFiles(), pipeline, opts);

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
    expect(JSON.stringify(output)).toBe(JSON.stringify(result));
  });
  test('Default options adds an empty array for files', async () => {
    const output: OutPutIteration[] = [];
    const opts: WorkspaceOpts = {
      src: __dirname,
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const workspace = new Workspace(opts);
    expect(JSON.stringify(workspace.opts.files)).toBe(JSON.stringify([]));
  });

  test('Should load package contents from packagePath if packageContents is not provided', () => {
    const mockPackageContent = { name: 'test-package', version: '1.0.0' };

    const opts: WorkspaceOpts = {
      src: process.cwd(),
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: undefined,
      packagePath: './path/to/package.json',
    };

    mockFs({
      './path/to': {
        'package.json': JSON.stringify(mockPackageContent),
      },
    });

    const workspace = new Workspace(opts);
    workspace.defaultLoader(opts);

    expect(opts.packageContents).toEqual(mockPackageContent);

    mockFs.restore();
  });
});
