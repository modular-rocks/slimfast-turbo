import { basename, dirname, extname, join } from 'path';

import type { Codebase } from '..';
import type { FileContainer } from '../file';

/**
 * Restructures a given file in the codebase.
 *
 * If the file name is not "index", this function:
 * 1. Creates a new directory with the base name of the file.
 * 2. Renames the file to "index" with its original extension inside this new directory.
 * If the file name is "index", the path remains unchanged.
 *
 * @param codebase - The codebase where file changes are applied. This object is also mutated in-place.
 * @param file - The file to be restructured.
 * @returns The new path of the file as a string.
 *
 * @example
 * // Consider a file at './path1.ts'
 * const codebase = new Codebase(...opts, { files: ['./path1.ts'] });
 * const file = new FileContainer('./path1.ts', '', codebase);
 * makeDirectory(codebase, file);
 * // Now, file.pathname will be './path1/index.ts'
 */
export const makeDirectory = (codebase: Codebase, file: FileContainer) => {
  const filename = basename(file.pathname);

  const baseFileName = basename(filename, extname(filename));
  const extension = extname(filename);

  if (baseFileName === 'index') {
    return file.pathname;
  }

  const directory = dirname(file.pathname);
  const newSrc = join(directory, baseFileName, `index${extension}`);

  codebase.files[newSrc] = codebase.files[file.pathname];
  delete codebase.files[file.pathname];
  file.pathname = newSrc;

  return newSrc;
};
