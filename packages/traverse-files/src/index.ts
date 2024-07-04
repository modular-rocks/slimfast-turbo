import { basename, extname, posix } from 'node:path';

import { isDirectory, read, readFilesInDirectory } from './convenience.js';

import type { Directory, Options, RandomObject } from './types.js';

/**
 * Returns a function that checks if a file extension is not in the provided list of extensions.
 * @param extensions - The array of extensions to check.
 * @returns A function that takes a fullpath as an argument and returns true if the file extension is not included in the extensions array.
 * @example
 * removeExtensions(['js', 'ts'])('hello-world.js'); // false
 * removeExtensions(['js', 'ts'])('hello-world.gs'); // true
 * removeExtensions(['js', 'ts'])('hello-world.ts'); // false
 */
export const removeExtensions =
  (extensions: string[]) => (fullpath: string) => {
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
export const removeIgnoredExtensions =
  (ignoredExtensions: string[]) => (fullpath: string) => {
    return !ignoredExtensions
      .map((ex: string) => fullpath.includes(ex))
      .filter(Boolean)[0];
  };

/**
 * Checks if a given file is a test file.
 * @param fullpath - The full path to the file.
 * @returns False if the file is a test file, true otherwise.
 * @example
 * removeTests('hello-world.test.ts'); // false
 * removeTests('hello-world.ts'); // true
 */
export const removeTests = (fullpath: string) =>
  !basename(fullpath).match(/test/);

/**
 * Recursively traverse a directory and returns all file paths within it.
 * @param directory - The directory to traverse.
 * @param files - Initial array of file paths (usually empty and used during recursion).
 * @returns An array of string representing all file paths.
 */
export async function traverse(
  directory: string,
  files: string[]
): Promise<string[]> {
  const accumulatedFiles: string[] = [...files];

  const filesInDirectory = await readFilesInDirectory(directory);

  for (const filePath of filesInDirectory) {
    const absolutePath: string = posix.join(directory, filePath);
    const isDir = await isDirectory(absolutePath);
    if (isDir) {
      accumulatedFiles.push(...(await traverse(absolutePath, [])));
    } else {
      accumulatedFiles.push(absolutePath);
    }
  }

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
export const collect = async (
  path: string,
  extensions: string[],
  ignoredExtensions: string[],
  ignoreTests: Boolean
): Promise<string[]> => {
  const files: string[] = await traverse(path, []);

  let output = files
    .filter(removeExtensions(extensions))
    .filter(removeIgnoredExtensions(ignoredExtensions));

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
export const readDirectory = async (opts: Options): Promise<Directory> => {
  const { src, extensions, ignoredFiles } = opts;

  const files: Directory = [];
  const readFiles: string[] = await collect(
    src,
    extensions,
    ignoredFiles,
    true
  );

  for (const path of readFiles) {
    const fileContent = await read(path);
    files.push([path, fileContent]);
  }

  return files;
};

/**
 * Reads a JSON file and returns an object.
 * @param packagePath - The path to the JSON file.
 * @returns The content of the JSON file as an object.
 */
export const readJSONFile = async (
  packagePath: string
): Promise<RandomObject> => {
  return JSON.parse(await read(packagePath));
};
