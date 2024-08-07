import { describe, expect, test } from 'vitest';

import { Workspace } from './index.js';
import { Codebase } from './codebase/index.js';

import type { CodebaseOpts, OutputIteration, WorkspaceOpts } from '../types.js';

const normalFunction = (i: number, time: number, output: OutputIteration[]) => {
  return () => {
    const result: OutputIteration = [i, time];
    output.push(result);
    return result;
  };
};

const asyncFunction = (i: number, time: number, output: OutputIteration[]) => {
  return async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        const result: OutputIteration = [i, time];
        output.push(result);
        resolve(result);
      }, time);
    });
  };
};

describe('Workspace base', () => {
  test('Is invoked in order', async () => {
    const output: OutputIteration[] = [];

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
  }, 8000);

  test('Default options adds an empty array for files', async () => {
    const output: OutputIteration[] = [];
    const opts: WorkspaceOpts = {
      src: __dirname,
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const workspace = new Workspace(opts);
    await workspace.defaultLoader(opts);

    expect(JSON.stringify(workspace.opts.files)).toBe(JSON.stringify([]));
  });
});
