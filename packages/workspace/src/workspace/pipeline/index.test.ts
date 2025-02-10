import { describe, expect, test } from 'vitest';

import { pipeline as runPipeline } from './index.js';
import { Workspace } from '../index.js';
import { Codebase } from '../codebase/index.js';

import type {
  CodebaseOpts,
  OutputIteration,
  WorkspaceOpts,
} from '../../types.js';

const syncFunction = (i: number, time: number, output: OutputIteration[]) => {
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

describe('Pipeline', () => {
  const output: OutputIteration[] = [];

  const pipeline = [
    asyncFunction(1, 500, output),
    asyncFunction(2, 20, output),
    syncFunction(3, 600, output),
    syncFunction(4, 30, output),
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
    src: '/',
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  const workspace = new Workspace(opts);
  const codebase = new Codebase(codebaseOpts);
  const filesContainer = Object.values(codebase.files);

  test('should invoke the pipeline in order', async () => {
    await runPipeline(filesContainer, pipeline, opts, workspace);
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

  test('should handle errors thrown by functions in the pipeline', async () => {
    const functionWithError = async () => {
      throw new Error('Test error');
    };

    await expect(() =>
      runPipeline(filesContainer, [functionWithError], opts, workspace)
    ).rejects.toThrowError('Test error');
  });

  test('should handle an empty pipeline correctly', async () => {
    const { isRunning } = await runPipeline(
      filesContainer,
      [],
      opts,
      workspace
    );
    expect(isRunning).toBe(false);
  });
});
