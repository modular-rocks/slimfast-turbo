import { basename, extname, posix } from 'path';

import { isDirectory, read, readFilesInDirectory } from './convenience';

import type { Directory, Options, RandomObject } from './types';

/**
 * Returns a function that checks if a file extension is not in the provided list of extensions.
 * @param extensions - The array of extensions to check.
 * @returns A function that takes a fullpath as an argument and returns true if the file extension is not included in the extensions array.
 * @example
 * removeExtensions(['js', 'ts'])('hello-world.js'); // false
 * removeExtensions(['js', 'ts'])('hello-world.gs'); // true
 * removeExtensions(['js', 'ts'])('hello-world.ts'); // false
 */
export const removeExtensions = (extensions: string[]) => (fullpath: string) => {
  return extensions.includes(extname(fullpath).replace('.', ''));
};

/**
 * Returns a function that checks if a file extension is not in the provided list of ignored extensions.
 * @param ignoredExtensions - The array of ignored extensions.
 * @returns A function that takes a fullpath as an argument and returns true if the file extension is not included in the ignoredExtensions array.
 * @example
 * removeIgnoredExtensions(['.d.ts', '.d.tsx'])('hello-world.d.ts'); // false
 * removeIgnoredExtensions(['.d.ts', '.d.tsx'])('hello-world.d.gs'); // true
 * removeIgnoredExtensions(['.d.ts', '.d.tsx'])('hello-world.ts'); // true
 */
export const removeIgnoredExtensions = (ignoredExtensions: string[]) => (fullpath: string) => {
  return !ignoredExtensions.map((ex: string) => fullpath.includes(ex)).filter(Boolean)[0];
};

/**
 * Checks if a given file is a test file.
 * @param fullpath - The full path to the file.
 * @returns False if the file is a test file, true otherwise.
 * @example
 * removeTests('hello-world.test.ts'); // false
 * removeTests('hello-world.ts'); // true
 */
export const removeTests = (fullpath: string) => !basename(fullpath).match(/test/);

/**
 * Recursively traverse a directory and returns all file paths within it.
 * @param directory - The directory to traverse.
 * @param files - Initial array of file paths (usually empty and used during recursion).
 * @returns An array of string representing all file paths.
 */
export function traverse(directory: string, files: string[]): string[] {
  const accumulatedFiles: string[] = [...files];

  readFilesInDirectory(directory).forEach((filePath: string) => {
    const absolutePath: string = posix.join(directory, filePath);
    if (isDirectory(absolutePath)) {
      accumulatedFiles.push(...traverse(absolutePath, []));
    } else {
      accumulatedFiles.push(absolutePath);
    }
  });

  return accumulatedFiles;
}

/**
 * Collects file paths based on given parameters.
 * @param path - The path to start collecting file paths.
 * @param extensions - The extensions of the files to be included in the collection.
 * @param ignoredExtensions - The extensions of the files to be excluded from the collection.
 * @param ignoreTests - If true, exclude test files from the collection.
 * @returns An array of file paths.
 */
export const collect = (path: string, extensions: string[], ignoredExtensions: string[], ignoreTests: Boolean) => {
  const files: string[] = traverse(path, []);

  let output = files.filter(removeExtensions(extensions)).filter(removeIgnoredExtensions(ignoredExtensions));

  if (ignoreTests) {
    output = output.filter(removeTests);
  }

  return output;
};

/**
 * Reads files in a directory based on given options.
 * @param opts - The options specifying the directory and the type of files to read.
 * @returns An array of tuples with file paths and their content.
 */
export const readDirectory = (opts: Options): Directory => {
  const { src, extensions, ignoredFiles } = opts;

  const files: [string, string][] = [];
  const readFiles: string[] = collect(src, extensions, ignoredFiles, true);

  readFiles.forEach((path: string) => {
    files.push([path, read(path)]);
  });

  return files;
};

/**
 * Reads a JSON file and returns an object.
 * @param packagePath - The path to the JSON file.
 * @returns The content of the JSON file as an object.
 */
export const readJSONFile = (packagePath: string): RandomObject => {
  return JSON.parse(read(packagePath));
};
