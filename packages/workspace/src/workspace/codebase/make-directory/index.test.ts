import { normalize } from 'node:path';

import { describe, expect, test } from 'vitest';

import { makeDirectory } from '.';
import { Codebase } from '..';

import type { CodebaseOpts } from '../../../types';

describe('"makeDirectory" utility', () => {
  const opts: CodebaseOpts = {
    pipeline: [],
    files: [],
    src: normalize('/home/projects/project/'),
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  test('Should restructure a file named other than "index"', () => {
    const filePath = normalize('/home/projects/project/path1.ts');
    const files: [string, string][] = [[filePath, '']];
    const codebase = new Codebase({ ...opts, files });

    const file = codebase.extractFiles()[0];
    const newSrc = makeDirectory(codebase, file);

    expect(normalize(newSrc)).toBe(normalize('/project/path1/index.ts'));
    expect(codebase.files[normalize('/project/path1.ts')]).toBeUndefined();
  });

  test('Should leave a file named "index" unchanged', () => {
    const filePath = normalize('/home/projects/project/index.ts');
    const files: [string, string][] = [[filePath, '']];
    const codebase = new Codebase({ ...opts, files });

    const file = codebase.extractFiles()[0];
    const newSrc = makeDirectory(codebase, file);

    expect(normalize(newSrc)).toBe(normalize('/project/index.ts'));
    expect(codebase.files[normalize('/project/index.ts')]).toBeDefined();
  });

  test('Should handle unusual file names correctly', () => {
    const filePath = normalize('/home/projects/project/.file.ts');
    const files: [string, string][] = [[filePath, '']];
    const codebase = new Codebase({ ...opts, files });

    const file = codebase.extractFiles()[0];
    const newSrc = makeDirectory(codebase, file);

    expect(normalize(newSrc)).toBe(normalize('/project/.file/index.ts'));
    expect(codebase.files[normalize('/project/.file.ts')]).toBeUndefined();
  });
});
