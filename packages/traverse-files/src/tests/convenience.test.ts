import { posix } from 'node:path';

import mockFs from 'mock-fs';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import {
  isDirectory,
  read,
  readFilesInDirectory,
  resolve,
} from '../convenience.js';

describe('convenience functions', () => {
  beforeEach(() => {
    mockFs({
      './tests/test-directory': {
        'file.txt': 'Hello, world!',
        directory: {
          'file1.txt': 'File 1',
          'file2.txt': 'File 2',
        },
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('read function', () => {
    test('should read the content of a file and return as a string', async () => {
      const filePath = './tests/test-directory/file.txt';
      const expectedContent = 'Hello, world!';
      const content = await read(filePath);

      expect(content).toBe(expectedContent);
    });

    test('should throw an error if the file does not exist', async () => {
      const filePath = './tests/test-directory/nonexistentFile.txt';

      await expect(() => read(filePath)).rejects.toThrowError();
    });
  });

  describe('resolve function', () => {
    test('should resolve the path correctly', () => {
      const dirname = './tests/test-directory';
      const filename = 'file.txt';
      const expectedPath = posix.resolve(dirname, filename);
      const resolvedPath = resolve(dirname, filename);

      if (process.platform === 'win32') {
        // On Windows it should start with a drive letter
        const regexPattern = new RegExp(`^[A-Za-z]:${expectedPath}$`);
        expect(resolvedPath).toMatch(regexPattern);
      } else {
        expect(resolvedPath).toBe(expectedPath);
      }
    });
  });

  describe('readFilesInDirectory function', () => {
    test('should read all files in the directory', async () => {
      const directoryPath = './tests/test-directory/directory';
      const expectedFiles = ['file1.txt', 'file2.txt'];

      const files = await readFilesInDirectory(directoryPath);

      expect(files).toEqual(expect.arrayContaining(expectedFiles));
    });

    test('should throw an error if the path is not a directory', async () => {
      const nonDirectoryPath = './tests/test-directory/file.txt';

      // expect(() => readFilesInDirectory(nonDirectoryPath)).toThrowError();
      await expect(() =>
        readFilesInDirectory(nonDirectoryPath)
      ).rejects.toThrowError();
    });
  });

  describe('isDirectory function', () => {
    test('should return true if the path is a directory', async () => {
      const directoryPath = './tests/test-directory/directory';

      const isDir = await isDirectory(directoryPath);

      expect(isDir).toBe(true);
    });

    test('should return false if the path is not a directory', async () => {
      const filePath = './tests/test-directory/file.txt';

      const isDir = await isDirectory(filePath);

      expect(isDir).toBe(false);
    });
  });
});
