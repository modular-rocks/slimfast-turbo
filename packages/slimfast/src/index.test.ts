import mockFs from 'mock-fs';
import { describe, expect, test, vi } from 'vitest';

import { SlimFast } from './index.js';

import type { CodebaseOpts } from '@modular-rocks/workspace/types';

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

    const slimFast = new SlimFast(opts);
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

    const slimFast = new SlimFast(opts);
    await slimFast.run();

    expect(JSON.stringify(output)).toBe(JSON.stringify([]));
    expect(JSON.stringify(slimFast.opts.pipeline)).toBe(JSON.stringify([]));
  });

  test('save method calls refactored.save', async () => {
    mockFs({
      './path/to': {},
    });

    const files: [string, string][] = [1, 2, 3].map((x: number) => [
      `./path/to/file-${x}.js`,
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

    const slimFast = new SlimFast(opts);

    const saveSpy = vi.spyOn(slimFast.refactored, 'save').mockResolvedValue([]);

    await slimFast.save();

    expect(saveSpy).toHaveBeenCalled();

    saveSpy.mockRestore();
    mockFs.restore();
  });
});
