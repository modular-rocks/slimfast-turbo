import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve as pathResolve, posix, sep } from 'path';

/**
 * Reads the content of a file and returns it as a string.
 * @param filePath - The path of the file to be read.
 * @returns The content of the file as a string.
 * @throws {Error} If the file does not exist or cannot be read.
 */
export const read = (filePath: string): string => readFileSync(filePath).toString();

/**
 * Converts a directory path to a POSIX-style path by replacing backslashes with forward slashes.
 * This function is used to ensure path consistency, especially when dealing with different operating systems.
 * @param path - The directory path to be converted.
 * @returns The directory path with POSIX-style separators.
 */
export const normalizePathToPosix = (path: string): string => path.split(sep).join(posix.sep);

/**
 * Resolves a filename relative to a directory to get the absolute path.
 * The function normalizes the directory and filename to POSIX style
 * paths and then resolves the absolute path.
 * @param dirname - The directory name from which the filename is resolved.
 * @param filename - The filename to be resolved.
 * @returns The absolute path of the resolved filename.
 */
export const resolve = (dirname: string, filename: string): string => {
  dirname = normalizePathToPosix(dirname);
  filename = normalizePathToPosix(filename);

  return normalizePathToPosix(pathResolve(dirname, filename));
};

/**
 * Reads all the filenames in a given directory and returns them as an array of strings.
 * @param directoryPath - The path of the directory to read.
 * @returns An array of strings representing the filenames in the directory.
 * @throws {Error} If the directory does not exist or cannot be read.
 */
export const readFilesInDirectory = (directoryPath: string): string[] => {
  const posixDirectoryPath = posix.normalize(directoryPath);
  return readdirSync(posixDirectoryPath);
};

/**
 * Checks if a given absolute path is a directory.
 * @param absolutePath - The absolute path to check.
 * @returns `true` if the path is a directory, `false` otherwise.
 * @throws {Error} If the path does not exist or an error occurs during the check.
 */
export const isDirectory = (absolutePath: string): boolean => statSync(absolutePath).isDirectory();
