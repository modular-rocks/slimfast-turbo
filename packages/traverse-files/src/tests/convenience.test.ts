import { posix } from 'path';

import mockFs from 'mock-fs';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import {
  isDirectory,
  read,
  readFilesInDirectory,
  resolve,
} from '../convenience';

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
    test('should read the content of a file and return as a string', () => {
      const filePath = './tests/test-directory/file.txt';
      const expectedContent = 'Hello, world!';
      const content = read(filePath);

      expect(content).toBe(expectedContent);
    });

    test('should throw an error if the file does not exist', () => {
      const filePath = './tests/test-directory/nonexistentFile.txt';

      expect(() => read(filePath)).toThrowError();
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
    test('should read all files in the directory', () => {
      const directoryPath = './tests/test-directory/directory';
      const expectedFiles = ['file1.txt', 'file2.txt'];

      const files = readFilesInDirectory(directoryPath);

      expect(files).toEqual(expect.arrayContaining(expectedFiles));
    });

    test('should throw an error if the path is not a directory', () => {
      const nonDirectoryPath = './tests/test-directory/file.txt';

      expect(() => readFilesInDirectory(nonDirectoryPath)).toThrowError();
    });
  });

  describe('isDirectory function', () => {
    test('should return true if the path is a directory', () => {
      const directoryPath = './tests/test-directory/directory';

      const isDir = isDirectory(directoryPath);

      expect(isDir).toBe(true);
    });

    test('should return false if the path is not a directory', () => {
      const filePath = './tests/test-directory/file.txt';

      const isDir = isDirectory(filePath);

      expect(isDir).toBe(false);
    });
  });
});
