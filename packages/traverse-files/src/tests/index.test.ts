import mockFs from 'mock-fs';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import {
  collect,
  readDirectory,
  readJSONFile,
  removeExtensions,
  removeIgnoredExtensions,
  removeTests,
  traverse,
} from '../index.js';

import type { Directory, Options, RandomObject } from '../types.js';

beforeEach(() => {
  mockFs({
    '/path/to/test-directory/src': {
      nested: {
        'one.js': '',
        'three.js': '',
        'two.js': '',
      },
      'one-declaration.d.ts': '',
      'one.js': '',
      'one-test.test.js': '',
      'three.js': '',
      'two.js': '',
    },
    '/path/to/test-directory/test-package.json': JSON.stringify({
      name: 'test-package',
      version: '1.0.0',
    }),
  });
});

afterEach(() => {
  mockFs.restore();
});

describe('"traverse-files" index', () => {
  test('removeExtensions works as intended', () => {
    const extensions = ['js', 'ts'];
    expect(removeExtensions(extensions)('hello-world.js')).toEqual(true);
    expect(removeExtensions(extensions)('hello-world.gs')).toEqual(false);
    expect(removeExtensions(extensions)('hello-world.ts')).toEqual(true);
  });

  test('removeIgnoredExtensions works as intended', () => {
    const ignoredExtensions = ['.d.ts', '.d.tsx'];
    expect(
      removeIgnoredExtensions(ignoredExtensions)('hello-world.d.ts')
    ).toEqual(false);
    expect(
      removeIgnoredExtensions(ignoredExtensions)('hello-world.d.gs')
    ).toEqual(true);
    expect(
      removeIgnoredExtensions(ignoredExtensions)('hello-world.ts')
    ).toEqual(true);
  });

  test('removeTests works as intended', () => {
    expect(removeTests('hello-world.test.ts')).toEqual(false);
    expect(removeTests('hello-world.ts')).toEqual(true);
  });

  test('collect works as intended', async () => {
    const fullpath: string = '/path/to/test-directory/src';
    const extensions = ['js', 'ts', 'tsx', 'jsx'];
    const ignoredExtensions = ['.d.ts', '.d.tsx'];
    const ignoreTests = true;

    const collected: string[] = await collect(
      fullpath,
      extensions,
      ignoredExtensions,
      ignoreTests
    );

    const expected = [
      '/path/to/test-directory/src/nested/one.js',
      '/path/to/test-directory/src/nested/three.js',
      '/path/to/test-directory/src/nested/two.js',
      '/path/to/test-directory/src/one.js',
      '/path/to/test-directory/src/three.js',
      '/path/to/test-directory/src/two.js',
    ];

    expect(collected).toEqual(expected);
  });

  test('traverse works as intended', async () => {
    const fullpath: string = '/path/to/test-directory/src';

    const collected: string[] = await traverse(fullpath, []);

    const expected = [
      '/path/to/test-directory/src/nested/one.js',
      '/path/to/test-directory/src/nested/three.js',
      '/path/to/test-directory/src/nested/two.js',
      '/path/to/test-directory/src/one-declaration.d.ts',
      '/path/to/test-directory/src/one-test.test.js',
      '/path/to/test-directory/src/one.js',
      '/path/to/test-directory/src/three.js',
      '/path/to/test-directory/src/two.js',
    ];

    expect(collected).toEqual(expected);
  });

  test('readDirectory works as intended', async () => {
    const src: string = '/path/to/test-directory/src';
    const extensions = ['js', 'ts', 'tsx', 'jsx'];
    const ignoredFiles = ['.d.ts', '.d.tsx'];

    const opts: Options = {
      src,
      extensions,
      ignoredFiles,
    };

    const collected: Directory = await readDirectory(opts);

    const expected = [
      ['/path/to/test-directory/src/nested/one.js', ''],
      ['/path/to/test-directory/src/nested/three.js', ''],
      ['/path/to/test-directory/src/nested/two.js', ''],
      ['/path/to/test-directory/src/one.js', ''],
      ['/path/to/test-directory/src/three.js', ''],
      ['/path/to/test-directory/src/two.js', ''],
    ];

    expect(collected).toEqual(expected);
  });

  test('readJSONFile works as intended', async () => {
    const packagePath: string = '/path/to/test-directory/test-package.json';
    const contents: RandomObject = await readJSONFile(packagePath);

    const expected = {
      name: 'test-package',
      version: '1.0.0',
    };

    expect(expected).toEqual(contents);
  });
});
