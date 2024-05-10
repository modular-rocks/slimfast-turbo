import { readFile, writeFile } from 'node:fs/promises';

import mockFs from 'mock-fs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  createDir,
  fromFile,
  saveFile,
  saveToJSON,
  toFile,
  toJson,
} from './index';
import { Codebase } from '..';

import type { CodebaseOpts, RandomObject } from '../../../types';

describe('Save utilities', () => {
  const mockData: RandomObject = {
    key: 'value',
    nested: {
      prop: 'nestedValue',
    },
  };

  const opts: CodebaseOpts = {
    pipeline: [],
    files: [],
    src: process.cwd(),
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  beforeEach(() => {
    mockFs({
      './path/to': {},
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  test('"createDir" creates a directory and writes data to a file', async () => {
    const filePath = './path/to/new-dir/sampleFile.txt';
    const code = 'Hello, World!';

    await createDir(filePath, code);
    const writtenData = await readFile(filePath, 'utf-8');

    expect(writtenData).toBe(code);
  });

  test('"createDir" handles errors correctly', async () => {
    const filePath = '\0somepath';
    const code = 'Hello, World!';

    const logSpy = vi
      .spyOn(global.console, 'error')
      .mockImplementation(() => {});

    await createDir(filePath, code);

    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });

  test('"toJson" converts object to JSON string', () => {
    const result = toJson(mockData);
    expect(result).toBe(JSON.stringify(mockData));
  });

  test('"saveFile" writes data to a file', async () => {
    const filePath = './path/to/file.txt';
    await saveFile(filePath, 'sample data');
    const writtenData = await readFile(filePath, 'utf-8');

    expect(writtenData).toBe('sample data');
  });

  test('"saveToJSON" writes JSON data to a file', async () => {
    const filePath = './path/to/file.json';
    await saveToJSON(filePath, mockData);
    const writtenData = await readFile(filePath, 'utf-8');

    expect(writtenData).toBe(JSON.stringify(mockData));
  });

  test('"fromFile" reads and parses JSON data from a file', async () => {
    const filePath = './path/to/file.json';
    await writeFile(filePath, JSON.stringify(mockData));

    const codebase: Codebase & typeof mockData = new Codebase(opts);
    await fromFile(filePath, codebase);

    expect(codebase).toHaveProperty('key');
    expect(codebase).toHaveProperty('nested');
    expect(codebase.nested.prop).toBe('nestedValue');
  });

  test('"fromFile" handles errors correctly', async () => {
    const filePath = './path/to/non-existing/file.js';
    const code = 'console.log("Hello");';
    const files: [string, string][] = [[filePath, code]];

    const codebase = new Codebase({ ...opts, files });

    const logSpy = vi
      .spyOn(global.console, 'error')
      .mockImplementation(() => {});

    await fromFile(filePath, codebase);

    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });

  test('"toFile" writes a FileContainer to the filesystem', async () => {
    const filePath = './path/to/file.js';
    const code = 'console.log("Hello");';
    const files: [string, string][] = [[filePath, code]];

    const codebase = new Codebase({ ...opts, files });
    const fileContainer = codebase.files[filePath];

    await toFile(fileContainer);
    const writtenData = await readFile(filePath, 'utf-8');
    expect(writtenData).toBe(code);
  });
});
